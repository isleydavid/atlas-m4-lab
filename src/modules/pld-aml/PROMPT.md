# Prompt p/ Claude Code — construir a página M7 (PLD/AML)

Você vai construir a página do módulo **M7 · PLD/AML** do Atlas a partir do design já fechado. **Fonte da verdade: o `SPEC.md` (o quê) + o `mockup.html` (como deve ficar).** Construa a página fiel ao mockup.

## Fontes (leia primeiro)

- `@src/modules/pld-aml/SPEC.md` — visão da página inteira, anatomia, telas, guardrails, faseamento.
- `@src/modules/pld-aml/mockup.html` — **o visual a reproduzir** (layout, ordem das faixas, estilos).
- `@src/modules/pld-aml/BRIEFING.md` e `@src/modules/pld-aml/PESQUISA.md` — referência regulatória (manter; não apagar).
- `@DESIGN_SYSTEM.md` e `@src/theme.css` — tokens e regras de responsividade obrigatórios.

## Antes de tudo — branch novo

Trabalhe em um branch isolado para que a limpeza e a reconstrução sejam fáceis de revisar e reverter:

```bash
git checkout -b m7-pld-aml
```

Faça todos os commits (remoções + nova página) nesse branch. Não trabalhe direto na branch principal.

## Limpeza (antes de construir)

A abordagem mudou de "componente a componente" para "página inteira". Remova o trabalho parcial que foi substituído:

- **Apagar** `src/modules/pld-aml/charts/kpis.jsx`
- **Apagar** `src/modules/pld-aml/charts/case-drawer.jsx`
- **Apagar** `src/modules/pld-aml/HANDOFF.md`
- **Manter** `SPEC.md`, `mockup.html`, `BRIEFING.md`, `PESQUISA.md`, e este `PROMPT.md`.

## O que construir

A página M7 fiel ao `mockup.html`, com dados **mockados** (sem backend), na ordem de leitura do SPEC:

1. Header com flag "Acesso restrito · Compliance" + período.
2. **4 KPIs** (apostadores com flag ativo · alertas gerados · volume sob análise R$ · red flags por categoria) — tiles com mini-tendência (sparkline), o de categoria com barra de distribuição, tooltip leve no "i", e link "abrir → página".
3. Faixa de contexto: **countdown COAF (24h) dos críticos** + **alertas por severidade**.
4. **WorkList** (fila de alertas): tabela com Apostador (mascarado), Marca, Red flag, Score PLD (barra), Severidade, SLA, Status, Responsável. Filtros por status/severidade/tipo/marca. Críticos (score ≥ 85) no topo, com marca vermelha à esquerda. Clique na linha abre o drawer.
5. **Drawer de investigação** (overlay): timeline de transações, `score_factors[]`, vínculos, e ações **Iniciar análise → → COAF (modal de RO) / Arquivar (justificativa)**.
6. Rodapé com drills (Perfil, Watchlist, Glossário COAF, Fluxos PLD) e lembretes de compliance.

## Integração no app

- Reaproveite o design system: **somente tokens do `theme.css`** (cores, `--font-head` Exo 2, `--font-body` Saira, `--font-mono` Geist Mono, raio 16, sombras). Nada de cor hard-coded fora dos tokens.
- A página M7 é **bespoke e interativa** (tabela, filtros, drawer) — implemente como **página/rota dedicada** do módulo (não force no sistema de mosaico do `module.md`, que é para os módulos de cards). Registre o M7 na navegação/`src/modules/registry.js` (hoje há um placeholder `risco-fraude` que pode ser substituído por `pld-aml`).
- Respeite a responsividade do `DESIGN_SYSTEM.md` (sidebar colapsa, conteúdo fluido, sem corte nas larguras 1280/1512/1920/2560).

## Guardrails de produto (não negociáveis)

- **RBAC**: só `org_admin`, `compliance`, `risk_analyst` acessam; `risk_analyst` **não** exporta RO.
- **LGPD**: CPF/nome/IP/e-mail mascarados em 100% das telas; **exceção**: o export do RO ao COAF vai sem máscara (base legal Lei 9.613, art. 11).
- **Audit trail**: toda ação logada com autor + timestamp, append-only/imutável.
- **Anti-tipping-off**: nunca exibir status de investigação ao apostador.
- **Explicabilidade**: `score_factors[]` é obrigatório para score ≥ 70.
- **Base regulatória adotada**: COAF Resolução 36/2021 — threshold **R$ 2.000** e prazo **24h** para críticos; trate esses dois valores como **parametrizáveis** (há divergência com a Portaria 1.143/2024 anotada no BRIEFING, pendente de validação jurídica).
- Notificação: crítico sem ação > 20h → e-mail ao Diretor de Compliance.

## Critério de aceite

- [ ] Página M7 abre na navegação e reproduz o `mockup.html` (mesmas faixas, ordem e estilo).
- [ ] 4 KPIs com tendência/tooltip/drill; WorkList com filtros, SLA e críticos no topo.
- [ ] Drawer abre ao clicar na linha, com timeline, score_factors e ações (análise/COAF/arquivar).
- [ ] Justificativa obrigatória ao arquivar (mín. 50 chars) e ao escalar p/ COAF.
- [ ] RBAC e mascaramento LGPD aplicados; audit trail registra ações.
- [ ] Arquivos antigos removidos; só tokens do `theme.css`; sem corte nas 4 larguras.

## Como trabalhar

Primeiro me apresente um **plano** (arquivos a criar/editar/remover) e só depois implemente. Rode `npm run dev` para validar visualmente contra o `mockup.html` ao longo do caminho.
