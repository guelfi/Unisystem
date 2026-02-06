# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Unisystem** is a fullstack user management system built with **.NET Core 8** (backend) and **Angular 19** (frontend) demonstrating Clean Architecture, CQRS pattern, and JWT authentication. The project is **100% complete and deployed to production** on Oracle Cloud Infrastructure (OCI).

**Production:** http://129.153.86.168/unisystem/  
**Stack:** .NET Core 8 + Angular 19 + SQLite + Docker + Nginx

---

## Common Commands

### Backend (.NET API)

```bash
# Navigate to API directory
cd src/Unisystem.API

# Run API locally (port 5050)
dotnet run --urls "http://localhost:5050"

# Run with specific environment
ASPNETCORE_ENVIRONMENT=Development dotnet run --urls "http://localhost:5050"

# Run tests
cd ../../tests/Unisystem.Tests
dotnet test

# Run tests from root
dotnet test tests/Unisystem.Tests/Unisystem.Tests.csproj

# Database migrations (if needed)
cd src/Unisystem.API
dotnet ef database update

# Build
dotnet build src/Unisystem.sln
```

**Important:** Always run the API from `src/Unisystem.API` directory to ensure correct working directory for SQLite database path resolution.

### Frontend (Angular 19)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run dev server (port 5051)
npm start
# Equivalent to: ng serve

# Build for production
npm run build
# Equivalent to: ng build

# Run tests
npm test
# Equivalent to: ng test

# Watch mode for development
npm run watch
# Equivalent to: ng build --watch --configuration development
```

### Integration Tests

```bash
# Run integration tests (requires API running)
bash test-api.sh
```

This script tests:
1. User registration
2. Login
3. Authenticated user listing
4. Unauthenticated requests (401)

### Docker & Deployment

```bash
# Build API image
docker build -f Dockerfile.api -t unisystem-api .

# Build frontend image
docker build -f frontend/Dockerfile -t unisystem-frontend ./frontend

# Deploy to OCI (from project root on local machine)
# Note: Deployment is managed via parent directory scripts
cd /home/guelfi/Projetos
./deploy-oci.sh
```

**Production Update:**
```bash
# SSH into OCI
ssh -i ~/.ssh/ssh-key-2025-08-28.key ubuntu@129.153.86.168

# Navigate and update
cd /var/www/Unisystem
git pull
cd /var/www
docker-compose -f docker-compose-oci-completo.yml up -d --build unisystem-api unisystem-frontend
docker-compose -f docker-compose-oci-completo.yml restart nginx-proxy
```

---

## Architecture

### Backend - Clean Architecture + CQRS

The backend follows **Clean Architecture** with clear separation of concerns:

```
src/
├── Unisystem.Domain/          # Core business entities and interfaces
│   ├── Entities/             # User entity
│   └── Interfaces/           # IRepository, IUnitOfWork, IJwtTokenGenerator
│
├── Unisystem.Application/     # Use cases (Commands & Queries)
│   ├── Features/
│   │   ├── Auth/            # LoginCommand, RegisterCommand
│   │   └── Users/           # GetUsersQuery
│   ├── DTOs/                # Data Transfer Objects
│   └── Common/              # Result pattern, base classes
│
├── Unisystem.Infrastructure/  # External dependencies implementation
│   ├── Data/                # ApplicationDbContext (EF Core)
│   ├── Repositories/        # UserRepository, UnitOfWork
│   ├── Services/            # JwtTokenGenerator
│   └── Migrations/          # EF Core migrations
│
└── Unisystem.API/            # Entry point
    └── Controllers/         # AuthController, UsersController
```

**Key Patterns:**
- **CQRS** with MediatR: Commands modify state, Queries read state
- **Repository Pattern** with Unit of Work: Abstracts data access
- **Result Pattern**: Standardized success/error responses
- **Dependency Injection**: All dependencies injected via DI container

**Important Backend Details:**
- **SQLite** database located at `src/Unisystem.Infrastructure/Database/unisystem.db` (development)
- **JWT tokens** expire after 8 hours (configured in `JwtTokenGenerator`)
- **BCrypt** cost factor is 12 for password hashing
- **UsePathBase("/unisystem-api")** in `Program.cs` enables reverse proxy support
- Swagger is **enabled in production** at `/unisystem-api/swagger/index.html`

### Frontend - Feature-based with Standalone Components

Angular 19 with **standalone components** (no NgModules):

```
frontend/src/app/
├── core/                     # Cross-cutting concerns
│   ├── guards/              # auth.guard.ts (route protection)
│   ├── interceptors/        # auth.interceptor.ts (auto-add JWT)
│   ├── models/              # TypeScript interfaces
│   └── services/            # auth.service.ts (login, register, logout)
│
└── features/                 # Feature modules
    ├── auth/                # Login, Register components
    └── users/               # UsersListComponent
