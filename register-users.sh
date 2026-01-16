#!/bin/bash
API_URL="http://localhost:5000/api"

echo "=== Cadastrando novos usuários ==="

# Usuário 2
echo "1. Cadastrando Maria Santos..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria Santos","email":"maria@example.com","password":"Maria123"}' | jq
echo ""

# Usuário 3
echo "2. Cadastrando Pedro Oliveira..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pedro Oliveira","email":"pedro@example.com","password":"Pedro123"}' | jq
echo ""

# Usuário 4
echo "3. Cadastrando Ana Costa..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Costa","email":"ana@example.com","password":"Ana123"}' | jq
echo ""

echo "=== Usuários cadastrados com sucesso! ==="
echo ""
echo "Fazendo login com Maria para obter token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","password":"Maria123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Token obtido: ${TOKEN:0:50}..."
echo ""

echo "Listando todos os usuários..."
curl -s -X GET "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" | jq

echo ""
echo "=== Concluído! ==="
