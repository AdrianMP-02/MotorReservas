# TypeScript Style Guide - BookingCore-ES

## Core Principles
- **Strict Typing**: No usage of `any`. Interfaces for all data shapes.
- **SoC**: Business logic in Services, API structure in Controllers.
- **Early Return**:
  ```typescript
  if (!isValid) return; // Preferred
  ```
- **Recursive Componentization**: Extract logic if > 20 lines.

## Dependency Injection
- Always use Interfaces for providers to allow mocking and isolation.
