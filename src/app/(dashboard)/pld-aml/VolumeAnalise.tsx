"use client"

import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Dot,
} from 'recharts'

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
  { label: 'Alta prioridade',  color: 'var(--orange)', valor: 'R$ 842 mil', pct: '68%' },
  { label: 'Média prioridade', color: 'var(--amber)',  valor: 'R$ 282 mil', pct: '23%' },
  { label: 'Baixa prioridade', color: 'var(--green)',  valor: 'R$ 116 mil', pct: '9%'  },
]

const TOTAL  = 'R$ 1,24 mi'
const DELTA  = '+R$ 180 mil'
const RADIUS = 72

function Gauge() {
  const cx = 88, cy = 88, r = RADIUS
  const circ = 2 * Math.PI * r
  const dash  = circ * 0.68

  return (
    <svg width={176} height={176} viewBox="0 0 176 176">
      <circle cx={cx} cy={cy} r={r} fill="none" style={{ stroke: 'var(--line)' }} strokeWidth={14} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        style={{ stroke: 'var(--orange)' }}
        strokeWidth={14}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
      />
      <text x={cx} y={cy - 10} textAnchor="middle"
        style={{ fontSize: 11, fill: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>
        Total atual
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle"
        style={{ fontSize: 20, fontWeight: 800, fill: 'var(--ink)', fontFamily: 'var(--font-head)' }}>
        {TOTAL}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle"
        style={{ fontSize: 10, fill: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>
        sob análise
      </text>
    </svg>
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 8, padding: '6px 12px',
      fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--ink)',
      boxShadow: 'var(--shadow-card)',
    }}>
      R$ {payload[0].value.toFixed(2)} mi
    </div>
  )
}

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

export function VolumeAnalise() {
  const ticks = DATA.filter((_, i) => i % 5 === 0).map(d => d.d)

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 12, padding: 20,
      fontFamily: 'var(--font-body)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>

      {/* Título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>
          Volume sob análise
        </span>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
          style={{ stroke: 'var(--muted-2)' }} strokeWidth={2} strokeLinecap="round">
          <circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/>
        </svg>
      </div>

      {/* Gauge + legenda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ flexShrink: 0 }}><Gauge /></div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start',
            background: 'var(--orange-soft)', border: '1px solid var(--orange-line)',
            borderRadius: 10, padding: '10px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--orange)', fontSize: 12 }}>▲</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--orange)', fontFamily: 'var(--font-head)' }}>{DELTA}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 2 }}>vs. últimos 30 dias</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SEGMENTS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '8px 0',
                borderBottom: i < SEGMENTS.length - 1 ? '1px solid var(--line)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--ink)' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginRight: 16 }}>{s.valor}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.color, fontFamily: 'var(--font-head)', minWidth: 36, textAlign: 'right' }}>{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Área chart */}
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted-text)', marginBottom: 8 }}>
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
            <XAxis dataKey="d" ticks={ticks} axisLine={false} tickLine={false}
              tick={{ fontSize: 9, fill: '#7d7573', fontFamily: 'Saira, sans-serif' }} />
            <YAxis tickFormatter={v => `R$ ${v} mi`} axisLine={false} tickLine={false}
              domain={[0, 1.5]} ticks={[0, 0.5, 1.0, 1.5]}
              tick={{ fontSize: 9, fill: '#7d7573', fontFamily: 'Saira, sans-serif' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="v" stroke="#F26122" strokeWidth={1.8}
              fill="url(#volGrad)"
              dot={(props) => <TodayDot {...props} dataLength={DATA.length} />}
              activeDot={{ r: 4, fill: '#F26122' }} />
            <ReferenceLine x={DATA[DATA.length - 1].d} stroke="#F26122"
              strokeDasharray="4 3" strokeWidth={1}
              label={{ value: 'R$ 1,24 mi', position: 'right', fontSize: 10,
                fill: '#fff', fontFamily: 'Saira, sans-serif', fontWeight: 700 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rodapé */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
            style={{ stroke: 'var(--orange)' }} strokeWidth={2} strokeLinecap="round">
            <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize: 10, color: 'var(--muted-text)' }}>Atualizado há 12 minutos</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--muted-2)' }}>Fonte: Atlas AML</span>
      </div>

    </div>
  )
}

export default VolumeAnalise
