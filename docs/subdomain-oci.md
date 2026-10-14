# Unisystem: demonstração por subdomínio

Produção: https://unisystem.guelfi.com.br/; API /api; Swagger /swagger/index.html. A aplicação continua uma prova de conceito, sem ampliação dos fluxos de negócio.

Os argumentos BASE_HREF/API_URL do frontend preservam os defaults legados para desenvolvimento e Docker local. O deploy OCI aplica apenas UNISYSTEM_BASE_HREF=/ e UNISYSTEM_API_URL=/api no ambiente privado existente. O JWT e o volume SQLite unisystem_unisystem-db-data devem permanecer iguais; configuração ausente ou divergente interrompe o deploy.

Cada publicação preserva uma cópia consistente SQLite, ambiente privado e imagens anteriores em /var/backups/unisystem, antes de recriar somente os dois containers do projeto. O proxy compartilhado é administrado pela infraestrutura central e usa resolução DNS em execução. Não reiniciar/recriar o Nginx para publicar este projeto.

O workflow publica o SHA que passou no CI, recusa uma revisão superada no main e exige respostas HTTPS do frontend e OpenAPI após a publicação. CI testa imagens e o contrato de base/API do build da raiz.

## Auditoria de dependências

O lockfile foi atualizado em 14/10/2026 com patches compatíveis da linha Angular21, incluindo router21.2.25/CLI21.2.26 e bibliotecas transitivas. O relatório passou de5 alertas críticos para0. Os11 alertas altos restantes são cadeias de dependências exclusivamente de desenvolvimento derivadas do aviso GHSA-vfj7-8cjw-p6xm de braces, sem patch compatível na cadeia Angular/Karma atual; elas não são copiadas para a imagem final Nginx.

A política de CI exige relatório completo, verifica o lockfile e aceita apenas esse aviso exato em nós marcados dev. Qualquer aviso High/Critical novo, dependência de produção ou diagnóstico incompleto bloqueia a publicação. A exceção por nomes amplos de pacote foi substituída por esse critério restrito, com testes para impedir que um pacote já revisado aceite um aviso novo.

Referências: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm e https://github.com/advisories/GHSA-ff3f-86qr-9cv3. O segundo refere-se a SSR, que não é usado nesta SPA; mesmo assim, o router foi atualizado para a versão corrigida.
