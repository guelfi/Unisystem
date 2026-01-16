#!/bin/bash

echo "=== Teste da API Unisystem ==="
echo ""

API_URL="http://localhost:5000/api"

# 1. Registro
echo "1. Testando registro de usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","password":"Senha123"}')
echo "Resposta: $REGISTER_RESPONSE"
echo ""

# 2. Login
echo "2. Testando login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"Senha123"}')
echo "Resposta: $LOGIN_RESPONSE"

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtido: ${TOKEN:0:50}..."
echo ""

# 3. Listar usuários (com token)
echo "3. Testando listagem de usuários (autenticado)..."
USERS_RESPONSE=$(curl -s -X GET "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN")
echo "Resposta: $USERS_RESPONSE"
echo ""

# 4. Tentar listar sem token (deve falhar)
echo "4. Testando listagem sem token (deve retornar 401)..."
curl -s -w "\nHTTP Status: %{http_code}\n" -X GET "$API_URL/users"
echo ""

echo "=== Testes concluídos ==="
