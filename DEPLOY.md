# Deploy na internet

Este projeto esta preparado para deploy no Render usando `render.yaml`.
O backend Fastify tambem serve o build do Angular, entao o deploy publico fica em um unico Web Service com um Postgres gerenciado.

## Passos

1. Suba este repositorio para o GitHub.
2. Entre em https://dashboard.render.com/blueprints.
3. Clique em `New Blueprint Instance`.
4. Selecione o repositorio.
5. Confirme o blueprint `render.yaml`.
6. Aguarde o build e o pre-deploy terminar.

O Render vai criar:

- `equipe17`: Web Service Node com frontend e backend.
- `equipe17-db`: banco PostgreSQL.

## Variaveis

O `render.yaml` ja configura:

- `DATABASE_URL`: vem automaticamente do Postgres do Render.
- `JWT_SECRET`: gerado automaticamente pelo Render.
- `NODE_VERSION`: `24.15.0`.

## Comandos usados no deploy

- Build: `npm run build:all`
- Migrations: `npm run db:deploy`
- Start: `npm start`
- Health check: `/check`

## Login demo

O deploy aplica migrations, mas nao roda seed demo automaticamente.
Para criar dados demo no banco de producao, rode manualmente no Shell do Render:

```bash
npx tsx scripts/seed-demo.ts
```

Credenciais demo:

- Email: `demo@gbriel.com`
- Senha: `demo123456`
