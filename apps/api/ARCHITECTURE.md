# Clean Architecture Implementation

This API application has been restructured following **Hexagonal/Clean Architecture** principles to improve maintainability, testability, and separation of concerns.

## Architecture Overview

```
apps/api/src/
├── app.module.clean.ts      # Module composition for Clean Architecture
├── main.ts                  # Nest bootstrap
├── application/             # Use cases, DTOs, orchestrators
├── domain/                  # Entities, value objects, repository contracts
├── infrastructure/          # Prisma repositories & external adapters
├── interface/               # Controllers, guards, filters, interceptors
├── instrumentation/         # Datadog tracer bootstrap & metrics helpers
├── casl/                    # Authorization policies and ability factory
├── prisma/                  # Prisma schema, migrations, providers
└── assets/                  # Seed/config resources bundled at runtime
```

## Layer Responsibilities

### 1. Domain Layer (`/domain`)

- **Entities**: Core business objects with behavior
- **Value Objects**: Immutable objects representing concepts
- **Repository Interfaces**: Contracts for data access
- **Domain Services**: Business logic that doesn't belong to entities

### 2. Application Layer (`/application`)

- **Use Cases**: Application-specific business rules
- **DTOs**: Data transfer objects for API communication
- **Application Services**: Orchestrate use cases

### 3. Infrastructure Layer (`/infrastructure`)

- **Repository Implementations**: Concrete data access
- **External Services**: Third-party integrations
- **Adapters**: Convert between external and internal formats

### 4. Interface Layer (`/interface`)

- **Controllers**: Handle HTTP requests/responses
- **Guards**: Authentication and authorization
- **Interceptors & Filters**: Cross-cutting concerns (logging, responses, error shaping)

### 5. Instrumentation (`/instrumentation`)

- **Tracer bootstrap**: `datadog-tracer.ts` initializes `dd-trace` via `packages/observability`
- **Metrics**: DogStatsD helpers that emit timings/counters for interceptors and use cases
- **Shutdown hooks**: Ensures tracers flush before the process exits

### 6. Authorization (`/casl`)

- **Ability factory**: Centralizes CASL rule creation
- **Policy definitions**: Declarative access control alongside the domain

## Key Benefits

### ✅ **Separation of Concerns**

- Business logic isolated in domain layer
- External dependencies in infrastructure layer
- API concerns in interface layer

### ✅ **Testability**

- Domain logic can be tested without external dependencies
- Use cases can be tested with mock repositories
- Infrastructure can be tested independently

### ✅ **Maintainability**

- Changes to external systems don't affect business logic
- Clear boundaries between layers
- Easy to add new features

### ✅ **Flexibility**

- Easy to swap implementations (e.g., database, external services)
- Can add new interfaces without changing core logic
- Supports multiple data sources

## Dependency Flow

```
Interface Layer → Application Layer → Domain Layer
     ↓                    ↓
Infrastructure Layer ← Application Layer
```

**Rule**: Dependencies always point inward toward the domain layer.

## Usage Examples

### Adding a New Use Case

1. **Create Use Case** in `application/use-cases/`
2. **Add to ApplicationModule** providers
3. **Inject in Controller** and call execute()

### Adding a New Repository

1. **Define Interface** in `domain/repositories/`
2. **Implement** in `infrastructure/repositories/`
3. **Register** in InfrastructureModule
4. **Use** in ApplicationModule

### Adding External Service

1. **Create Service** in `infrastructure/services/`
2. **Define Interface** if needed in domain
3. **Register** in InfrastructureModule
4. **Inject** in use cases

## Migration from Old Structure

The old structure has been preserved in `/app` directory for reference. The new clean architecture is in the root `/src` directory.

### Key Changes:

- **Controllers** moved to `/interface/controllers/`
- **Services** split into use cases and domain services
- **Repositories** moved to infrastructure with interfaces in domain
- **DTOs** moved to application layer
- **Entities** created in domain layer
- **Datadog instrumentation** centralized under `/instrumentation` with helpers in `packages/observability`
- **Configuration schemas** consolidated in `packages/config` for reuse across services

## Best Practices

1. **Domain First**: Start with domain entities and business rules
2. **Interface Segregation**: Keep interfaces small and focused
3. **Dependency Inversion**: Depend on abstractions, not concretions
4. **Single Responsibility**: Each class has one reason to change
5. **Test-Driven**: Write tests for each layer independently

## Testing Strategy

- **Unit Tests**: Domain entities and value objects
- **Integration Tests**: Use cases with real repositories
- **E2E Tests**: Full API endpoints
- **Contract Tests**: Repository interfaces

This architecture ensures the application remains maintainable and scalable as it grows.
