"use client"

import React, { useState } from 'react'

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
type Sev = 'Crítico' | 'Alto' | 'Médio'

interface CoafCase {
  id:     string
  nome:   string
  tHoras: number
  valor:  string
  sev:    Sev
}

interface CoafTimelineV2Props {
  onInvestigate?: (id: string) => void
}

// ---------------------------------------------------------------------------
// Mock
// ---------------------------------------------------------------------------
const CASES: CoafCase[] = [
  { id: 'AML-2026-0046', nome: 'R. FERREIRA', tHoras:  6.5,  valor: 'R$ 215.430,00', sev: 'Crítico' },
  { id: 'AML-2026-0047', nome: 'C. ROCHA',    tHoras:  9,    valor: 'R$ 183.210,00', sev: 'Crítico' },
  { id: 'AML-2026-0048', nome: 'M. DIAS',     tHoras: 10,    valor: 'R$ 98.760,00',  sev: 'Alto'    },
  { id: 'AML-2026-0045', nome: 'P. SANTOS',   tHoras: 11,    valor: 'R$ 72.540,00',  sev: 'Alto'    },
  { id: 'AML-2026-0044', nome: 'L. ALMEIDA',  tHoras: 13,    valor: 'R$ 56.320,00',  sev: 'Médio'   },
  { id: 'AML-2026-0043', nome: 'T. MELO',     tHoras: 19,    valor: 'R$ 44.100,00',  sev: 'Alto'    },
  { id: 'AML-2026-0042', nome: 'F. CASTRO',   tHoras: 27,    valor: 'R$ 31.200,00',  sev: 'Médio'   },
  { id: 'AML-2026-0041', nome: 'J. PIRES',    tHoras: 34,    valor: 'R$ 28.900,00',  sev: 'Médio'   },
]

const HORIZON = 36
const PRAZO   = 24

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function sevColor(sev: Sev, muted = false): string {
  if (sev === 'Crítico') return muted ? '#fde8e8' : 'var(--red)'
  if (sev === 'Alto')    return muted ? '#fef3e2' : 'var(--orange)'
  return muted ? '#fef9ec' : 'var(--amber)'
}

function sevBorder(sev: Sev): string {
  if (sev === 'Crítico') return 'var(--red)'
  if (sev === 'Alto')    return 'var(--orange)'
  return 'var(--amber)'
}

function fmtTime(h: number): string {
  const hFloor = Math.floor(h)
  const min    = Math.round((h - hFloor) * 60)
  if (min === 0) return `${hFloor}h`
  return `${hFloor}h ${min}min`
}

