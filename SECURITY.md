# 🔐 Segurança - Unisystem

Este documento descreve as práticas de segurança implementadas no projeto Unisystem.

> ⚠️ Para os pontos de segurança **pendentes** (vulnerabilidades conhecidas), consulte o [Relatório de Vulnerabilidades](RELATORIO_VULNERABILIDADES.md).

---

## 🛡️ Práticas Implementadas

### 1. Autenticação JWT

**Implementação:**
- Tokens JWT assinados com chave secreta (HS256)
- Expiração de 8 horas
- Token incluído automaticamente via HTTP Interceptor (frontend)
- Validação em todos os endpoints protegidos

**Configuração:**
```json
{
  "Jwt": {
    "Key": "[chave-secreta-256-bits]",
    "Issuer": "Unisystem",
    "Audience": "UnisystemApp",
    "ExpiresInHours": 8
  }
}
```

**Claims no Token:**
- `sub`: ID do usuário (GUID)
- `email`: Email do usuário
- `name`: Nome do usuário
- `jti`: ID único do token
- `exp`: Data de expiração
- `iss`: Emissor (Unisystem)
- `aud`: Audiência (UnisystemApp)

---

### 2. Hash de Senhas

**Implementação:**
- BCrypt.Net para hash de senhas
- Custo de trabalho: 12 (padrão)
- Senhas NUNCA armazenadas em texto plano
- PasswordHash não retornado nas respostas da API

**Exemplo de uso:**
```csharp
// Gerar hash ao cadastrar
string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

// Verificar ao fazer login
bool isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
```

---

### 3. Validação de Dados

**Backend - FluentValidation:**
- Email obrigatório e formato válido
- Senha obrigatória com mínimo de 6 caracteres
- Nome obrigatório

**Frontend - Reactive Forms:**
- Validação em tempo real
- Feedback visual de erros
- Botões desabilitados enquanto formulário inválido

---

### 4. Proteção de Rotas

**Frontend - Auth Guard:**
- Rota `/users` protegida por autenticação
- Redirecionamento automático para `/login` se não autenticado
- Verificação de token no localStorage

**Backend - [Authorize]:**
- Endpoints protegidos com atributo `[Authorize]`
- Retorna 401 Unauthorized sem token válido

---

### 5. CORS

**Configuração:**
- Permite requisições de `http://localhost:5001` (desenvolvimento)
- Métodos permitidos: GET, POST, PUT, DELETE
- Headers permitidos: Content-Type, Authorization

**Para Produção:**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://seu-dominio.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

---

### 6. Validação de Email Único

**Implementação:**
- Verificação no banco antes de cadastrar
- Índice único na coluna Email (SQLite)
- Mensagem de erro apropriada: "E-mail já cadastrado"

---

## 📋 Checklist de Segurança

### ✅ Implementado
- [x] JWT com assinatura e expiração
- [x] Hash de senhas com BCrypt
- [x] Validação de dados (backend e frontend)
- [x] Proteção de rotas sensíveis
- [x] CORS configurado
- [x] Email único garantido
- [x] Senhas nunca expostas nas respostas

### ⚠️ Recomendações para Produção

1. **HTTPS Obrigatório**
   - Configurar certificado SSL/TLS
   - Redirecionar HTTP para HTTPS
   - HSTS (HTTP Strict Transport Security)

2. **Variáveis de Ambiente**
   - Mover JWT Key para variável de ambiente
   - Não commitar secrets no repositório
   - Usar Azure Key Vault ou similar

3. **Rate Limiting**
   - Implementar limite de requisições por IP
   - Proteção contra força bruta no login
   - Throttling em endpoints sensíveis

4. **Logging e Monitoramento**
   - Log de tentativas de login falhas
   - Monitoramento de tokens expirados
   - Alertas de atividades suspeitas

5. **Validações Adicionais**
   - Complexidade de senha (letras, números, símbolos)
   - Bloqueio de senhas comuns
   - Captcha em formulários públicos

---

## 🔍 Testes de Segurança

### Validações Testadas
1. ✅ Login sem token retorna 401
2. ✅ Email duplicado é rejeitado
3. ✅ Senha hasheada não é exposta
4. ✅ Token inválido é rejeitado
5. ✅ Token expirado é rejeitado

### Comandos de Teste
```bash
# Testar endpoint sem autenticação
curl -X GET http://localhost:5000/api/users
# Esperado: 401 Unauthorized

# Testar com token válido
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer {seu-token}"
# Esperado: 200 OK com lista de usuários
```

---

## 📝 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [BCrypt](https://github.com/BcryptNet/bcrypt.net)
- [ASP.NET Core Security](https://docs.microsoft.com/aspnet/core/security/)

---

**⚠️ IMPORTANTE:** Esta documentação descreve as práticas implementadas no ambiente de desenvolvimento. Para produção, implemente as recomendações adicionais listadas acima.
