"use client"

// VolumeAnalise — gráfico de volume sob análise
// Caminho de destino: src/app/(dashboard)/pld-aml/VolumeAnalise.tsx
// Layout: metade da página (col-span-1 de um grid de 2 colunas)

import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Dot,
} from 'recharts'

// ---------------------------------------------------------------------------
// Mock — 30 dias de evolução
// ---------------------------------------------------------------------------
const DATA = [
  { d: '15/abr', v: 0.52 }, { d: '16/abr', v: 0.55 }, { d: '17/abr', v: 0.57 },
  { d: '18/abr', v: 0.60 }, { d: '19/abr', v: 0.63 }, { d: '20/abr', v: 0.65 },
  { d: '21/abr', v: 0.68 }, { d: '22/abr', v: 0.70 }, { d: '23/abr', v: 0.72 },
  { d: '24/abr', v: 0.73 }, { d: '25/abr', v: 0.76 }, { d: '26/abr', v: 0.78 },
  { d: '27/abr', v: 0.79 }, { d: '28/abr', v: 0.82 }, { d: '29/abr', v: 0.84 },
  { d: '30/abr', v: 0.85 }, { d: '01/mai', v: 0.88 }, { d: '02/mai', v: 0.90 },
  { d: '03/mai', v: 0.92 }, { d: '04/mai', v: 0.94 }, { d: '05/mai', v: 0.96 },
  { d: '06/mai', v: 0.99 }, { d: '07/mai', v: 1.02 }, { d: '08/mai', v: 1.05 },
  { d: '09/mai', v: 1.08 }, { d: '10/mai', v: 1.12 }, { d: '11/mai', v: 1.10 },
  { d: '12/mai', v: 1.14 }, { d: '13/mai', v: 1.18 }, { d: '14/mai', v: 1.16 },
  { d: '15/mai', v: 1.20 }, { d: '16/mai', v: 1.22 }, { d: '17/mai', v: 1.24 },
]

const SEGMENTS = [
  { label: 'Alta prioridade',  color: '#F26122', valor: 'R$ 842 mil', pct: '68%' },
  { label: 'Média prioridade', color: '#E0C020', valor: 'R$ 282 mil', pct: '23%' },
  { label: 'Baixa prioridade', color: '#4B8EF0', valor: 'R$ 116 mil', pct: '9%'  },
]

const TOTAL   = 'R$ 1,24 mi'
const DELTA   = '+R$ 180 mil'
const RADIUS  = 72   // raio do anel SVG

// ---------------------------------------------------------------------------
// Anel (donut gauge)
// ---------------------------------------------------------------------------
function Gauge() {
  const cx = 88, cy = 88, r = RADIUS
  const circ = 2 * Math.PI * r
  // percentual de alta prioridade preenche 68% do anel em laranja
  // o restante fica cinza claro
  const pctHigh = 0.68
  const dash    = circ * pctHigh

  return (
    <svg width={176} height={176} viewBox="0 0 176 176">
      {/* trilha cinza */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDEDED" strokeWidth={14} />
      {/* arco laranja — começa no topo (−90°) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#F26122"
        strokeWidth={14}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}   // rotacionar para começar no topo
        strokeLinecap="round"
      />
      {/* texto central */}
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize={11} fill="#7d7573" fontFamily="Saira, sans-serif">
        Total atual
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={20} fontWeight={800} fill="#242424" fontFamily="Exo 2, sans-serif">
        {TOTAL}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize={10} fill="#7d7573" fontFamily="Saira, sans-serif">
        sob análise
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Tooltip customizado
// ---------------------------------------------------------------------------
function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: 8, padding: '6px 12px',
      fontSize: 12, fontFamily: 'Saira, sans-serif', color: '#242424',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      R$ {payload[0].value.toFixed(2)} mi
    </div>
  )
}

// ponto de hoje destacado (último)
function TodayDot(props: { cx?: number; cy?: number; index?: number; dataLength?: number }) {
  const { cx, cy, index, dataLength } = props
  if (index !== (dataLength ?? 0) - 1) return <Dot {...props} r={3} fill="#F26122" stroke="#F26122" />
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#fff" stroke="#F26122" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={3} fill="#F26122" />
    </g>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function VolumeAnalise() {
  const ticks = DATA
    .filter((_, i) => i % 5 === 0)
    .map(d => d.d)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 20,
      fontFamily: 'Saira, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>

      {/* ── Título ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#242424', fontFamily: 'Exo 2, sans-serif' }}>
          Volume sob análise
        </span>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#AEB4BF" strokeWidth={2} strokeLinecap="round">
          <circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/>
        </svg>
      </div>

      {/* ── Linha 1: gauge + legenda ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>

        {/* Gauge */}
        <div style={{ flexShrink: 0 }}>
          <Gauge />
        </div>

        {/* Direita: delta + segmentos */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Delta */}
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start',
            background: 'rgba(242,97,34,0.07)',
            border: '1px solid rgba(242,97,34,0.15)',
            borderRadius: 10, padding: '10px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#F26122', fontSize: 12 }}>▲</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#F26122', fontFamily: 'Exo 2, sans-serif' }}>{DELTA}</span>
            </div>
            <span style={{ fontSize: 11, color: '#7d7573', marginTop: 2 }}>vs. últimos 30 dias</span>
          </div>

          {/* Segmentos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SEGMENTS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < SEGMENTS.length - 1 ? '1px solid #f4f4f4' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#242424' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#242424', marginRight: 16 }}>{s.valor}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.color, fontFamily: 'Exo 2, sans-serif', minWidth: 36, textAlign: 'right' }}>{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Linha 2: área chart ── */}
      <div>
        <div style={{ fontSize: 11, color: '#7d7573', marginBottom: 8 }}>
          Evolução (últimos 30 dias)
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#F26122" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#F26122" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="d"
              ticks={ticks}
              tick={{ fontSize: 9, fill: '#AEB4BF', fontFamily: 'Saira, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={v => `R$ ${v} mi`}
              tick={{ fontSize: 9, fill: '#AEB4BF', fontFamily: 'Saira, sans-serif' }}
              axisLine={false} tickLine={false}
              domain={[0, 1.5]}
              ticks={[0, 0.5, 1.0, 1.5]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#F26122"
              strokeWidth={1.8}
              fill="url(#volGrad)"
              dot={(props) => <TodayDot {...props} dataLength={DATA.length} />}
              activeDot={{ r: 4, fill: '#F26122' }}
            />
            {/* linha tracejada no último ponto */}
            <ReferenceLine
              x={DATA[DATA.length - 1].d}
              stroke="#F26122"
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: 'R$ 1,24 mi',
                position: 'right',
                fontSize: 10,
                fill: '#fff',
                fontFamily: 'Saira, sans-serif',
                fontWeight: 700,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Rodapé ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid #f4f4f4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#F26122" strokeWidth={2} strokeLinecap="round">
            <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize: 10, color: '#7d7573' }}>Atualizado há 12 minutos</span>
        </div>
        <span style={{ fontSize: 10, color: '#AEB4BF' }}>Fonte: Atlas AML</span>
      </div>

    </div>
  )
}

export default VolumeAnalise
