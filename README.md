# 🏢 Unisystem - Sistema de Gestão de Usuários

Sistema fullstack desenvolvido com .NET Core 8 (backend) e Angular 19 (frontend) para gestão de usuários com autenticação JWT.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [API Endpoints](#api-endpoints)
- [Segurança](#segurança)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 📖 Sobre o Projeto

Unisystem é uma aplicação fullstack completa que demonstra boas práticas de desenvolvimento com:

- **Backend**: API REST em .NET Core 8 com Clean Architecture e CQRS
- **Frontend**: SPA em Angular 19 com standalone components
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: SQLite com Entity Framework Core
- **Validação**: FluentValidation
- **Documentação**: Swagger/OpenAPI

**Status**: ✅ 100% Funcional

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

## 📋 Pré-requisitos

- [.NET Core 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- npm (incluído com Node.js)

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
dotnet run
```

A API estará disponível em:
- **Base URL**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

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
- **URL**: http://localhost:5001

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
│   └── src/
│       └── app/
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
   - Configurado para localhost:5001
   - Ajustar para produção

5. **HTTPS**
   - Recomendado para produção
   - Configurar certificados SSL/TLS

---

## 👥 Usuários de Teste

| Nome | Email | Senha |
|------|-------|-------|
| João Silva | joao@example.com | Senha123 |
| Maria Santos | maria@example.com | Maria123 |
| Pedro Oliveira | pedro@example.com | Pedro123 |
| Ana Costa | ana@example.com | Ana123 |

---

## 📚 Documentação Adicional

- [STATUS.md](STATUS.md) - Status do projeto e progresso
- [SECURITY.md](SECURITY.md) - Práticas de segurança
- [TESTS_RESULTS.md](TESTS_RESULTS.md) - Resultados dos testes
- [SystemArchitecture.md](SystemArchitecture.md) - Arquitetura detalhada
- [TESTE_MANUAL.md](TESTE_MANUAL.md) - Guia de teste manual

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verificar se a porta 5000 está livre
netstat -ano | findstr :5000
```

### Frontend não compila
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Erro 401 ao listar usuários
- Verificar se o token foi gerado no login
- Verificar se o interceptor está configurado
- Ver console do navegador (F12)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Marco Guelfi**
- GitHub: [@guelfi](https://github.com/guelfi)
- Email: guelfi@msn.com

---

## 🎉 Agradecimentos

Projeto desenvolvido como desafio técnico para demonstrar conhecimentos em:
- Clean Architecture
- CQRS
- Angular standalone components
- Autenticação JWT
- Testes automatizados

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
