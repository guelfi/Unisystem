# 🎓 UNISYSTEM - Sistema de Gestão de Usuários

**Stack:** .NET Core 8 API + Angular 19  
**Branch:** `main`  
**Banco:** SQLite (unisystem.db)  
**Repo:** https://github.com/guelfi/Unisystem.git

## 📋 CONTEXTO

Projeto desenvolvido como **Teste Prático para Desenvolvedor Fullstack**, demonstrando:
- Arquitetura limpa (Clean Architecture)
- Padrão CQRS com MediatR
- Autenticação JWT
- Segurança e boas práticas
- Containerização com Docker
- Documentação interativa (Swagger)

## 📋 CONFIGURAÇÃO

| Componente | Porta | URL Local | URL Produção |
|------------|-------|-----------|--------------|
| API | 5000 | http://localhost:5000 | TBD |
| Frontend | 5001 | http://localhost:5001 | TBD |
| Swagger | 5000 | http://localhost:5000/swagger | TBD |

## 🗄️ BANCO DE DADOS

**SQLite:** `src/Unisystem.Infrastructure/Database/unisystem.db`

⚠️ **IMPORTANTE:** Unisystem usa SQLite para simplicidade do teste.

## 🏗️ ARQUITETURA

### Backend (Clean Architecture)
```
src/
├── Unisystem.API/           # Controllers, Startup
├── Unisystem.Application/   # CQRS (Commands, Queries, Handlers)
├── Unisystem.Domain/        # Entities, Interfaces, ValueObjects
└── Unisystem.Infrastructure/# EF Core, Repositories, JWT
```

### Frontend (Angular 19)
```
src/
├── app/
│   ├── core/               # Guards, Interceptors, Services
│   ├── features/
│   │   ├── users/          # Módulo de usuários
│   │   └── auth/           # Módulo de autenticação
│   └── shared/             # Componentes compartilhados
```

## 🎯 FUNCIONALIDADES PRINCIPAIS

### API Endpoints
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Autenticação (retorna JWT)
- `POST /api/users` - Criar usuário (requer auth)
- `GET /api/users` - Listar usuários (requer auth)

### Frontend
- Tela de Login
- Tela de Cadastro de Usuário
- Tela de Listagem de Usuários
- HTTP Interceptor (envia JWT automaticamente)
- Route Guards (protege rotas)

## 🛠️ TECNOLOGIAS

### Backend
- .NET Core 8.0
- Entity Framework Core 8.0
- SQLite
- MediatR (CQRS)
- FluentValidation
- AutoMapper
- JWT Bearer Authentication
- Swashbuckle (Swagger)

### Frontend
- Angular 19
- TypeScript 5.9.3
- RxJS
- Angular Router
- HttpClient
- Reactive Forms
- Angular Animations

### DevOps
- Docker
- Docker Compose
- Dockerfile (multi-stage build)

## 🚀 DESENVOLVIMENTO LOCAL

### Opção 1: Docker (Recomendado)
```bash
docker-compose up -d
```

### Opção 2: Execução Direta
```bash
# Backend
cd src/Unisystem.API
dotnet run

# Frontend (nova janela)
cd frontend
npm start
```

## 🚀 DEPLOY (FUTURO)

O projeto seguirá o padrão dos outros projetos quando for publicado:
- docker-compose.production.yml
- deploy.sh
- GitHub Actions (CI/CD)

## 🧪 TESTES

### Backend
```bash
cd tests/Unisystem.Tests
dotnet test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 REQUISITOS DO DESAFIO

- ✅ API .NET Core 8
- ✅ Frontend Angular 19
- ✅ Banco de dados relacional (SQLite)
- ✅ EF Core
- ✅ Arquitetura limpa
- ✅ CQRS
- ✅ JWT Authentication
- ✅ Modularização (Angular Modules)
- ✅ HTTP Interceptors
- ✅ Route Guards
- ✅ Testes automatizados (mínimo 1)
- ✅ Docker / docker-compose
- ✅ README com instruções

## 🔗 DOCUMENTAÇÃO

- [README.md](./README.md) - Documentação principal
- [SystemArchitecture.md](./SystemArchitecture.md) - Arquitetura detalhada
- [Teste Fullstack v1.pdf](./Teste%20Fullstack%20v1_250707_103941.pdf) - Requisitos originais
- Swagger: http://localhost:5000/swagger (após executar)

## 🔗 LINKS

- Repositório: https://github.com/guelfi/Unisystem
- Docs Central: /mnt/c/Users/SP-MGUELFI/Projetos/PROMPT_MESTRE.md
