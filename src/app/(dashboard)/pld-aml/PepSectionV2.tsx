"use client"

import React from 'react'

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
type Vinculo = 'Titular' | 'Familiar 2º grau' | 'Representante' | 'Colaborador'
type Risco   = 'Crítico' | 'Alto' | 'Médio'

interface PepRow {
  id:      string
  nome:    string
  vinculo: Vinculo
  score:   number
  volume:  string
  alertas: number
  risco:   Risco
}

interface PepSectionV2Props {
  onInvestigate?: (id: string) => void
}

// ---------------------------------------------------------------------------
// Mock — nomes mascarados (LGPD)
// ---------------------------------------------------------------------------
const ROWS: PepRow[] = [
  { id: 'PEP-0001', nome: 'J. SILVA',  vinculo: 'Titular',          score: 94, volume: 'R$ 420 mil', alertas: 4, risco: 'Crítico' },
  { id: 'PEP-0002', nome: 'M. COSTA',  vinculo: 'Familiar 2º grau', score: 89, volume: 'R$ 310 mil', alertas: 3, risco: 'Crítico' },
  { id: 'PEP-0003', nome: 'P. LIMA',   vinculo: 'Representante',    score: 82, volume: 'R$ 180 mil', alertas: 2, risco: 'Alto'    },
  { id: 'PEP-0004', nome: 'A. SOUZA',  vinculo: 'Titular',          score: 78, volume: 'R$ 150 mil', alertas: 1, risco: 'Alto'    },
  { id: 'PEP-0005', nome: 'C. ROCHA',  vinculo: 'Colaborador',      score: 76, volume: 'R$ 120 mil', alertas: 1, risco: 'Médio'   },
]

// ---------------------------------------------------------------------------
// Helpers de cor
// ---------------------------------------------------------------------------
function riscoColor(r: Risco): string {
  if (r === 'Crítico') return 'var(--red)'
  if (r === 'Alto')    return 'var(--orange)'
  return 'var(--amber)'
}
function riscoBg(r: Risco): string {
  if (r === 'Crítico') return 'rgba(239,68,68,0.10)'
  if (r === 'Alto')    return 'rgba(242,97,34,0.10)'
  return 'rgba(224,144,31,0.10)'
}
function scoreColor(s: number): string {
  if (s >= 85) return 'var(--red)'
  if (s >= 70) return 'var(--orange)'
  return 'var(--amber)'
}

// ---------------------------------------------------------------------------
// Ícones de vínculo (SVG inline)
// ---------------------------------------------------------------------------
function VinculoIcon({ v }: { v: Vinculo }) {
  const color = 'var(--muted-text)'
  const s = { width: 14, height: 14, flexShrink: 0 as const }
  if (v === 'Titular')
    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={8} r={4}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
  if (v === 'Familiar 2º grau')
    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><circle cx={9} cy={8} r={3}/><circle cx={16} cy={10} r={2.5}/><path d="M2 20c0-3 3-5.5 7-5.5s7 2.5 7 5.5"/><path d="M18 20c0-2 1.8-3.5 3.5-3.5"/></svg>
  if (v === 'Representante')
    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><rect x={2} y={7} width={20} height={14} rx={2}/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={8} r={4}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M20 8l-2 2-1-1"/></svg>
}

