# Meeting Rooms Booker

Sistema interno para reservar salas de reunião.

## Como rodar

Requer Node.js 24+.

```bash
npm install        # instala dependências e gera o Prisma Client
npm run db:setup   # aplica as migrations e popula o banco
npm run dev        # http://localhost:3000
```

## Seed

Seed de usuários:

| Usuário        | Papel |
| -------------- | ----- |
| Daiane Pereira | Comum |
| Bruno Lima     | Comum |
| Yago Santos    | Admin |

Para recriar o banco do zero: `npm run db:reset`.

## Stack

- **Next.js (App Router) + TypeScript strict**: renderização no servidor, server actions e tipagem estrita de ponta a ponta.
- **Prisma + SQLite**: migrations versionadas em SQL legível e seed nativo; SQLite dispensa infraestrutura local.
- **Vitest**: rápido e compatível com TypeScript/ESM sem configuração extra.
- **ESLint (config do Next) + Prettier**: padrão da comunidade, diffs consistentes nos PRs.
- **GitHub Actions**: lint, formatação, typecheck, testes e build em todo PR.

## Testes

```bash
npm test
```
