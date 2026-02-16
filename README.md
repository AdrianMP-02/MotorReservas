## 🏨 BookingCore-ES (MotorReservas) 🚀

**Arquitectura de Sistemas de Alto Rendimiento para la Gestión de Reservas.**

`BookingCore-ES` es un motor de reservas de grado empresarial diseñado para garantizar la **integridad absoluta del inventario** y una **latencia mínima** en entornos de alta demanda. No es solo un backend; es una catedral de software construida bajo los principios de **Solidez** (estructural) y **Vibe** (velocidad de desarrollo).

---

### 🤖 Desarrollo Impulsado por IA (Antigravity)
Este proyecto es el resultado de una colaboración avanzada entre un **Arquitecto de Sistemas Humano** y **Antigravity**, un asistente de IA especializado en ingeniería de software de alto nivel. 

- **Pair Programming de Próxima Generación**: Cada línea de código ha sido diseñada, revisada y optimizada mediante un proceso iterativo humano-IA.
- **Protocolo Conductor**: Utilizamos el framework `Conductor` para orquestar cambios atómicos, trazables y documentados automáticamente por la IA.
- **Integridad Verificada**: Antigravity asegura que cada componente respete el diseño atómico y los principios SOLID definidos en el núcleo del sistema.

---

### 🏛️ Pilares del Proyecto
- **Separación Estricta de Responsabilidades (SoC)**: Capas de aplicación, dominio e infraestructura totalmente desacopladas. La lógica de negocio no conoce los detalles de la base de datos ni de la UI.
- **Agnosticismo de Dependencias (Wrappers)**: Implementamos interfaces intermedias para cada servicio externo (MySQL, Redis, APIs de terceros). Si la tecnología cambia mañana, el núcleo del negocio permanece intacto.
- **Prevención de Overbooking Distribuido**: Implementación de bloqueos optimistas y pesados mediante **Redlock** en Redis para garantizar que ninguna habitación se reserve dos veces simultáneamente.
- **Inmutabilidad por Defecto**: Los estados de las reservas se tratan como inmutables, utilizando un flujo de eventos y cambios de estado controlados para eliminar efectos secundarios impredecibles.

---

### 🛠️ Stack Tecnológico Premium
| Componente | Tecnología | Razón del Uso |
| :--- | :--- | :--- |
| **Núcleo** | [NestJS](https://nestjs.com/) | Modularidad extrema y tipado fuerte. |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | Seguridad en tiempo de compilación y mantenibilidad. |
| **Persistencia** | [MySQL 8.0](https://www.mysql.com/) | Transaccionalidad robusta y Row-Level Locking. |
| **Caché & Latencia** | [Redis](https://redis.io/) | Bloqueo distribuido y velocidades de respuesta sub-ms. |
| **Infraestructura** | [Docker](https://www.docker.com/) | Entornos reproductibles y despliegue atómico. |

---

### 📂 Estructura del repositorio
- `src/core/`: Patrones y abstracciones base (Wrappers, Interfaces).
- `src/modules/`: Lógica de dominio modular (Booking, Inventory, Payments).
- `conductor/`: El cerebro del proyecto. Contiene los `tracks` de desarrollo y la memoria del proceso creativo humano-IA.
- `docker/`: Configuraciones de infraestructura listas para producción.

---

### ⚡ Inicio Rápido con Docker
```bash
# 1. Levantar la infraestructura (MySQL + Redis)
docker-compose up -d

# 2. Instalar dependencias
npm install

# 3. Lanzar en modo desarrollo
npm run start:dev
```

---

*Desarrollado en simbiosis por **Adrián** y **Antigravity AI**.*

