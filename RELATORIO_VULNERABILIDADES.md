# 🚨 Relatório de Vulnerabilidades - Unisystem

**Data da auditoria:** 20/08/2026
**Escopo:** Backend (.NET 8), Frontend (Angular 21), Docker, Nginx, configurações de deploy
**Método:** Análise estática manual do código-fonte

> ⚠️ **Contexto:** Este projeto é uma prova de conceito / desafio técnico, sem uso por clientes reais. Os achados abaixo **não exigem correção imediata** — este relatório existe para consulta futura, caso o projeto evolua para uso real.

---

## 📊 Resumo Executivo

| Severidade | Quantidade | Itens |
|---|---|---|
| 🔴 Alta | 3 | Validação de entrada inexistente, sem HTTPS, login sem rate limiting |
| 🟡 Média | 5 | Swagger público, segredo JWT commitado, token em localStorage sem CSP, containers root, user enumeration |
| 🟢 Baixa | 2 | CORS com IP de LAN, healthcheck inócuo |

**Prioridade sugerida (se um dia for corrigir):** 1 → 3 → 5 → 2 → 4 → 6 → demais.

---

## 🔴 Vulnerabilidades Altas

### 1. Validação de entrada inexistente no servidor (validators nunca executam)

**Arquivos:**
- `src/Unisystem.API/Program.cs:28` — registra os validators via `AddValidatorsFromAssembly`
- `src/Unisystem.Application/Features/Auth/Commands/Register/RegisterCommandValidator.cs` — regras definidas, mas **código morto**
- `src/Unisystem.Application/Features/Auth/Commands/Login/LoginCommandHandler.cs` e `Register/RegisterCommandHandler.cs` — handlers recebem o comando sem validação

**Problema:** Os validators FluentValidation estão registrados no DI, mas não existe nenhum `IPipelineBehavior` (ValidationBehavior) no pipeline do MediatR, e os handlers não validam manualmente. Resultado: **nenhuma validação de entrada acontece no servidor**.

**Impacto real:**
- Senha de 1 caractere aceita no registro (a regra de mínimo 6 é código morto)
- E-mail sem validação de formato
- Nome/e-mail sem limite de tamanho (além do limite do banco)

**Correção sugerida:** Adicionar um `ValidationBehavior<TRequest, TResponse>` no pipeline do MediatR (`builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>))`), ou validar manualmente no início de cada handler.

---

### 2. Sem HTTPS em produção — credenciais e tokens em texto claro

**Arquivos:**
- `frontend/nginx.conf:2` — apenas `listen 80`
- `src/Unisystem.API/Program.cs` — sem `UseHttpsRedirection()` / `UseHsts()`
- Produção: `http://129.153.86.168` (CORS em `Program.cs:54`)

**Problema:** Todo o tráfego é HTTP. O login envia a senha em claro e o JWT de 8h pode ser interceptado em qualquer ponto da rede.

