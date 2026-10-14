# Unisystem: demonstração por subdomínio

Produção: https://unisystem.guelfi.com.br/; API /api; Swagger /swagger/index.html. A aplicação continua uma prova de conceito, sem ampliação dos fluxos de negócio.

Os argumentos BASE_HREF/API_URL do frontend preservam os defaults legados para desenvolvimento e Docker local. O deploy OCI aplica apenas UNISYSTEM_BASE_HREF=/ e UNISYSTEM_API_URL=/api no ambiente privado existente. O JWT e o volume SQLite unisystem_unisystem-db-data devem permanecer iguais; configuração ausente ou divergente interrompe o deploy.

Cada publicação preserva uma cópia consistente SQLite, ambiente privado e imagens anteriores em /var/backups/unisystem, antes de recriar somente os dois containers do projeto. O proxy compartilhado é administrado pela infraestrutura central e usa resolução DNS em execução. Não reiniciar/recriar o Nginx para publicar este projeto.

O workflow publica o SHA que passou no CI, recusa uma revisão superada no main e exige respostas HTTPS do frontend e OpenAPI após a publicação. CI testa imagens e o contrato de base/API do build da raiz.
