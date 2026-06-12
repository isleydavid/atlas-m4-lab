"use client"

import React from 'react'

// ---------------------------------------------------------------------------
// Dados
// ---------------------------------------------------------------------------
interface Stage {
  value: string
  label: string
  conv:  string | null
  h:     number
}

const STAGES: Stage[] = [
  { value: '850.000', label: 'Transações\nMonitoradas', conv: null,    h: 112 },
  { value: '18.200',  label: 'Regras\nAcionadas',       conv: '2,1%',  h: 95  },
  { value: '3.420',   label: 'Alertas\nGerados',        conv: '18,8%', h: 80  },
  { value: '740',     label: 'Em\nInvestigação',        conv: '21,6%', h: 65  },
  { value: '112',     label: 'Casos\nAbertos',          conv: '15,1%', h: 50  },
  { value: '18',      label: 'Comunicações\nCOAF',      conv: '2,4%',  h: 38  },
]

interface KpiItem {
  label:    string
  value:    string
  sub:      string
  deltaPos: boolean | null
}

const KPIS: KpiItem[] = [
  { label: 'Taxa de Conversão AML',         value: '0,0021%',    sub: 'Monitorado → COAF',        deltaPos: null  },
  { label: 'Tempo Médio de Investigação',   value: '2,4 dias',   sub: '−0,6 vs. 30 dias ant.',    deltaPos: false },
  { label: 'Volume Financeiro Investigado', value: 'R$ 48,7 MM', sub: '+12% vs. 30 dias ant.',    deltaPos: true  },
  { label: 'Contas Envolvidas',             value: '1.256',      sub: '+8% vs. 30 dias ant.',     deltaPos: true  },
]

// ---------------------------------------------------------------------------
// Cor por índice — laranja sólido → pêssego bem claro
// ---------------------------------------------------------------------------
const BG = [
  '#F26122',
  '#F47340',
  '#F68B62',
  '#F8A585',
  '#FABFAA',
  '#FCDACF',
]

const TEXT_DARK = ['#fff', '#fff', '#fff', '#fff', '#fff', '#F26122']

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function PipelineAml({ onViewRegras }: { onViewRegras?: () => void } = {}) {
  const maxH   = Math.max(...STAGES.map(s => s.h))
  const topRow = maxH + 40

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '20px 24px 14px', boxShadow: 'var(--shadow-card)', width: '100%', boxSizing: 'border-box' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-body)' }}>
            PIPELINE AML · ÚLTIMOS 30 DIAS
          </div>
          {onViewRegras && (
            <button onClick={onViewRegras} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'var(--orange)', fontFamily: 'var(--font-body)', padding: 0 }}>
              Ver regras →
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-text)', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>HOJE</span>
          <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1, letterSpacing: '-0.5px' }}>18</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>COMUNICAÇÕES COAF</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ color: 'var(--orange)', fontSize: 10 }}>▲</span>
          <span style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>+5 vs. 30 dias anteriores</span>
        </div>
      </div>

      {/* Funil */}
      <div style={{ position: 'relative', height: topRow, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {STAGES.map((s, i) => {
          const isLast = i === STAGES.length - 1
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>

              {/* taxa de conversão acima */}
              <div style={{ height: topRow - maxH - 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 }}>
                {s.conv && (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', lineHeight: 1, fontFamily: 'var(--font-body)' }}>{s.conv}</span>
                    <span style={{ fontSize: 9, color: 'var(--muted-text)', lineHeight: 1.2, fontFamily: 'var(--font-body)' }}>taxa de conversão</span>
                    <span style={{ fontSize: 10, color: 'var(--muted-text)', lineHeight: 1, marginTop: 1 }}>↓</span>
                  </>
                )}
              </div>

              {/* chevron */}
              <div
                onClick={i === 1 && onViewRegras ? onViewRegras : undefined}
                style={{
                  width: '100%',
                  height: s.h,
                  background: BG[i],
                  clipPath: isLast
                    ? 'none'
                    : 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
                  borderRadius: isLast ? 4 : 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 14px 6px 6px',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  cursor: i === 1 && onViewRegras ? 'pointer' : 'default',
                }}>
                <span style={{
                  fontSize: s.h > 70 ? 18 : s.h > 50 ? 14 : 11,
                  fontWeight: 900,
                  color: TEXT_DARK[i],
                  fontFamily: 'var(--font-head)',
                  lineHeight: 1,
                  letterSpacing: '-0.3px',
                  textAlign: 'center',
                }}>
                  {s.value}
                </span>
                <span style={{
                  fontSize: s.h > 70 ? 9 : 8,
                  color: i < 5 ? 'rgba(255,255,255,0.85)' : 'var(--orange)',
                  lineHeight: 1.3,
                  textAlign: 'center',
                  marginTop: 3,
                  whiteSpace: 'pre-line',
                  fontFamily: 'var(--font-body)',
                }}>
                  {s.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline de dots */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 16px 0' }}>
        {STAGES.map((_, i) => (
          <React.Fragment key={i}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: i === 0 ? 'var(--orange)' : 'var(--muted-2)',
            }} />
            {i < STAGES.length - 1 && (
              <div style={{ flex: 1, height: 1, background: 'var(--muted-2)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* KPIs de rodapé */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border-default)' }}>
        {KPIS.map((k, i) => {
          const deltaColor = k.deltaPos === null ? 'var(--muted-text)' : k.deltaPos ? 'var(--green)' : 'var(--red)'
          return (
            <div key={i} style={{
              padding: '12px 14px',
              borderLeft: i === 0 ? '3px solid var(--orange)' : '1px solid var(--border-default)',
            }}>
              <div style={{ fontSize: 10, color: 'var(--muted-text)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: deltaColor, marginTop: 3, fontFamily: 'var(--font-body)' }}>{k.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Nota */}
      <div style={{ fontSize: 10, color: 'var(--muted-text)', marginTop: 8, fontFamily: 'var(--font-body)' }}>
        ⓘ Dados referentes aos últimos 30 dias. Atualizado hoje às 08:30.
      </div>

    </div>
  )
}

export default PipelineAml