```

**Key Frontend Details:**
- **Standalone Components**: All components are standalone (no `@NgModule`)
- **Auth Interceptor**: Automatically adds `Authorization: Bearer <token>` to all HTTP requests
- **Auth Guard**: Protects `/users` route, redirects unauthenticated users to `/login`
- **Reactive Forms**: Used in login/register with built-in validation
- **Mobile-First**: Responsive design with breakpoints at 480px, 768px, 1024px
- **Environment Files**: `environment.ts` (dev) and `environment.prod.ts` (production)
- **FileReplacements**: Configured in `angular.json` to swap environments on production build

### Mobile-First Responsive Design (v2.0)

**Implemented responsive features:**
- Meta tags optimized for mobile (viewport, theme-color, Apple)
- Touch-friendly inputs (min-height 48px) and buttons (min-height 50px)
- Toggle password visibility in login/register forms
- Stacked header on mobile (users list)
- Adaptive grid (1 column on mobile <480px)
- Animations (fade-in, slide-in)
- Font-size 16px on mobile (prevents iOS auto-zoom)
- Hover effects only on devices with hover capability

---

## Database

**Type:** SQLite  
**Location (dev):** `src/Unisystem.Infrastructure/Database/unisystem.db`  
**Location (prod):** Docker volume `unisystem-db-data:/app/database`

**Schema:**
- **Users** table: Id (GUID), Name, Email (unique), PasswordHash, CreatedAt

**⚠️ Important:** Unlike other projects in the ecosystem (Batuara, DriverHub), Unisystem uses **SQLite**, not PostgreSQL. The database file is created automatically on first run if migrations are applied.

---

## Authentication Flow

1. **Register**: `POST /api/auth/register` with name, email, password
   - Password validated (FluentValidation)
   - Password hashed with BCrypt (cost 12)
   - User saved to database
   
2. **Login**: `POST /api/auth/login` with email, password
   - Credentials validated
   - JWT token generated (8h expiration)
   - Token returned to client
   
3. **Authenticated Requests**: Client stores token in localStorage
   - HTTP Interceptor automatically adds token to requests
   - API validates token via JWT Bearer middleware
   - Protected endpoints return 401 if token invalid/missing

---

## Deployment Architecture

### Production (OCI)

**Infrastructure:**
- Server: 129.153.86.168
- Reverse Proxy: Nginx (shared with other projects)
- Network: `projetos-net` (Docker network)
- Volumes: `unisystem-db-data` (SQLite persistence)

**Containers:**
- `unisystem-api`: Backend API (internal port 5050)
- `unisystem-frontend`: Angular SPA + Nginx (internal port 80)
- `nginx-proxy`: Reverse proxy (external port 80)

**Path Routing:**
- Frontend: `/unisystem/` → `unisystem-frontend:80`
- API: `/unisystem-api/` → `unisystem-api:5050`

**Critical Configuration:**
- `Program.cs`: `app.UsePathBase("/unisystem-api")` enables reverse proxy routing
- `nginx.conf`: Configured for SPA routing (all routes return `index.html`)
- `environment.prod.ts`: API URL is `/unisystem-api/api` (relative path)

### Local Development

**URLs:**
- Frontend: http://localhost:5051
- API: http://localhost:5050
- Swagger: http://localhost:5050/swagger

**No reverse proxy** in local development - services run on their own ports.

---

## Testing

### Unit Tests (.NET)
Located in `tests/Unisystem.Tests/`

Run: `dotnet test tests/Unisystem.Tests/Unisystem.Tests.csproj`

**Expected:** 2/2 tests passing

### Integration Tests
Script: `test-api.sh`

Tests registration, login, authenticated/unauthenticated access.

**Expected:** 4/4 tests passing

### Frontend Tests (Angular)
Run: `cd frontend && npm test`

Uses Jasmine + Karma for unit testing.

---

## Common Issues & Solutions

### API Fails Silently on Startup
**Cause:** Incorrect working directory or missing `ASPNETCORE_ENVIRONMENT`

**Solution:**
```bash
cd src/Unisystem.API
ASPNETCORE_ENVIRONMENT=Development dotnet run --urls "http://localhost:5050"
```

### SQLite Database Not Found
**Cause:** API running from wrong directory

**Solution:** Always run from `src/Unisystem.API` directory. The database path in `appsettings.json` is relative: `"Data Source=../Unisystem.Infrastructure/Database/unisystem.db"`

### Frontend Can't Connect to API
**Local:** Check API is running on port 5050  
**Production:** Check `environment.prod.ts` has correct API URL

### Docker Build Fails
Ensure you're building from project root:
```bash
docker build -f Dockerfile.api -t unisystem-api .
docker build -f frontend/Dockerfile -t unisystem-frontend ./frontend
```

### Swagger Not Working in Production
Swagger is **intentionally enabled in production** for this project. If not working:
1. Check `Program.cs` has Swagger configuration outside `if (app.Environment.IsDevelopment())`
2. Verify Nginx proxy_pass configuration
3. Check container logs: `docker logs unisystem-api`

---

## Project Context in Ecosystem

Unisystem is **one of 6 projects** in a larger ecosystem:
1. Batuara.net (management system)
2. HealthCore (health system)
3. DriverHub (driver management)
4. Barbear.IA (barbershop)
5. Hako (static website)
6. **Unisystem** (user management - this project)

All projects share:
- Same OCI server (129.153.86.168)
- Same Nginx reverse proxy
- Same Docker network (`projetos-net`)
- Similar deployment patterns

**Central Documentation:** `/home/guelfi/Projetos/PROMPT_MESTRE.md`

---

## Key Files

- `src/Unisystem.API/Program.cs` - API entry point, DI configuration
- `src/Unisystem.Infrastructure/Data/ApplicationDbContext.cs` - EF Core context
- `src/Unisystem.Infrastructure/Services/JwtTokenGenerator.cs` - JWT generation
- `frontend/src/app/core/services/auth.service.ts` - Authentication service
- `frontend/src/app/core/interceptors/auth.interceptor.ts` - Auto JWT injection
- `frontend/src/environments/environment.prod.ts` - Production API URL
- `Dockerfile.api` - Backend multi-stage Docker build
- `frontend/Dockerfile` - Frontend Docker build (Node + Nginx)
- `test-api.sh` - Integration test script

---

## Version

**Current Version:** 2.0.0 (Mobile-First)  
**Last Updated:** 16/01/2026  
**Status:** ✅ 100% Complete and in Production
