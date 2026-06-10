// ComplianceKpis — faixa de cabeçalho do M7 (PLD/AML), direção "Tendência".
// Base e KPIs conforme o discovery (PM_ONBOARDING_GUIDE): 4 KPIs de dashboard.
// É VISÃO GERAL: cada tile mostra número + mini-tendência e ABRE a página do tema (drill-down).
// O "i" é um TOOLTIP leve (padrão do guia), não um modal. KPI de distribuição mostra barra por categoria.
// Tokens: var(--orange #f26122), --red/amber/green(-soft), --font-head.

import { useState } from 'react'

// dados sintéticos — no produto vêm do analytics service (ClickHouse, recorte do período)
const KPIS = [
  {
    id: 'flag-ativo', label: 'Apostadores com flag ativo',
    valor: '27', sub: '▲ +4 no período', subCor: 'var(--red)',
    serie: [18, 19, 21, 22, 24, 25, 27], trendCor: 'var(--red)',
    tip: 'Qtd. de apostadores com pelo menos 1 red flag ativo (não arquivado).',
    destino: { rotulo: 'watchlist', pagina: 'watchlist' },
  },
  {
    id: 'alertas', label: 'Alertas gerados',
    valor: '38', sub: 'no período', subCor: 'var(--muted)',
    serie: [22, 26, 24, 30, 31, 33, 38], trendCor: 'var(--muted-2)',
    tip: 'Total de alertas criados no período selecionado.',
    destino: { rotulo: 'fila', pagina: 'alertas' },
  },
  {
    id: 'volume', label: 'Volume sob análise',
    valor: 'R$ 1,24 mi', valorPequeno: true, sub: '▲ +R$ 180 mil', subCor: 'var(--amber)',
    serie: [820, 910, 880, 1000, 1080, 1120, 1240], trendCor: 'var(--muted-2)',
    tip: 'Soma do volume financeiro dos apostadores atualmente em análise.',
    destino: { rotulo: 'fila', pagina: 'alertas' },
  },
  {
    id: 'flags-categoria', label: 'Red flags por categoria',
    valor: '34', sub: '4 categorias', subCor: 'var(--muted)',
    breakdown: [
      { nome: 'Estruturação',   valor: 14, cor: 'var(--red)' },
      { nome: 'Saque atípico',  valor: 9,  cor: 'var(--amber)' },
      { nome: 'Depósito susp.', valor: 7,  cor: 'var(--orange)' },
      { nome: 'Comport. incons.', valor: 4, cor: 'var(--muted-2)' },
    ],
    tip: 'Distribuição dos red flags ativos por categoria: estruturação, saque atípico, depósito suspeito e comportamento inconsistente.',
    destino: { rotulo: 'fila', pagina: 'alertas' },
  },
]

// mini-tendência (sparkline) normalizada num viewBox fixo
function Spark({ serie, cor }) {
  const w = 56, h = 22, pad = 2
  const min = Math.min(...serie), max = Math.max(...serie)
  const rng = (max - min) || 1
  const pts = serie.map((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / (serie.length - 1)
    const y = h - pad - ((v - min) / rng) * (h - 2 * pad)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ flex: '0 0 auto' }}>
      <polyline points={pts} fill="none" stroke={cor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// barra empilhada por categoria (para o KPI de distribuição)
function CatBar({ breakdown }) {
  const total = breakdown.reduce((s, b) => s + b.valor, 0) || 1
  return (
    <div style={{ flex: '0 0 auto', width: 56 }}>
      <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', background: 'var(--line)' }}>
        {breakdown.map((b) => (
          <div key={b.nome} title={`${b.nome}: ${b.valor}`} style={{ width: `${(b.valor / total) * 100}%`, background: b.cor }} />
        ))}
      </div>
    </div>
  )
}

// "i" → tooltip leve (hover/clique), não modal
function Info({ texto }) {
  const [open, setOpen] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="ibtn" aria-label="Informação"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        style={{ width: 17, height: 17, fontSize: 10 }}>i</button>
      {open && (
        <span role="tooltip" onClick={(e) => e.stopPropagation()} style={{
          position: 'absolute', top: 24, right: 0, zIndex: 30, width: 200,
          background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(16,24,40,.14)', padding: '8px 10px',
          fontSize: 11, lineHeight: 1.5, color: 'var(--ink-2)', fontWeight: 500, cursor: 'default',
        }}>{texto}</span>
      )}
    </span>
  )
}

export default function ComplianceKpis({ dados, onAbrir }) {
  const items = dados?.kpis || KPIS
  const abrir = (pagina) => (onAbrir ? onAbrir(pagina) : null)
  return (
    <div className="body" style={{ overflow: 'visible' }}>
      <style>{`.m7-kpi{transition:border-color .12s} .m7-kpi:hover{border-color:var(--orange-line)} .m7-kpi:hover .m7-abrir{color:var(--orange)}`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(158px, 1fr))', gap: 10 }}>
        {items.map((k) => (
          <div key={k.id} className="m7-kpi" role="button" tabIndex={0}
            onClick={() => abrir(k.destino?.pagina)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(k.destino?.pagina) } }}
            title={k.destino ? `Abrir ${k.destino.rotulo}` : undefined}
            style={{
              cursor: 'pointer', background: 'var(--card)', border: 'var(--border-hair)', borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-card)', padding: 'var(--pad-kpi)', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11.5, color: 'var(--muted)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.label}</span>
              <Info texto={k.tip} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, lineHeight: 1.05, fontSize: k.valorPequeno ? 18 : 26, color: k.valorCor || 'var(--ink)' }}>{k.valor}</span>
              {k.serie ? <Spark serie={k.serie} cor={k.trendCor || 'var(--muted-2)'} /> : k.breakdown && <CatBar breakdown={k.breakdown} />}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: k.subCor || 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.sub}</span>
              {k.destino && <span className="m7-abrir" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-2)', whiteSpace: 'nowrap', flex: '0 0 auto' }}>abrir {k.destino.rotulo} ↗</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
