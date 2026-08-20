# Frontend Unisystem - Angular 21

Frontend da aplicação Unisystem desenvolvido com Angular 21 standalone components.

## 🚀 Tecnologias

- Angular 21
- TypeScript
- SCSS
- Reactive Forms
- HttpClient
- RxJS

## 📋 Pré-requisitos

- Node.js 18+
- npm

## 🔧 Instalação

```bash
npm install
```

## ▶️ Executar

```bash
npm start
```

A aplicação estará disponível em: http://localhost:5001

## 🏗️ Build

```bash
npm run build
```

## 🧪 Testes

```bash
npm test
```

## 📁 Estrutura

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Auth Guard
│   │   ├── interceptors/    # HTTP Interceptor
│   │   ├── models/          # Interfaces
│   │   └── services/        # AuthService
│   └── features/
│       ├── auth/            # Login e Register
│       └── users/           # Lista de usuários
├── environments/            # Configurações de ambiente
└── styles.scss             # Estilos globais
```

## 🔐 Autenticação

- JWT armazenado no localStorage
- Interceptor adiciona token automaticamente
- Guard protege rotas privadas

## 🛣️ Rotas

- `/` → Redireciona para `/login`
- `/login` → Página de login
- `/register` → Página de cadastro
- `/users` → Lista de usuários (protegida)

## 🔗 API

Backend: http://localhost:5000/api

Endpoints:
- POST `/auth/register` - Cadastro
- POST `/auth/login` - Login
- GET `/users` - Lista usuários (requer token)
