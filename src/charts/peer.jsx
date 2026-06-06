import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend,
} from 'recharts'
import { C, peerBars, peerRadar } from '../data/mock.js'

const maxX = Math.max(...peerBars.map((p) => p.x))

/* Barras vs. mediana (x vezes) */
export function PeerBars() {
  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
      {peerBars.map((p) => (
        <div key={p.metrica}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span>{p.metrica}</span><b>{p.x}×</b>
          </div>
          <div style={{ height: 9, borderRadius: 6, background: '#EFF1F4', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(p.x / maxX) * 100}%`, borderRadius: 6, background: `linear-gradient(90deg,${C.orange},${C.orange2})` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* Percentil na distribuição (curva custom) */
export function PeerPercentile() {
  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column' }}>
      <svg width="100%" height="100%" viewBox="0 0 200 110" preserveAspectRatio="none" style={{ flex: 1 }}>
        <path d="M0,100 C50,100 60,22 100,22 C140,22 150,100 200,100 Z" fill="#FDEDE6" stroke="#F0C9B6" />
        <line x1="172" y1="14" x2="172" y2="105" stroke={C.orange} strokeWidth="2" />
        <circle cx="172" cy="52" r="3.5" fill={C.orange} />
        <text x="150" y="11" fontSize="9" fill={C.orange} fontWeight="700">P96</text>
      </svg>
      <div className="cap">Velocidade de depósito no <b>top 4%</b> dos pares.</div>
    </div>
  )
}

/* Radar jogador vs cohort */
export function PeerRadar() {
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={peerRadar} outerRadius="70%">
          <PolarGrid stroke="#E6E8EC" />
          <PolarAngleAxis dataKey="eixo" tick={{ fontSize: 10, fill: C.muted }} />
          <Radar name="Cohort" dataKey="cohort" stroke="#9AA3B2" fill="#9AA3B2" fillOpacity={0.15} />
          <Radar name="Apostador" dataKey="jogador" stroke={C.orange} fill={C.orange} fillOpacity={0.25} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