// ---------------------------------------------------------------------------
// Beeswarm SVG
// ---------------------------------------------------------------------------
function BeeswarmChart({ cases, onSelect, selected }: {
  cases: CoafCase[]
  onSelect: (c: CoafCase) => void
  selected: string | null
}) {
  const W = 520, H = 120
  const PAD_L = 24, PAD_R = 16, PAD_T = 28, PAD_B = 28
  const chartW = W - PAD_L - PAD_R
  const chartH = H - PAD_T - PAD_B

  const xOf = (h: number) => PAD_L + (h / HORIZON) * chartW
  const prazoX  = xOf(PRAZO)
  const crit12X = xOf(12)

  const R = 7
  const placed: { c: CoafCase; cx: number; cy: number }[] = []

  for (const c of cases) {
    const cx = xOf(c.tHoras)
    let cy = PAD_T + chartH / 2
    let attempts = 0
    while (attempts < 20) {
      const hit = placed.find(p =>
        Math.abs(p.cx - cx) < R * 2.2 && Math.abs(p.cy - cy) < R * 2.2
      )
      if (!hit) break
      cy = cy <= PAD_T + chartH / 2
        ? cy - R * 2.4
        : cy + R * 2.4
      attempts++
    }
    placed.push({ c, cx, cy })
  }

  const ticks = [0, 6, 12, 18, 24, 30, 36]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* zona crítica < 12h */}
      <rect x={PAD_L} y={PAD_T - 4} width={crit12X - PAD_L} height={chartH + 8}
        fill="rgba(239,68,68,0.08)" rx={4} />
      <text x={PAD_L + 6} y={PAD_T + 10} fontSize={9} fill="var(--red)" fontFamily="var(--font-body)" fontWeight={600}>
        crítico
      </text>

      {/* linha prazo 24h */}
      <line x1={prazoX} y1={PAD_T - 6} x2={prazoX} y2={PAD_T + chartH + 4}
        stroke="var(--muted-text)" strokeWidth={1} strokeDasharray="4 3" />
      <text x={prazoX + 3} y={PAD_T - 8} fontSize={9} fill="var(--muted-text)"
        fontFamily="var(--font-body)">prazo 24h</text>

      {/* eixo X */}
      <line x1={PAD_L} y1={PAD_T + chartH + 6} x2={W - PAD_R} y2={PAD_T + chartH + 6}
        stroke="var(--border-default)" strokeWidth={1} />
      {ticks.map(t => (
        <g key={t}>
          <line x1={xOf(t)} y1={PAD_T + chartH + 4} x2={xOf(t)} y2={PAD_T + chartH + 8}
            stroke="var(--border-default)" strokeWidth={1} />
          <text x={xOf(t)} y={H - 2} textAnchor="middle" fontSize={9}
            fill={t === 12 ? 'var(--red)' : 'var(--muted-text)'}
            fontFamily="var(--font-body)" fontWeight={t === 12 ? 700 : 400}>
            {t}h
          </text>
        </g>
      ))}

      {/* dots */}
      {placed.map(({ c, cx, cy }) => (
        <circle
          key={c.id}
          cx={cx} cy={cy} r={R}
          fill={sevColor(c.sev)}
          stroke={selected === c.id ? 'var(--ink)' : 'transparent'}
          strokeWidth={2}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(c)}
        >
          <title>{c.nome} · {fmtTime(c.tHoras)} · {c.sev}</title>
        </circle>
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Distribuição por prazo
// ---------------------------------------------------------------------------
function DistGrid({ cases }: { cases: CoafCase[] }) {
  const buckets = [
    { label: '< 6h',   count: cases.filter(c => c.tHoras < 6).length },
    { label: '6–12h',  count: cases.filter(c => c.tHoras >= 6  && c.tHoras < 12).length },
    { label: '12–24h', count: cases.filter(c => c.tHoras >= 12 && c.tHoras < 24).length },
    { label: '24–36h', count: cases.filter(c => c.tHoras >= 24).length },
  ]
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', marginBottom: 6 }}>
        Distribuição por prazo
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
        {buckets.map((b, i) => (
          <div key={i} style={{
            padding: '8px 10px',
            borderRight: i < 3 ? '1px solid var(--border-default)' : 'none',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>{b.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1.2 }}>{b.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tabela lateral
// ---------------------------------------------------------------------------
function CaseTable({ cases, onInvestigate }: { cases: CoafCase[]; onInvestigate?: (id: string) => void }) {
  const visible = cases.slice(0, 5)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)', marginBottom: 12 }}>
        Próximos a vencer
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 1.4fr 0.9fr', gap: 8, paddingBottom: 8, borderBottom: '1px solid var(--border-default)', marginBottom: 4 }}>
        {['Apostador', 'Caso', 'Tempo restante', 'Valor envolvido', 'Nível de risco'].map(h => (
          <span key={h} style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>{h}</span>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {visible.map((c, i) => (
          <div
            key={c.id}
            onClick={() => onInvestigate?.(c.id)}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1.2fr 1fr 1.4fr 0.9fr',
              gap: 8,
              padding: '10px 0',
              borderBottom: i < visible.length - 1 ? '1px solid var(--border-default)' : 'none',
              alignItems: 'center',
              cursor: onInvestigate ? 'pointer' : 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: sevColor(c.sev), flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-body)', lineHeight: 1.2 }}>{c.nome}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>{c.id}</div>
              </div>
            </div>

            <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-mono)' }}>{c.id.slice(-4)}</div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: sevColor(c.sev, true),
              border: `1px solid ${sevBorder(c.sev)}`,
              borderRadius: 6, padding: '3px 8px',
              width: 'fit-content',
            }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={sevColor(c.sev)} strokeWidth={2.5} strokeLinecap="round">
                <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: sevColor(c.sev), fontFamily: 'var(--font-body)' }}>{fmtTime(c.tHoras)}</span>
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>{c.valor}</div>

            <div style={{
              display: 'inline-flex', justifyContent: 'center',
              background: sevColor(c.sev, true),
              border: `1px solid ${sevBorder(c.sev)}`,
              borderRadius: 6, padding: '3px 8px', width: 'fit-content',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: sevColor(c.sev), fontFamily: 'var(--font-body)' }}>{c.sev}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: 8, borderTop: '1px solid var(--border-default)', textAlign: 'right' }}>
        <button
          onClick={() => onInvestigate?.('all')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: 'var(--orange)',
            fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}
        >
          Ver todos os casos ›
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function CoafTimelineV2({ onInvestigate }: CoafTimelineV2Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const criticos = CASES.filter(c => c.tHoras < 12)
  const total    = CASES.length

  function handleSelect(c: CoafCase) {
    setSelected(c.id === selected ? null : c.id)
    onInvestigate?.(c.id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* dois painéis */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden',
        background: 'var(--card)',
      }}>

        {/* PAINEL ESQUERDO — beeswarm + stats */}
        <div style={{ padding: 20, borderRight: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>
              Prazo COAF — horizonte {HORIZON}h
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: 'var(--red)',
              background: 'var(--red-soft)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 6, padding: '2px 8px', fontFamily: 'var(--font-body)',
            }}>
              {criticos.length} críticos &lt; 12h
            </span>
          </div>

          <BeeswarmChart cases={CASES} onSelect={handleSelect} selected={selected} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '12px 0' }}>
            {[
              { label: 'Casos críticos', value: criticos.length, sub: 'Vencem em até 12h', color: 'var(--red)',    bg: 'rgba(239,68,68,0.1)'  },
              { label: 'Total a vencer', value: total,           sub: `Nas próximas ${HORIZON}h`, color: 'var(--orange)', bg: 'rgba(242,97,34,0.1)'  },
            ].map((k, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '10px 12px',
                background: 'var(--bg)', borderRadius: 8,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: k.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={k.color} strokeWidth={2.5} strokeLinecap="round">
                    <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>{k.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <DistGrid cases={CASES} />
        </div>

        {/* PAINEL DIREITO — tabela */}
        <div style={{ padding: 20 }}>
          <CaseTable cases={CASES} onInvestigate={onInvestigate} />
        </div>
      </div>

      {/* rodapé */}
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', marginTop: 8,
        fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)',
      }}>
        <span>ⓘ Atualizado às 15:44</span>
        <span style={{ color: 'var(--border-default)' }}>|</span>
        <span>Dados referentes às próximas {HORIZON}h</span>
      </div>

    </div>
  )
}

export default CoafTimelineV2
