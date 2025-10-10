## Visão rápida

Repositório Next.js (app router) — Next 15, React 19. Scripts principais em `package.json`: `npm run dev` (dev com Turbopack), `npm run build`, `npm run start`, `npm run lint`.

Fatos importantes:

- Usa `@tanstack/react-query` e `axios` (dependências instaladas) — observe onde providers e componentes cliente são necessários.
- TypeScript com alias `@/*` -> `./src/*` (veja `tsconfig.json`).
- Estilos: `src/app/globals.css` (globais) e `src/app/page.module.css` (CSS Modules).
- Fontes via `next/font/google` usadas em `src/app/pages/layout.tsx`.

Arquivos/chaves a checar primeiro:

- `package.json` — scripts e dependências
- `tsconfig.json` — paths e configurações TS
- `next.config.ts` — configurações Next.js (atualmente vazio)
- `src/app/pages/layout.tsx` — layout root (lugar natural para providers)
- `src/app/pages/home/index.tsx` — exemplo de rota presente

Padrões e convenções detectadas (observável no código):

- Estrutura: a maioria dos arquivos do app está sob `src/app/pages/...`. Confirme mapeamento de rotas: o app router padrão do Next espera `src/app/<route>/page.tsx`, mas aqui há `src/app/pages/home/index.tsx` — verifique se há rota customizada ou se o projeto está usando convenção alternativa.
- Componentes em `src/app` são server components por padrão. Qualquer uso de state/hooks de cliente (`useState`, React Query client, event handlers) deve estar em componentes com `"use client"` na primeira linha.
- Se for usar React Query, adicione `QueryClientProvider` em um componente cliente colocado no root (ex.: dentro de `layout.tsx` crie/importe um client wrapper com `"use client"`).

Como executar e depurar (descoberto no repo):

- Desenvolvimento: `npm run dev` — inicia Next com Turbopack (observe os flags em `package.json`).
- Build: `npm run build` (também usa Turbopack). Teste local de produção: `npm run start` após build.
- Lint: `npm run lint` (configuração em `eslint.config.mjs` no root).

Integrações e pontos de atenção:

- API calls: projeto tem `axios` instalado; preferir chamadas server-side em components/server quando possível (rodando no servidor) ou criar wrappers cliente para usar dentro de componentes marcados como `use client`.
- Se adicionar state global/clients (React Query, Contexts), registre-os no root layout importando um componente cliente:
  - Arquivo observado para alteração: `src/app/pages/layout.tsx` (ex.: envolver `children` com providers).
- Paths absolutos: use import com `@/` (ex.: `import X from '@/components/X'`).

Exemplos rápidos (referências locais):

- Layout/Fontes: `src/app/pages/layout.tsx` usa `next/font/google` e importa `./globals.css`.
- Rota exemplo: `src/app/pages/home/index.tsx` importa `../../app/page.module.css` e exporta um componente funcional simples.

Regras para agentes (específicas deste repositório):

1. Antes de criar providers ou mover arquivos, verifique `src/app/pages/layout.tsx` e confirme se o componente é server/client. Não converta para client sem necessidade.
2. Preserve a convenção de imports com `@/` ao adicionar novos arquivos; atualize `tsconfig.json` se precisar de novos aliases.
3. Para mudanças que afetam rota/estrutura (`src/app/pages/**`), valide manualmente rodando `npm run dev` e confirmando a rota no browser (http://localhost:3000).
4. Evite alterar `next.config.ts` sem um case claro; está vazio e o comportamento atual depende das flags em `package.json`.

Onde olhar para dúvidas futuras:

- `eslint.config.mjs` — regras de lint
- `package.json` — scripts e versões (Next 15, React 19)
- `tsconfig.json` — paths e comportamento de compilação

Feedback
Se algo importante estiver faltando (por exemplo um provider já existente, rotas configuradas de forma diferente, ou scripts de CI), mande o caminho do arquivo ou peça para eu inspecionar arquivos/situações específicas — posso ajustar este guia com exemplos concretos.
