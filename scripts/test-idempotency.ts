import axios, { AxiosError } from 'axios';
import { execSync } from 'child_process';
import * as crypto from 'crypto';

async function runIdempotencyTest() {
  const resourceName = 'Habitacion_Suite_101';
  const totalStock = 10;
  const requests = 5;
  const url = 'http://localhost:3000';
  const idempotencyKey = crypto.randomUUID();

  console.log(`--- Preparando Entorno de Test ---`);
  try {
    execSync('docker exec booking-redis redis-cli FLUSHALL');
    execSync(
      'docker exec booking-mysql mysql -u booking_user -pbooking_pass booking_db -e "DELETE FROM bookings; DELETE FROM inventory;"',
      { stdio: 'ignore' },
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (e: unknown) {
    console.warn('Advertencia al limpiar entorno', (e as Error).message);
  }

  // 1. Inicializar stock
  try {
    await axios.post(`${url}/inventory/init`, { resourceName, totalStock });
    console.log(`Stock inicializado: ${totalStock} unidades.`);
  } catch (error) {
    console.log(`Stock ya existía o error.`);
  }

  // 2. Enviar 5 peticiones IDENTICAS con la MISMA idempotency key
  console.log(`Enviando ${requests} peticiones simultáneas con misma key: ${idempotencyKey}`);

  const results = await Promise.allSettled(
    Array.from({ length: requests }).map((_, i) =>
      axios.post(
        `${url}/bookings`,
        {
          resourceName,
          // Sending different logical users, but same intent/jobid. 
          // Real world: same user and request retried.
          userId: `user_idempotent`,
          quantity: 1,
        },
        {
          headers: {
            'x-idempotency-key': idempotencyKey,
          },
        },
      ),
    ),
  );

  // 3. Evaluar respuestas. Deberían todas retornar 202 con el MISMO jobId
  let successCount = 0;
  let returnedJobIds = new Set<string>();

  for (const r of results) {
    if (r.status === 'fulfilled') {
      successCount++;
      returnedJobIds.add(r.value.data.jobId);
    } else {
      console.log('Error en petición:', (r.reason as AxiosError).message);
    }
  }

  console.log(`Peticiones procesadas por el servidor (202): ${successCount}`);
  console.log(`Job IDs únicos devueltos: ${Array.from(returnedJobIds).join(', ')}`);

  // Esperar a que la cola termine
  console.log('Esperando 2 segundos para dar tiempo a la cola de procesar...');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 4. Verificar stock final
  const response = await axios.get<{ available_stock: number }>(
    `${url}/inventory/${resourceName}`,
  );

  const finalStock = response.data.available_stock;
  console.log(`Stock inicial: ${totalStock}, Stock final: ${finalStock}`);
  console.log(`Unidades consumidas: ${totalStock - finalStock}`);

  if (returnedJobIds.size === 1 && totalStock - finalStock === 1) {
    console.log(`✅ TEST DE IDEMPOTENCIA EXITOSO: Sólo se cobró/reservó 1 vez a pesar de ${requests} reintentos.`);
  } else {
    console.log(`❌ TEST FALLIDO: Se detectaron reservas duplicadas o no se respetó la key.`);
  }
}

void runIdempotencyTest();
