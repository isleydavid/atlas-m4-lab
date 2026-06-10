# Atlas — Design System & Responsividade (M4 Lab)

Spec de proporções, espaçamentos e regras responsivas. Baseado no rascunho do dashboard
de referência (viewport 1407×916). Objetivo: **responsivo sem cortar conteúdo** e **proporcional**.

> **Separação importante**
> - **Conteúdo / cards** (o que aparece na página e é **exportado** como HTML) → segue ESTE design system, igual produção.
> - **Casca do Lab** (sidebar de controle: mosaicos/componentes) → é **ferramenta**, não vai no export; pode ter largura própria.

---

## 1. Tokens (CSS variables → `theme.css`)

```css
:root {
  /* cores (CONFIRMADAS no site oficial via inspecionar) */
  --orange:    #f26122;   /* laranja da marca Atlas (data-color do widget) */
  --text:      #3c3f44;   /* cor de texto do body */
  --bg-app:    #f9f9f9;   /* fundo de sidebars / app */
  --bg-card:   #ffffff;   /* cards e área principal */
  --border:    #ededed;   /* bordas/divisores */
  --border-2:  #f0f0f0;   /* borda da área principal */
  /* semânticas existentes: --green, --amber, --red */

  /* tipografia (CONFIRMADA — Google Fonts) */
  --font-body: "Saira", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  --font-head: "Exo 2", var(--font-body);   /* títulos/destaques */
  --font-mono: "Geist Mono", ui-monospace, monospace; /* números/IDs */

  /* espaçamento */
  --pad-kpi:    12px;     /* padding de card KPI (p-3) */
  --pad-card:   16px;     /* padding de card de gráfico (p-4) */
  --gap-sec:    24px;     /* gap entre seções de gráfico */
  --gap-rows:   16px;     /* gap entre linhas de KPI */
  --gap-cards:  12px;     /* gap entre cards de ocorrência */
  --gap-tight:  8px;      /* espaçamento menor (cards na lista) */

  /* forma */
  --radius:     16px;     /* rounded-xl em todos os cards */
  --shadow-card: 0 2px 4.8px rgba(0,0,0,.04);
  --border-hair: .625px solid var(--border);

  /* colunas */
  --w-left:   256px;      /* sidebar de navegação (produção) */
  --w-right:  288px;      /* sidebar Ocorrências (produção) */
  --w-content-max: 1328px;/* max-w-[1328px] do conteúdo (oficial) */
  --gutter: 24px;         /* gutters laterais do conteúdo (grid 24px) */
  --h-header: 64px;       /* header das sidebars/topo */
}
```

### 1.1 Tipografia (corrige o "letras grandes/desproporcional")

A causa principal do desalinhamento é a **fonte**: o lab usa fonte do sistema (mais larga e
pesada); o Atlas usa **Saira**. Adotar a fonte real resolve a proporção.

- Importar do Google Fonts: **Saira** (400/500/600/700), **Exo 2** (600/700), **Geist Mono** (400/500).
- `body { font-family: var(--font-body); color: var(--text); }`
- Base **15px** no corpo (a Saira renderiza “maior” que system na mesma medida — não usar 16–17px cheios).
- Números/IDs (saldos, CPF, hashes) podem usar `var(--font-mono)`.
- Títulos de card/seção podem usar `var(--font-head)` (Exo 2).

---

## 2. Layout de 3 colunas (dashboard de produção)

| Coluna | Largura | Comportamento responsivo |
|---|---|---|
| Left sidebar (nav) | `256px` fixo | colapsa para ícones (~64px) < 1200px; vira drawer < 768px |
| Área principal | **fluida** (`flex:1; min-width:0`) | sempre ocupa o resto; conteúdo centrado com `max-width:1200px` |
| Right sidebar (Ocorrências) | `288px` fixo | **esconde** < 1100px (vira botão/painel sob demanda) |

Regras-chave para **não cortar**:
- Sidebars têm largura fixa; **só a principal é fluida** (`flex:1; min-width:0`).
- A coluna de conteúdo usa `max-width: var(--w-content-max)` e `margin-inline:auto` + `padding: 24px`.
- Nada de larguras somando mais que 100% — a principal absorve a sobra.

---

## 3. Casca do Lab (ferramenta) vs. Conteúdo

- **Sidebar de controle do Lab** (mosaicos + componentes): largura própria (ex.: 280–300px), colapsável. **Não** segue a métrica de produção e **não** entra no export.
- **Área de conteúdo do Lab** (o mosaico de cards): segue 100% este design system, porque é o que vira a página real e o HTML exportado.

---

## 4. Grid de cards / mosaico — responsivo sem cortar

- Base: 12 colunas (`grid-template-columns: repeat(12, 1fr)`), `gap: var(--gap-sec)` (24px) entre seções; `--gap-rows` (16px) entre linhas de KPI.
- **Altura:** não usar altura de linha fixa que distorce. Usar `grid-auto-rows: minmax(96px, auto)` para o card **crescer** com o conteúdo em vez de cortar.
- **Overflow interno:** cada card tem `overflow: auto` no corpo (`.body`) — listas/tabelas longas rolam dentro do card, sem vazar.
- **Gráficos:** sempre `ResponsiveContainer` (Recharts) preenchendo `.body` a 100% — adaptam à célula.
- **Breakpoints do grid** (quando o slot pede largura w):
  - ≥ 1200px: usa `w` cheio (12 colunas).
  - 768–1199px: dobra para no máximo 6–8 colunas efetivas (cards largos viram meia/linha).
  - < 768px: tudo empilha em 1 coluna (cada card 100%).

