# M7 · PLD/AML — guia de alterações (gateway p/ Claude Code)

Use este arquivo como ponto de entrada para qualquer mudança na página PLD/AML.

## Onde fica o quê

- **Página live:** `src/app/(dashboard)/pld-aml/page.tsx` (Next.js App Router · branch `main`). **É aqui que se edita.**
- **Anatomia / guardrails:** `@src/modules/pld-aml/SPEC.md` (estado atual da página + regras de produto).
- **Base regulatória profunda:** `@src/modules/pld-aml/BRIEFING.md`.
- **Referência visual inicial:** `@src/modules/pld-aml/mockup.html` (mockup do design; algumas partes evoluíram na página live — em divergência, vale o `page.tsx` + SPEC).
- **Tokens / design system:** `@src/app/globals.css` (base `--atlas-color-*` + semânticos `--orange`, `--ink`, `--muted-text`, `--line`, etc.).

## Regras fixas (valem para toda mudança)

- **Não recriar a página** — só ajustar o que foi pedido.
- **Cores/estilos só via tokens do `globals.css`** — nada hard-coded (exceto `#fff` para texto sobre fundo colorido).
- **LGPD:** CPF/nome/IP/e-mail mascarados em tela.
- **Manter dados mock atuais** salvo pedido contrário.
- Tipografia: Saira (corpo) · Exo 2 (`--font-head`) · Geist Mono (IDs).
- **Plan mode antes** de editar; **commits separados por etapa**.

## Estado atual (construído)

Abas **Visão Geral** e **Alertas** + período no topo + barra superior global. Visão Geral: indicadores (faixa plana) · Prazo COAF (timeline beeswarm + lista "Próximos a vencer") · PEP (quadrante + ficha) · Red flags (donut) · Volume (área). Alertas: WorkList. Drawer de investigação = painel lateral (Sheet) compartilhado.

## Pendências conhecidas

- **Watchlist (monitorados)** — **não construída**; hoje só há um chip de atalho no rodapé. Design no `SPEC.md` (§4/§5) e no catálogo `M7_PLD_AML_GRAFICOS.md`. Para construir: aba nova com KPIs (em observação/adicionados/escalados) + filtros + tabela (apostador · score por classe · motivo · marca · última ocorrência · status · ação) + ações (abrir drawer · escalar p/ caso · remover).
- **Glossário COAF** e **Fluxos PLD** — só chips no rodapé; páginas não construídas.
- Afinação fina opcional: `--card` → `#ffffff` puro; conferir token de texto vs Figma (`#242424`).

## Como pedir uma mudança (modelo)

> Leia `@src/modules/pld-aml/SPEC.md` e `@src/modules/pld-aml/PROMPT.md`. Na página `src/app/(dashboard)/pld-aml/page.tsx`, [descreva o ajuste]. Não recriar; só tokens do `globals.css`; plan antes; commit próprio.
