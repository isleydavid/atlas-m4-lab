# Prompt p/ Claude Code — M7 PLD/AML: casca de produção + verificação

> **⚠️ ARQUIVADO** — `PldAmlPage.jsx` foi removido. A página live está em:
> **`src/app/(dashboard)/pld-aml/page.tsx`** (Next.js 15 App Router, branch `main`).
> Este arquivo é mantido apenas como histórico do processo de migração Vite → Next.js.

---

## Estado atual (importante — NÃO reconstruir)

A página do módulo **M7 · PLD/AML** **já existe e está no `main`**: `src/modules/pld-aml/PldAmlPage.jsx` (página bespoke, ~690 linhas), registrada como `status: 'ready'` no `src/modules/registry.js`. Os arquivos parciais antigos (`charts/kpis.jsx`, `charts/case-drawer.jsx`, `HANDOFF.md`) **já foram removidos**. O `src/theme.css` **já foi alinhado ao Figma** (texto #242424, muted #7d7573, bordas faint/default/strong, fundo #fafafa, base 14px) — **não reverter**.

Portanto, **não recrie a página nem apague nada do módulo**. O trabalho agora é só: (1) remover a casca do Lab, (2) criar a barra superior global, (3) verificar/ajustar a página existente contra o mockup.

## Fontes (leia primeiro)

- `@src/modules/pld-aml/PldAmlPage.jsx` — a página atual (a ser verificada/ajustada, não reconstruída).
- `@src/modules/pld-aml/mockup.html` — o visual de referência (deve bater com a página).
- `@src/modules/pld-aml/SPEC.md` — anatomia e guardrails.
- `@BARRA_SUPERIOR.md` — spec da barra superior global.
- `@DESIGN_SYSTEM.md` e `@src/theme.css` — tokens e responsividade obrigatórios.

## Branch

```bash
git checkout -b m7-producao
```

Commits separados por passo. Não trabalhar direto no `main`.

## Passo 1 — remover a casca do Lab (global, commit próprio)

O app ainda é um "Lab" de mosaicos. Remover as ferramentas do Lab (escopo "só a casca" — **NÃO apagar o motor de mosaico**, só ocultar/desligar os pontos de edição):

- Em `src/app/ModulePage.jsx`: remover do header os controles do Lab — **Leitura/TV**, **Aprovar página**, **Exportar HTML**, link **resetar**, o selo **Rascunho/Aprovada**, e o subtítulo "*Mosaico … troque o tipo pelo ⋮ · X de Y visíveis*". Trocar `<h1>… · Mosaico de Componentes</h1>` pelo **título real do módulo**. Esse header dá lugar à barra superior (passo 2).
- Ocultar as ferramentas de edição: **kebab ⋮ por card** (`src/ui/Kebab.jsx`), **HiddenMenu** "X de Y visíveis" (`src/ui/HiddenMenu.jsx`) e o **editor de mosaico** do painel lateral (`src/ui/ControlPanel.jsx` / `src/ui/MosaicEditor.jsx`). Manter a **navegação** (sidebar de módulos) e os componentes renderizando.

## Passo 2 — barra superior global (Layout, commit próprio)

Implementar a barra superior descrita em `@BARRA_SUPERIOR.md` na `src/app/Layout.jsx` (topo do `.canvas`, acima do conteúdo do módulo). Global a todos os módulos. Esquerda: seletor de organização + "Atualizado às HH:MM". Direita: notificações (+99), tema, Ajuda, Docs, Upgrade. Só tokens do `theme.css`.

## Passo 3 — verificar/ajustar a página existente (NÃO reconstruir)

Abrir `PldAmlPage.jsx` e comparar com `mockup.html`. **Ajustar apenas divergências** — não reescrever. Confirme que a página tem, na ordem:

1. **Indicadores** (ajustar ao estilo do Figma): trocar os cards arredondados por uma **faixa plana única** com 4 colunas separadas por linha fina (`--border-faint`), cada coluna = rótulo (muted, com "i") → número grande (`--font-head`, semibold) → legenda curta. **Sem** card por métrica, **sem** sparkline e **sem** barra de categoria. Manter os dados (apostadores com flag ativo · alertas gerados · volume sob análise R$ · red flags por categoria), o tooltip "i" e o drill por clique (coluna inteira clicável). Ver o bloco "Indicadores" no `mockup.html`. (Estrutura/visual = Figma; dados = nossos.)
2. **Prazo COAF — vencimentos** (ajustar): trocar a lista de barras por uma **timeline empilhada (beeswarm)** num horizonte de 48h — cada caso é um ponto posicionado pelo tempo restante; pontos próximos **empilham verticalmente** (não sobrepõem), formando colunas de densidade; zona crítica (<12h) sombreada e linha do prazo de 24h tracejada; cor por severidade (crítico <12h vermelho, alto âmbar). **Abaixo**, uma lista "Próximos a vencer" com os mais urgentes (severidade + nome + ID + marca + tempo). Ver o bloco "Prazo COAF" no `mockup.html` (a lógica de empilhamento está no script). Ponto/linha clicável → drawer.
3. **PEP**: quadrante exposição × risco (ponto = pessoa, cor por tipo de vínculo) + **ficha individual** ao clicar (cargo/esfera, aging 5 anos, comportamento financeiro, vínculos, status da DD).
4. **WorkList**: tabela (apostador mascarado, marca, red flag, score, severidade, SLA, status, responsável); filtros; críticos no topo; clique abre o drawer.
5. **Drawer de investigação**: timeline, `score_factors[]`, vínculos, ações (Iniciar análise / → COAF com justificativa / Arquivar com justificativa).
6. **Rodapé**: drills (Perfil, Watchlist, Glossário, Fluxos) + lembretes de compliance.

Se algum desses estiver faltando ou diferente do mockup, ajuste; se já estiver igual, não mexa.

## Guardrails de produto (manter na verificação)

- **RBAC**: só `org_admin`, `compliance`, `risk_analyst`; `risk_analyst` não exporta RO.
- **LGPD**: CPF/nome/IP/e-mail mascarados em tela; export do RO ao COAF sem máscara (Lei 9.613, art. 11).
- **Audit trail** append-only; **anti-tipping-off** (nunca exibir investigação ao apostador); `score_factors[]` para score ≥ 70.
- **Base COAF 36/2021**: threshold R$ 2.000 e prazo 24h parametrizáveis (divergência c/ Portaria 1.143/2024 anotada no BRIEFING).

## Como trabalhar

Apresente o **plano** (arquivos a editar por passo) antes de implementar. Rode `npm run dev` e compare a tela com o `mockup.html`. Só tokens do `theme.css`; sem corte nas larguras 1280/1512/1920/2560.
