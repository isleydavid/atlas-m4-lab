import { C } from './colors.js'

const dotColor = { g: C.green, a: C.amber, m: C.muted, r: C.red }

export function InterventionTimeline({ dados }) {
  return (
    <div className="body" style={{ overflow: 'auto' }}>
      {dados.itens.map((it) => (
        <div key={it.titulo} style={{ display: 'flex', gap: 10, marginBottom: 11 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 3, flex: '0 0 auto', background: dotColor[it.cor] }} />
          <div style={{ fontSize: 12, fontWeight: 700 }}>{it.titulo}
            <small style={{ display: 'block', color: C.muted, fontWeight: 500, fontSize: 11, marginTop: 1 }}>{it.sub}</small>
          </div>
        </div>
      ))}
    </div>
  )
}

export function InterventionBoard({ dados }) {
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
