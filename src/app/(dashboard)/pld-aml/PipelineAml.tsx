"use client"

import React from 'react'

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Stage {
  icon: string
  value: string
  label: string
  conv: string | null
}

interface KpiItem {
  icon: string
  value: string
  label: string
  delta: string
  deltaUp: boolean | null
}

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------
const STAGES: Stage[] = [
  { icon: '⌕',  value: '850.000', label: 'Transações\nMonitoradas', conv: null },
  { icon: '✦',  value: '18.200',  label: 'Regras\nAcionadas',       conv: '2,1%' },
  { icon: '🔔', value: '3.420',   label: 'Alertas\nGerados',        conv: '18,8%' },
  { icon: '📋', value: '740',     label: 'Em\nInvestigação',        conv: '21,6%' },
  { icon: '📁', value: '112',     label: 'Casos\nAbertos',          conv: '15,1%' },
  { icon: '✈',  value: '18',      label: 'Comunicações\nCOAF',     conv: '2,4%' },
]

const KPIS: KpiItem[] = [
  { icon: '📈', value: '0,0021%',    label: 'Taxa de Conversão AML',          delta: 'Monitorado → COAF',     deltaUp: null  },
  { icon: '⏱',  value: '2,4 dias',   label: 'Tempo Médio de Investigação',    delta: '−0,6 vs. 30 dias ant.', deltaUp: false },
  { icon: '💰', value: 'R$ 48,7 MM', label: 'Volume Financeiro Investigado',  delta: '+12% vs. 30 dias ant.', deltaUp: true  },
  { icon: '👤', value: '1.256',      label: 'Contas Envolvidas',              delta: '+8% vs. 30 dias ant.',  deltaUp: true  },
]

const HEADLINE = { value: '18', label: 'COMUNICAÇÕES COAF', delta: '+5 vs. 30 dias anteriores' }
const PERIOD   = 'ÚLTIMOS 30 DIAS'

// ---------------------------------------------------------------------------
// Gradiente laranja com opacidade decrescente (alpha computado em JS)
// ---------------------------------------------------------------------------
function stageAlpha(i: number, total: number): string {
  const alpha = 1 - (i / (total - 1)) * 0.82
  return `rgba(242, 97, 34, ${alpha.toFixed(2)})`
}

// ---------------------------------------------------------------------------
// Chevron
// ---------------------------------------------------------------------------
function Chevron({ stage, index, total }: { stage: Stage; index: number; total: number }) {
  const isLast   = index === total - 1
  const widthPct = 100 - index * (55 / (total - 1))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
      <div style={{ height: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
        {stage.conv && (
          <>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', fontFamily: 'var(--font-body)', lineHeight: 1 }}>
              {stage.conv}
            </span>
            <span style={{ fontSize: 9, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', lineHeight: 1.2 }}>
              taxa de conversão
            </span>
          </>
        )}
      </div>
      <div style={{
        position: 'relative',
        width: `${widthPct}%`,
        minWidth: 72,
        height: 88,
        background: stageAlpha(index, total),
        clipPath: isLast
          ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: '0 18px 0 8px',
      }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>{stage.icon}</span>
        <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-head)', lineHeight: 1, letterSpacing: '-0.5px' }}>
          {stage.value}
        </span>
        <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.88)', fontFamily: 'var(--font-body)', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line' }}>
          {stage.label}
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dot timeline
// ---------------------------------------------------------------------------
function DotTimeline({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '6px 0 0 0' }}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--orange)' : 'var(--muted-2)', flexShrink: 0 }} />
          {i < count - 1 && (
            <div style={{ flex: 1, height: 1, background: 'var(--muted-2)', minWidth: 24 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// KPI de rodapé
// ---------------------------------------------------------------------------
function BottomKpi({ item }: { item: KpiItem }) {
  const deltaColor = item.deltaUp === null
    ? 'var(--muted-text)'
    : item.deltaUp ? 'var(--green)' : 'var(--red)'

  return (
    <div style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, minWidth: 0 }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          {item.value}
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', lineHeight: 1.3, marginTop: 1 }}>
          {item.label}
        </div>
        <div style={{ fontSize: 10, color: deltaColor, fontFamily: 'var(--font-body)', marginTop: 2 }}>
          {item.delta}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function PipelineAml() {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '20px 24px 14px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Cabeçalho */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--muted-text)', fontFamily: 'var(--font-body)', lineHeight: 1 }}>
          Pipeline AML · {PERIOD}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--orange)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '.5px' }}>hoje</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1, letterSpacing: '-0.5px' }}>
            {HEADLINE.value}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>
            {HEADLINE.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ color: 'var(--orange)', fontSize: 10 }}>▲</span>
          <span style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>{HEADLINE.delta}</span>
        </div>
      </div>

      {/* Funil */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, overflow: 'hidden', width: '100%' }}>
        {STAGES.map((stage, i) => (
          <Chevron key={i} stage={stage} index={i} total={STAGES.length} />
        ))}
      </div>

      {/* Dot timeline */}
      <DotTimeline count={STAGES.length} />

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {KPIS.map((kpi, i) => (
          <BottomKpi key={i} item={kpi} />
        ))}
      </div>

      {/* Rodapé */}
      <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>
        ⓘ Dados referentes aos últimos 30 dias. Atualizado hoje às 08:30.
      </div>

    </div>
  )
}

export default PipelineAml
