"use client"

import React from 'react'

type FlagType = 'Saque sem jogo' | 'Pass-through' | 'Múltiplos depósitos' | 'Estruturação' | 'Movimentação atípica' | 'Saque rápido'

interface FlagRow {
  initials: string
  nome:     string
  valor:    string
  tempo:    string
  flag:     FlagType
  score:    number
}

const ROWS: FlagRow[] = [
  { initials: 'DF', nome: 'D. FERREIRA', valor: 'R$ 185 mil', tempo: 'há 2h',    flag: 'Saque sem jogo',      score: 98 },
  { initials: 'CR', nome: 'C. ROCHA',    valor: 'R$ 132 mil', tempo: 'há 5h',    flag: 'Pass-through',         score: 94 },
  { initials: 'MD', nome: 'M. DIAS',     valor: 'R$ 98 mil',  tempo: 'há 8h',    flag: 'Múltiplos depósitos',  score: 91 },
  { initials: 'PS', nome: 'P. SANTOS',   valor: 'R$ 76 mil',  tempo: 'há 11h',   flag: 'Estruturação',         score: 89 },
  { initials: 'LA', nome: 'L. ALMEIDA',  valor: 'R$ 64 mil',  tempo: 'há 1 dia', flag: 'Movimentação atípica', score: 84 },
  { initials: 'RC', nome: 'R. COSTA',    valor: 'R$ 58 mil',  tempo: 'há 1 dia', flag: 'Saque rápido',         score: 82 },
]

const TOTAL    = 27
const DELTA    = '+4 no período'
const RESTANTE = TOTAL - ROWS.length

function scoreColor(s: number) {
  if (s >= 95) return 'var(--red)'
  if (s >= 85) return 'var(--orange)'
  return 'var(--amber)'
}
function scoreBg(s: number) {
  if (s >= 95) return 'var(--red-soft)'
  if (s >= 85) return 'var(--orange-soft)'
  return 'var(--amber-soft)'
}

function FlagIcon({ flag, color }: { flag: FlagType; color: string }) {
  const s = { width: 14, height: 14, flexShrink: 0 as const }
  const p = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const }

  if (flag === 'Saque sem jogo')
    return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M12 19V5m0 0l-4 4m4-4l4 4"/><path d="M5 19h14"/></svg>
  if (flag === 'Pass-through')
    return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M2 7h20M2 12h20M2 17h20"/><path d="M5 4l-3 3 3 3"/><path d="M19 20l3-3-3-3"/></svg>
  if (flag === 'Múltiplos depósitos')
    return <svg style={s} viewBox="0 0 24 24" {...p}><circle cx={9} cy={7} r={3}/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><circle cx={17} cy={9} r={2.5}/><path d="M17 14c2 0 4 1.3 4 3.5"/></svg>
  if (flag === 'Estruturação')
    return <svg style={s} viewBox="0 0 24 24" {...p}><rect x={2} y={3} width={20} height={5} rx={1}/><rect x={2} y={10} width={14} height={5} rx={1}/><rect x={2} y={17} width={9} height={5} rx={1}/></svg>
  if (flag === 'Movimentação atípica')
    return <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="2 12 6 6 10 16 14 9 18 13 22 8"/></svg>
  return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M7 16l-4-4 4-4"/><path d="M17 8l4 4-4 4"/><line x1={3} y1={12} x2={21} y2={12}/></svg>
}

function ApostadorCard({ row, onInvestigate }: { row: FlagRow; onInvestigate?: (nome: string) => void }) {
  const sc = scoreColor(row.score)

  return (
    <div
      onClick={() => onInvestigate?.(row.nome)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 12px 12px 14px',
        border: '1px solid var(--line)',
        borderLeft: `3px solid ${sc}`,
        borderRadius: 10,
        cursor: onInvestigate ? 'pointer' : 'default',
        background: 'var(--card)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--card)')}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: scoreBg(row.score),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: sc, fontFamily: 'var(--font-head)',
      }}>
        {row.initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1.2 }}>
          {row.nome}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--muted-text)' }}>{row.valor}</span>
          <span style={{ color: 'var(--line)' }}>|</span>
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
            style={{ stroke: 'var(--muted-2)' }} strokeWidth={2} strokeLinecap="round">
            <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize: 11, color: 'var(--muted-text)' }}>{row.tempo}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
          <FlagIcon flag={row.flag} color={sc} />
          <span style={{ fontSize: 11, color: sc, fontWeight: 600 }}>{row.flag}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: 'var(--muted-2)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Score AML
        </span>
        <div style={{
          width: 42, height: 36, borderRadius: 8,
          background: scoreBg(row.score),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: sc, fontFamily: 'var(--font-head)' }}>
            {row.score}
          </span>
        </div>
      </div>

      <button
        onClick={e => e.stopPropagation()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', color: 'var(--muted-2)', flexShrink: 0 }}
      >
        ⋮
      </button>
    </div>
  )
}

interface ApostadoresFlagAtivoProps {
  onInvestigate?: (nome: string) => void
  onVerTodos?:    () => void
}

export function ApostadoresFlagAtivo({ onInvestigate, onVerTodos }: ApostadoresFlagAtivoProps) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 12, padding: 20,
      fontFamily: 'var(--font-body)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: 'var(--orange-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
              style={{ stroke: 'var(--orange)' }} strokeWidth={2} strokeLinecap="round">
              <circle cx={10} cy={7} r={4}/><path d="M2 21c0-4 3.6-7 8-7"/><path d="M18 14l2-2 2 2"/><path d="M20 12v6"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>
                Apostadores com flag ativo
              </span>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                style={{ stroke: 'var(--muted-2)' }} strokeWidth={2} strokeLinecap="round">
                <circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/>
              </svg>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-text)', marginTop: 2 }}>Monitorados em risco AML</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--orange)', fontFamily: 'var(--font-head)', lineHeight: 1 }}>
            {TOTAL}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 2 }}>
            <span style={{ color: 'var(--orange)', fontSize: 11 }}>▲</span>
            <span style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 600 }}>{DELTA}</span>
          </div>
        </div>
      </div>

      {/* Grid de cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ROWS.map((row, i) => (
          <ApostadorCard key={i} row={row} onInvestigate={onInvestigate} />
        ))}
      </div>

      {/* Rodapé */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12, borderTop: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
            style={{ stroke: 'var(--muted-2)' }} strokeWidth={2} strokeLinecap="round">
            <circle cx={9} cy={7} r={3}/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><circle cx={17} cy={9} r={2.5}/><path d="M17 14c2 0 4 1.3 4 3.5"/>
          </svg>
          <span style={{ fontSize: 11, color: 'var(--muted-text)' }}>+{RESTANTE} apostadores monitorados</span>
        </div>
        <button
          onClick={onVerTodos}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)', fontFamily: 'var(--font-body)' }}>
            Ver todos os {TOTAL}
          </span>
          <span style={{ color: 'var(--orange)', fontSize: 16 }}>→</span>
        </button>
      </div>

    </div>
  )
}

export default ApostadoresFlagAtivo
