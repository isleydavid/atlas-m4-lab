# Atlas / M4 Lab — Spec de Mosaico, Tipografia & Segunda Sidebar

Spec derivado da análise do screenshot do **Perfil do Apostador** (atlas.lifters.tech) cruzado com os tokens reais já existentes em `src/theme.css`, o schema de mosaicos em `src/mosaics.js` e o shell em `src/app/Layout.jsx`. Tudo aqui é ancorado nos valores que o produto já usa — o objetivo é padronizar, não reinventar.

Referência: grid do mosaico = 12 colunas, `grid-auto-rows: 96px`, `gap: 16px`, `padding: 22px` (`.dash` em `theme.css`).

---

## 1. Análise do design atual

### 1.1 Cores (de `:root`)

O sistema já é coerente: laranja como cor de marca/ação, neutros frios para texto/linhas, e trio semântico verde/âmbar/vermelho.

| Token | Valor | Uso |
|---|---|---|
| `--orange` | `#E8612C` | marca, ativo, ações primárias |
| `--orange-2` | `#F08A52` | gradientes, hover |
| `--orange-soft` | `#FDEDE6` | fundo de estado ativo (pill da nav, chips) |
| `--orange-line` | `#F6CDB8` | borda em hover/seleção |
| `--ink` / `--ink-2` | `#23262F` / `#4A4F5A` | texto principal / secundário |
| `--muted` / `--muted-2` | `#8A92A3` / `#AEB4BF` | legendas / rótulos fracos |
| `--line` / `--bg` / `--card` | `#ECEEF2` / `#F4F5F7` / `#FFF` | bordas / fundo / cartões |
| `--green` / `--amber` / `--red` | `#2E9E5B` / `#E0901F` / `#E23B3B` | semáforo (+ variantes `-soft`) |
| `--radius` / `--shadow` | `16px` / sombra dupla suave | cartões |

### 1.2 Tipografia observada (inventário real)

A escala hoje é **fragmentada** — há ~15 tamanhos distintos (9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 16, 17, 20, 26, 34px). Mapa do que está em uso:

| Elemento | Tamanho | Peso | Notas |
|---|---|---|---|
| Título de página (`.cv-top h1`) | 20px | 800 | |
| Número KPI grande | 34px / 26px | 800 | sparkline / donut |
| Logo (`.p-logo b`) | 17px | 800 | |
| Título de modal (`.modal-head h3`) | 16px | 800 | |
| Título de card (`.card .ch h3`) | 14px | 800 | |
| Corpo base (`body`) | 14px | 400 | line-height 1.45 |
| Input (`.field input`) | 13.5px | — | |
| Botões primário/ghost | 13px | 800 / 700 | |
| Item de mosaico (`.mosaic-meta b`) | 12.5px | 800 | |
| Toggle / kebab item | 12.5px | 600 / — | |
| Subtítulo de card (`.ch p`) | 11px | — | `--muted` |
| Chip / sinal (`.sgc`) | 11px | 700 | |
| Rótulo de categoria (`.cat`) | 10px | 800 | uppercase, ls .6px, `--muted-2` |
| Badge / pílula de status | 10px / 9px | 800 | |

**Recomendação:** colapsar para uma escala de 7 degraus (ver §5).

### 1.3 Espaçamento observado

Gaps e paddings hoje variam livremente (2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 22, 24px). Não há escala. O grid do mosaico usa `gap: 16` / `row: 96` / `padding: 22`; o card usa `padding: 15px 16px 14px`. **Recomendação:** base 4pt (4 · 8 · 12 · 16 · 24 · 32).

### 1.4 Anatomia do shell (screenshot vs. código atual)

O screenshot tem **três colunas**: (a) nav de módulos, (b) feed "Ocorrências Ao Vivo", (c) canvas. O M4 Lab hoje tem **duas**: uma `.panel` única (nav + editor de mosaico) + canvas. As seções §3 e §4 abaixo trazem o shell para o padrão de três colunas do produto.

---

## 2. Mosaico novo — preset "Perfil Executivo" + densidade

### 2.1 O preset (reproduz a composição do screenshot)

Bloco de identidade largo à esquerda + score à direita, faixa de KPIs, depois grade. Para colar em `src/mosaics.js` dentro do array `MOSAICS`:

