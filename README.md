# Meeting Rooms Booker

Sistema interno para reservar salas de reunião.

## Como rodar

Requer Node.js 24+.

```bash
npm install        # instala dependências e gera o Prisma Client
npm run db:setup   # aplica as migrations e popula o banco
npm run dev        # http://localhost:3000
```

Use o seletor **Entrar como** no topo da página para trocar de usuário:

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

## Decisões

- **Autenticação**: ainda não há provedor de identidade. O seletor "entrar como" grava apenas o id do usuário num cookie `httpOnly`; o papel (admin ou comum) é sempre lido do banco e toda permissão é verificada no servidor. A integração com um provedor real fica restrita a `lib/auth.ts`.
- **Recursos das salas** ficam numa tabela própria (N:N), já que o SQLite não tem arrays e o filtro por recurso fica simples.
- **Cancelamento lógico** (`cancelledAt`): mantém o histórico e reservas canceladas não contam na sobreposição.
- **Branches `chore/`**: além de `feature/SALA-n`, `hotfix/` e `release/`, tarefas de infraestrutura usam `chore/`.

## Testes

```bash
npm test
```
