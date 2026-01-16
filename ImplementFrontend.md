# Implementação Frontend Angular 19 - Unisystem

## 🎯 Objetivo
Implementar frontend completo em Angular 19 consumindo a API já desenvolvida, com autenticação JWT, interceptors e guards.

## 🏗️ Contexto
- **API Backend**: 🟢 100% implementada e testada
- **Endpoints disponíveis**:
    - `POST /api/auth/register`
    - `POST /api/auth/login`
    - `GET /api/users` (protegido)
- **Status**: JWT funcionando corretamente, API rodando em `http://localhost:5000`

## 📂 Estrutura do Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── users/
│   │   │       └── users-list/
│   │   ├── shared/
│   │   │   ├── models/
│   │   │   └── components/
│   │   └── app.routes.ts
│   ├── environments/
│   └── styles.css
└── angular.json
```

## 🗓️ Plano de Implementação

### 🔹 Fase 1: Setup do Projeto
- [x] **1.1 Criar Projeto Angular 19**
    - Verificar versão do Node.js (18+)
    - Verificar versão do Angular CLI
    - Criar projeto: `ng new frontend --routing --style=css --standalone`
    - Configurar porta 5001 no `angular.json`
- [ ] **1.2 Configurar Environments**
    - Criar `environment.ts` com URL da API
    - Configurar para apontar para `http://localhost:5000/api`
- [ ] **1.3 Instalar Dependências**
    - Angular Material (opcional, mas recomendado)
    - Reactive Forms (já incluído)
    - HttpClient (já incluído)

### 🔹 Fase 2: Core Layer
- [ ] **2.1 Models**
    - `User` interface
    - `LoginRequest` interface
    - `LoginResponse` interface
    - `RegisterRequest` interface
- [ ] **2.2 Auth Service**
    - Métodos: `login`, `register`, `logout`, `isAuthenticated`, `getToken`
    - Gerenciamento do token no localStorage
    - Decodificação do JWT
- [ ] **2.3 HTTP Interceptor**
    - Adicionar token automaticamente em todas as requisições
    - Header: `Authorization: Bearer {token}`
    - Implementar como `HttpInterceptorFn` (Angular 19)
- [ ] **2.4 Auth Guard**
    - Proteger rotas que requerem autenticação
    - Redirecionar para login se não autenticado
    - Implementar como `CanActivateFn` (Angular 19)

### 🔹 Fase 3: Feature - Autenticação
- [ ] **3.1 Login Component**
    - Formulário reativo com validações (Email, Password)
    - Integração com `AuthService.login()`
    - Redirecionamento e tratamento de erros
- [ ] **3.2 Register Component**
    - Formulário reativo com validações (Name, Email, Password)
    - Integração com `AuthService.register()`
    - Redirecionamento após sucesso

### 🔹 Fase 4: Feature - Usuários
- [ ] **4.1 Users Service**
    - Método: `getUsers()`
    - Requisição `GET /api/users`
- [ ] **4.2 Users List Component**
    - Buscar e listar usuários (Tabela/Cards)
    - Botão de logout

### 🔹 Fase 5: Routing
- [ ] **5.1 Configurar Rotas**
    - `/login`, `/register`, `/users` (protegida)
    - Redirecionamentos padrão
- [ ] **5.2 Navegação**
    - Links de navegação e redirecionamento pós-login/logout

### 🔹 Fase 6: Styling
- [ ] **6.1 Layout Básico**
    - Header, Container centralizado
- [ ] **6.2 Feedback Visual**
    - Loading spinners, mensagens de erro/sucesso

### 🔹 Fase 7: Testes
- [ ] **7.1 Teste de Componente**
    - Teste do `LoginComponent`
- [ ] **7.2 Teste Manual**
    - Fluxo completo de registro, login e listagem

### 🔹 Fase 8: Integração
- [ ] **8.1 Validar Integração com API**
    - CORS, JWT e tratamento de erros

## ✅ Requisitos Técnicos
- **Angular 19 Features**: Standalone components, Signals, Functional guards/interceptors
- **Boas Práticas**: Reactive Forms, Unsubscribe (async pipe), Strict mode

## 📐 Estrutura de Código Sugerida

### Auth Service Interface
```typescript
interface LoginRequest { email: string; password: string; }
interface LoginResponse { token: string; expiresAt: string; }
interface RegisterRequest { name: string; email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(request: LoginRequest): Observable<LoginResponse>;
  register(request: RegisterRequest): Observable<void>;
  logout(): void;
  isAuthenticated(): boolean;
  getToken(): string | null;
}
```

### HTTP Interceptor
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

### Auth Guard
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
```

## ⏱️ Estimativa de Tempo
- **Setup & Core**: ~1h
- **Auth & Users Features**: ~1h 40min
- **Routing, Styling & Testes**: ~1h 20min
- **Total Estimado**: ~4 horas

## 🏁 Critérios de Sucesso Final
- [ ] Usuário consegue se registrar e fazer login
- [ ] Token JWT é armazenado e enviado via Interceptor
- [ ] Lista de usuários é exibida protegida por Guard
- [ ] Logout funciona corretamente
- [ ] Mínimo 1 teste passando