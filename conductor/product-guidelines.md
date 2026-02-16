# Product Guidelines - BookingCore-ES

## Voice and Tone
Detallado y educativo: Explicando el 'por qué' de cada decisión técnica.

## Design Principles
- **Seguridad y fiabilidad del usuario**: El sistema debe fallar de forma segura sin comprometer nunca la integridad del stock.
- **Simplicidad operativa**: El sistema debe ser fácil de monitorear y desplegar con Docker.
- **Componibilidad recursiva**: Extraer lógica a componentes aislados si superan 20 líneas (según reglas globales).
- **Separación Estricta de Responsabilidades (SoC)**: UI tonta, Lógica ciega.
- **Agnosticismo de Dependencias**: Uso sistemático de Wrappers.