---

## 5. Cards

| Tipo | Padding | Raio | Sombra | Borda |
|---|---|---|---|---|
| KPI / indicador | `12px` | `16px` | `--shadow-card` | `--border-hair` |
| Gráfico | `16px` | `16px` | `--shadow-card` | `--border-hair` |
| Ocorrência (lista) | `12px 12px 12px 16px` | `16px` | `--shadow-card` | `--border-hair` + barra lateral laranja 4px |

- KPI row 1 ≈ 180px de altura; row 2 ≈ 136px (referência) — no Lab, deixar **auto** com mínimo, para não cortar números.
- Divisor central em grids 2-col: `24px` (`grid-cols-[1fr_24px_1fr]`).

---

## 6. Breakpoints (por tamanho de tela — 13" / 14" / 21" / 27")

> O CSS responde à **largura em px do navegador**, não às polegadas (há scaling do SO).
> Abaixo, a largura CSS efetiva típica de cada classe de tela.

**Modo de largura: PREENCHER (dashboard operacional / TV).** O conteúdo **ocupa a largura toda**
(sem `max-width` travando) — só gutters laterais. Em telas muito grandes, **escala para cima**
(fonte/espaçamento/altura) em vez de deixar campos largos demais ou cards minúsculos.

| Tela | Largura CSS | Layout |
|---|---|---|
| **TV / 4K** | ≥ 2560 | Preenche tudo; densidade **"tv"** (fonte +20–30%, cards maiores) p/ leitura de longe. |
| **27"** (QHD ~2560) | 1920–2559 | Preenche tudo; densidade **"amplo"** (fonte/espaçamento maiores). |
| **21"** (FHD 1920) | 1680–1919 | Preenche tudo; 3 colunas completas; densidade "confortável". |
| **14"** (Pro 14 ~1512) | 1440–1679 | 3 colunas cabem; Ocorrências visível. |
| **13"** (~1280) | 1200–1439 | **Esconde** a sidebar de Ocorrências (vira botão); nav enxuta; main ocupa o resto. |
| Tablet | 768–1199 | Nav vira ícones/drawer; grid reduz colunas. |
| Mobile | < 768 | Tudo empilha em 1 coluna; sidebars viram drawer/topo. |

**Regras-chave:**
- **Esticar e escalar** nas telas grandes (não travar largura). Usar `clamp()` na fonte base e no espaçamento, atrelados a `vw`, para crescer com a tela: ex. `--fs-scale` sobe em 1920/2560.
- **Telas pequenas (13"): priorizar o principal.** Somem elementos secundários (Ocorrências) para o main respirar; nada de scroll horizontal.
- Sidebars com largura fixa; **só o main é fluido** (`flex:1; min-width:0`), preenchendo a sobra.
- (Opcional) **modo "Leitura"**: um toggle que aplica `max-width:1328px` quando o conteúdo for muito textual — mas o **default é preencher**.

```css
/* esqueleto: preencher + escalar */
.content{ width:100%; padding-inline: clamp(16px, 2vw, 40px); }   /* sem max-width travando */
@media (min-width:1920px){ :root{ --fs-scale:1.12; --dash-row:120px; --gap-sec:28px } } /* 21"/27" */
@media (min-width:2560px){ :root{ --fs-scale:1.28; --dash-row:140px; --gap-sec:32px } } /* TV/4K */
@media (max-width:1439px){ .feed-occ{ display:none } }            /* 13": esconde Ocorrências */
@media (max-width:1199px){ .nav{ /* ícones/drawer */ } }
@media (max-width:767px){ .dash{ grid-template-columns:1fr } }    /* empilha */
```

---

## 7. Notas para o Claude Code

- Centralizar tudo em **CSS variables** no `theme.css` (já existe) usando os tokens da seção 1.
- A coluna principal é **fluida** (`flex:1; min-width:0`) e **preenche a largura toda** (sem `max-width` travando) — dashboard operacional / TV. Nas telas grandes, **escalar** fonte/espaçamento (não travar). O "desproporcional" se resolve pela fonte (Saira) + escala, não por travar largura.
- Trocar `grid-auto-rows: 96px` (fixo) por `minmax(96px, auto)` + `overflow:auto` no `.body` dos cards (corrige cortes).
- Garantir `box-sizing: border-box` global (já está) e **testar nas larguras das 4 telas: 1280 (13"), 1512 (14"), 1920 (21") e 2560 (27")** — sem corte nem scroll horizontal, e sem o conteúdo esticar nas grandes.
- Sidebar de Ocorrências e nav só existem no layout de produção; no Lab, manter a sidebar de controle e a área de conteúdo seguindo estes tokens.
```
