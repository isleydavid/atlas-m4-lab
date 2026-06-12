"use client"
import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea, ReferenceLine, Cell,
} from 'recharts'

// ---------------------------------------------------------------------------
// Color constants (from colors.js)
// ---------------------------------------------------------------------------
const CC = {
  orange: '#f26122', orange2: '#F08A52', orangeSoft: '#FDEDE6', line: '#ededed',
  ink: '#3c3f44', muted: '#8A92A3', green: '#2E9E5B', amber: '#E0901F', red: '#E23B3B',
}

// ---------------------------------------------------------------------------
// Shared atoms
// ---------------------------------------------------------------------------
function Panel({ title, sub, children, style }: {
  title: string; sub?: string; children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', overflow: 'hidden', ...style }}>
      <div style={{ padding: '12px 15px 10px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>{title}</div>
        {sub && <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ padding: '12px 15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

function ToggleBar({ opts, val, onChange }: { opts: string[]; val: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', background: '#F1F2F4', borderRadius: 9, padding: 3, gap: 2, marginBottom: 12, flexShrink: 0 }}>
      {opts.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          style={{ flex: 1, padding: '5px 6px', fontSize: 11, fontWeight: val === o ? 700 : 600,
            color: val === o ? '#fff' : 'var(--muted-text)', background: val === o ? 'var(--orange)' : 'transparent',
            border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {o}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Panel 1 — Identity & KYC
// ---------------------------------------------------------------------------
const IDENTITY = {
  iniciais: 'EP', nome: 'EVANDRO PANTA', email: 'ev••••••••••@gmail.com',
  kyc: { texto: 'KYC Verificado', verificado: true },
  documento: '•••.•••.•••-••', marca: 'vaidebet-ngx',
  dataRegistro: '22/05/2026', dataCaso: 'Nenhum caso analisado',
  telefone: '•••••••2338', ultimoAcesso: '05/06 · 17:13',
  id: '6a0fef2e60857e6c1bd388ee', alertas: 15,
  depositos: { valor: 'R$ 0,00', transacoes: '0 transações' },
  saques:    { valor: 'R$ 0,00', transacoes: '0 transações' },
  saldo:     { valor: 'R$ 1,00' },
}

function Eye() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" style={{ flex: '0 0 auto', opacity: .7 }}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

function IField({ label, value, mono, eye }: { label: string; value: string; mono?: boolean; eye?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--muted-text)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 5, fontFamily: mono ? 'var(--font-mono)' : undefined }}>
        {value}{eye && <Eye />}
      </div>
    </div>
  )
}

function IdentityPanel() {
  const d = IDENTITY
  return (
    <Panel title="Identidade & KYC">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13, flex: '0 0 auto', fontFamily: 'var(--font-head)' }}>{d.iniciais}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-head)' }}>{d.nome}</div>
            <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 1 }}>{d.email}</div>
          </div>
          {d.kyc && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--orange-soft)', color: 'var(--orange)', fontWeight: 700, fontSize: 10.5, padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap', flex: '0 0 auto' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 11a7 7 0 0 1 14 0" /><path d="M7.5 12a4.5 4.5 0 0 1 9 0c0 3-1 5-1 6.5" />
                <path d="M12 12v3c0 2-.4 3.5-1.2 5" /><path d="M9.4 19.5c.6-1.4.6-3 .6-4.5" />
              </svg>
              {d.kyc.texto}
            </div>
          )}
        </div>
        <div style={{ height: 1, background: 'var(--line)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 18px' }}>
          <IField label="Documento"        value={d.documento}    mono eye />
          <IField label="Marca"            value={d.marca}                />
          <IField label="Data de Registro" value={d.dataRegistro}         />
          <IField label="Data do Caso"     value={d.dataCaso}             />
          <IField label="Telefone"         value={d.telefone}     mono eye />
          <IField label="Último Acesso"    value={d.ultimoAcesso}         />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 10.5, color: 'var(--muted-text)', flexShrink: 0 }}>ID</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d.id}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" style={{ flex: '0 0 auto' }}>
              <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 600 }}>Risco Atual</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--orange)', color: '#fff', fontWeight: 700, fontSize: 11.5, padding: '6px 13px', borderRadius: 8, fontFamily: 'var(--font-head)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".6" fill="currentColor" />
            </svg>
            {d.alertas} Alertas
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
          {[
            { k: 'Depósitos', val: d.depositos.valor, sub: d.depositos.transacoes },
            { k: 'Saques',    val: d.saques.valor,    sub: d.saques.transacoes    },
            { k: 'Saldo',     val: d.saldo.valor,     sub: null                   },
          ].map(({ k, val, sub }, i) => (
            <div key={k} style={{ padding: '9px 11px', borderLeft: i > 0 ? '1px solid var(--line)' : undefined }}>
              <div style={{ fontSize: 10, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '.3px', fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--orange)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>{val}</div>
              {sub && <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 2 }}>{sub}</div>}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 2 — Score de Risco
// ---------------------------------------------------------------------------
const SCORE_DATA = {
  valor: 91, max: 100, faixa: 'RISCO BAIXO', delta: '▲ +6 em 7 dias',
  serie: [70, 74, 78, 83, 86, 88, 91],
  dimensoes: [
    { nome: 'Financeiro',       valor: 100 },
    { nome: 'PLD / AML',        valor: 100 },
    { nome: 'Jogo Responsável', valor: 35  },
  ],
  sinais: [
    { tipo: 'warn', titulo: 'Alto volume financeiro',    desc: 'O apostador apresenta movimentação elevada de depósitos ou saques na janela atual.' },
    { tipo: 'link', titulo: 'Ganhos elevados em cassino',desc: 'O perfil dominante em cassino registrou ganhos acima do benchmark da marca.' },
  ],
}

const R = 56, CIRC = 2 * Math.PI * R

function ScorePanel() {
  const d = SCORE_DATA
  const [modo, setModo] = useState('donut')
  const offset = CIRC * (1 - d.valor / d.max)
  const maxV = Math.max(...d.serie), minV = Math.min(...d.serie)
  const pts = d.serie.map((v, i) =>
    `${(i / (d.serie.length - 1)) * 240},${110 - ((v - minV) / (maxV - minV || 1)) * 90 - 10}`
  ).join(' ')

  return (
    <Panel title="Score de Risco" sub="Donut + dimensões + sinais">
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
        {[{ id: 'donut', icon: <path d="M12 3a9 9 0 1 0 9 9h-9z" /> }, { id: 'linha', icon: <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" /> }].map(({ id, icon }) => (
          <div key={id} onClick={() => setModo(id)} style={{ width: 30, height: 26, borderRadius: 8, display: 'grid', placeItems: 'center', cursor: 'pointer', border: `1px solid ${modo === id ? 'var(--orange)' : 'var(--line)'}`, background: modo === id ? 'var(--orange)' : '#fff', color: modo === id ? '#fff' : 'var(--muted-text)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
          </div>
        ))}
      </div>
      {modo === 'donut' ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%,#FBE6DC 0%,rgba(251,230,220,0) 62%)' }} />
            <svg width="160" height="160" viewBox="0 0 160 160">
              <defs><linearGradient id="ring-sr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F79A6E" /><stop offset="1" stopColor="#EE4E1E" /></linearGradient></defs>
              <circle cx="80" cy="80" r={R} fill="none" stroke="#F1E4DD" strokeWidth="13" />
              <circle cx="80" cy="80" r={R} fill="none" stroke="url(#ring-sr)" strokeWidth="13" strokeLinecap="round"
                strokeDasharray={CIRC} strokeDashoffset={offset} transform="rotate(-90 80 80)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--orange)', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>{d.valor}</div>
                <span style={{ display: 'inline-block', fontSize: 9.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '2px 8px', borderRadius: 999, marginTop: 6 }}>{d.faixa}</span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--amber)', marginTop: 6 }}>{d.delta}</div>
        </div>
      ) : (
        <svg width="100%" height="110" viewBox="0 0 240 110">
          <polyline points={pts} fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
        {d.dimensoes.map((dim) => (
          <div key={dim.nome}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: 'var(--muted-text)' }}>{dim.nome}</span>
              <span style={{ fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{dim.valor}</span>
            </div>
            <div style={{ height: 7, borderRadius: 5, background: '#EFF1F4', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${dim.valor}%`, borderRadius: 5, background: 'linear-gradient(90deg,#F58A5B,#EE4E1E)' }} />
            </div>
          </div>
        ))}
      </div>
      {d.sinais.map((s, i) => (
        <div key={i} style={{ borderTop: '1px solid var(--line)', paddingTop: 10, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: 1 }}>
              {s.tipo === 'warn' ? <><path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".6" fill="var(--orange)" /></> : <><path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1" /><path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1" /></>}
            </svg>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>{s.titulo}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 3, lineHeight: 1.45 }}>{s.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 3 — Ação Recomendada
// ---------------------------------------------------------------------------
const ACOES = [
  { titulo: 'Enviar comunicação de Jogo Responsável', sub: 'Exigido pela Portaria 1.231/2024 · registra na trilha' },
  { titulo: 'Abrir caso de revisão PLD',              sub: 'Padrão de depósitos sugere estruturação' },
]

function ActionPanel() {
  return (
    <Panel title="Ação Recomendada" sub="O que fazer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ACOES.map((a) => (
          <button key={a.titulo} style={{ textAlign: 'left', background: '#fff', border: '1px solid var(--orange-line)', borderRadius: 10, padding: '10px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{a.titulo}</div>
            <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 4, lineHeight: 1.4 }}>{a.sub}</div>
          </button>
        ))}
      </div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 4 — Por que esse score (XAI)
// ---------------------------------------------------------------------------
const XAI_DATA = {
  base: 8,
  fatores: [
    { nome: 'Aceleração de depósitos vs. baseline', pts: 28 },
    { nome: 'Recuperação de perdas (chasing)',       pts: 21 },
    { nome: 'Conta vinculada (mesmo IP + PIX)',      pts: 15 },
    { nome: 'Apostas em horário atípico',            pts: 9  },
  ],
}

function XaiPanel() {
  const [vista, setVista] = useState('Barras')
  const d = XAI_DATA
  const maxF = Math.max(...d.fatores.map((f) => f.pts))

  let acc = 0
  const waterfallData = [{ nome: 'Base', val: d.base, start: 0 }, ...d.fatores.map((f) => {
    acc += (acc === 0 ? d.base : 0); const start = acc === 0 ? d.base : acc; acc += f.pts
    return { nome: f.nome.split(' ')[0], val: f.pts, start }
  })]

  return (
    <Panel title="Por que esse score" sub="XAI — fatores ponderados">
      <ToggleBar opts={['Barras', 'Waterfall']} val={vista} onChange={setVista} />
      {vista === 'Barras' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {d.fatores.map((f) => (
            <div key={f.nome}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{f.nome}</span>
                <span style={{ color: CC.muted, fontWeight: 700 }}>+{f.pts} pts</span>
              </div>
              <div style={{ height: 9, borderRadius: 6, background: '#EFF1F4', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(f.pts / maxF) * 100}%`, borderRadius: 6, background: `linear-gradient(90deg,${CC.orange},${CC.orange2})` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waterfallData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F4" vertical={false} />
              <XAxis dataKey="nome" tick={{ fontSize: 10, fill: CC.muted }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: CC.muted }} />
              <Tooltip />
              <Area type="step" dataKey="start" stackId="a" stroke="none" fill="transparent" />
              <Area type="step" dataKey="val" stackId="a" stroke={CC.orange} fill={CC.orange} fillOpacity={0.85} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 5 — Evolução do Score
// ---------------------------------------------------------------------------
const TREND_LINES = [
  { dia: '29/05', risco: 22, jr: 18, pld: 30 },
  { dia: '30/05', risco: 24, jr: 20, pld: 32 },
  { dia: '31/05', risco: 28, jr: 26, pld: 35 },
  { dia: '01/06', risco: 41, jr: 34, pld: 40 },
  { dia: '02/06', risco: 52, jr: 48, pld: 45 },
  { dia: '03/06', risco: 60, jr: 56, pld: 52 },
  { dia: '04/06', risco: 64, jr: 61, pld: 58 },
]

function ScoreTrendPanel() {
  const [vista, setVista] = useState('Área')
  return (
    <Panel title="Evolução do Score" sub="Trajetória sobre as faixas de risco">
      <ToggleBar opts={['Área', 'Multi-linha']} val={vista} onChange={setVista} />
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          {vista === 'Área' ? (
            <AreaChart data={TREND_LINES} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <defs><linearGradient id="sc-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={CC.orange} stopOpacity={0.25} /><stop offset="1" stopColor={CC.orange} stopOpacity={0} /></linearGradient></defs>
              <ReferenceArea y1={70} y2={100} fill="#FBE7E7" fillOpacity={0.7} />
              <ReferenceArea y1={45} y2={70} fill="#FBF0DD" fillOpacity={0.7} />
              <ReferenceArea y1={0}  y2={45} fill="#E7F4EC" fillOpacity={0.7} />
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: CC.muted }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: CC.muted }} />
              <Tooltip />
              <Area type="monotone" dataKey="risco" stroke={CC.orange} strokeWidth={3} fill="url(#sc-grad)" />
            </AreaChart>
          ) : (
            <LineChart data={TREND_LINES} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: CC.muted }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: CC.muted }} />
              <Tooltip />
              <Line type="monotone" dataKey="risco" stroke={CC.orange} strokeWidth={2.5} dot={false} name="Risco" />
              <Line type="monotone" dataKey="pld"   stroke={CC.amber}  strokeWidth={2}   dot={false} name="PLD" />
              <Line type="monotone" dataKey="jr"    stroke="#9AA3B2"   strokeWidth={2} strokeDasharray="4 4" dot={false} name="JR" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 6 — Vínculos / Análise de Riscos
// ---------------------------------------------------------------------------
const VINCULOS_DATA = {
  vinculosMesmoIP: true, contasVinculadas: 1,
  conta: { nome: 'ADIEL FERREIRA', marca: 'vaidebet-ngx', cpf: '076.161.543-10', ip: '2804:29b8:517b:87b6:32be:efe9:1c98:f334' },
  score: { valor: 100, max: 100, critico: true },
  sinais: ['Vínculos com mesmo IP'],
  grafo: {
    nos: [
      { id: 'EP',  x: 210, y: 85,  principal: true  },
      { id: 'IP',  x: 95,  y: 38,  principal: false },
      { id: 'A2',  x: 88,  y: 135, principal: false },
      { id: 'A3',  x: 330, y: 40,  principal: false },
      { id: 'PIX', x: 340, y: 135, principal: false },
    ],
    arestas: [['EP','IP'],['EP','A2'],['EP','A3'],['EP','PIX'],['A3','PIX']] as [string,string][],
  },
  descricao: 'Foram identificados 1 alerta(s), com destaque para vínculos com mesmo IP. O último IP observado também foi utilizado por 1 outra(s) conta(s) dentro do recorte selecionado.',
}

function VinculosPanel() {
  const d = VINCULOS_DATA
  const node = (id: string) => d.grafo.nos.find((n) => n.id === id)
  return (
    <Panel title="Vínculos" sub="Análise de Riscos + grafo topológico">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['Vínculos com mesmo IP', d.vinculosMesmoIP ? 'Sim ⚠' : 'Não'], ['Contas Vinculadas', `${d.contasVinculadas} conta`]].map(([k, v]) => (
          <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
            <span style={{ color: 'var(--muted-text)' }}>{k}</span>
            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{v}</span>
          </div>
        ))}
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', flex: '0 0 auto' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.conta.nome}</span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '2px 7px', borderRadius: 6, whiteSpace: 'nowrap' }}>{d.conta.marca}</span>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 7 }}>
            CPF <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)', fontWeight: 600 }}>{d.conta.cpf}</span>
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>Sinais:</div>
        {d.sinais.map((s) => (
          <div key={s} style={{ background: 'var(--red-soft)', color: 'var(--red)', textAlign: 'center', fontSize: 11, padding: '8px 10px', borderRadius: 9, fontWeight: 600 }}>{s}</div>
        ))}
        <div style={{ border: '1px solid var(--line)', borderRadius: 11, padding: '10px 12px', background: 'linear-gradient(180deg,#fff,#FFFBF9)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Topologia dos vínculos</div>
          <svg width="100%" height="130" viewBox="0 0 420 170">
            {d.grafo.arestas.map(([a, b], i) => {
              const na = node(a), nb = node(b)
              if (!na || !nb) return null
              return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#F0C9B6" strokeWidth="2" strokeDasharray={a !== 'EP' ? '5 4' : undefined} />
            })}
            {d.grafo.nos.map((n) => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={n.principal ? 22 : 15} fill={n.principal ? 'var(--orange)' : '#FDEDE6'} stroke={n.principal ? 'none' : 'var(--orange)'} strokeWidth="1.2" />
                <text x={n.x} y={n.y + (n.principal ? 4 : 3)} textAnchor="middle" fill={n.principal ? '#fff' : 'var(--orange)'} fontSize={n.principal ? 11 : 9} fontWeight="700">{n.id}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 7 — Fluxo de Caixa
// ---------------------------------------------------------------------------
const CASHFLOW_LINES = [
  { dia: '29/05', dep: 1.2, saq: 0   },
  { dia: '30/05', dep: 2.0, saq: 0   },
  { dia: '31/05', dep: 2.8, saq: 0.5 },
  { dia: '01/06', dep: 3.6, saq: 0   },
  { dia: '02/06', dep: 4.8, saq: 0   },
  { dia: '03/06', dep: 6.0, saq: 0.9 },
  { dia: '04/06', dep: 6.6, saq: 0   },
]

function CashflowPanel() {
  const [vista, setVista] = useState('Barras')
  let acc = 0
  const netData = CASHFLOW_LINES.map((d) => { acc += d.dep - d.saq; return { dia: d.dia, net: +acc.toFixed(1) } })
  return (
    <Panel title="Fluxo de Caixa" sub="Depósitos × saques por dia">
      <ToggleBar opts={['Barras', 'Saldo líquido']} val={vista} onChange={setVista} />
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          {vista === 'Barras' ? (
            <BarChart data={CASHFLOW_LINES} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: CC.muted }} />
              <YAxis tick={{ fontSize: 10, fill: CC.muted }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="dep" name="Depósitos" stackId="a" fill={CC.orange} radius={[4, 4, 0, 0]} />
              <Bar dataKey="saq" name="Saques"    stackId="a" fill="#F4C6AE" />
            </BarChart>
          ) : (
            <LineChart data={netData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: CC.muted }} />
              <YAxis tick={{ fontSize: 10, fill: CC.muted }} />
              <Tooltip />
              <Line type="monotone" dataKey="net" name="Saldo líquido" stroke={CC.orange} strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 8 — Padrões PLD / AML
// ---------------------------------------------------------------------------
const PLD_HIST = { barras: [
  { faixa: '0-50',    n: 1 }, { faixa: '50-100',  n: 2 }, { faixa: '100-150', n: 6 },
  { faixa: '150-190', n: 9 }, { faixa: '190-200', n: 8 }, { faixa: '200-250', n: 2 }, { faixa: '250+', n: 1 },
], limite: '190-200' }

const PLD_SCATTER = { pontos: [
  { t: 1, v: 60 }, { t: 2, v: 80 }, { t: 3, v: 120 }, { t: 4, v: 150 },
  { t: 5, v: 175 }, { t: 6, v: 185 }, { t: 7, v: 190 }, { t: 8, v: 188 },
], limite: 200 }

const PLD_HEAT = { matriz: [
  [1, 2, 4, 3, 1, 0, 1], [3, 4, 6, 5, 2, 1, 2], [1, 1, 3, 1, 1, 0, 1], [0, 2, 2, 3, 1, 1, 0],
] }

function PldPanel() {
  const [vista, setVista] = useState('Histograma')
  const maxHeat = Math.max(...PLD_HEAT.matriz.flat())
  const shade = (v: number) => v === 0 ? '#FDEDE6' : `rgba(232,97,44,${0.25 + (v / maxHeat) * 0.75})`
  return (
    <Panel title="Padrões PLD / AML" sub="Detecta estruturação / smurfing">
      <ToggleBar opts={['Histograma', 'Dispersão', 'Heatmap']} val={vista} onChange={setVista} />
      <div style={{ height: 200 }}>
        {vista === 'Histograma' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PLD_HIST.barras} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
              <XAxis dataKey="faixa" tick={{ fontSize: 9, fill: CC.muted }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: CC.muted }} />
              <Tooltip />
              <ReferenceLine x={PLD_HIST.limite} stroke={CC.red} strokeDasharray="5 4" label={{ value: 'Limite', fontSize: 9, fill: CC.red, position: 'top' }} />
              <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                {PLD_HIST.barras.map((d, i) => <Cell key={i} fill={d.n >= 6 ? CC.orange : '#F4C6AE'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : vista === 'Dispersão' ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: CC.muted }} />
              <YAxis dataKey="v" tick={{ fontSize: 10, fill: CC.muted }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <ReferenceLine y={PLD_SCATTER.limite} stroke={CC.red} strokeDasharray="5 4" label={{ value: 'Limite', fontSize: 9, fill: CC.red, position: 'insideTopRight' }} />
              <Scatter data={PLD_SCATTER.pontos} fill={CC.orange} />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PLD_HEAT.matriz[0].length},1fr)`, gap: 3, width: '90%' }}>
              {PLD_HEAT.matriz.flat().map((v, i) => (
                <div key={i} title={String(v)} style={{ aspectRatio: '1.6', borderRadius: 4, background: shade(v) }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 9 — Jogo Responsável
// ---------------------------------------------------------------------------
const JR_SINAIS = [
  { nome: 'Perdas crescentes',       nivel: 'r' },
  { nome: 'Apostas madrugada (14%)', nivel: 'a' },
  { nome: 'Sem autolimitação',        nivel: 'a' },
  { nome: 'Sem autoexclusão',         nivel: 'g' },
  { nome: 'Velocidade de aposta',     nivel: 'g' },
]
const JR_RADAR = [
  { eixo: 'Perdas', v: 80 }, { eixo: 'Tempo', v: 45 }, { eixo: 'Madrugada', v: 70 },
  { eixo: 'Frequência', v: 65 }, { eixo: 'Velocidade', v: 40 },
]
const dotColor: Record<string, string> = { g: CC.green, a: CC.amber, r: CC.red, m: CC.muted }

function JrPanel() {
  const [vista, setVista] = useState('Semáforo')
  return (
    <Panel title="Jogo Responsável" sub="Portaria 1.231/2024">
      <ToggleBar opts={['Semáforo', 'Radar']} val={vista} onChange={setVista} />
      {vista === 'Semáforo' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {JR_SINAIS.map((s) => (
            <div key={s.nome} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor[s.nivel], flex: '0 0 auto' }} />
              <span style={{ fontSize: 12.5, color: 'var(--ink)' }}>{s.nome}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={JR_RADAR} outerRadius="72%">
              <PolarGrid stroke="#E6E8EC" />
              <PolarAngleAxis dataKey="eixo" tick={{ fontSize: 10, fill: CC.muted }} />
              <Radar dataKey="v" stroke={CC.orange} fill={CC.orange} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 10 — Comparação com Pares
// ---------------------------------------------------------------------------
const PEER_BARS = [
  { metrica: 'Ticket médio',  x: 2.1 },
  { metrica: 'Frequência',    x: 1.4 },
  { metrica: 'Vel. depósito', x: 3.0 },
]
const PEER_RADAR = [
  { eixo: 'Ticket', jogador: 78, cohort: 50 }, { eixo: 'Freq.', jogador: 70, cohort: 55 },
  { eixo: 'Vel. dep.', jogador: 92, cohort: 50 }, { eixo: 'Volume', jogador: 80, cohort: 52 },
  { eixo: 'Madrugada', jogador: 66, cohort: 40 },
]

function PeerPanel() {
  const [vista, setVista] = useState('Percentil')
  const maxX = Math.max(...PEER_BARS.map((p) => p.x))
  return (
    <Panel title="Comparação com Pares" sub="Posição na distribuição do cohort">
      <ToggleBar opts={['Percentil', 'Barras', 'Radar']} val={vista} onChange={setVista} />
      {vista === 'Percentil' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <svg width="100%" height="130" viewBox="0 0 200 110" preserveAspectRatio="none">
            <path d="M0,100 C50,100 60,22 100,22 C140,22 150,100 200,100 Z" fill="#FDEDE6" stroke="#F0C9B6" />
            <line x1="172" y1="14" x2="172" y2="105" stroke={CC.orange} strokeWidth="2" />
            <circle cx="172" cy="52" r="3.5" fill={CC.orange} />
            <text x="150" y="11" fontSize="9" fill={CC.orange} fontWeight="700">P96</text>
          </svg>
          <div style={{ fontSize: 11, color: 'var(--muted-text)', lineHeight: 1.5 }}>Velocidade de depósito no top 4% dos pares.</div>
        </div>
      ) : vista === 'Barras' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PEER_BARS.map((p) => (
            <div key={p.metrica}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--ink)' }}>{p.metrica}</span>
                <b style={{ color: 'var(--ink)' }}>{p.x}×</b>
              </div>
              <div style={{ height: 9, borderRadius: 6, background: '#EFF1F4', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(p.x / maxX) * 100}%`, borderRadius: 6, background: `linear-gradient(90deg,${CC.orange},${CC.orange2})` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={PEER_RADAR} outerRadius="70%">
              <PolarGrid stroke="#E6E8EC" />
              <PolarAngleAxis dataKey="eixo" tick={{ fontSize: 10, fill: CC.muted }} />
              <Radar name="Cohort"    dataKey="cohort"  stroke="#9AA3B2" fill="#9AA3B2" fillOpacity={0.15} />
              <Radar name="Apostador" dataKey="jogador" stroke={CC.orange} fill={CC.orange} fillOpacity={0.25} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 11 — Classificação Comportamental
// ---------------------------------------------------------------------------
const COMP_ITENS = [
  { k: 'Depósitos',     icone: 'dep',  v: 'Alto',     detalhe: 'R$ 1.234,00', tendencia: 'up'   },
  { k: 'Saques',        icone: 'saq',  v: 'Baixo',    detalhe: 'R$ 0,00',     tendencia: 'flat' },
  { k: 'Ticket Médio',  icone: 'tick', v: 'R$ 3,73',  detalhe: 'vs R$ 2,10',  tendencia: 'up'   },
  { k: 'Frequência',    icone: 'freq', v: 'Alta',     detalhe: '14 sessões',  tendencia: 'up'   },
  { k: 'Ganhos',        icone: 'gan',  v: 'Baixo',    detalhe: '−R$ 230,00',  tendencia: 'down' },
  { k: 'Tipo Aposta',   icone: 'tipo', v: 'Múltipla', detalhe: '87% múltipla',tendencia: null   },
]
const COMP_ICONS: Record<string, React.ReactNode> = {
  dep:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14"/><path d="M5 17l7 7 7-7"/><path d="M3 21h18"/></svg>,
  saq:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V7"/><path d="M5 7l7-7 7 7"/><path d="M3 21h18"/></svg>,
  tick: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  freq: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>,
  gan:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  tipo: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="5" rx="2"/><rect x="2" y="10" width="20" height="5" rx="2"/><rect x="2" y="17" width="20" height="5" rx="2"/></svg>,
}
const TR: Record<string, { label: string; color: string }> = {
  up:   { label: '▲', color: 'var(--red)'   },
  down: { label: '▼', color: 'var(--green)' },
  flat: { label: '▬', color: 'var(--muted-text)' },
}

function ComportamentalPanel() {
  const [periodo, setPeriodo] = useState('30D')
  return (
    <Panel title="Classificação Comportamental" sub="Ícones + toggle de período">
      <ToggleBar opts={['30D', '90D', 'Histórico']} val={periodo} onChange={setPeriodo} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {COMP_ITENS.map((item) => {
          const tr = item.tendencia ? TR[item.tendencia] : null
          return (
            <div key={item.k} style={{ border: '1px solid var(--line)', borderRadius: 11, padding: '9px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--orange-soft)', color: 'var(--orange)', display: 'grid', placeItems: 'center' }}>
                {COMP_ICONS[item.icone]}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted-text)', fontWeight: 600, letterSpacing: '.2px', lineHeight: 1.2 }}>{item.k}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{item.v}</span>
                {tr && <span style={{ fontSize: 10, fontWeight: 700, color: tr.color }}>{tr.label}</span>}
              </div>
              {item.detalhe && <div style={{ fontSize: 9.5, color: 'var(--muted-2)', lineHeight: 1.3 }}>{item.detalhe}</div>}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 12 — Trilha de Intervenção
// ---------------------------------------------------------------------------
const INTERV_ITENS = [
  { titulo: 'Mensagem de JR enviada', sub: 'WhatsApp · 02/06 · entregue',          cor: 'g' },
  { titulo: 'Caso de revisão aberto', sub: 'SLA 48h · pendente há 2 dias',         cor: 'a' },
  { titulo: 'Consulta SIGAP',         sub: 'Módulo de Impedidos · não integrado',  cor: 'r' },
]
const BOARD_SINAIS = [{ nome: 'JR: enviado', nivel: 'g' }, { nome: 'SLA: 48h', nivel: 'a' }, { nome: 'SIGAP: off', nivel: 'r' }]

function InterventionPanel() {
  const [vista, setVista] = useState('Timeline')
  return (
    <Panel title="Trilha de Intervenção" sub="Histórico auditável — Portaria 1.231/2024">
      <ToggleBar opts={['Timeline', 'Status']} val={vista} onChange={setVista} />
      {vista === 'Timeline' ? (
        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'var(--line)' }} />
          {INTERV_ITENS.map((it) => (
            <div key={it.titulo} style={{ position: 'relative', marginBottom: 14 }}>
              <span style={{ position: 'absolute', left: -19, top: 3, width: 10, height: 10, borderRadius: '50%', background: dotColor[it.cor] }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{it.titulo}</div>
              <div style={{ fontSize: 11, color: 'var(--muted-text)', marginTop: 2 }}>{it.sub}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BOARD_SINAIS.map((s) => (
            <div key={s.nome} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor[s.nivel], flex: '0 0 auto' }} />
              <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{s.nome}</span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Panel 13 — Transações / Bilhetes
// ---------------------------------------------------------------------------
const TRANSACOES_DATA = {
  periodo: '08 jun – 09 jun 2026',
  rodape: '07/06/2026 — 08/06/2026',
  abas: [
    { id: 'depositos', label: 'Depósitos', tipo: 'fin', itens: [
      { tipo: 'Depósito', data: '09 Jun 2026', status: 'Aprovado', marca: 'vaidebet-ngx', id: '6a2778cd80949b25909559e0',            valor: 'R$ 10,00', tempo: '02h 22m' },
      { tipo: 'Depósito', data: '09 Jun 2026', status: 'Pendente', marca: 'vaidebet-ngx', id: '06adbcb1-9dcb-48ec-8a30-31d2baa7f33a',valor: 'R$ 10,00', tempo: '02h 22m' },
      { tipo: 'Depósito', data: '09 Jun 2026', status: 'Aprovado', marca: 'vaidebet-ngx', id: '6a2778cd80949b25909559e0',            valor: 'R$ 10,00', tempo: '02h 22m' },
    ] },
    { id: 'saques',     label: 'Saques',     tipo: 'fin', itens: [] },
    { id: 'cassino',    label: 'Cassino',    tipo: 'fin', itens: [] },
    { id: 'esportivas', label: 'Esportivas', tipo: 'esp', itens: [
      { titulo: 'Aposta Múltipla', status: 'NÃO PREMIADO', legs: [
        { ev: 'Rússia x Burkina Faso · GOALS_OVER_UNDER', odd: '1.24' },
        { ev: 'Canadá x Irlanda · GOALS_OVER_UNDER',      odd: '1.34' },
        { ev: 'Geórgia x Bahrain · GOALS_OVER_UNDER',     odd: '1.20' },
      ] },
    ] },
  ],
}

function TransacoesPanel() {
  const [ativa, setAtiva] = useState(0)
  const d = TRANSACOES_DATA
  const aba = d.abas[ativa]
  return (
    <Panel title="Transações / Bilhetes" sub="Dep · Saq · Cas · Esp">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', background: '#F1F2F4', borderRadius: 10, padding: 4, gap: 3 }}>
          {d.abas.map((a, i) => (
            <button key={a.id} onClick={() => setAtiva(i)} style={{
              padding: '7px 14px', fontSize: 11.5, fontWeight: i === ativa ? 700 : 600,
              color: i === ativa ? '#fff' : 'var(--muted-text)', background: i === ativa ? 'var(--orange)' : 'transparent',
              border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {a.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--orange)', color: '#fff', fontWeight: 600, fontSize: 11, padding: '5px 10px', borderRadius: 999 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
          {d.periodo}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {aba.itens.length === 0 && (
          <div style={{ color: 'var(--muted-text)', fontSize: 12, padding: '20px 0', textAlign: 'center' }}>Sem registros no período.</div>
        )}
        {aba.tipo === 'fin' && (aba.itens as Array<{ tipo: string; data: string; status: string; marca: string; id: string; valor: string; tempo: string }>).map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F7F7F8', borderRadius: 10, padding: '11px 13px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--orange)', flex: '0 0 auto' }} />
                {t.tipo}
                <span style={{ fontSize: 10, fontWeight: 700, color: t.status === 'Aprovado' ? 'var(--green)' : 'var(--amber)', background: t.status === 'Aprovado' ? 'var(--green-soft)' : 'var(--amber-soft)', padding: '2px 7px', borderRadius: 5 }}>{t.status}</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <span>{t.data}</span><span>·</span><span>{t.marca}</span><span>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{t.id}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{t.valor}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 3 }}>{t.tempo}</div>
            </div>
          </div>
        ))}
        {aba.tipo === 'esp' && (aba.itens as Array<{ titulo: string; status: string; legs: Array<{ ev: string; odd: string }> }>).map((b, i) => (
          <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>
              {b.titulo}
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.4px', color: 'var(--muted-text)', background: '#EEF0F2', padding: '3px 8px', borderRadius: 5, whiteSpace: 'nowrap' }}>{b.status}</span>
            </div>
            {b.legs.map((l, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-text)', marginTop: 7, gap: 8 }}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.ev}</span>
                <b style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{l.odd}</b>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 10.5, color: 'var(--muted-2)' }}>{d.rodape}</div>
    </Panel>
  )
}

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
export default function PerfilApostadorPage() {
  return (
    <main className="canvas">
      <div style={{ padding: 'clamp(16px,2vw,40px)', paddingBottom: 56 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>Perfil do Apostador</h1>
            <div style={{ fontSize: 14, color: 'var(--muted-text)', marginTop: 5 }}>
              Visão consolidada de risco, comportamento financeiro e conformidade regulatória.
            </div>
          </div>

          {/* Layout em linhas — 2 colunas ou largura total */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Linha 1: Identidade & KYC | Score de Risco */}
            <div className="grid-2col">
              <IdentityPanel />
              <ScorePanel />
            </div>

            {/* Linha 2: Classificação comportamental | Fluxo de caixa */}
            <div className="grid-2col">
              <ComportamentalPanel />
              <CashflowPanel />
            </div>

            {/* Linha 3: Vínculos [largura total] */}
            <VinculosPanel />

            {/* Linha 4: Transações [largura total] */}
            <TransacoesPanel />

            {/* Linha 5: Ação recomendada | Trilha de intervenção */}
            <div className="grid-2col">
              <ActionPanel />
              <InterventionPanel />
            </div>

            {/* Linha 6: Evolução de score | Comparação com pares */}
            <div className="grid-2col">
              <ScoreTrendPanel />
              <PeerPanel />
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