**Correção sugerida:** Certificado TLS no nginx-proxy (Let's Encrypt), redirect 80→443, `app.UseHsts()` e `app.UseHttpsRedirection()` na API.

---

### 3. Login sem rate limiting nem proteção contra brute force

**Arquivos:**
- `src/Unisystem.API/Controllers/AuthController.cs` — `POST /api/auth/login` aceita tentativas ilimitadas
- `src/Unisystem.API/Program.cs` — sem `AddRateLimiter`

**Problema:** Endpoint de login exposto na internet pública sem limite de tentativas, sem lockout, sem CAPTCHA. O BCrypt retarda ataques offline, mas online é viável contra senhas fracas — agravado pelo achado #1 (senhas de 1 caractere são permitidas).

**Correção sugerida:** `builder.Services.AddRateLimiter(...)` com política de janela fixa por IP nos endpoints `/api/auth/*`, e/ou lockout após N falhas consecutivas.

---

## 🟡 Vulnerabilidades Médias

### 4. Swagger exposto em produção sem autenticação

**Arquivo:** `src/Unisystem.API/Program.cs:105-110` — `UseSwagger()`/`UseSwaggerUI()` fora de qualquer verificação de ambiente.

**Problema:** Acessível publicamente em `/unisystem-api/swagger`, expondo o contrato completo da API e facilitando reconhecimento para os ataques #1 e #3. (O `AGENTS.md` documenta isso como intencional, mas é uma exposição real.)

**Correção sugerida:** Condicionar a `app.Environment.IsDevelopment()` ou proteger com autenticação.

---

### 5. Segredo JWT commitado no repositório + fallback inseguro em produção

**Arquivos:**
- `src/Unisystem.API/appsettings.Development.json:6` — secret de dev commitada no Git
- `src/Unisystem.API/appsettings.json:6` — placeholder `"CHANGE_THIS_TO_A_SECURE_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG"`

**Problema:** Se a variável `UNISYSTEM_JWT_SECRET` (referenciada em `docker-compose.yml`) não estiver definida no deploy, a API sobe silenciosamente com o placeholder público — **qualquer pessoa poderia forjar tokens JWT válidos** e acessar endpoints protegidos.

**Correção sugerida:** Falhar no startup se `Jwt:Secret` ainda for o placeholder (checagem explícita em `Program.cs`); usar User Secrets em dev e remover segredos de arquivos commitados.

---

### 6. JWT em localStorage + ausência de Content-Security-Policy

**Arquivos:**
- `frontend/src/app/core/services/auth.service.ts:19-20` — token e usuário em `localStorage`
- `frontend/nginx.conf:11-14` — headers básicos presentes, mas **sem CSP** (`X-XSS-Protection` é obsoleto e ignorado por browsers modernos)

**Problema:** Qualquer XSS lê o token do localStorage e o envia para um atacante. Sem CSP, a superfície para XSS é maior.

**Correção sugerida:** Adicionar CSP restritiva no nginx (mínimo: `default-src 'self'`), `Referrer-Policy` e `Permissions-Policy`. Alternativa mais robusta: cookie `HttpOnly; Secure; SameSite=Strict`.

---

### 7. Containers rodam como root

**Arquivos:**
- `Dockerfile.api` — sem instrução `USER` (processo dotnet como root)
- `frontend/Dockerfile:32` — nginx master como root

**Problema:** Se um processo no container for comprometido, o atacante tem root dentro do container, facilitando escape e movimento lateral.

**Correção sugerida:** Na API, usar `USER $APP_UID` (disponível nas imagens .NET 8); no frontend, usar `nginxinc/nginx-unprivileged` ou configurar usuário não-root.

---

### 8. User enumeration no registro

**Arquivo:** `src/Unisystem.Application/Features/Auth/Commands/Register/RegisterCommandHandler.cs:22-23` — retorna `"E-mail já cadastrado"`.

**Problema:** Permite descobrir quais e-mails estão registrados na base (combinado com a ausência de rate limiting, dá para mapear a base inteira). O login está correto, com mensagem genérica "E-mail ou senha inválidos".

**Correção sugerida:** Resposta genérica ou fluxo de confirmação por e-mail.

---

## 🟢 Vulnerabilidades Baixas

### 9. CORS com origens HTTP e IP de LAN hardcoded

**Arquivo:** `src/Unisystem.API/Program.cs:54` — origens incluem `http://129.153.86.168`, `http://localhost` e `http://192.168.15.119` (rede local do desenvolvedor), com `AllowCredentials()`.

**Problema:** Não é `AllowAnyOrigin` (risco limitado), mas IP privado de LAN não deveria estar na política de produção e as origens deveriam ser HTTPS.

**Correção sugerida:** Mover origens para configuração por ambiente; remover IP privado.

---

### 10. Healthcheck inócuo no docker-compose

**Arquivo:** `docker-compose.yml:20` — `test -d /app` sempre passa.

**Problema:** Não é vulnerabilidade, mas o healthcheck não detecta API travada — falha operacional de detecção.

**Correção sugerida:** Usar `curl -f` contra um endpoint de health real (ex.: adicionar `app.MapHealthChecks("/health")`).

---

## ✅ Pontos Verificados como Seguros

- **Validação de token JWT correta:** issuer, audience, lifetime e signing key todos validados (`Program.cs:39-46`); token inclui `jti` e expiração configurável; HmacSha256 com chave de tamanho adequado
- **Sem SQL injection:** todo acesso a dados via EF Core/LINQ parametrizado (`UserRepository.cs`)
- **Hash de senha com BCrypt** e hash nunca exposto em respostas — DTOs só expõem Id/Name/Email/CreatedAt
- **Erro de login genérico** ("E-mail ou senha inválidos"); sem `UseDeveloperExceptionPage` em produção (sem stack traces vazando)
- **`.gitignore` cobre `*.db`** — nenhum banco ou `.env` commitado
- **`npm audit --omit=dev` no frontend: 0 vulnerabilidades** (Angular 21.2.19)

---

## ⏳ Itens a Monitorar

- **Pacotes NuGet:** não foi possível rodar `dotnet list package --vulnerable` na máquina da auditoria. Versões atuais: EF Core/ASP.NET 8.0.11-8.0.23, `System.IdentityModel.Tokens.Jwt` 8.2.1. Rodar o scan periodicamente.
- **Fim de suporte do .NET 8:** novembro/2026. Planejar migração para .NET 10 LTS se o projeto continuar vivo.
- **Renovação do segredo JWT:** quando corrigir o achado #5, revogar/rotacionar qualquer segredo que tenha ido para produção.

---

## 📋 Plano de Correção Sugerido (referência futura)

| Ordem | Item | Esforço estimado |
|---|---|---|
| 1 | #1 — Adicionar ValidationBehavior no pipeline MediatR | Baixo (~30 min) |
| 2 | #3 — Rate limiting nos endpoints de auth | Baixo (~30 min) |
| 3 | #5 — Falhar no startup com secret placeholder + User Secrets | Baixo (~30 min) |
| 4 | #2 — HTTPS no nginx-proxy (Let's Encrypt) | Médio |
| 5 | #4 — Restringir Swagger a Development | Baixo (~5 min) |
| 6 | #6 — CSP e headers de segurança no nginx | Baixo (~30 min) |
| 7 | #7/#8/#9 — Containers não-root, resposta genérica no registro, CORS por ambiente | Médio |
