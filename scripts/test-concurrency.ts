import axios from 'axios';
import { execSync } from 'child_process';

async function runTest() {
  const resourceName = 'Habitacion_Suite_101';
  const totalStock = 10;
  const requests = 100;
  const url = 'http://localhost:3000';

  console.log(`--- Preparando Entorno de Test ---`);
  try {
    // We clear Redis (flushes BullMQ queues)
    execSync('docker exec booking-redis redis-cli FLUSHALL');
    console.log('Redis limpiado (Colas vaciadas).');

    // We clear the Database
    execSync(
      'docker exec booking-mysql mysql -u booking_user -pbooking_pass booking_db -e "DELETE FROM bookings; DELETE FROM inventory;"',
    );
    console.log('Base de datos limpiada (Reservas e Inventario eliminados).');

    // Give external systems a tiny bit of time to settle
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.warn(
      'Atención: No se pudo limpiar el entorno. Es posible que el test arroje falsos negativos.',
      error instanceof Error ? error.message : '',
    );
  }

  console.log(`--- Iniciando Test de Concurrencia ---`);

  // 1. Inicializar stock
  try {
    await axios.post(`${url}/inventory/init`, { resourceName, totalStock });
    console.log(
      `Stock inicializado: ${resourceName} con ${totalStock} unidades.`,
    );
  } catch {
    console.log(`Stock ya existía o hubo un error al inicializar.`);
  }

  // 2. Lanzar peticiones concurrentes
  console.log(`Lanzando ${requests} reservas concurrentes a la COLA...`);

  const initialRequests = await Promise.allSettled(
    Array.from({ length: requests }).map((_, i) =>
      axios.post<{ jobId: string }>(`${url}/bookings`, {
        resourceName,
        userId: `user_${i}`,
        quantity: 1,
      }),
    ),
  );

  const jobIds = initialRequests
    .filter(
      (
        r,
      ): r is PromiseFulfilledResult<axios.AxiosResponse<{ jobId: string }>> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value.data.jobId);

  console.log(
    `Encolados ${jobIds.length} trabajos. Esperando procesamiento...`,
  );

  // 3. Polling de resultados
  const finalResults = { successful: 0, failed: 0 };
  const pendingJobs = [...jobIds];

  while (pendingJobs.length > 0) {
    const jobId = pendingJobs.shift();
    if (!jobId) continue;

    const response = await axios.get<{ status: string }>(
      `${url}/bookings/status/${jobId}`,
    );
    const status = response.data;

    if (status.status === 'completed') {
      finalResults.successful++;
    } else if (status.status === 'failed') {
      finalResults.failed++;
    } else {
      // Sigue en cola o activo, lo devolvemos al final
      pendingJobs.push(jobId);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Pequeña espera
    }
  }

  console.log(`--- Resultados Finales ---`);
  console.log(`Reservasitosas: ${finalResults.successful}`);
  console.log(`Reservas fallidas: ${finalResults.failed}`);

  // 4. Verificar stock final
  const response = await axios.get<{ available_stock: number }>(
    `${url}/inventory/${resourceName}`,
  );
  const inventory = response.data;
  console.log(`Stock final en DB: ${inventory.available_stock}`);

  if (
    finalResults.successful === totalStock &&
    inventory.available_stock === 0
  ) {
    console.log(`✅ TEST EXITOSO: Se reservó todo el stock sin overbooking.`);
  } else {
    console.log(`❌ TEST FALLIDO: Inconsistencia detectada.`);
  }
}

void runTest();
