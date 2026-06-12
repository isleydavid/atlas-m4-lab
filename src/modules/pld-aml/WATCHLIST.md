# M7 · PLD/AML — Aba Watchlist (spec de construção)

Spec para construir a aba **Watchlist** na página `src/app/(dashboard)/pld-aml/page.tsx`. Hoje só existe um chip de atalho "Watchlist" no rodapé — esta aba ainda **não foi construída**.

## Conceito (leitura)

Lista de apostadores sob **monitoramento contínuo** (vigilância **proativa**) — diferente da WorkList/Alertas, que é **reativa** (alertas que exigem ação agora). A Watchlist é o "radar": pessoas que o compliance decidiu acompanhar, com ou sem alerta aberto. Quando alguém da watchlist dispara um sinal, vira caso (vai pra Alertas).

**Quem entra:** PEPs confirmados, reincidentes (já tiveram caso), alto volume/score, casos arquivados que merecem acompanhamento, ou adição manual do analista.

## Onde entra

- Adicionar `{ id: 'watchlist', label: 'Watchlist' }` ao array `ABAS` (hoje só `visao-geral` e `alertas`).
- Render condicional `{aba === 'watchlist' && (…)}` no mesmo padrão das outras abas.
- É o destino do KPI "Apostadores com flag ativo → abrir watchlist" e do chip "Watchlist" do rodapé.

## Conteúdo da aba

1. **KPIs de topo** (linha enxuta, mesmo estilo dos indicadores): `Em observação` · `Adicionados (7d)` · `Escalados (7d)`.
2. **Filtros** (chips, estilo do `FILTERS` já existente): Status (Em observação / Escalado / Removido) · Motivo (PEP / Reincidência / Alto volume) · Classe (Alto/Médio/Baixo) · Marca.
3. **Tabela de monitorados** (reusar o componente `Table` / padrão da WorkList):

| Coluna | Conteúdo |
|---|---|
| Apostador | nome + CPF mascarado (`•••.•••.•••-NN`) |
| Score PLD | barra + número, cor por classe via `SCORE_COLOR(s)` (alto `--red`, médio `--amber`, baixo `--atlas-color-status-info`/`--muted-2`) |
| Motivo | chip (`Pill`): PEP · Reincidência · Alto volume |
| Marca | texto |
| Última ocorrência | "há 6h", "há 2d" |
| Status | `Pill`: **Em observação** (neutro) · **Escalado** (`--orange`/`--orange-soft`) · **Removido** (`--muted-text`, linha esmaecida) |
| Ação | "Abrir ↗" |

## Ações por linha

- **Abrir** → abre o **drawer de investigação** existente (mesmo `Sheet` da WorkList — setar `selected`).
- **Escalar para caso** → move pra aba Alertas (status vira "Aberto" na WorkList).
- **Remover da watchlist** → exige **justificativa** (registrada na trilha auditável); a linha vai pra status "Removido" (esmaecida).

## Dados (mock)

Criar um `WATCH_DATA` (≈6–8 linhas), reaproveitando nomes/IDs já usados (PEP/WorkList) quando fizer sentido. Campos por linha: `nome, cpf, score, classe, motivo, marca, ultima, status`. Ex.: R. FERREIRA (Reincidência, 92, Escalado) · G. NUNES (PEP·Titular, 82, Em observação) · L. ALMEIDA (PEP·familiar, 71) · C. ROCHA (Alto volume, 64) · M. DIAS (Reincidência, 58) · T. ALVES (Alto volume, 45, Removido).

## Regras

- **Só tokens do `globals.css`**; nada hard-coded (exceto `#fff` em texto sobre fundo colorido).
- **LGPD:** dados mascarados na tela.
- Reaproveitar componentes existentes: `Table`, `Pill`, `SCORE_COLOR`, o drawer `Sheet`, e os tokens de status.
- Responsivo (sem corte nas larguras 1280/1512/1920).
