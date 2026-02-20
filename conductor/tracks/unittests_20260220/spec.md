# Specification: Unit Testing

## Goal
Dotar a la aplicación de pruebas unitarias sólidas utilizando Jest y la utilidades `Testing` de `@nestjs/testing`. Se aislará la base de datos (TypeORM), Redis y las Colas (BullMQ) para asegurar que la lógica pura de negocio no tenga regresiones.

## Technical Approach
1. **Tooling:** Utilizar el framework por defecto (Jest) incluido en tu `package.json` mediante NestJS.
2. **Mocking Dependencies:**
   - TypeORM Repositories se mockearán.
   - ICacheService usará la implementación `MockCacheService` que ya creamos en `src/core/mocks`.
   - BullMQ Queues (`booking-queue`) se mockearán en los controladores para evitar dependencias de red en las pruebas.
3. **Target Modules:**
   - `inventory.service.spec.ts` (Validar lógica de obtención de inventario y checks de excepciones)
   - `inventory.controller.spec.ts` (Opcional, prioridad baja)
   - `booking.service.spec.ts` (Validar creación e interacciones con cache)
   - `booking.processor.spec.ts` (Validar que el Consumer consume el servicio correcto)

## Expected Behavior
- Ejecutar `npm run test` debe levantar Jest y reportar éxito en todos los "test suites".
- Deberíamos ser capaces de ejecutar un coverage básico y que las capas de negocio pasen verde aisladas.
