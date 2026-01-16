# 🎓 UNISYSTEM - Sistema de Gestão de Usuários

**Stack:** .NET Core 8 API + Angular 19  
**Branch:** `main`  
**Banco:** SQLite (unisystem.db)  
**Repo:** https://github.com/guelfi/Unisystem.git  
**Status:** ✅ 100% Completo e em Produção

## 📋 CONTEXTO

Projeto desenvolvido como **Teste Prático para Desenvolvedor Fullstack**, demonstrando:
- Arquitetura limpa (Clean Architecture)
- Padrão CQRS com MediatR
- Autenticação JWT
- Segurança e boas práticas
- Containerização com Docker
- Documentação interativa (Swagger)
- Deploy em OCI (Oracle Cloud Infrastructure)

## 📋 CONFIGURAÇÃO

| Componente | Porta | URL Local | URL Produção |
|------------|-------|-----------|--------------|
| API | 5050 | http://localhost:5050 | http://129.153.86.168/unisystem-api/api |
| Frontend | 5051 | http://localhost:5051 | http://129.153.86.168/unisystem/ |
| Swagger | 5050 | http://localhost:5050/swagger | http://129.153.86.168/unisystem-api/swagger/index.html |

## 🗄️ BANCO DE DADOS

**SQLite:** `src/Unisystem.Infrastructure/Database/unisystem.db`  
**Volume Produção:** `unisystem-db-data:/app/database`

⚠️ **IMPORTANTE:** Unisystem usa SQLite para simplicidade do teste.

## 🏗️ ARQUITETURA

### Backend (Clean Architecture)
```
src/
├── Unisystem.API/           # Controllers, Startup, Middleware
├── Unisystem.Application/   # CQRS (Commands, Queries, Handlers)
├── Unisystem.Domain/        # Entities, Interfaces, ValueObjects
└── Unisystem.Infrastructure/# EF Core, Repositories, JWT
```

### Frontend (Angular 19 - Standalone Components)
```
src/
├── app/
│   ├── core/               # Guards, Interceptors, Services, Models
│   └── features/
│       ├── auth/           # Login, Register
│       └── users/          # User List
```

## 🎯 FUNCIONALIDADES PRINCIPAIS

### API Endpoints
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Autenticação (retorna JWT com 8h de expiração)
- `GET /api/users` - Listar usuários (requer auth)

### Frontend
- Tela de Login
- Tela de Cadastro de Usuário
- Tela de Listagem de Usuários
- HTTP Interceptor (envia JWT automaticamente)
- Route Guards (protege rotas)
- Standalone Components (sem NgModules)
- **Responsividade Mobile-First** (breakpoints: 480px, 768px, 1024px)
- **Toggle de visibilidade de senha** em login/register
- **Inputs e botões touch-friendly** (min-height 48-50px)
- **Header empilhado** em mobile (lista de usuários)
- **Grid adaptável** (1 coluna em mobile)
- **Meta tags mobile otimizadas** (viewport, theme-color, Apple)

## 🛠️ TECNOLOGIAS

### Backend
- .NET Core 8.0
- Entity Framework Core 8.0
- SQLite
- MediatR (CQRS)
- FluentValidation
- BCrypt.Net (hash de senhas)
- JWT Bearer Authentication
- Swashbuckle (Swagger)

### Frontend
- Angular 19 (Standalone Components)
- TypeScript 5.6
- RxJS 7.8
- Angular Router
- HttpClient
- Reactive Forms
- SCSS

### DevOps
- Docker & Docker Compose
- Nginx (reverse proxy)
- Multi-stage builds
- Oracle Cloud Infrastructure (OCI)
- Volumes persistentes

## 🚀 DESENVOLVIMENTO LOCAL

### Opção 1: Execução Direta (Recomendado para Dev)
```bash
# Backend
cd src/Unisystem.API
dotnet run --urls "http://localhost:5050"

# Frontend (nova janela)
cd frontend
npm install
npm start
```

### Opção 2: Docker
```bash
docker-compose up -d
```

## 🚀 DEPLOY PRODUÇÃO

### Infraestrutura OCI
- **Servidor:** 129.153.86.168
- **Nginx:** Reverse proxy compartilhado
- **Network:** projetos-net
- **Volumes:** unisystem-db-data

### Containers
- `unisystem-api` - Backend .NET Core
- `unisystem-frontend` - Frontend Angular + Nginx
- `nginx-proxy` - Reverse proxy (compartilhado)

