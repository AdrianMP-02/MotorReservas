# Workflow - BookingCore-ES

## TDD Policy
- **Strict**: Tests de integración/unitarios obligatorios antes de implementar lógica crítica.
- **Concurrencia**: Escenarios de colisión deben estar testados en el ciclo Red-Green-Refactor.

## Commit Strategy
- **Conventional Commits**: Format `type(scope): description`.
- **Atomicidad**: Cambios completos y funcionales por commit.

## Code Review
- **Required for all changes**: Revisión obligatoria enfocada en integridad estructural y SoS.

## Verification Checkpoints
- **After each phase completion**: Validación manual y automatizada tras completar un bloque lógico completo.

## Rules Enforcement
- **Early Return Pattern**: Evitar el anidamiento excesivo.
- **Chesterton’s Fence**: No refactorizar sin documentar el por qué del código original.
