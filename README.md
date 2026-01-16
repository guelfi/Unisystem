# 🏢 Unisystem - Sistema de Gestão de Usuários

Sistema fullstack desenvolvido com .NET Core 8 (backend) e Angular 19 (frontend) para gestão de usuários com autenticação JWT.

**🌐 Em Produção:** http://129.153.86.168/unisystem/

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [URLs de Acesso](#urls-de-acesso)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [API Endpoints](#api-endpoints)
- [Segurança](#segurança)
- [Deploy](#deploy)

---

## 📖 Sobre o Projeto

Unisystem é uma aplicação fullstack completa que demonstra boas práticas de desenvolvimento com:

- **Backend**: API REST em .NET Core 8 com Clean Architecture e CQRS
- **Frontend**: SPA em Angular 19 com standalone components
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: SQLite com Entity Framework Core
- **Validação**: FluentValidation
- **Documentação**: Swagger/OpenAPI
- **Deploy**: Oracle Cloud Infrastructure (OCI) com Docker e Nginx

**Status**: ✅ 100% Funcional em Produção

---

## 🚀 Tecnologias

### Backend
- .NET Core 8.0
- Entity Framework Core
- MediatR (CQRS)
- FluentValidation
- BCrypt.Net (hash de senhas)
- JWT Bearer Authentication
- Swagger/OpenAPI
- xUnit (testes)

### Frontend
- Angular 19
- TypeScript 5.6
- RxJS 7.8
- Reactive Forms
- SCSS
- Standalone Components

### DevOps
- Docker & Docker Compose
- Nginx (reverse proxy)
- Oracle Cloud Infrastructure (OCI)
- SQLite (persistência em volume)

---

## 🏗️ Arquitetura

### Backend - Clean Architecture

```
src/
├── Unisystem.Domain/          # Entidades e Interfaces
├── Unisystem.Application/     # Casos de uso (CQRS)
├── Unisystem.Infrastructure/  # Implementações (DB, JWT)
└── Unisystem.API/            # Controllers e configuração
```

**Padrões utilizados:**
- Clean Architecture
- CQRS (Command Query Responsibility Segregation)
- Repository Pattern
- Unit of Work
- Result Pattern
- Dependency Injection

### Frontend - Feature-based

```
src/app/
├── core/              # Serviços, Guards, Interceptors
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
└── features/          # Funcionalidades
    ├── auth/         # Login e Registro
    └── users/        # Listagem de usuários
```

---

## ⚡ Funcionalidades

- ✅ Cadastro de usuários com validação
- ✅ Login com JWT
- ✅ Listagem de usuários (protegida)
- ✅ Logout
- ✅ Proteção de rotas (Auth Guard)
- ✅ Interceptor HTTP automático (adiciona token)
- ✅ Validação de formulários
- ✅ Feedback visual (loading, erros)
- ✅ Hash seguro de senhas (BCrypt)

---

## 🌐 URLs de Acesso

### Produção (OCI)
- **Frontend**: http://129.153.86.168/unisystem/
- **API Swagger**: http://129.153.86.168/unisystem-api/swagger/index.html
- **API Base**: http://129.153.86.168/unisystem-api/api

### Desenvolvimento Local
- **Frontend**: http://localhost:5051
- **API**: http://localhost:5050
- **Swagger**: http://localhost:5050/swagger

---

## 🔧 Instalação e Execução

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/guelfi/Unisystem.git
cd Unisystem
```

### 2️⃣ Backend

```bash
# Navegar até o diretório da API
cd src/Unisystem.API

# Executar migrations (caso necessário)
dotnet ef database update

# Executar a API
dotnet run --urls "http://localhost:5050"
```

A API estará disponível em:
- **Base URL**: http://localhost:5050
- **Swagger**: http://localhost:5050/swagger

### 3️⃣ Frontend

```bash
# Em outro terminal, navegar até o frontend
cd frontend

# Instalar dependências
npm install

# Executar o servidor de desenvolvimento
npm start
```

O frontend estará disponível em:
- **URL**: http://localhost:5051

---

## 📁 Estrutura do Projeto

```
Unisystem/
├── src/
│   ├── Unisystem.Domain/
│   ├── Unisystem.Application/
│   ├── Unisystem.Infrastructure/
│   └── Unisystem.API/
├── tests/
│   └── Unisystem.Tests/
├── frontend/
│   ├── src/app/
│   ├── Dockerfile
│   └── nginx.conf
├── Dockerfile.api
├── docs/
├── README.md
└── STATUS.md
```

---

## 🧪 Testes

### Testes Unitários (.NET)

```bash
dotnet test tests/Unisystem.Tests/Unisystem.Tests.csproj
```

**Resultado esperado**: 2/2 testes passando

### Testes de Integração (curl)

```bash
bash test-api.sh
```

**Testes incluídos:**
1. Registro de usuário
2. Login
3. Listagem com autenticação
4. Listagem sem autenticação (401)

### Testes Frontend (Angular)

```bash
cd frontend
npm test
```

---

## 🔌 API Endpoints

### Autenticação

#### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Senha123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "Senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "c74a2863-a432-4f7b-9232-5d9b5acd964a",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2026-01-16T02:38:17.2956694"
  }
}
```

### Usuários

#### Listar Usuários (Protegido)
```http
GET /api/users
Authorization: Bearer {token}
```

---

## 🔐 Segurança

### Práticas Implementadas

1. **Senhas**
   - Hash com BCrypt (custo: 12)
   - Nunca armazenadas em texto puro

2. **JWT**
   - Tokens com expiração de 8 horas
   - Assinatura com chave secreta
   - Validação em todas as requisições protegidas

3. **Validação**
   - FluentValidation no backend
   - Reactive Forms com validação no frontend
   - Sanitização de inputs

4. **CORS**
   - Configurado para localhost:5051 e IP da OCI
   - AllowCredentials habilitado

5. **HTTPS**
   - Preparado para HTTPS em produção

---

## 🚀 Deploy

### Docker

#### Build das Imagens

```bash
# API
docker build -f Dockerfile.api -t unisystem-api .

# Frontend
docker build -f frontend/Dockerfile -t unisystem-frontend ./frontend
```

#### Executar com Docker Compose

```bash
docker-compose up -d
```

### Produção (OCI)

O projeto está deployado na Oracle Cloud Infrastructure com:
- Nginx como reverse proxy
- Docker containers para API e Frontend
- Volume persistente para SQLite
- Acesso via IP público: 129.153.86.168

**Configurações:**
- API: Porta interna 5050, exposta via `/unisystem-api/`
- Frontend: Porta interna 80, exposta via `/unisystem/`
- Network: `projetos-net`
- Volume: `unisystem-db-data`

---

## 📚 Documentação Adicional

- [STATUS.md](STATUS.md) - Status do projeto e progresso
- [PROJETO.md](PROJETO.md) - Especificações do projeto
- [SECURITY.md](SECURITY.md) - Práticas de segurança
- [TESTS_RESULTS.md](TESTS_RESULTS.md) - Resultados dos testes
- [SystemArchitecture.md](SystemArchitecture.md) - Arquitetura detalhada
- [TESTE_MANUAL.md](TESTE_MANUAL.md) - Guia de teste manual

---

## 👤 Autor

**Marco Guelfi**
- GitHub: [@guelfi](https://github.com/guelfi)
- Email: guelfi@msn.com

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
