import { C } from './colors.js'

export function IdentityCard({ dados }) {
  return (
    <div className="body">
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 13 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: C.orangeSoft, color: C.orange, display: 'grid', placeItems: 'center', fontWeight: 800 }}>{dados.iniciais}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{dados.nome}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{dados.email}</div>
        </div>
      </div>
      <div className="chiprow" style={{ marginBottom: 12 }}>
        <span className="badge b-kyc">⚑ KYC Pendente</span>
        <span className="badge b-sig">⛔ SIGAP: a verificar</span>
        <span className="badge b-al">▲ {dados.alertas} alertas</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px 14px', paddingTop: 12, borderTop: '1px solid var(--line)' }}>
        {dados.campos.map(([k, v]) => (
          <div key={k}><div style={{ fontSize: 10.5, color: C.muted }}>{k}</div><div style={{ fontSize: 12.5, fontWeight: 700 }}>{v}</div></div>
        ))}
      </div>
    </div>
  )
}

export function Behavioral({ dados }) {
  const tr = { up: { t: '▲', c: C.red }, down: { t: '▼', c: C.green }, flat: { t: '▬', c: C.muted } }
  return (
    <div className="body">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
        {dados.itens.map((b) => (
          <div key={b.k} style={{ border: '1px solid var(--line)', borderRadius: 11, padding: 10 }}>
            <div style={{ fontSize: 10.5, color: C.muted }}>{b.k}</div>
            <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              {b.v}{b.tendencia && <span style={{ fontSize: 11, color: tr[b.tendencia].c }}>{tr[b.tendencia].t}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ActionCard({ dados }) {
  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
      {dados.acoes.map((a) => (
        <button key={a.titulo} style={{ textAlign: 'left', background: '#fff', border: '1px solid var(--orange-line)', borderRadius: 10, padding: '10px 12px', cursor: 'pointer' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.titulo}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{a.sub}</div>
        </button>
      ))}
    </div>
  )
}

export function AlertsFeed({ dados }) {
  return (
    <div className="body" style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {dados.alertas.map((a, i) => (
        <div key={i} style={{ border: '1px solid var(--line)', borderLeft: `3px solid ${C.orange}`, borderRadius: 11, padding: '9px 11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.orange }} />{a.tipo}
            <span style={{ marginLeft: 'auto', color: C.muted, fontSize: 10.5, fontWeight: 600 }}>{a.ago}</span>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{a.cpf}</div>
        </div>
      ))}
    </div>
  )
}

export function Transactions({ dados }) {
  return (
    <div className="body" style={{ overflow: 'auto' }}>
      {dados.transacoes.map((b, i) => (
        <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 11, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700 }}>
            {b.tipo}
            <span style={{ marginLeft: 'auto', fontSize: 9.5, fontWeight: 800, color: C.muted, background: '#F1F2F5', padding: '3px 7px', borderRadius: 6 }}>{b.status}</span>
          </div>
          {b.legs.map((l, j) => (
            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.muted, marginTop: 5 }}>
              <span>{l.ev}</span><b style={{ color: C.ink }}>{l.odd}</b>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
