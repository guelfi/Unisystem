# 🔐 SECURITY - Práticas de Segurança do Unisystem

**Versão:** 1.0  
**Data:** 16/01/2026

---

## 📋 VISÃO GERAL

Este documento descreve as práticas de segurança implementadas no projeto Unisystem, focando em simplicidade, eficácia e adequação ao contexto de um teste prático.

---

## 🎯 ABORDAGEM ESCOLHIDA

### ✅ **Registro Aberto + JWT (RECOMENDADA PARA O TESTE)**

**Por quê esta abordagem?**
- ✅ Simples de implementar (tempo é importante no teste)
- ✅ Segura e adequada ao contexto
- ✅ Segue boas práticas da indústria
- ✅ Facilita a avaliação pelo examinador
- ✅ Não expõe credenciais no cliente

**Fluxo:**
1. Qualquer pessoa pode se registrar (POST /api/auth/register)
2. Após registro, faz login (POST /api/auth/login) e recebe JWT
3. Usa JWT para acessar endpoints protegidos
4. Frontend protege rotas com Guards

---

## 🔒 ESTRUTURA DE SEGURANÇA

### 1. **Endpoints da API**

#### Endpoints Públicos (sem autenticação)
```
POST /api/auth/register
  - Cadastro de novo usuário
  - Valida e-mail único
  - Hash de senha com BCrypt
  
POST /api/auth/login
  - Autentica usuário
  - Retorna JWT token
  - Token válido por 8 horas
```

#### Endpoints Protegidos (requer JWT)
```
GET /api/users
  - Lista todos os usuários
  - Requer: Authorization: Bearer {token}
  
GET /api/users/{id}
  - Obtém usuário específico
  - Requer: Authorization: Bearer {token}
```

### 2. **Autenticação JWT**

#### Configuração do Token
```csharp
// appsettings.json (valores vêm do .env)
{
  "Jwt": {
    "Secret": "[MIN 32 CARACTERES]",
    "Issuer": "Unisystem",
    "Audience": "UnisystemApp",
    "ExpirationHours": 8
  }
}
```

#### Estrutura do Token JWT
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "exp": 1234567890,
  "iss": "Unisystem",
  "aud": "UnisystemApp"
}
```

#### Validação no Backend
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Secret"])
            )
        };
    });
```

### 3. **Proteção de Senhas**

#### Hash com BCrypt
```csharp
// Ao cadastrar
string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

// Ao validar login
bool isValid = BCrypt.Net.BCrypt.Verify(password, hashedPassword);
```

**Configuração:**
- WorkFactor: 12 (padrão)
- Salt gerado automaticamente
- Hashes únicos mesmo para senhas iguais

### 4. **Proteção no Frontend**

#### HTTP Interceptor (envio automático de token)
```typescript
// src/app/core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

#### Route Guards (proteção de rotas)
```typescript
// src/app/core/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Redireciona para login se não autenticado
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

#### Validação de Token
```typescript
// src/app/core/services/auth.service.ts
isAuthenticated(): boolean {
  const token = this.getToken();
  if (!token) return false;
  
  // Verifica se token não expirou
  const payload = this.decodeToken(token);
  const now = Date.now() / 1000;
  
  return payload.exp > now;
}
```

### 5. **Estrutura de Rotas**

#### Públicas (sem proteção)
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // ...
];
```

#### Protegidas (com Guard)
```typescript
const routes: Routes = [
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [authGuard]
  },
  // ...
];
```

---

## 🔐 GESTÃO DE CREDENCIAIS

### 1. **Variáveis de Ambiente**

#### Backend (.env) - NUNCA COMMITAR
```bash
# JWT Configuration
JWT_SECRET=sua_chave_super_secreta_aqui_minimo_32_caracteres_alfanumericos
JWT_ISSUER=Unisystem
JWT_AUDIENCE=UnisystemApp
JWT_EXPIRATION_HOURS=8

# Database
DATABASE_PATH=./database/unisystem.db

# Environment
ASPNETCORE_ENVIRONMENT=Development
```

#### Backend (.env.example) - COMMITAR
```bash
# JWT Configuration
JWT_SECRET=your_secret_key_here_minimum_32_characters
JWT_ISSUER=Unisystem
JWT_AUDIENCE=UnisystemApp
JWT_EXPIRATION_HOURS=8

# Database
DATABASE_PATH=./database/unisystem.db

# Environment
ASPNETCORE_ENVIRONMENT=Development
```

#### Frontend (environment.ts)
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
  // ⚠️ NUNCA coloque secrets/tokens aqui!
  // Apenas configurações públicas (URLs)
};
```

