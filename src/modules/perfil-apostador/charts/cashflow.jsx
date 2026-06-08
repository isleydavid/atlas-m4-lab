import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { C } from './colors.js'

export function CashflowStacked({ dados }) {
  const cores = [C.orange, '#F4C6AE', C.amber, '#9AA3B2']
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados.linhas} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
          <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {dados.series.map((s, i) => (
            <Bar key={s.chave} dataKey={s.chave} name={s.nome} stackId="a"
              fill={cores[i] || C.orange} radius={i === 0 ? [4, 4, 0, 0] : undefined} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CashflowNet({ dados }) {
  let acc = 0
  const data = dados.linhas.map((d) => { acc += d.dep - d.saq; return { dia: d.dia, net: +acc.toFixed(1) } })
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
          <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <Line type="monotone" dataKey="net" name="Saldo líquido" stroke={C.orange} strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
