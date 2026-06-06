import { C, vinculos } from '../data/mock.js'

const find = (id) => vinculos.nodes.find((n) => n.id === id)

/* Grafo de vínculos (SVG responsivo) */
export function VinculosGraph() {
  return (
    <div className="body">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {vinculos.edges.map(([a, b], i) => {
          const na = find(a), nb = find(b)
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#F0C9B6" strokeWidth="0.7"
            strokeDasharray={a !== 'EP' ? '2 2' : undefined} />
        })}
        {vinculos.nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.main ? 8 : 5.5} fill={n.main ? C.orange : C.orangeSoft}
              stroke={n.main ? 'none' : C.orange} strokeWidth="0.6" />
            <text x={n.x} y={n.y + (n.main ? 1.2 : 1)} textAnchor="middle"
              fill={n.main ? '#fff' : C.orange} fontSize={n.main ? 4 : 3} fontWeight="700">{n.id}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* Tabela de conexões (evidência) */
export function VinculosTable() {
  return (
    <div className="body" style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead><tr>
          {['Conta', 'Vínculo', 'Força'].map((h) => (
            <th key={h} style={{ background: C.orange, color: '#fff', textAlign: 'left', padding: '6px 8px', fontSize: 11 }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {vinculos.table.map((r) => (
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
