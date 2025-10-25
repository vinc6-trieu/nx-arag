# Clean Architecture Implementation

This API application has been restructured following **Hexagonal/Clean Architecture** principles to improve maintainability, testability, and separation of concerns.

## Architecture Overview

```
apps/api/src/
├── domain/                    # Domain Layer (Business Logic)
│   ├── entities/             # Domain Entities
│   │   └── user.entity.ts
│   ├── value-objects/        # Value Objects
│   │   └── auth.vo.ts
│   ├── repositories/         # Repository Interfaces
│   │   └── user.repository.interface.ts
│   ├── services/             # Domain Services
│   │   └── auth.domain.service.ts
│   └── domain.module.ts
├── application/              # Application Layer (Use Cases)
│   ├── dtos/                 # Data Transfer Objects
│   │   └── auth.dto.ts
│   ├── use-cases/           # Use Cases
│   │   └── auth/
│   │       ├── login.use-case.ts
│   │       ├── register.use-case.ts
│   │       ├── get-profile.use-case.ts
│   │       └── update-profile.use-case.ts
│   └── application.module.ts
├── infrastructure/          # Infrastructure Layer (External Concerns)
│   ├── repositories/        # Repository Implementations
│   │   └── user.repository.impl.ts
│   ├── services/            # External Services
│   │   └── external-auth.service.ts
│   └── infrastructure.module.ts
├── interface/               # Interface Layer (Controllers, Guards)
│   ├── controllers/         # Controllers
│   │   ├── auth.controller.ts
│   │   └── health.controller.ts
│   └── interface.module.ts
└── app.module.clean.ts      # Main Application Module
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
- **Interceptors**: Cross-cutting concerns

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
