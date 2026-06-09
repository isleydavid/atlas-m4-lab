import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'
import { C } from './colors.js'

export function RgSemaforo({ dados }) {
  return (
    <div className="body" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="chiprow">
        {dados.sinais.map((s) => (
          <span className="sgc" key={s.nome}><span className={`cd ${s.nivel}`} />{s.nome}</span>
        ))}
      </div>
    </div>
  )
}

export function RgRadar({ dados }) {
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={dados.eixos} outerRadius="72%">
          <PolarGrid stroke="#E6E8EC" />
          <PolarAngleAxis dataKey="eixo" tick={{ fontSize: 10, fill: C.muted }} />
          <Radar dataKey="v" stroke={C.orange} fill={C.orange} fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RgGauge({ dados }) {
  const v = dados.valor
  return (
    <div className="body" style={{ display: 'grid', placeItems: 'center' }}>
      <div style={{
        width: 110, height: 110, borderRadius: '50%',
        background: `conic-gradient(${C.amber} 0 ${v}%, #EFF1F4 ${v}% 100%)`,
        display: 'grid', placeItems: 'center',
      }}>
        <div style={{ width: 78, height: 78, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: 20, fontFamily: 'var(--font-mono)' }}>{v}</div><div style={{ fontSize: 10, color: C.muted }}>{dados.rotulo}</div></div>
        </div>
      </div>
    </div>
  )
}
