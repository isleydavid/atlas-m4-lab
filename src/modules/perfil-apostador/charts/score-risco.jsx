// ScoreRisco — donut oficial + 3 dimensões + sinais + toggle donut/linha
// Tokens: var(--orange #f26122), var(--font-head Exo 2), var(--font-mono)
import { useState } from 'react'

const dummy = {
  valor: 91, max: 100, faixa: 'RISCO BAIXO', delta: '▲ +6 em 7 dias',
  serie: [70, 74, 78, 83, 86, 88, 91],
  dimensoes: [
    { nome: 'Financeiro',        valor: 100 },
    { nome: 'PLD / AML',         valor: 100 },
    { nome: 'Jogo Responsável',  valor: 35  },
  ],
  sinais: [
    { tipo: 'warn', titulo: 'Alto volume financeiro',   desc: 'O apostador apresenta movimentação elevada de depósitos ou saques na janela atual.' },
    { tipo: 'link', titulo: 'Ganhos elevados em cassino', desc: 'O perfil dominante em cassino registrou ganhos acima do benchmark da marca.' },
  ],
}

const R = 56, CIRC = 2 * Math.PI * R

function Donut({ valor, max, faixa, delta }) {
  const offset = CIRC * (1 - valor / max)
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ position: 'relative', width: 160, height: 160, margin: '4px auto 0' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%,#FBE6DC 0%,rgba(251,230,220,0) 62%)' }} />
        <svg width="160" height="160" viewBox="0 0 160 160">
          <defs><linearGradient id="ring-sr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F79A6E" /><stop offset="1" stopColor="#EE4E1E" /></linearGradient></defs>
          <circle cx="80" cy="80" r={R} fill="none" stroke="#F1E4DD" strokeWidth="13" />
          <circle cx="80" cy="80" r={R} fill="none" stroke="url(#ring-sr)" strokeWidth="13" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={offset} transform="rotate(-90 80 80)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--orange)', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>{valor}</div>
            <span style={{ marginTop: 6, display: 'inline-block', fontSize: 9.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '2px 8px', borderRadius: 999 }}>{faixa}</span>
          </div>
        </div>
      </div>
      {delta && (
        <div style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: 'var(--amber)', marginTop: 4 }}>{delta}</div>
      )}
    </div>
  )
}

function Linha({ serie }) {
  const w = 240, h = 110
  const max = Math.max(...serie), min = Math.min(...serie)
  const pts = serie.map((v, i) =>
    `${(i / (serie.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 20) - 10}`
  ).join(' ')
  return (
    <svg width="100%" height="110" viewBox={`0 0 ${w} ${h}`} style={{ margin: '4px 0', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SigIcon = ({ tipo }) => tipo === 'warn'
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}><path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".6" fill="var(--orange)" /></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.2" strokeLinecap="round" style={{ flex: '0 0 auto' }}><path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1" /><path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1" /></svg>

export default function ScoreRisco({ dados = dummy }) {
  const d = dados
  const [modo, setModo] = useState('donut')

  const tgStyle = (on) => ({
    width: 30, height: 26, borderRadius: 8, display: 'grid', placeItems: 'center', cursor: 'pointer',
    border: `1px solid ${on ? 'var(--orange)' : 'var(--line)'}`,
    background: on ? 'var(--orange)' : '#fff',
    color: on ? '#fff' : 'var(--muted)',
  })

  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>

      {/* toggle donut / linha */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexShrink: 0 }}>
        <div style={tgStyle(modo === 'donut')} onClick={() => setModo('donut')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a9 9 0 1 0 9 9h-9z" /></svg>
        </div>
        <div style={tgStyle(modo === 'linha')} onClick={() => setModo('linha')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" /></svg>
        </div>
      </div>

      {/* visualização */}
      {modo === 'donut'
        ? <Donut valor={d.valor} max={d.max} faixa={d.faixa} delta={d.delta} />
        : <Linha serie={d.serie} />
      }

      {/* dimensões */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flexShrink: 0 }}>
        {d.dimensoes.map((dim) => (
          <div key={dim.nome}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: 'var(--muted)' }}>{dim.nome}</span>
              <span style={{ fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{dim.valor}</span>
            </div>
            <div style={{ height: 7, borderRadius: 5, background: '#EFF1F4', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${dim.valor}%`, borderRadius: 5, background: 'linear-gradient(90deg,#F58A5B,#EE4E1E)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* sinais */}
      {d.sinais.map((s, i) => (
        <div key={i} style={{ borderTop: '1px solid var(--line)', paddingTop: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <SigIcon tipo={s.tipo} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>{s.titulo}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>{s.desc}</div>
            </div>
          </div>
        </div>
      ))}

    </div>
  )
}