```js
{
  id: 'perfil-executivo',
  name: 'Perfil Executivo',
  desc: 'Identidade + score, faixa de KPIs e grade',
  mode: 'prefix',
  pattern: [
    { w: 7, h: 4 },   // Identidade / ficha (bloco principal esquerdo)
    { w: 5, h: 4 },   // Score de Risco (donut + dimensões)
    { w: 4, h: 2 },   // KPI
    { w: 4, h: 2 },   // KPI
    { w: 4, h: 2 },   // KPI
    { w: 8, h: 3 },   // série larga (cohort / fluxo)
    { w: 4, h: 3 },   // card lateral
  ],
  fallback: { w: 4, h: 3 },
  // densidade própria deste mosaico (ver 2.2)
  density: 'confortavel',
}
```

`cellFor()` já consome `pattern`/`fallback` sem alteração. O campo `density` é o item novo descrito a seguir.

### 2.2 "Tamanho, espaçamento e letras" por mosaico (densidade)

Hoje um mosaico só controla **w/h das células**. Para o pedido — um mosaico que também carregue **tamanho/espaçamento/tipografia** — proponho estender o schema com `density`, um de três presets que viram CSS vars no grid:

| Densidade | `--dash-gap` | `--dash-row` | `--dash-pad` | `--fs-scale` |
|---|---|---|---|---|
| `compacto` | 12px | 88px | 16px | 0.92 |
| `confortavel` (padrão) | 16px | 96px | 22px | 1.00 |
| `amplo` | 20px | 112px | 28px | 1.08 |

**`theme.css` — trocar o `.dash` por versão tokenizada:**

```css
.dash{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  grid-auto-rows:var(--dash-row,96px);
  grid-auto-flow:row dense;
  gap:var(--dash-gap,16px);
  padding:var(--dash-pad,22px);
  font-size:calc(14px * var(--fs-scale,1));
}
/* o título e os cards seguem a escala do mosaico */
.dash .card .ch h3{ font-size:calc(14px * var(--fs-scale,1)); }
.dash .cap, .dash .card .ch p{ font-size:calc(11px * var(--fs-scale,1)); }

.dash[data-density="compacto"]   { --dash-gap:12px; --dash-row:88px;  --dash-pad:16px; --fs-scale:.92; }
.dash[data-density="confortavel"]{ --dash-gap:16px; --dash-row:96px;  --dash-pad:22px; --fs-scale:1;   }
.dash[data-density="amplo"]      { --dash-gap:20px; --dash-row:112px; --dash-pad:28px; --fs-scale:1.08;}
```

**`src/ui/Dashboard.jsx` — aplicar a densidade do mosaico ativo:**

```jsx
export default function Dashboard({ slots, state, mosaic, onChangeType, onHide }) {
  const visible = slots.filter((s) => state[s.id]?.visible)
  return (
    <div className="dash" data-density={mosaic?.density ?? 'confortavel'}>
      {/* ...resto igual... */}
    </div>
  )
}
```

Resultado: trocar o mosaico passa a ajustar **layout + espaçamento + corpo de fonte** de uma vez, sem tocar em cada card.

---

## 3. Segunda sidebar — coluna "Ocorrências Ao Vivo"

Replica a coluna de feed do screenshot. Fica **entre** a nav e o canvas, com a mesma largura/ritmo da `.panel`, colapsável.

### 3.1 CSS (anexar ao `theme.css`)

```css
/* ---------- segunda sidebar: feed ao vivo ---------- */
.feed{width:288px;flex:0 0 auto;background:#fff;border-right:1px solid var(--line);
  display:flex;flex-direction:column;overflow:hidden}
.feed.collapsed{width:48px}

.feed-head{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid var(--line)}
.feed-head .live{width:8px;height:8px;border-radius:50%;background:var(--orange);
  box-shadow:0 0 0 0 rgba(232,97,44,.5);animation:pulse 1.8s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(232,97,44,.45)}70%{box-shadow:0 0 0 7px rgba(232,97,44,0)}100%{box-shadow:0 0 0 0 rgba(232,97,44,0)}}
.feed-head b{font-size:13px;font-weight:800}
.feed-head .clock{margin-left:auto;font-size:11px;color:var(--muted);font-weight:700}

.feed-filters{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-bottom:1px solid var(--line)}
.fchip{font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:999px;border:1px solid var(--line);
  background:#fff;color:var(--ink-2);cursor:pointer}
.fchip:hover{border-color:var(--orange-line);color:var(--orange)}
.fchip.on{background:var(--orange-soft);border-color:var(--orange-line);color:var(--orange)}

.feed-body{flex:1;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;gap:9px}
.feed-card{border:1px solid var(--line);border-left:3px solid var(--orange);border-radius:11px;padding:10px 12px}
.feed-card .top{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700}
.feed-card .top .ago{margin-left:auto;font-size:10.5px;color:var(--muted);font-weight:600}
.feed-card .cpf{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);margin-top:5px}
.feed-card .brand{display:inline-block;margin-top:8px;font-size:10px;font-weight:700;
  color:var(--orange);background:var(--orange-soft);padding:3px 8px;border-radius:6px}
```