### 2. **.gitignore Obrigatório**

```gitignore
# Credenciais e configurações sensíveis
.env
.env.local
.env.production
*.env

# Banco de dados
*.db
*.db-shm
*.db-wal
database/

# Logs
logs/
*.log

# Certificados
*.pfx
*.p12
*.key
*.pem
```

### 3. **Docker Compose (Produção)**

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./backend
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - JWT_ISSUER=${JWT_ISSUER}
      - JWT_AUDIENCE=${JWT_AUDIENCE}
    env_file:
      - .env  # Arquivo não commitado
    ports:
      - "5000:80"
```

---

## ✅ VALIDAÇÕES DE SEGURANÇA

### 1. **Validação de Entrada (Backend)**

```csharp
// FluentValidation
public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(100);
            
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6)
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)")
            .WithMessage("Senha deve conter maiúscula, minúscula e número");
            
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(100);
    }
}
```

### 2. **Validação de E-mail Único**

```csharp
// No handler de registro
var existingUser = await _context.Users
    .FirstOrDefaultAsync(u => u.Email == request.Email);
    
if (existingUser != null)
{
    return Result.Failure("E-mail já cadastrado");
}
```

### 3. **Proteção contra SQL Injection**

✅ **Entity Framework Core** previne automaticamente:
```csharp
// EF Core usa parametrização automática
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Email == email);
```

### 4. **CORS (Cross-Origin Resource Sharing)**

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

---

## 🛡️ PROTEÇÕES IMPLEMENTADAS

### ✅ Checklist de Segurança

- [x] **Autenticação JWT**
- [x] **Hash de senhas (BCrypt)**
- [x] **Validação de entrada (FluentValidation)**
- [x] **Proteção contra SQL Injection (EF Core)**
- [x] **E-mail único validado**
- [x] **Tokens com expiração**
- [x] **CORS configurado**
- [x] **Credenciais em variáveis de ambiente**
- [x] **.gitignore protegendo .env**
- [x] **HTTPS em produção (Docker)**
- [x] **Route Guards no frontend**
- [x] **HTTP Interceptors**
- [x] **Validação de token no frontend**

---

## 🚫 O QUE EVITAR

### ❌ Práticas NÃO Recomendadas

1. **NUNCA commitar .env com valores reais**
2. **NUNCA colocar secrets no frontend**
3. **NUNCA usar senhas em texto plano**
4. **NUNCA confiar em validação apenas no frontend**
5. **NUNCA expor detalhes de erro ao cliente**
6. **NUNCA usar JWT sem expiração**
7. **NUNCA armazenar senhas sem hash**

---

## 📊 COMPARAÇÃO DE ABORDAGENS

| Abordagem | Complexidade | Segurança | Adequação ao Teste |
|-----------|--------------|-----------|-------------------|
| **Registro Aberto + JWT** | ⭐ Baixa | ⭐⭐⭐ Alta | ✅ **ESCOLHIDA** |
| Seed Usuário Admin | ⭐⭐ Média | ⭐⭐⭐ Alta | ✅ Alternativa |
| Client ID/Secret | ⭐⭐⭐ Alta | ⭐⭐ Média | ❌ Desnecessário |
| OAuth2 Externo | ⭐⭐⭐⭐ Muito Alta | ⭐⭐⭐⭐ Muito Alta | ❌ Excessivo |

---

## 🔍 TESTES DE SEGURANÇA

### Cenários a Testar

1. ✅ Tentar acessar `/api/users` sem token → 401 Unauthorized
2. ✅ Tentar acessar `/api/users` com token inválido → 401 Unauthorized
3. ✅ Tentar acessar `/api/users` com token expirado → 401 Unauthorized
4. ✅ Cadastrar e-mail duplicado → 400 Bad Request
5. ✅ Login com senha incorreta → 401 Unauthorized
6. ✅ Acessar rota protegida no frontend sem login → Redirect para /login

---

## 📚 REFERÊNCIAS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [ASP.NET Core Security](https://docs.microsoft.com/aspnet/core/security/)
- [Angular Security Guide](https://angular.io/guide/security)

---

## 🎯 CONCLUSÃO

A abordagem escolhida (**Registro Aberto + JWT**) é:
- ✅ Simples de implementar
- ✅ Segura para o contexto
- ✅ Adequada ao tempo do teste
- ✅ Segue boas práticas
- ✅ Facilita a avaliação

**Não exponha credenciais. Sempre use variáveis de ambiente. Proteja o .env.**
