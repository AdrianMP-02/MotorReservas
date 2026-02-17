# Specification: Queue-Driven Booking System

## Context
Actualment, el sistema utiliza un "Fail-Fast Distributed Lock". Si dos personas intentan reservar al mismo milisegundo, una gana y la otra recibe un error 409. Para un sistema de reservas masivo, queremos que la segunda persona espere su turno en lugar de ser rechazada.

## Goals
- [x] Implementar BullMQ como motor de colas sobre Redis.
- [ ] Transformar el flujo de reserva de Síncrono (HTTP 201) a Asíncrono (HTTP 202 + Job ID).
- [ ] Procesar las reservas una por una para eliminar la contención de locks.
- [ ] Mantener la integridad del inventario al 100%.

## Architecture
1. **Producer**: El `BookingController` recibe el request y pone un mensaje en la cola `booking-queue`.
2. **Queue**: BullMQ almacena el mensaje en Redis con persistencia y lógica de reintentos.
3. **Consumer**: Un `BookingProcessor` extrae el mensaje y ejecuta la lógica de `BookingService.createBooking`.
4. **State Tracking**: El cliente recibe un `jobId` para consultar el estado de su reserva (Polling).
