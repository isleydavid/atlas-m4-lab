import { C, interventions } from '../data/mock.js'

const dotColor = { g: C.green, a: C.amber, m: C.muted, r: C.red }

/* Linha do tempo vertical */
export function InterventionTimeline() {
  return (
    <div className="body" style={{ overflow: 'auto' }}>
      {interventions.map((it) => (
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

/* Status board (estado atual) */
export function InterventionBoard() {
  const items = [
    { l: 'JR: enviado', c: 'g' }, { l: 'SLA: 48h', c: 'a' }, { l: 'SIGAP: off', c: 'r' },
  ]
  return (
    <div className="body" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="chiprow">
        {items.map((i) => <span className="sgc" key={i.l}><span className={`cd ${i.c}`} />{i.l}</span>)}
      </div>
    </div>
  )
}