// ---------------------------------------------------------------------------
// Avatar placeholder
// ---------------------------------------------------------------------------
function Avatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: 'var(--bg)',
      border: '1px solid var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--muted-text)" strokeWidth={2} strokeLinecap="round">
        <circle cx={12} cy={8} r={4}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function PepSectionV2({ onInvestigate }: PepSectionV2Props) {
  const totalPeps   = 6
  const volumeTotal = 'R$ 2,8 MM'

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '20px 24px 14px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--muted-text)', fontFamily: 'var(--font-body)', lineHeight: 1 }}>
          Pessoas politicamente expostas (PEP)
        </span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)', padding: 0, lineHeight: 0 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/>
          </svg>
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--border-default)', borderRadius: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: 'rgba(242,97,34,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={2} strokeLinecap="round">
              <circle cx={12} cy={8} r={4}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              <path d="M17 13l1.5 1.5L21 12" strokeWidth={2.5}/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', marginBottom: 2 }}>PEPs em ação</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1 }}>{totalPeps}</div>
            <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', marginTop: 2 }}>ativos no momento</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--border-default)', borderRadius: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: 'rgba(242,97,34,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={2} strokeLinecap="round">
              <path d="M12 2C8 2 4 5 4 9c0 5.25 8 13 8 13s8-7.75 8-13c0-4-4-7-8-7z"/>
              <circle cx={12} cy={9} r={2.5}/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', marginBottom: 2 }}>Volume total</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--orange)', fontFamily: 'var(--font-head)', lineHeight: 1 }}>{volumeTotal}</div>
            <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', marginTop: 2 }}>movimentado</div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>

        {/* título + timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border-default)' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>TOP 5 PEPs críticos</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--muted-text)" strokeWidth={2} strokeLinecap="round">
              <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>Atualizado às 15:44</span>
          </div>
        </div>

        {/* header colunas */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 0.8fr 1fr 0.8fr 0.8fr auto', gap: 8, padding: '10px 14px 12px', borderBottom: '1px solid var(--line)', background: 'transparent' }}>
          {['PEP', 'VÍNCULO', 'SCORE', 'VOLUME', 'ALERTAS', 'RISCO', 'AÇÃO'].map((h, i) => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontFamily: 'var(--font-body)' }}>{h}</span>
              {i >= 2 && i <= 4 && (
                <svg width={8} height={8} viewBox="0 0 10 14" fill="var(--muted-text)">
                  <path d="M5 0L9 5H1L5 0Z"/><path d="M5 14L1 9H9L5 14Z"/>
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* linhas */}
        {ROWS.map((row, i) => (
          <div
            key={row.id}
            onClick={() => onInvestigate?.(row.id)}
            style={{
              display: 'grid',
              gridTemplateColumns: '2.2fr 1.4fr 0.8fr 1fr 0.8fr 0.8fr auto',
              gap: 8, padding: '14px 14px',
              borderBottom: i < ROWS.length - 1 ? '1px solid var(--border-faint, #f4f4f4)' : 'none',
              alignItems: 'center',
              cursor: onInvestigate ? 'pointer' : 'default',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* PEP: dot + avatar + nome + id */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: riscoColor(row.risco), flexShrink: 0 }} />
              <Avatar />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-body)', lineHeight: 1.2 }}>{row.nome}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>{row.id}</div>
              </div>
            </div>

            {/* Vínculo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <VinculoIcon v={row.vinculo} />
              <span style={{ fontSize: 11, color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>{row.vinculo}</span>
            </div>

            {/* Score */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 24, borderRadius: 6,
              background: `${scoreColor(row.score)}18`,
              border: `1px solid ${scoreColor(row.score)}40`,
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: scoreColor(row.score), fontFamily: 'var(--font-head)' }}>{row.score}</span>
            </div>

            {/* Volume */}
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>{row.volume}</span>

            {/* Alertas */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={row.alertas >= 3 ? 'var(--red)' : 'var(--orange)'} strokeWidth={2} strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: row.alertas >= 3 ? 'var(--red)' : 'var(--orange)', fontFamily: 'var(--font-body)' }}>{row.alertas}</span>
            </div>

            {/* Risco badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '4px 10px', borderRadius: 6,
              background: riscoBg(row.risco),
              border: `1px solid ${riscoColor(row.risco)}40`,
              width: 'fit-content',
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: riscoColor(row.risco), fontFamily: 'var(--font-body)' }}>{row.risco}</span>
            </div>

            {/* Ação */}
            <button
              onClick={(e) => { e.stopPropagation(); onInvestigate?.(row.id) }}
              style={{
                fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                ...(row.risco === 'Crítico'
                  ? { background: 'var(--orange)', border: 'none', color: '#fff' }
                  : row.risco === 'Alto'
                  ? { background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)' }
                  : { background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted-text)' }),
              }}
            >
              Investigar
            </button>
          </div>
        ))}

        {/* ver todos */}
        <div style={{ padding: '10px 14px', textAlign: 'center', borderTop: '1px solid var(--border-default)' }}>
          <button
            onClick={() => onInvestigate?.('all-peps')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)' }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)' }}>Ver todos os PEPs</span>
            <span style={{ color: 'var(--orange)', fontSize: 13 }}>›</span>
          </button>
        </div>
      </div>

    </div>
  )
}

export default PepSectionV2
