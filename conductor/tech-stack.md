# Tech Stack - BookingCore-ES

## Core Technologies
- **Primary Language**: TypeScript
- **Backend Framework**: NestJS
- **Database**: MySQL (InnoDB Engine for Row-Level Locking)
- **Caching & Locks**: Redis (for Availability Cache and Redlock)
- **Infrastructure**: Docker / Docker Compose

## Global Rules
- **Agnosticismo de Dependencias**: Cada librería externa (Redis, MySQL, Pasarelas) debe tener un Wrapper o Interfaz Intermedia.
- **Inmutabilidad por Defecto**: Tratar datos como inmutables.
- **Tokenización**: Uso de variables semánticas para cualquier valor constante.
