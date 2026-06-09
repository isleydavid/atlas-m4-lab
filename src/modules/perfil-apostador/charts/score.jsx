import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceArea,
} from 'recharts'
import { C } from './colors.js'

export function RiskVerdict({ dados }) {
  const pct = dados.valor
  return (
    <div className="body" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{
        width: 120, height: 120, borderRadius: '50%', flex: '0 0 auto',
        background: `conic-gradient(${C.orange} 0 ${pct}%, #EFE2DB ${pct}% 100%)`,
        display: 'grid', placeItems: 'center',
      }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div><div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>{pct}</div><div style={{ fontSize: 10, color: C.muted }}>de 100</div></div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: C.orange, padding: '4px 11px', borderRadius: 999 }}>{dados.rotulo}</span>
        <div style={{ fontSize: 12, color: C.amber, fontWeight: 700, marginTop: 10 }}>▲ {dados.delta}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Subiu de "Baixo" para "Médio-Alto" esta semana. {dados.alertas} alertas ativos.</div>
      </div>
    </div>
  )
}

export function ScoreFactors({ dados }) {
  const maxF = Math.max(...dados.fatores.map((f) => f.pts))
  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
      {dados.fatores.map((f) => (
        <div key={f.nome}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <b style={{ fontWeight: 700 }}>{f.nome}</b><span style={{ color: C.muted, fontWeight: 700 }}>+{f.pts} pts</span>
          </div>
          <div style={{ height: 9, borderRadius: 6, background: '#EFF1F4', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(f.pts / maxF) * 100}%`, borderRadius: 6, background: `linear-gradient(90deg,${C.orange},${C.orange2})` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ScoreWaterfall({ dados }) {
  let acc = 0
  const steps = [{ nome: 'Base', pts: dados.base, baseStep: true }, ...dados.fatores]
  const total = dados.base + dados.fatores.reduce((s, f) => s + f.pts, 0)
  const data = steps.map((s) => {
    const start = acc; acc += s.pts
    return { nome: s.baseStep ? 'Base' : s.nome.split(' ')[0], start, val: s.pts }
  })
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={[...data, { nome: 'Score', start: 0, val: total }]} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F4" vertical={false} />
          <XAxis dataKey="nome" tick={{ fontSize: 10, fill: C.muted }} interval={0} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <Area type="step" dataKey="start" stackId="a" stroke="none" fill="transparent" />
          <Area type="step" dataKey="val" stackId="a" stroke={C.orange} fill={C.orange} fillOpacity={0.85} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ScoreEvolution({ dados }) {
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dados.linhas} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
          <defs><linearGradient id="sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.orange} stopOpacity={0.25} /><stop offset="1" stopColor={C.orange} stopOpacity={0} /></linearGradient></defs>
          <ReferenceArea y1={70} y2={100} fill="#FBE7E7" fillOpacity={0.7} />
          <ReferenceArea y1={45} y2={70} fill="#FBF0DD" fillOpacity={0.7} />
          <ReferenceArea y1={0} y2={45} fill="#E7F4EC" fillOpacity={0.7} />
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
          <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <Area type="monotone" dataKey="risco" stroke={C.orange} strokeWidth={3} fill="url(#sc)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ScoreMultiLine({ dados }) {
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados.linhas} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
          <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <Line type="monotone" dataKey="risco" stroke={C.orange} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="pld" stroke={C.amber} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="jr" stroke="#9AA3B2" strokeWidth={2} strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ScoreSparkline({ dados }) {
  return (
    <div className="body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{dados.valor}</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados.linhas}><Line type="monotone" dataKey="risco" stroke={C.orange} strokeWidth={2.5} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontSize: 11, color: C.amber, fontWeight: 700, flexShrink: 0 }}>▲ {dados.delta}</div>
      </div>
    </div>
  )
}

export function DimensionsBars({ dados }) {
  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
      {dados.dimensoes.map((d) => (
        <div key={d.nome}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 5 }}><span>{d.nome}</span><span>{d.valor}</span></div>
          <div style={{ height: 8, borderRadius: 5, background: '#EFF1F4', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${d.valor}%`, borderRadius: 5, background: d.cor }} />
          </div>
        </div>
      ))}
    </div>
  )
}
