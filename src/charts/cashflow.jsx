import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { C, cashflow } from '../data/mock.js'

/* Barras empilhadas dep/saque por dia */
export function CashflowStacked() {
  return (
    <div className="body">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cashflow} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
          <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="dep" name="Depósitos" stackId="a" fill={C.orange} radius={[4, 4, 0, 0]} />
          <Bar dataKey="saq" name="Saques" stackId="a" fill="#F4C6AE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Linha de saldo líquido acumulado */
export function CashflowNet() {
  let acc = 0
  const data = cashflow.map((d) => { acc += d.dep - d.saq; return { dia: d.dia, net: +acc.toFixed(1) } })
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
