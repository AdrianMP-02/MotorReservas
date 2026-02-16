# Docker Style Guide - BookingCore-ES

## Architecture
- **Multi-stage Builds**: Minimize image size and attack surface.
- **Immutability**: Containers should be stateless. Volumes for data persistence.
- **Orchestration**: `docker-compose.yml` must define healthchecks for MySQL and Redis before app starts.

## Configuration
- Use environment variables for all secrets and dynamic configs.
