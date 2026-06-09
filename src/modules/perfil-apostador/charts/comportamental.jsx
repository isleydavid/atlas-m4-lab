// Comportamental — layout oficial Atlas: ícones + toggle 30D/90D/Histórico + setas do lab
import { useState } from 'react'

const PERIODOS = ['30D', '90D', 'Histórico']

const dummy = {
  itens: [
    { k: 'Depósitos',     icone: 'dep',  v: 'Alto',      detalhe: 'R$ 1.234,00', tendencia: 'up'   },
    { k: 'Saques',        icone: 'saq',  v: 'Baixo',     detalhe: 'R$ 0,00',     tendencia: 'flat' },
    { k: 'Ticket Médio',  icone: 'tick', v: 'R$ 3,73',   detalhe: 'vs R$ 2,10',  tendencia: 'up'   },
    { k: 'Frequência',    icone: 'freq', v: 'Alta',      detalhe: '14 sessões',   tendencia: 'up'   },
    { k: 'Ganhos',        icone: 'gan',  v: 'Baixo',     detalhe: '−R$ 230,00',  tendencia: 'down' },
    { k: 'Tipo de Aposta',icone: 'tipo', v: 'Múltipla',  detalhe: '87% múltipla', tendencia: null   },
  ],
}

const ICONS = {
  dep: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v14"/><path d="M5 17l7 7 7-7"/><path d="M3 21h18"/>
    </svg>
  ),
  saq: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V7"/><path d="M5 7l7-7 7 7"/><path d="M3 21h18"/>
    </svg>
  ),
  tick: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  freq: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>
    </svg>
  ),
  gan: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  tipo: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="5" rx="2"/><rect x="2" y="10" width="20" height="5" rx="2"/><rect x="2" y="17" width="20" height="5" rx="2"/>
    </svg>
  ),
}

const TR = {
  up:   { label: '▲', color: 'var(--red)'   },
  down: { label: '▼', color: 'var(--green)' },
  flat: { label: '▬', color: 'var(--muted)' },
}

export default function Comportamental({ dados = dummy }) {
  const [periodo, setPeriodo] = useState('30D')
  const d = dados

  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>

      {/* toggle de período */}
      <div style={{ display: 'flex', background: '#F1F2F4', borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
        {PERIODOS.map((p) => (
          <button key={p} onClick={() => setPeriodo(p)} style={{
            flex: 1, padding: '5px 6px', fontSize: 11, fontWeight: periodo === p ? 700 : 600,
            color: periodo === p ? '#fff' : 'var(--muted)',
            background: periodo === p ? 'var(--orange)' : 'transparent',
            border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
          }}>{p}</button>
        ))}
      </div>

      {/* grid de métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, flex: 1 }}>
        {d.itens.map((item) => {
          const tr = item.tendencia ? TR[item.tendencia] : null
          return (
            <div key={item.k} style={{ border: '1px solid var(--line)', borderRadius: 11, padding: '9px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>

              {/* ícone */}
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--orange-soft)', color: 'var(--orange)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {ICONS[item.icone]}
              </div>

              {/* label */}
              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.2px', lineHeight: 1.2, marginTop: 2 }}>{item.k}</div>

              {/* valor + seta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{item.v}</span>
                {tr && <span style={{ fontSize: 10, fontWeight: 700, color: tr.color }}>{tr.label}</span>}
              </div>

              {/* detalhe */}
              {item.detalhe && (
                <div style={{ fontSize: 9.5, color: 'var(--muted-2)', lineHeight: 1.3 }}>{item.detalhe}</div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
