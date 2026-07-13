# CarboRota

Projeto Angular feito para aprendizado (nível júnior).

## Como rodar

```bash
npm install
npm run dev
```

Acesse: `http://localhost:4200`

## Estrutura simples

```
src/app/
├── app.component.ts / .html / .css   → Estrutura principal
├── app.routes.ts                     → Rotas do site
├── usuario.service.ts                → Login
├── menu/                             → Menu do topo
├── home/                             → Página inicial
├── calcular/                         → Calculadora
├── contato/                          → Contato + comunidade
├── login/                            → Entrar / cadastrar
└── lgpd/                             → Privacidade
```

## Cada página tem 3 arquivos

- `.ts` = lógica (TypeScript)
- `.html` = tela
- `.css` = estilo

## Rotas

- `/` início (público)
- `/login` entrar (público)
- `/calcular` calculadora (precisa login)
- `/contato` contato (precisa login)
- `/lgpd` privacidade (público)

## Para apresentação

Explique nesta ordem:

1. `app.routes.ts` (rotas)
2. `usuario.service.ts` (login)
3. `calcular/calcular.component.ts` (cálculo de CO₂)
