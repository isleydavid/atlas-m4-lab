import {
  ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts'
import { C, pldHistogram, pldScatter, pldHeatmap } from '../data/mock.js'

/* Histograma de valores de depósito + limite */
export function PldHistogram() {
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pldHistogram} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
          <XAxis dataKey="faixa" tick={{ fontSize: 9, fill: C.muted }} interval={0} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <ReferenceLine x="190-200" stroke={C.red} strokeDasharray="5 4" label={{ value: 'Limite', fontSize: 9, fill: C.red, position: 'top' }} />
          <Bar dataKey="n" radius={[4, 4, 0, 0]}>
            {pldHistogram.map((d, i) => (
              <Cell key={i} fill={d.n >= 6 ? C.orange : '#F4C6AE'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Dispersão de depósitos no tempo + limite */
export function PldScatter() {
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" />
          <XAxis dataKey="t" name="ordem" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis dataKey="v" name="valor" tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <ReferenceLine y={200} stroke={C.red} strokeDasharray="5 4" label={{ value: 'Limite de reporte', fontSize: 9, fill: C.red, position: 'insideTopRight' }} />
          <Scatter data={pldScatter} fill={C.orange} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Heatmap dia x hora (grid custom) */
export function PldHeatmap() {
  const max = Math.max(...pldHeatmap.flat())
  const shade = (v) => {
    if (v === 0) return '#FDEDE6'
    const t = v / max
    return `rgba(232,97,44,${0.25 + t * 0.75})`
  }
  return (
    <div className="body" style={{ display: 'grid', placeItems: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${pldHeatmap[0].length},1fr)`, gap: 3, width: '92%' }}>
        {pldHeatmap.flat().map((v, i) => (
          <div key={i} title={String(v)} style={{ aspectRatio: '1.6', borderRadius: 4, background: shade(v) }} />
        ))}
      </div>
    </div>
  )
}