### Atualizar Produção
```bash
# Na OCI
cd /var/www/Unisystem
git pull
cd /var/www
docker-compose -f docker-compose-oci-completo.yml up -d --build unisystem-api unisystem-frontend
docker-compose -f docker-compose-oci-completo.yml restart nginx-proxy
```

## 🧪 TESTES

### Backend
```bash
cd tests/Unisystem.Tests
dotnet test
```
**Resultado:** 2/2 testes passando

### Frontend
```bash
cd frontend
npm test
```

### Testes de Integração
```bash
bash test-api.sh
```
**Resultado:** 4/4 testes passando

## 📱 MELHORIAS DE RESPONSIVIDADE (v2.0)

**Implementado em:** 16/01/2026

### Frontend Mobile-First
- ✅ **Meta tags mobile otimizadas** (viewport, theme-color, Apple)
- ✅ **Base responsiva** com variáveis CSS e breakpoints
- ✅ **Toggle de visibilidade de senha** em login/register
- ✅ **Inputs touch-friendly** (min-height 48px, padding aumentado)
- ✅ **Botões touch-friendly** (min-height 50px, área de toque adequada)
- ✅ **Autocomplete configurado** em todos os campos
- ✅ **Header empilhado** em mobile (lista de usuários)
- ✅ **Grid adaptável** (1 coluna em mobile <480px)
- ✅ **Cards com padding reduzido** em mobile
- ✅ **Botão logout com ícone** em mobile (🚪)
- ✅ **Loading spinner animado**
- ✅ **Hover effects** apenas em dispositivos com hover
- ✅ **Animações suaves** (fade-in, slide-in)
- ✅ **Font-size de 16px** em mobile (evita zoom iOS)

### Breakpoints Implementados
- **Mobile:** ≤480px
- **Mobile landscape / Tablet pequeno:** ≤768px
- **Tablet:** ≤1024px
- **Desktop:** ≥1025px

### Documentação
- [RESPONSIVIDADE.md](./RESPONSIVIDADE.md) - Detalhes técnicos completos
- [DEPLOY_RESPONSIVIDADE.md](./DEPLOY_RESPONSIVIDADE.md) - Deploy na OCI

---

## 📝 REQUISITOS DO DESAFIO

- ✅ API .NET Core 8
- ✅ Frontend Angular 19
- ✅ Banco de dados relacional (SQLite)
- ✅ EF Core
- ✅ Arquitetura limpa
- ✅ CQRS
- ✅ JWT Authentication
- ✅ Standalone Components (Angular 19)
- ✅ HTTP Interceptors
- ✅ Route Guards
- ✅ Testes automatizados
- ✅ Docker / docker-compose
- ✅ README com instruções
- ✅ Deploy em produção
- ✅ **Responsividade mobile** (adicionado)

## 🔐 SEGURANÇA

- BCrypt para hash de senhas (custo 12)
- JWT com expiração de 8 horas
- FluentValidation em todos os comandos
- CORS configurado (localhost + OCI)
- Auth Guard protegendo rotas do frontend
- HTTP Interceptor adicionando token automaticamente

## 🔗 DOCUMENTAÇÃO

- [README.md](./README.md) - Documentação principal
- [STATUS.md](./STATUS.md) - Status e progresso
- [SECURITY.md](./SECURITY.md) - Práticas de segurança
- [SystemArchitecture.md](./SystemArchitecture.md) - Arquitetura detalhada
- [TESTE_MANUAL.md](./TESTE_MANUAL.md) - Guia de teste manual
- [AnaliseProjeto.md](./AnaliseProjeto.md) - Análise completa do projeto
- [RESPONSIVIDADE.md](./RESPONSIVIDADE.md) - Melhorias de responsividade mobile
- [DEPLOY_RESPONSIVIDADE.md](./DEPLOY_RESPONSIVIDADE.md) - Deploy de responsividade na OCI
- Swagger Local: http://localhost:5050/swagger
- Swagger Produção: http://129.153.86.168/unisystem-api/swagger/index.html

## 🔗 LINKS

- Repositório: https://github.com/guelfi/Unisystem
- Produção Frontend: http://129.153.86.168/unisystem/
- Produção API: http://129.153.86.168/unisystem-api/swagger/index.html
- Docs Central: /mnt/c/Users/SP-MGUELFI/Projetos/PROMPT_MESTRE.md

---

**Desenvolvido por:** Marco Guelfi  
**Data de Conclusão:** 16/01/2026