### 3.2 Componente (`src/ui/FeedSidebar.jsx`)

```jsx
import { useState } from 'react'

const TIPOS = ['Todos','Super Ganhador','Conta Vinculada','Aceleração Depósitos','Horário Atípico','Chasing','Aposta Irregular']

export default function FeedSidebar({ ocorrencias = [], collapsed, onCollapse }) {
  const [tipo, setTipo] = useState('Todos')
  if (collapsed) return <aside className="feed collapsed"><button className="collapse-btn" onClick={onCollapse}>⟩</button></aside>
  const itens = tipo === 'Todos' ? ocorrencias : ocorrencias.filter((o) => o.tipo === tipo)
  return (
    <aside className="feed">
      <div className="feed-head">
        <span className="live" /><b>Ocorrências Ao Vivo</b>
        <span className="clock">{new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>
      </div>
      <div className="feed-filters">
        {TIPOS.map((t) => (
          <button key={t} className={`fchip ${tipo===t?'on':''}`} onClick={() => setTipo(t)}>{t}</button>
        ))}
      </div>
      <div className="feed-body">
        {itens.map((o, i) => (
          <div className="feed-card" key={i}>
            <div className="top"><span className="cd r" />{o.tipo}<span className="ago">{o.ago}</span></div>
            <div className="cpf">CPF: {o.cpf} 👁 ⧉</div>
            <span className="brand">{o.marca}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
```

### 3.3 Encaixe no shell (`Layout.jsx`)

O `.app` já é `display:flex`. Basta inserir a `<FeedSidebar/>` entre a `.panel` e o `<Outlet/>`:

```jsx
<div className="app">
  <aside className="panel">{/* nav + mosaicos */}</aside>
  <FeedSidebar ocorrencias={ocorrencias} collapsed={feedOff} onCollapse={() => setFeedOff(v => !v)} />
  <Outlet context={outletContext} />
</div>
```

O feed deve vir de uma fonte ao vivo (ver §5); para protótipo, passe um array mock no formato `{ tipo, cpf, ago, marca }`.

---

## 4. Itens da sidebar seguindo o design da página

A nav atual em `Layout.jsx` são links de texto simples. O screenshot mostra um padrão mais rico: **pill ativa laranja**, **badges** (`NEW`, `PULSE`), **itens desabilitados** e **rótulos de seção** (`PLAYGROUND`, `RESEARCH PREVIEW`). Spec para alinhar:

### 4.1 CSS (anexar ao `theme.css`)

```css
.nav-item{display:flex;align-items:center;gap:10px;width:100%;text-decoration:none;
  padding:9px 11px;border-radius:10px;font-size:13.5px;font-weight:600;color:var(--ink-2);cursor:pointer}
.nav-item:hover{background:#FAFAFB}
.nav-item.active{background:var(--orange-soft);color:var(--orange);font-weight:700}
.nav-item .ico{width:18px;text-align:center;flex:0 0 auto}
.nav-item .nav-badge{margin-left:auto;font-size:9px;font-weight:800;letter-spacing:.4px;
  padding:2px 6px;border-radius:5px;background:var(--orange-soft);color:var(--orange)}
.nav-item .nav-badge.pulse{background:var(--amber-soft);color:var(--amber)}
.nav-item.disabled{opacity:.4;pointer-events:none}
.nav-group{font-size:10px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;
  color:var(--muted-2);padding:14px 11px 6px}   /* = .cat */
```

### 4.2 Modelo de dados da nav

Sugiro descrever a nav por dados (e renderizar em loop), em vez de JSX manual:

```js
export const NAV = [
  { group: null, items: [
    { id: 'overview', icon: '🏠', label: 'Overview', to: '/overview' },
  ]},
  { group: 'Playground', items: [
    { id: 'financiero',        icon: '📄', label: 'Financeiro' },
    { id: 'apostas',           icon: '🎯', label: 'Apostas Esportivas' },
    { id: 'cassino',           icon: '🌐', label: 'Cassino', badge: 'NEW' },
    { id: 'perfil-apostador',  icon: '👤', label: 'Perfil de Apostador' },
    { id: 'risco-fraude',      icon: '🛡️', label: 'Risco e Fraude (PULSE)', disabled: true },
    { id: 'pld',               icon: '🔎', label: 'PLD / AML', disabled: true },
    { id: 'web-analytics',     icon: '📈', label: 'Web Analytics', badge: 'NEW' },
  ]},
  { group: 'Research Preview', items: [
    { id: 'ai-assistant', icon: '✦', label: 'AI Assistant', disabled: true },
  ]},
]
```

```jsx
{NAV.map(({ group, items }) => (
  <div key={group ?? 'root'}>
    {group && <div className="nav-group">{group}</div>}
    {items.map((it) => it.disabled
      ? <span key={it.id} className="nav-item disabled"><span className="ico">{it.icon}</span>{it.label}</span>
      : <NavLink key={it.id} to={it.to ?? `/${it.id}`} className={({isActive}) => `nav-item ${isActive?'active':''}`}>
          <span className="ico">{it.icon}</span>{it.label}
          {it.badge && <span className={`nav-badge ${it.badge==='PULSE'?'pulse':''}`}>{it.badge}</span>}
        </NavLink>
    )}
  </div>
))}
```

Isso reproduz exatamente o padrão do screenshot (pill ativa, badges, seções) reaproveitando `--orange-soft`, `--amber-soft` e o estilo `.cat`.

---

## 5. Outras recomendações para o projeto

**Tokenizar tipografia e espaçamento.** Criar `--fs-1..7` (ex.: 10 · 11 · 12.5 · 14 · 16 · 20 · 28) e `--sp-1..6` (4 · 8 · 12 · 16 · 24 · 32) em `:root` e substituir os ~15 tamanhos e dezenas de gaps soltos. Reduz inconsistência e torna a densidade (§2.2) trivial.

**Tema escuro.** O screenshot tem um toggle de tema (ícone de sol), mas `theme.css` só tem paleta clara. Definir um bloco `[data-theme="dark"]` redefinindo as mesmas vars resolve sem tocar nos componentes.

**DRY no shell.** `GROUPS` está duplicado em `Layout.jsx` e `ControlPanel.jsx`, e os dois renderizam a mesma sidebar — `ControlPanel.jsx` parece legado. Consolidar em um só componente + um config compartilhado evita divergência.

**Mosaico no `module.md`.** Hoje os mosaicos são globais (`mosaics.js`). Como cada módulo tem composição ideal diferente, permitir um campo `mosaico_default` (e presets próprios) no frontmatter do `module.md` deixa cada página nascer com o layout certo — coerente com a arquitetura orientada a manifesto que já existe.

**Acessibilidade.** Os toggles `.sw` e os cliques em `.mosaic`/`.feed-card` são `div`/`span` com `onClick` — trocar por `<button>` reais, adicionar `aria-current` na nav ativa, `aria-pressed` nos chips de filtro e estados de foco visíveis.

**Responsividade.** O grid de 12 colunas é fixo. Adicionar breakpoints (ex.: < 1280px → as duas sidebars viram drawers; < 980px → grid de 6 colunas) evita quebra em telas menores.

**Contrato do feed ao vivo.** Padronizar a ocorrência como `{ id, tipo, cpf_mascarado, marca, ts }` e ligar o feed a uma fonte real (WebSocket/polling), com o filtro de marca já refletindo a marca selecionada no topo do canvas.

**Build multiplataforma.** O `vite build` quebra fora do macOS por falta do binário `@rollup/rollup-linux-arm64-gnu` (dependência opcional do Rollup não instalada no `node_modules` versionado/copiado). Não versionar `node_modules` e rodar `npm ci` no ambiente alvo, ou declarar os optionalDependencies de plataforma, resolve o CI/Linux.
