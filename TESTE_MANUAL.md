# 🧪 Guia de Teste Manual - Unisystem

Este guia orienta como testar manualmente a aplicação completa (Backend + Frontend).

---

## 📋 Pré-requisitos

- .NET Core 8 SDK
- Node.js 18+
- npm

---

## 🚀 Passo 1: Iniciar o Backend

### 1.1 Navegar até o diretório da API
```bash
cd src/Unisystem.API
```

### 1.2 Executar a API
```bash
dotnet run
```

✅ **Aguarde a mensagem:**
```
Now listening on: http://localhost:5000
```

✅ **Verifique o Swagger:**
Abra o navegador em: http://localhost:5000/swagger

---

## 🎨 Passo 2: Iniciar o Frontend

### 2.1 Abrir um NOVO terminal

### 2.2 Navegar até o diretório do frontend
```bash
cd frontend
```

### 2.3 Instalar dependências (primeira vez)
```bash
npm install
```

### 2.4 Executar o frontend
```bash
npm start
```

✅ **Aguarde a mensagem:**
```
Application bundle generation complete.
** Angular Live Development Server is listening on localhost:5001 **
```

✅ **Verifique o Frontend:**
Abra o navegador em: http://localhost:5001

---

## ✅ Passo 3: Testar Fluxo de Cadastro

### 3.1 Acessar página de cadastro
1. No navegador, acesse: http://localhost:5001
2. Você será redirecionado para `/login`
3. Clique em **"Cadastre-se"**

### 3.2 Preencher formulário de cadastro
- **Nome:** Seu Nome Completo
- **Email:** seuemail@teste.com
- **Senha:** Teste123

### 3.3 Clicar em "Cadastrar"

✅ **Resultado esperado:**
- Mensagem: "Cadastro realizado com sucesso! Redirecionando..."
- Redirecionamento automático para `/login` após 2 segundos

---

## 🔐 Passo 4: Testar Fluxo de Login

### 4.1 Na página de login, preencher:
- **Email:** seuemail@teste.com
- **Senha:** Teste123

### 4.2 Clicar em "Entrar"

✅ **Resultado esperado:**
- Login bem-sucedido
- Redirecionamento para `/users`
- Visualização da lista de usuários

---

## 👥 Passo 5: Verificar Lista de Usuários

### 5.1 Na página de usuários, verificar:
- ✅ Seu nome aparece no canto superior direito
- ✅ Lista de usuários cadastrados é exibida
- ✅ Cada card mostra: ícone, nome e email
- ✅ Botão "Sair" está visível

### 5.2 Usuários esperados:
Se você usou o script de cadastro, deve ver:
- João Silva (joao@example.com)
- Maria Santos (maria@example.com)
- Pedro Oliveira (pedro@example.com)
- Ana Costa (ana@example.com)
- + Seu usuário recém-cadastrado

---

## 🚪 Passo 6: Testar Logout

### 6.1 Clicar no botão "Sair"

✅ **Resultado esperado:**
- Redirecionamento para `/login`
- Token JWT removido do localStorage
- Não é possível acessar `/users` diretamente

---

## 🛡️ Passo 7: Testar Proteção de Rotas (Guard)

### 7.1 Sem estar logado, tentar acessar:
```
http://localhost:5001/users
```

✅ **Resultado esperado:**
- Redirecionamento automático para `/login`
- Rota protegida funcionando

---

## 🔍 Passo 8: Verificar Interceptor (DevTools)

### 8.1 Abrir DevTools do navegador (F12)
### 8.2 Ir para aba "Network"
### 8.3 Fazer login novamente
### 8.4 Acessar `/users`
### 8.5 Verificar requisição GET para `/api/users`

✅ **Resultado esperado:**
No header da requisição, deve conter:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## ❌ Passo 9: Testar Validações

### 9.1 Teste de email inválido
- Na página de login, digitar email inválido (ex: "teste")
- Tentar submeter

✅ **Resultado esperado:**
- Mensagem: "Email inválido"
- Botão desabilitado

### 9.2 Teste de senha curta
- Na página de cadastro, digitar senha com menos de 6 caracteres
- Tentar submeter

✅ **Resultado esperado:**
- Mensagem: "Senha deve ter no mínimo 6 caracteres"
- Botão desabilitado

### 9.3 Teste de email já cadastrado
- Tentar cadastrar com email já existente

✅ **Resultado esperado:**
- Mensagem de erro: "Email já cadastrado" ou similar

### 9.4 Teste de credenciais inválidas
- Tentar fazer login com senha errada

✅ **Resultado esperado:**
- Mensagem: "Erro ao fazer login. Verifique suas credenciais."

---

## 📊 Checklist de Teste

Marque cada item após testar:

### Backend
- [ ] API iniciada com sucesso em localhost:5000
- [ ] Swagger acessível em localhost:5000/swagger
- [ ] Endpoint POST /api/auth/register funcionando
- [ ] Endpoint POST /api/auth/login funcionando
- [ ] Endpoint GET /api/users funcionando (com token)
- [ ] Endpoint GET /api/users retorna 401 (sem token)

### Frontend
- [ ] Aplicação iniciada com sucesso em localhost:5001
- [ ] Redirecionamento "/" → "/login" funciona
- [ ] Página de cadastro acessível
- [ ] Página de login acessível
- [ ] Validação de formulários funciona
- [ ] Cadastro de usuário funciona
- [ ] Login funciona e redireciona para /users
- [ ] Lista de usuários carrega corretamente
- [ ] Cards de usuários exibem informações
- [ ] Nome do usuário logado aparece no header
- [ ] Botão de logout funciona
- [ ] Guard protege rota /users
- [ ] Interceptor adiciona token JWT automaticamente

### Integração
- [ ] Frontend se comunica com backend via API
- [ ] Token JWT é armazenado no localStorage
- [ ] Token é enviado automaticamente nas requisições
- [ ] Logout limpa token e redireciona
- [ ] Mensagens de erro são exibidas corretamente

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verificar se a porta 5000 está livre
netstat -ano | findstr :5000

# Se estiver em uso, matar o processo ou mudar a porta
```

### Frontend não inicia
```bash
# Limpar cache e reinstalar
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS
- Verificar se backend está rodando
- Verificar configuração em Program.cs (CORS deve permitir localhost:5001)

### Erro 401 na lista de usuários
- Verificar se login foi bem-sucedido
- Verificar no DevTools se token está no localStorage
- Verificar se interceptor está adicionando header Authorization

---

## ✅ Teste Completo

**Se todos os itens acima funcionaram corretamente:**

🎉 **Parabéns! A aplicação Unisystem está 100% funcional!**

- ✅ Backend API operacional
- ✅ Frontend Angular operacional
- ✅ Autenticação JWT funcionando
- ✅ Guards e Interceptors ativos
- ✅ Integração completa Backend ↔ Frontend

---

**Próximo passo:** Containerização com Docker (Dockerfile + docker-compose)
