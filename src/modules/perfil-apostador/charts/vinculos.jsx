import { C } from './colors.js'

export function VinculosGraph({ dados }) {
  const find = (id) => dados.nos.find((n) => n.id === id)
  const principalId = dados.nos.find((n) => n.principal)?.id
  return (
    <div className="body">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {dados.arestas.map(([a, b], i) => {
          const na = find(a), nb = find(b)
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#F0C9B6" strokeWidth="0.7"
            strokeDasharray={a !== principalId ? '2 2' : undefined} />
        })}
        {dados.nos.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.principal ? 8 : 5.5} fill={n.principal ? C.orange : C.orangeSoft}
              stroke={n.principal ? 'none' : C.orange} strokeWidth="0.6" />
            <text x={n.x} y={n.y + (n.principal ? 1.2 : 1)} textAnchor="middle"
              fill={n.principal ? '#fff' : C.orange} fontSize={n.principal ? 4 : 3} fontWeight="700">{n.id}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function VinculosTable({ dados }) {
  return (
    <div className="body" style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead><tr>
          {['Conta', 'Vínculo', 'Força'].map((h) => (
            <th key={h} style={{ background: C.orange, color: '#fff', textAlign: 'left', padding: '6px 8px', fontSize: 11 }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {dados.linhas.map((r) => (
            <tr key={r.conta}>
              <td style={{ padding: '6px 8px', borderTop: '1px solid #ECEEF2', fontWeight: 700 }}>{r.conta}</td>
              <td style={{ padding: '6px 8px', borderTop: '1px solid #ECEEF2', color: C.muted }}>{r.vinculo}</td>
              <td style={{ padding: '6px 8px', borderTop: '1px solid #ECEEF2', fontWeight: 700,
                color: r.forca === 'Alta' ? C.red : r.forca === 'Média' ? C.amber : C.muted }}>{r.forca}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
