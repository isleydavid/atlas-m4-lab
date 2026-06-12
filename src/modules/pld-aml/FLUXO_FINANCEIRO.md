# M7 · PLD/AML — Fluxo financeiro (2 gráficos lado a lado) · spec

Bloco na aba **Visão Geral** da página `src/app/(dashboard)/pld-aml/page.tsx`. **Dois gráficos lado a lado** (grid `1fr 1fr`, **mesma altura**), cada um para um cenário de lavagem. Coexiste com o PEP.

## Gráfico 1 — Entra e sai sem jogar (pass-through)

- **Tipo:** scatter (reaproveitar o padrão do quadrante PEP, helpers `SX`/`SY`).
- **X = volume movimentado (R$)** (grade + valores: R$0 · R$100k · R$200k · R$300k · R$500k+). **Y = % do dinheiro sem jogo** (0–100%, grade 25/50/75).
- **Banda de risco** no topo (Y alto = não jogou), `--amber-soft`/`--orange-soft`.
- **Bolhas = contas.** Pass-through → `--red`, canto superior direito (alto volume + não jogou). Normais (jogaram) → `--muted-2`, embaixo.
- **Leitura:** grandes entradas e saídas, com cálculo mostrando que quase não jogou.
- Rótulo da zona no topo-direita: "entra e sai sem jogar" (sem sobrepor bolha).
- Clique numa bolha → **drawer**; detalhe ("mais informações") com origem/destino e cálculo de jogo.

## Gráfico 2 — Valores recorrentes (estruturação)

- **Tipo:** **histograma de valores** das entradas/saques (reaproveita o conceito do `PldHistogram`).
- **X = faixa de valor (R$)** · **Y = nº de transações**. Barras por faixa.
- **Destaque:** a barra do **valor que se repete** (pico) em `--purple` (ou `--red` se acima de risco); demais barras em tom neutro/`--orange` suave.
- **Linha do limiar R$ 2.000** (tracejada) — pico logo abaixo do limiar = sinal de fracionamento.
- **Leitura:** entradas/saques recorrentes de **valores semelhantes** (estruturação). Um pico anômalo num valor específico denuncia o padrão.
- Clique numa barra → **drawer** com as **contas** daquele valor recorrente, **nº de repetições**, e o **IP / contas vinculadas** no detalhe.

## Layout

Os dois cards na mesma linha (`grid-template-columns: 1fr 1fr`, gap padrão), **altura igual**; empilham < ~1100px. Cabeçalho de cada card com título + legenda curta. Faixa de estatística opcional embaixo de cada um (contas · métrica · % jogado).

## Regras

- **Só tokens do `globals.css`**; nada hard-coded (exceto `#fff` em texto sobre cor).
- **LGPD:** contas mascaradas.
- Reaproveitar: scatter do PEP (Gráfico 1), padrão de histograma/barras (Gráfico 2), `Pill`, drawer `Sheet`, tokens de cor.
- Responsivo (sem corte em 1280/1512/1920).

## Dados (mock)

- **Gráfico 1:** ≈7 contas — 3 pass-through (alto volume, ~0–5% jogado) + 4 normais (jogaram).
- **Gráfico 2:** distribuição de valores com um **pico** num valor recorrente (ex.: ~R$ 1.900 repetido ×N, logo abaixo do limiar de R$ 2.000) + cauda normal.
