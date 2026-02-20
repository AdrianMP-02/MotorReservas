# Specification: Idempotency keys for booking creation

## Goal
Evitar reservas duplicadas accidentales si un cliente (aplicación móvil o web) reintenta la misma petición de reserva debido a fallos de red o timeouts (desconexiones temporales).

## Technical Approach
1. **Idempotency Header:** El cliente enviará un header `x-idempotency-key` con un UUID único en la solicitud `POST /bookings`.
2. **BullMQ Built-in feature:** Aprovechar la propiedad `jobId` de BullMQ. 
   - Al agregar un trabajo a la cola, si le pasamos `jobId: idempotencyKey`, BullMQ asegura de forma nativa que no existan dos trabajos con la misma ID en la misma cola, ignorando agregados posteriores si ya está pendiente o activo.
   - Dado que también retemenos trabajos exitosos y fallidos (1000 en historial), el ID único servirá para identificar reintentos y devolver el mismo estado.
3. **Endpoint Validation:** 
   - El controlador leerá el header.
   - Si no viene el header, se autogenerará uno (para compatibilidad retroactiva o pruebas directas), pero alertando en un log.
   - Enviaremos este id a la cola de BullMQ.

## Expected Behavior
- Una petición POST /bookings con `x-idempotency-key: 123` devuelve status 202 con `jobId: 123`.
- Una petición paralela o subsecuente con el mismo `x-idempotency-key: 123` no encolará otra acción, devolverá el mismo status 202 con `jobId: 123`.
- El saldo del inventario sólo bajará 1 unidad.
