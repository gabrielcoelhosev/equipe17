# Deploy gratis sem cartao: Vercel + Neon

Use este caminho quando o Render pedir cartao.

## 1. Banco no Neon

1. Acesse https://neon.com.
2. Crie uma conta gratis.
3. Crie um projeto Postgres.
4. Copie a connection string.

Ela deve ficar parecida com:

```text
postgresql://usuario:senha@host.neon.tech/database?sslmode=require
```

## 2. Configurar variaveis na Vercel

No projeto da Vercel, adicione:

```text
DATABASE_URL=postgresql://...
JWT_SECRET=qualquer-segredo-com-mais-de-10-caracteres
```

## 3. Deploy na Vercel

1. Suba o repo no GitHub.
2. Acesse https://vercel.com/new.
3. Importe o repositorio.
4. A Vercel vai usar o `vercel.json` automaticamente.
5. Confirme o deploy.

O build configurado e:

```bash
npm run build:vercel
```

A pasta publicada e:

```text
frontend/dist/gbriel-study-frontend/browser
```

## 4. Criar tabelas no banco

Depois de copiar a `DATABASE_URL` do Neon, rode localmente:

```bash
npm run db:deploy
```

Se quiser dados demo:

```bash
npx tsx scripts/seed-demo.ts
```

## 5. URLs

Depois do deploy:

```text
https://seu-projeto.vercel.app
https://seu-projeto.vercel.app/check
https://seu-projeto.vercel.app/docs
```

## Observacao

Uploads salvos em disco local nao sao persistentes em serverless. Para apresentacao rapida, o restante do app funciona; para upload real em producao, use um storage externo.
