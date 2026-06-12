"use client"

// Pipeline AML — substitui <VolumeTrend /> na página pld-aml/page.tsx
// Caminho de destino: src/app/(dashboard)/pld-aml/PipelineAml.tsx
// Uso: trocar <VolumeTrend /> por <PipelineAml /> na seção da Visão Geral

import React from 'react'

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Stage {
  icon: string
  value: string
  label: string
  conv: string | null   // taxa de conversão da etapa anterior → esta
}

interface KpiItem {
  icon: string
  value: string
  label: string
  delta: string
  deltaUp: boolean | null  // null = neutro
}

// ---------------------------------------------------------------------------
// Mock — trocar por dados reais via props ou fetch
// ---------------------------------------------------------------------------
const STAGES: Stage[] = [
  { icon: '⌕',  value: '850.000', label: 'Transações\nMonitoradas', conv: null },
  { icon: '✦',  value: '18.200',  label: 'Regras\nAcionadas',       conv: '2,1%' },
  { icon: '🔔', value: '3.420',   label: 'Alertas\nGerados',        conv: '18,8%' },
  { icon: '📋', value: '740',     label: 'Em\nInvestigação',        conv: '21,6%' },
  { icon: '📁', value: '112',     label: 'Casos\nAbertos',          conv: '15,1%' },
  { icon: '✈',  value: '18',     label: 'Comunicações\nCOAF',      conv: '2,4%' },
]

const KPIS: KpiItem[] = [
  { icon: '📈', value: '0,0021%',  label: 'Taxa de Conversão AML',       delta: 'Monitorado → COAF',     deltaUp: null },
  { icon: '⏱',  value: '2,4 dias', label: 'Tempo Médio de Investigação', delta: '−0,6 vs. 30 dias ant.', deltaUp: false },
  { icon: '$',  value: 'R$ 48,7 MM', label: 'Volume Financeiro Investigado', delta: '+12% vs. 30 dias ant.', deltaUp: true },
  { icon: '👤', value: '1.256',    label: 'Contas Envolvidas',            delta: '+8% vs. 30 dias ant.',  deltaUp: true },
]

const HEADLINE = { value: '18', label: 'COMUNICAÇÕES COAF', delta: '+5 vs. 30 dias anteriores', up: true }
const PERIOD   = 'ÚLTIMOS 30 DIAS'

// ---------------------------------------------------------------------------
// Helpers de cor — gradiente laranja com opacidade decrescente
// ---------------------------------------------------------------------------
function stageAlpha(i: number, total: number): string {
  // 1.0 → 0.18, distribuído linearmente
  const alpha = 1 - (i / (total - 1)) * 0.82
  return `rgba(242, 97, 34, ${alpha.toFixed(2)})`
}

// ---------------------------------------------------------------------------
// Sub-componente: um dente do funil (chevron em CSS clip-path)
// ---------------------------------------------------------------------------
function Chevron({ stage, index, total }: { stage: Stage; index: number; total: number }) {
  const isLast = index === total - 1
  // largura proporcional à posição (funil afunila da esquerda pra direita)
  const widthPct = 100 - index * (55 / (total - 1))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
      {/* taxa de conversão acima do chevron (exceto no primeiro) */}
      <div style={{ height: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
        {stage.conv && (
          <>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', fontFamily: 'Saira, sans-serif', lineHeight: 1 }}>
              {stage.conv}
            </span>
            <span style={{ fontSize: 9, color: 'var(--muted-text)', fontFamily: 'Saira, sans-serif', lineHeight: 1.2 }}>
              taxa de conversão
            </span>
          </>
        )}
      </div>

      {/* corpo do chevron */}
      <div
        style={{
          position: 'relative',
          width: `${widthPct}%`,
          minWidth: 80,
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
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{stage.icon}</span>
        <span style={{
          fontSize: 20,
          fontWeight: 800,
          color: '#ffffff',
          fontFamily: 'Exo 2, sans-serif',
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}>
          {stage.value}
        </span>
        <span style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.88)',
          fontFamily: 'Saira, sans-serif',
          textAlign: 'center',
          lineHeight: 1.3,
          whiteSpace: 'pre-line',
        }}>
          {stage.label}
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componente: linha de dots do timeline
// ---------------------------------------------------------------------------
function DotTimeline({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '6px 0 0 0' }}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i === 0 ? 'var(--orange)' : 'var(--muted-2, #AEB4BF)',
            flexShrink: 0,
          }} />
          {i < count - 1 && (
            <div style={{ flex: 1, height: 1, background: 'var(--muted-2, #AEB4BF)', minWidth: 24 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-componente: KPI de rodapé
// ---------------------------------------------------------------------------
function BottomKpi({ item }: { item: KpiItem }) {
  const deltaColor = item.deltaUp === null
    ? 'var(--muted-text)'
    : item.deltaUp ? 'var(--green, #22c55e)' : 'var(--red, #ef4444)'

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '10px 12px',
      background: 'var(--surface, #f4f4f5)',
      borderRadius: 8,
      minWidth: 0,
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 15,
          fontWeight: 800,
          color: 'var(--ink)',
          fontFamily: 'Exo 2, sans-serif',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
        }}>
          {item.value}
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'Saira, sans-serif', lineHeight: 1.3, marginTop: 1 }}>
          {item.label}
        </div>
        <div style={{ fontSize: 10, color: deltaColor, fontFamily: 'Saira, sans-serif', marginTop: 2 }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>

      {/* Cabeçalho */}
      <div>
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--muted-text)',
          fontFamily: 'Saira, sans-serif',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 2,
        }}>
          PIPELINE AML · {PERIOD}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--muted-text)',
            fontFamily: 'Saira, sans-serif',
            textTransform: 'uppercase',
          }}>
            HOJE
          </span>
          <span style={{
            fontSize: 28,
            fontWeight: 900,
            color: 'var(--ink)',
            fontFamily: 'Exo 2, sans-serif',
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}>
            {HEADLINE.value}
          </span>
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--ink)',
            fontFamily: 'Exo 2, sans-serif',
          }}>
            {HEADLINE.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ color: 'var(--orange)', fontSize: 10 }}>▲</span>
          <span style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'Saira, sans-serif' }}>
            {HEADLINE.delta}
          </span>
        </div>
      </div>

      {/* Funil */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        overflow: 'hidden',
        width: '100%',
      }}>
        {STAGES.map((stage, i) => (
          <Chevron key={i} stage={stage} index={i} total={STAGES.length} />
        ))}
      </div>

      {/* Timeline de dots */}
      <DotTimeline count={STAGES.length} />

      {/* KPIs de rodapé */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {KPIS.map((kpi, i) => (
          <BottomKpi key={i} item={kpi} />
        ))}
      </div>

      {/* Nota de rodapé */}
      <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'Saira, sans-serif' }}>
        ⓘ Dados referentes aos últimos 30 dias. Atualizado hoje às 08:30.
      </div>

    </div>
  )
}

export default PipelineAml
