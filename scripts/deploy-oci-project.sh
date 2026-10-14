#!/usr/bin/env bash
set -Eeuo pipefail
cd /var/www/Unisystem
sudo -n python3 scripts/prepare-oci.py
sudo -n docker compose -p unisystem --env-file .env config --quiet
sudo -n docker exec nginx-proxy nginx -t
sudo -n docker compose -p unisystem --env-file .env up -d --build unisystem-api unisystem-frontend
# Central routes use runtime DNS; this workflow never rewrites/recreates the proxy.
