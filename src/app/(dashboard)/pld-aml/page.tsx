"use client"
import { useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Row {
  id: number; nome: string; cpf: string; marca: string; flag: string
  score: number; sev: string; sla: string; slaH: number | null; slaC: string
  status: string; resp: string; crit: boolean
}
interface DrawerEntry {
  timeline: Array<{ desc: string; ts: string }>
  factors: string[]
  vinculos: string[]
}
interface PepPoint {
  id: string; nome: string; cargo: string; esfera: string; cat: string
  tipo: string; x: number; y: number; score: number
  agingMeses: number; agingMax: number
  vol: string; dep: string; giro: string; giroAlto: boolean
  fatores: string[]; vinculos: string; diligencia: string
}
interface StyleToken { c: string; bg: string }
interface CoafCase {
  id: string; nome: string; marca: string; t: number; tl: string; sev: 'CRÍTICO' | 'ALTO'
}

// ---------------------------------------------------------------------------
// Dados mock — WorkList
// ---------------------------------------------------------------------------
const ROWS: Row[] = [
  { id: 1, nome: 'EVANDRO P.',  cpf: '•••.•••.•••-70', marca: 'vaidebet-ngx', flag: 'Estruturação',           score: 92, sev: 'Crítico', sla: '3h',    slaH: 3,    slaC: 'r', status: 'Aberto',          resp: '—',      crit: true  },
  { id: 2, nome: 'ADIEL F.',    cpf: '•••.•••.•••-10', marca: 'betnacional',   flag: 'Saque atípico',          score: 88, sev: 'Crítico', sla: '7h',    slaH: 7,    slaC: 'r', status: 'Em análise',      resp: 'Marina', crit: true  },
  { id: 3, nome: 'J. SOUSA',    cpf: '•••.•••.•••-44', marca: 'vaidebet',      flag: 'Depósito suspeito',      score: 76, sev: 'Alto',    sla: '19h',   slaH: 19,   slaC: 'a', status: 'Aberto',          resp: '—',      crit: false },
  { id: 4, nome: 'R. LIMA',     cpf: '•••.•••.•••-29', marca: 'kto',           flag: 'Estruturação',           score: 71, sev: 'Alto',    sla: '1d 4h', slaH: 28,   slaC: 'm', status: 'Em análise',      resp: 'Caio',   crit: false },
  { id: 5, nome: 'T. ALVES',    cpf: '•••.•••.•••-83', marca: 'betano',        flag: 'Comport. inconsistente', score: 64, sev: 'Médio',   sla: '2d',    slaH: 48,   slaC: 'm', status: 'Aberto',          resp: '—',      crit: false },
  { id: 6, nome: 'M. COSTA',    cpf: '•••.•••.•••-05', marca: 'vaidebet',      flag: 'Saque atípico',          score: 58, sev: 'Médio',   sla: '—',     slaH: null, slaC: 'm', status: 'Comunicado COAF', resp: 'Marina', crit: false },
]

const DRAWER_DATA: Record<number, DrawerEntry> = {
  1: {
    timeline: [
      { desc: 'Depósito PIX R$ 1.980', ts: '09/06 14:02' }, { desc: 'Depósito PIX R$ 1.950', ts: '09/06 14:09' },
      { desc: 'Depósito PIX R$ 1.990', ts: '09/06 14:21' }, { desc: 'Saque R$ 5.800 sem aposta', ts: '09/06 14:35' },
    ],
    factors: ['Fracionamento < R$ 2.000 · ×3', 'Saque sem aposta', 'Velocidade atípica', 'Conta no mesmo IP de 2 contas'],
    vinculos: ['2 contas no mesmo IP', 'Mesma marca · dispositivo recorrente', 'PIX de 3 remetentes distintos'],
  },
  2: {
    timeline: [
      { desc: 'Depósito R$ 4.200', ts: '08/06 09:14' }, { desc: 'Aposta R$ 50', ts: '08/06 09:17' },
      { desc: 'Saque R$ 4.100', ts: '08/06 09:22' },
    ],
    factors: ['Saque logo após depósito', 'Aposta simbólica (R$ 50)', 'Ratio dep/saque > 97%'],
    vinculos: ['IP compartilhado com conta banida', 'PIX de origem variada'],
  },
  3: {
    timeline: [
      { desc: 'Depósito PIX R$ 8.500', ts: '07/06 22:05' }, { desc: 'Depósito PIX R$ 7.900', ts: '07/06 22:31' },
      { desc: 'Sem apostas registradas', ts: '—' },
    ],
    factors: ['Volume atípico para perfil', 'Sem atividade de aposta', 'Horário suspeito (madrugada)'],
    vinculos: ['Nenhum vínculo identificado até o momento'],
  },
  4: {
    timeline: [
      { desc: 'Depósito R$ 1.900', ts: '05/06 10:01' }, { desc: 'Depósito R$ 1.850', ts: '05/06 10:08' },
      { desc: 'Depósito R$ 1.980', ts: '05/06 10:19' }, { desc: 'Saque R$ 5.600', ts: '05/06 10:44' },
    ],
    factors: ['Fracionamento < R$ 2.000 · ×3', 'Saque consolidado', 'Padrão similar ao caso #1'],
    vinculos: ['Dispositivo recorrente em 3 operações'],
  },
  5: {
    timeline: [{ desc: 'Apostas em mercados opostos', ts: '04/06 — 06/06' }],
    factors: ['Apostas em resultados opostos', 'Sem histórico de lucro consistente'],
    vinculos: ['Nenhum vínculo identificado'],
  },
  6: {
    timeline: [
      { desc: 'Saque R$ 12.000', ts: '01/06 08:30' }, { desc: 'Comunicação enviada COAF', ts: '02/06 09:00' },
    ],
    factors: ['Saque atípico para o perfil', 'Frequência de saques +4× no mês'],
    vinculos: ['Conta bancária de destino diferente do cadastrado'],
  },
}

// ---------------------------------------------------------------------------
// Dados mock — COAF (9 casos · do mockup)
// ---------------------------------------------------------------------------
const COAF_CASES: CoafCase[] = [
  { id: 'AML-2026-0046', nome: 'R. FERREIRA', marca: 'vaidebet-ngx', t: 6.5,  tl: '6h 30min', sev: 'CRÍTICO' },
  { id: 'AML-2026-0047', nome: 'C. ROCHA',    marca: 'betnacional',  t: 9,    tl: '9h',        sev: 'CRÍTICO' },
  { id: 'AML-2026-0048', nome: 'M. DIAS',     marca: 'vaidebet',     t: 10,   tl: '10h',       sev: 'CRÍTICO' },
  { id: 'AML-2026-0045', nome: 'P. SANTOS',   marca: 'betnacional',  t: 11,   tl: '11h',       sev: 'CRÍTICO' },
  { id: 'AML-2026-0044', nome: 'L. ALMEIDA',  marca: 'vaidebet',     t: 13,   tl: '13h',       sev: 'ALTO'    },
  { id: 'AML-2026-0043', nome: 'T. OLIVEIRA', marca: 'kto',          t: 19.7, tl: '19h 40min', sev: 'ALTO'    },
  { id: 'AML-2026-0042', nome: 'J. SOUSA',    marca: 'vaidebet',     t: 22,   tl: '22h',       sev: 'ALTO'    },
  { id: 'AML-2026-0041', nome: 'R. LIMA',     marca: 'betano',       t: 27.7, tl: '27h 40min', sev: 'ALTO'    },
  { id: 'AML-2026-0040', nome: 'G. SANTOS',   marca: 'kto',          t: 33,   tl: '33h',       sev: 'ALTO'    },
]

// ---------------------------------------------------------------------------
// Dados mock — KPIs (faixa plana)
// ---------------------------------------------------------------------------
const KPI_DATA = [
  { label: 'Apostadores com flag ativo', tooltip: 'Qtd. de apostadores com pelo menos 1 red flag ativo (não arquivado).', value: '27',        delta: '▲ +4 no período', deltaColor: 'var(--red)'   as string | undefined },
  { label: 'Alertas gerados',            tooltip: 'Total de alertas criados no período selecionado.',                       value: '38',        delta: 'no período',       deltaColor: undefined                              },
  { label: 'Volume sob análise',         tooltip: 'Soma do volume financeiro dos apostadores atualmente em análise.',       value: 'R$ 1,24 mi', delta: '▲ +R$ 180 mil',   deltaColor: 'var(--amber)' as string | undefined },
  { label: 'Red flags por categoria',    tooltip: 'Estruturação · saque atípico · depósito suspeito · comportamento inconsistente.', value: '34', delta: '4 categorias',  deltaColor: undefined                              },
]

// ---------------------------------------------------------------------------
// Beeswarm layout (algoritmo do mockup.html)
// ---------------------------------------------------------------------------
const BW = 700, BH = 132, BPL = 46, BPR = 26, BY = 104, BSTEP = 13, BR = 6, BGAP = 14
const BMAX = Math.ceil(Math.max(...COAF_CASES.map(c => c.t)) / 6) * 6  // rounds up to nearest 6h above last case
function beeX(t: number) { return BPL + (t / BMAX) * (BW - BPL - BPR) }
type BeePoint = CoafCase & { x: number; cy: number }
const BEE_LAYOUT: BeePoint[] = (() => {
  const placed: Array<{ x: number; lvl: number }> = []
  return [...COAF_CASES].sort((a, b) => a.t - b.t).map((c) => {
    const x = beeX(c.t)
    let lvl = 0
    while (placed.some(p => p.lvl === lvl && Math.abs(p.x - x) < BGAP)) lvl++
    placed.push({ x, lvl })
    return { ...c, x, cy: BY - 8 - lvl * BSTEP }
  })
})()

function coafToRow(c: CoafCase): Row {
  const match = ROWS.find(r => r.nome === c.nome)
  if (match) return match
  return {
    id: -(COAF_CASES.findIndex(x => x.id === c.id) + 1),
    nome: c.nome, cpf: '•••.•••.•••-••', marca: c.marca,
    flag: 'Estruturação',
    score: c.sev === 'CRÍTICO' ? 88 : 71,
    sev: c.sev === 'CRÍTICO' ? 'Crítico' : 'Alto',
    sla: c.tl, slaH: c.t,
    slaC: c.t < 12 ? 'r' : 'a',
    status: 'Aberto', resp: '—',
    crit: c.sev === 'CRÍTICO',
  }
}

// ---------------------------------------------------------------------------
// Dados mock — PEP
// ---------------------------------------------------------------------------
const PEP_COLORS: Record<string, string> = {
  titular:       'var(--orange)',
  familiar:      'var(--ink-2)',
  representante: 'var(--muted-text)',
  colaborador:   'var(--muted-2)',
}

const PEP_POINTS: PepPoint[] = [
  { id: 'pep-1',  nome: 'EVANDRO P.', cargo: 'Secretário Municipal',  esfera: 'Municipal', cat: 'Titular',          tipo: 'titular',       x: 78, y: 88, score: 88, agingMeses: 22, agingMax: 60, vol: 'R$ 420k', dep: 'R$ 420k', giro: '8%',  giroAlto: true,  fatores: ['Depósitos ×4 vs média do cargo', 'Saques para conta de terceiro', 'Sem aposta efetiva'],  vinculos: '—',                         diligencia: 'pendente'     },
  { id: 'pep-2',  nome: 'B. SANTOS',  cargo: 'Vereador',              esfera: 'Municipal', cat: 'Familiar 2º grau', tipo: 'familiar',      x: 62, y: 71, score: 71, agingMeses: 14, agingMax: 60, vol: 'R$ 180k', dep: 'R$ 195k', giro: '15%', giroAlto: false, fatores: ['Movimentação acima do esperado'],                                                           vinculos: 'Cônjuge do titular',         diligencia: 'em andamento' },
  { id: 'pep-3',  nome: 'C. LIMA',    cargo: 'Deputado Estadual',     esfera: 'Estadual',  cat: 'Representante',    tipo: 'representante', x: 85, y: 55, score: 55, agingMeses: 38, agingMax: 60, vol: 'R$ 95k',  dep: 'R$ 100k', giro: '5%',  giroAlto: false, fatores: ['Volume dentro do esperado'],                                                                vinculos: '—',                         diligencia: 'ok'           },
  { id: 'pep-4',  nome: 'D. MELO',    cargo: 'Senador',               esfera: 'Federal',   cat: 'Titular',          tipo: 'titular',       x: 91, y: 79, score: 79, agingMeses:  8, agingMax: 60, vol: 'R$ 310k', dep: 'R$ 330k', giro: '11%', giroAlto: true,  fatores: ['Depósito elevado · Federal', 'Padrão de giro suspeito'],                                    vinculos: 'Familiar presente na lista', diligencia: 'pendente'     },
  { id: 'pep-5',  nome: 'E. FARIA',   cargo: 'Secretário Estadual',   esfera: 'Estadual',  cat: 'Familiar 2º grau', tipo: 'familiar',      x: 48, y: 42, score: 42, agingMeses: 50, agingMax: 60, vol: 'R$ 60k',  dep: 'R$ 65k',  giro: '3%',  giroAlto: false, fatores: ['Abaixo do limiar'],                                                                         vinculos: '—',                         diligencia: 'ok'           },
  { id: 'pep-6',  nome: 'F. ROCHA',   cargo: 'Diretor de Autarquia',  esfera: 'Federal',   cat: 'Colaborador',      tipo: 'colaborador',   x: 55, y: 60, score: 60, agingMeses: 29, agingMax: 60, vol: 'R$ 120k', dep: 'R$ 125k', giro: '7%',  giroAlto: false, fatores: ['Operações dentro do padrão'],                                                               vinculos: '—',                         diligencia: 'em andamento' },
  { id: 'pep-7',  nome: 'G. NUNES',   cargo: 'Prefeito',              esfera: 'Municipal', cat: 'Titular',          tipo: 'titular',       x: 70, y: 82, score: 82, agingMeses:  3, agingMax: 60, vol: 'R$ 270k', dep: 'R$ 280k', giro: '9%',  giroAlto: true,  fatores: ['Início de mandato · alta exposição', 'Volume crescente'],                                   vinculos: 'Esposa na base de dados',   diligencia: 'pendente'     },
  { id: 'pep-8',  nome: 'H. VIEIRA',  cargo: 'Vereador',              esfera: 'Municipal', cat: 'Familiar 2º grau', tipo: 'familiar',      x: 35, y: 30, score: 30, agingMeses: 54, agingMax: 60, vol: 'R$ 40k',  dep: 'R$ 42k',  giro: '2%',  giroAlto: false, fatores: ['Sem anomalia detectada'],                                                                   vinculos: '—',                         diligencia: 'ok'           },
  { id: 'pep-9',  nome: 'I. BORGES',  cargo: 'Rep. Comercial',        esfera: 'Estadual',  cat: 'Representante',    tipo: 'representante', x: 73, y: 48, score: 48, agingMeses: 42, agingMax: 60, vol: 'R$ 75k',  dep: 'R$ 80k',  giro: '4%',  giroAlto: false, fatores: ['Operações regulares'],                                                                      vinculos: '—',                         diligencia: 'ok'           },
  { id: 'pep-10', nome: 'J. COSTA',   cargo: 'Governador',            esfera: 'Estadual',  cat: 'Titular',          tipo: 'titular',       x: 82, y: 93, score: 93, agingMeses:  1, agingMax: 60, vol: 'R$ 580k', dep: 'R$ 600k', giro: '14%', giroAlto: true,  fatores: ['Recém-empossado · máxima exposição', 'Depósitos atípicos'],                                vinculos: '2 familiares cadastrados',  diligencia: 'pendente'     },
  { id: 'pep-11', nome: 'K. ALVES',   cargo: 'Analista Público',      esfera: 'Federal',   cat: 'Colaborador',      tipo: 'colaborador',   x: 22, y: 18, score: 18, agingMeses: 58, agingMax: 60, vol: 'R$ 25k',  dep: 'R$ 27k',  giro: '1%',  giroAlto: false, fatores: ['Risco baixo'],                                                                              vinculos: '—',                         diligencia: 'ok'           },
]

const SX = (v: number) => 50 + (v / 100) * 400
const SY = (v: number) => 240 - (v / 100) * 200
const CROSS_X = SX(60)
const CROSS_Y = SY(60)

// ---------------------------------------------------------------------------
// Token maps
// ---------------------------------------------------------------------------
const SEV: Record<string, StyleToken> = {
  'Crítico': { c: 'var(--red)',   bg: 'var(--red-soft)'   },
  'Alto':    { c: 'var(--amber)', bg: 'var(--amber-soft)' },
  'Médio':   { c: 'var(--atlas-color-status-info)', bg: 'var(--bg)' },
}
const ST: Record<string, StyleToken> = {
  'Aberto':          { c: 'var(--orange)', bg: 'var(--orange-soft)' },
  'Em análise':      { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
  'Comunicado COAF': { c: 'var(--green)',  bg: 'var(--green-soft)'  },
  'Arquivado':       { c: 'var(--muted-text)', bg: 'var(--bg)'      },
}
const DILIG: Record<string, StyleToken> = {
  'pendente':     { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
  'em andamento': { c: 'var(--orange)', bg: 'var(--orange-soft)' },
  'ok':           { c: 'var(--green)',  bg: 'var(--green-soft)'  },
}

const SCORE_COLOR = (s: number) =>
  s >= 85 ? 'var(--red)' : s >= 70 ? 'var(--amber)' : 'var(--atlas-color-status-info)'

const FILTERS = ['Todos', 'Aberto', 'Em análise', 'Crítico', 'Estruturação', 'vaidebet']

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------
function Pill({ c, bg, children }: { c: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap', color: c, background: bg }}>
      {children}
    </span>
  )
}

function Sech({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--muted-text)', margin: '26px 0 11px', ...style }}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal COAF / Arquivar
// ---------------------------------------------------------------------------
function Modal({ type, justificativa, setJustificativa, onConfirm, onClose }: {
  type: 'coaf' | 'arquivar'
  justificativa: string
  setJustificativa: (v: string) => void
  onConfirm: () => void
  onClose: () => void
}) {
  const isCoaf = type === 'coaf'
  const valid  = isCoaf || justificativa.trim().length >= 50
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,31,.45)', display: 'grid', placeItems: 'center', zIndex: 200, padding: 20 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', width: 480, maxWidth: '100%', padding: '24px 26px', boxShadow: '0 16px 48px rgba(16,24,40,.22)' }}>
        <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)', marginBottom: 10 }}>
          {isCoaf ? '→ Escalar para COAF' : 'Arquivar caso'}
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--muted-text)', lineHeight: 1.6 }}>
          {isCoaf
            ? 'Confirma a comunicação ao COAF? Registrado em trilha auditável e irreversível. O RO será gerado sem mascaramento de CPF/nome (Lei 9.613, art. 11).'
            : 'Justificativa obrigatória (mín. 50 caracteres). Registrada em trilha auditável.'}
        </p>
        {!isCoaf && (
          <>
            <textarea value={justificativa} onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva o motivo do arquivamento..." rows={4}
              style={{ width: '100%', resize: 'vertical', borderRadius: 10, border: '1px solid var(--line)', padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--ink)' }} />
            <div style={{ fontSize: 11, color: justificativa.trim().length >= 50 ? 'var(--green)' : 'var(--muted-text)', marginTop: 5 }}>
              {justificativa.trim().length}/50 caracteres mínimos
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button disabled={!valid} onClick={valid ? onConfirm : undefined}
            className={valid ? 'btn-primary' : undefined}
            style={!valid ? { padding: '9px 18px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13, background: 'var(--line)', color: 'var(--muted-text)', cursor: 'not-allowed' }
                          : { background: isCoaf ? 'var(--orange)' : 'var(--red)' }}>
            {isCoaf ? 'Confirmar → COAF' : 'Arquivar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Drawer de investigação
// ---------------------------------------------------------------------------
function Drawer({ row, rowStatus, onUpdateStatus, onClose }: {
  row: Row
  rowStatus: Record<number, string>
  onUpdateStatus: (id: number, newStatus: string) => void
  onClose: () => void
}) {
  const [modal, setModal] = useState<'coaf' | 'arquivar' | null>(null)
  const [justif, setJustif] = useState('')
  const d      = DRAWER_DATA[row.id] ?? { timeline: [], factors: [], vinculos: [] }
  const status = rowStatus[row.id] || row.status
  const sc     = SCORE_COLOR(row.score)

  function confirm() {
    if (modal === 'coaf')     onUpdateStatus(row.id, 'Comunicado COAF')
    if (modal === 'arquivar') onUpdateStatus(row.id, 'Arquivado')
    setModal(null); setJustif('')
  }

  return (
    <>
      <div style={{ marginTop: 14, position: 'relative', border: '1px dashed var(--orange-line)', borderRadius: 'var(--radius)', padding: 8 }}>
        <span style={{ position: 'absolute', top: -10, left: 16, background: 'var(--bg)', padding: '0 8px', fontSize: 11, fontWeight: 700, color: 'var(--orange)' }}>
          Drawer — investigação
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Esquerda */}
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>{row.nome}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '3px 9px', borderRadius: 7 }}>{row.marca}</span>
              <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: sc }}>{row.score}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-text)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>
              {row.cpf} · {row.flag} · {row.sev} · SLA {row.sla}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted-text)', margin: '16px 0 8px' }}>
              Timeline de transações
            </div>
            <div style={{ position: 'relative', paddingLeft: 16 }}>
              <div style={{ position: 'absolute', left: 4, top: 3, bottom: 3, width: 2, background: 'var(--line)' }} />
              {d.timeline.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--muted-text)', padding: '5px 0 5px 4px' }}>Sem registros disponíveis.</div>
              ) : d.timeline.map((t, i) => (
                <div key={i} style={{ position: 'relative', padding: '5px 0 5px 4px', fontSize: 12.5, color: 'var(--ink)' }}>
                  <span style={{ position: 'absolute', left: -15, top: 9, width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', display: 'block' }} />
                  {t.desc} <span style={{ color: 'var(--muted-text)', fontSize: 11 }}>— {t.ts}</span>
                </div>
              ))}
            </div>
            {row.score >= 70 && (
              <>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted-text)', margin: '16px 0 8px' }}>
                  Score factors (≥ 70 · obrigatório)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {d.factors.length === 0 ? (
                    <span style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>Aguardando análise.</span>
                  ) : d.factors.map((f) => (
                    <span key={f} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--amber)', background: 'var(--amber-soft)', border: '1px solid var(--orange-line)', padding: '4px 9px', borderRadius: 7 }}>{f}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Direita */}
          <div style={{ padding: '16px 18px', background: 'var(--bg)', borderLeft: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: 8 }}>Vínculos</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>
              {d.vinculos.length === 0
                ? <span style={{ color: 'var(--muted-text)' }}>Sem vínculos identificados.</span>
                : d.vinculos.map((v, i) => <div key={i}>• {v}</div>)}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted-text)', margin: '16px 0 8px' }}>Decisão</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.6 }}>
              Status: <b>{status}</b>
              {status === 'Aberto' && (
                <span style={{ color: 'var(--muted-text)', display: 'block', marginTop: 4, fontSize: 12 }}>
                  → Inicie a análise para habilitar a comunicação.
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {status === 'Aberto' && (
                <button className="btn-primary" onClick={() => onUpdateStatus(row.id, 'Em análise')}>Iniciar análise</button>
              )}
              {status === 'Em análise' && (
                <button className="btn-ghost" onClick={() => setModal('coaf')}>→ COAF</button>
              )}
              {(status === 'Aberto' || status === 'Em análise') && (
                <button className="btn-ghost" style={{ color: 'var(--red)', borderColor: 'var(--red-soft)' }} onClick={() => setModal('arquivar')}>
                  Arquivar
                </button>
              )}
              <button className="btn-ghost" onClick={onClose}>Fechar</button>
            </div>
            <div style={{ marginTop: 20, fontSize: 11, color: 'var(--muted-text)', lineHeight: 1.6, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              ⚷ Ações registradas em trilha auditável — autor + timestamp, imutável (art. 32)
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <Modal type={modal} justificativa={justif} setJustificativa={setJustif} onConfirm={confirm}
          onClose={() => { setModal(null); setJustif('') }} />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// COAF Timeline — beeswarm + popover
// ---------------------------------------------------------------------------
function CoafTimeline({ onInvestigate }: { onInvestigate: (row: Row) => void }) {
  const [popCase, setPopCase] = useState<CoafCase | null>(null)
  const [popPos,  setPopPos]  = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  function openPop(c: CoafCase, e: React.MouseEvent) {
    e.stopPropagation()
    setPopCase(c)
    setPopPos({ x: e.clientX, y: e.clientY })
  }

  const critCount = COAF_CASES.filter(c => c.t < 12).length
  const listTop5  = [...COAF_CASES].sort((a, b) => a.t - b.t).slice(0, 5)

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
          Prazo COAF — horizonte {BMAX}h
        </h3>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'var(--red-soft)', color: 'var(--red)' }}>
          {critCount} críticos &lt; 12h
        </span>
      </div>

      {/* SVG beeswarm */}
      <div>
        <svg viewBox={`0 0 ${BW} ${BH}`} width="100%" style={{ display: 'block' }} preserveAspectRatio="xMinYMid meet">
          {/* Zona crítica */}
          <rect x={BPL} y={0} width={beeX(12) - BPL} height={BY + 10} fill="var(--red-soft)" opacity={0.55} rx={4} />
          {/* Linha 24h tracejada */}
          <line x1={beeX(24)} y1={8} x2={beeX(24)} y2={BY + 8} stroke="var(--muted-text)" strokeWidth={1.5} strokeDasharray="4 3" />
          {/* Eixo base */}
          <line x1={BPL} y1={BY + 9} x2={BW - BPR} y2={BY + 9} stroke="var(--line)" strokeWidth={1} />
          {/* Labels de eixo — geradas dinamicamente de 0 a BMAX em intervalos de 6h */}
          {Array.from({ length: BMAX / 6 + 1 }, (_, i) => i * 6).map(h => (
            <text key={h} x={h === 0 ? BPL : h === BMAX ? BW - BPR : beeX(h)} y={BH - 2}
              fontSize={9.5} textAnchor="middle"
              fill={h === 12 ? 'var(--red)' : 'var(--muted-text)'}
              fontWeight={h === 12 || h === 24 ? 700 : undefined}>{h}h</text>
          ))}
          {/* Rótulo zona crítica */}
          <text x={BPL + (beeX(12) - BPL) / 2} y={14} fontSize={8.5} fill="var(--red)" fontWeight={700} textAnchor="middle">CRÍTICO</text>
          {/* Rótulo 24h */}
          <text x={beeX(24) + 4} y={20} fontSize={8.5} fill="var(--muted-text)" textAnchor="start">prazo 24h</text>
          {/* Pontos */}
          {BEE_LAYOUT.map((pt) => (
            <g key={pt.id} style={{ cursor: 'pointer' }} onClick={(e) => openPop(pt, e)}>
              <circle cx={pt.x} cy={pt.cy} r={BR + 4} fill="transparent" />
              <circle cx={pt.x} cy={pt.cy} r={BR}
                fill={pt.t < 12 ? 'var(--red)' : 'var(--amber)'}
                stroke="var(--card)" strokeWidth={1.5} />
              <title>{pt.nome} — {pt.tl}</title>
            </g>
          ))}
        </svg>
      </div>

      {/* Próximos a vencer */}
      <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: 6 }}>
          Próximos a vencer
        </div>
        {listTop5.map((c, i) => (
          <div key={c.id} onClick={(e) => openPop(c, e)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 6px', borderTop: i === 0 ? 'none' : '1px solid var(--bg)', cursor: 'pointer', borderRadius: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.t < 12 ? 'var(--red)' : 'var(--amber)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}>{c.nome}</span>
            <span style={{ fontSize: 10, color: 'var(--muted-text)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{c.id}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>{c.marca}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: c.t < 12 ? 'var(--red)' : 'var(--amber)', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              faltam {c.tl}
            </span>
          </div>
        ))}
      </div>

      {/* Popover */}
      {popCase && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 149 }} onClick={() => setPopCase(null)} />
          <div style={{
            position: 'fixed',
            left: Math.min(popPos.x + 10, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 280),
            top:  Math.max(popPos.y - 30, 8),
            zIndex: 150,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(16,24,40,.18)',
            padding: '14px 16px',
            width: 260,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>{popCase.nome}</span>
              <button onClick={() => setPopCase(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted-text)', lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
            </div>
            <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--muted-text)', marginBottom: 10 }}>{popCase.id}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <Pill c={popCase.t < 12 ? 'var(--red)' : 'var(--amber)'}
                    bg={popCase.t < 12 ? 'var(--red-soft)' : 'var(--amber-soft)'}>
                {popCase.sev}
              </Pill>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '3px 9px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap' }}>
                {popCase.marca}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: popCase.t < 12 ? 'var(--red)' : 'var(--amber)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>
              ⏱ faltam {popCase.tl}
            </div>
            <button className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}
              onClick={() => { onInvestigate(coafToRow(popCase)); setPopCase(null) }}>
              Investigar →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// PEP — quadrante + ficha
// ---------------------------------------------------------------------------
function PepSection({ selectedPep: p, setSelectedPep }: { selectedPep: PepPoint | null; setSelectedPep: (p: PepPoint) => void }) {
  const sc         = p ? SCORE_COLOR(p.score) : null
  const pepColor   = p ? PEP_COLORS[p.tipo]   : null
  const diligStyle = p ? (DILIG[p.diligencia] || DILIG['pendente']) : null

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* quadrante */}
      <div style={{ flex: '1 1 340px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
            Quadrante PEP — exposição × risco
          </h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[['titular','Titular'],['familiar','Familiar 2º grau'],['representante','Representante'],['colaborador','Colaborador']].map(([tipo, label]) => (
              <span key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--ink-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: PEP_COLORS[tipo], flexShrink: 0 }} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ height: 186, overflow: 'visible' }}>
          <svg viewBox="0 0 500 280" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
            <rect x={CROSS_X} y={40} width={450 - CROSS_X} height={CROSS_Y - 40} fill="rgba(226,59,59,.05)" />
            <text x={449} y={54} fontSize={9} fill="var(--red)" fontWeight={700} textAnchor="end">Ação</text>
            <line x1={50} y1={240} x2={450} y2={240} stroke="var(--line)" strokeWidth={1} />
            <line x1={50} y1={40}  x2={50}  y2={240} stroke="var(--line)" strokeWidth={1} />
            <line x1={CROSS_X} y1={40}  x2={CROSS_X} y2={240} stroke="var(--muted-2)" strokeWidth={1} strokeDasharray="4 3" />
            <line x1={50} y1={CROSS_Y} x2={450} y2={CROSS_Y} stroke="var(--muted-2)" strokeWidth={1} strokeDasharray="4 3" />
            <text x={250} y={260} fontSize={10} fill="var(--muted-text)" textAnchor="middle">exposição PEP →</text>
            <text x={14}  y={145} fontSize={10} fill="var(--muted-text)" textAnchor="middle" transform="rotate(-90,14,145)">↑ risco / score PLD</text>
            {[0,25,50,75,100].map((v) => (
              <g key={v}>
                <line x1={SX(v)} y1={238} x2={SX(v)} y2={242} stroke="var(--line)" strokeWidth={1} />
                <text x={SX(v)} y={252} fontSize={8} fill="var(--muted-text)" textAnchor="middle">{v}</text>
                <line x1={48} y1={SY(v)} x2={52} y2={SY(v)} stroke="var(--line)" strokeWidth={1} />
                <text x={43} y={SY(v)+3} fontSize={8} fill="var(--muted-text)" textAnchor="end">{v}</text>
              </g>
            ))}
            {PEP_POINTS.map((pt) => {
              const isSel = p && pt.id === p.id
              const col   = PEP_COLORS[pt.tipo]
              return (
                <g key={pt.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPep(pt)}>
                  <circle cx={SX(pt.x)} cy={SY(pt.y)} r={isSel ? 10 : 7}
                    fill={col} fillOpacity={isSel ? 1 : 0.72}
                    stroke={isSel ? 'var(--ink)' : 'none'} strokeWidth={2} />
                  {isSel && (
                    <text x={SX(pt.x)} y={SY(pt.y) - 14} fontSize={9} fill="var(--ink)" fontWeight={700} textAnchor="middle">
                      {pt.nome}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--muted-text)' }}>
          {p ? `${p.nome} selecionado(a) · clique em outro ponto para trocar.` : 'Clique em um ponto para ver a ficha individual. Zona "Ação" = alta exposição + alto risco.'}
        </div>
      </div>

      {/* ficha */}
      {p ? (
        <div style={{ flex: '1 1 280px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', padding: '14px 16px' }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: 10 }}>
            Ficha PEP — pessoa selecionada
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
            <span style={{ width: 30, height: 30, borderRadius: '50%', background: pepColor ?? undefined, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
              {p.nome[0]}
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>{p.nome}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, color: pepColor ?? undefined, background: 'var(--bg)' }}>{p.cat}</span>
            <span style={{ marginLeft: 'auto', fontSize: 19, fontWeight: 800, fontFamily: 'var(--font-mono)', color: sc ?? undefined }}>{p.score}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: 8 }}>Condição PEP</div>
              {[['Cargo', p.cargo], ['Esfera', p.esfera], ['Categoria', p.cat]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid var(--bg)' }}>
                  <span style={{ color: 'var(--muted-text)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--muted-text)' }}>Aging (5 anos)</span>
                  <span style={{ fontWeight: 700, color: p.agingMeses <= 12 ? 'var(--orange)' : 'var(--muted-text)', fontFamily: 'var(--font-mono)' }}>
                    {p.agingMeses}mo / {p.agingMax}mo
                  </span>
                </div>
                <div style={{ height: 5, background: 'var(--line)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 999, width: `${Math.round(p.agingMeses / p.agingMax * 100)}%`, background: p.agingMeses <= 12 ? 'var(--orange)' : 'var(--muted-2)' }} />
                </div>
                <div style={{ fontSize: 10.5, color: p.agingMeses <= 12 ? 'var(--orange)' : 'var(--muted-text)', marginTop: 3 }}>
                  {p.agingMeses <= 12 ? '⚠ Exposição recente — máxima atenção' : 'Status ativo · monitoramento contínuo'}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted-text)', marginBottom: 8 }}>Comportamento financeiro</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
                {[{ label:'Volume', v:p.vol, alert:false }, { label:'Depósitos', v:p.dep, alert:false }, { label:'Giro', v:p.giro, alert:p.giroAlto }].map((k) => (
                  <div key={k.label} style={{ textAlign: 'center', background: k.alert ? 'var(--red-soft)' : 'var(--bg)', borderRadius: 8, padding: '6px 4px' }}>
                    <div style={{ fontSize: 9.5, color: k.alert ? 'var(--red)' : 'var(--muted-text)', fontWeight: 700, marginBottom: 3 }}>{k.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: k.alert ? 'var(--red)' : 'var(--ink)' }}>{k.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {p.fatores.map((f) => (
                  <span key={f} style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--amber)', background: 'var(--amber-soft)', border: '1px solid var(--orange-line)', padding: '2px 7px', borderRadius: 6 }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--line)', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-text)' }}>
              Vínculos: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.vinculos}</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>Diligência reforçada:</span>
              {diligStyle && <Pill c={diligStyle.c} bg={diligStyle.bg}>{p.diligencia}</Pill>}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: '1 1 280px', display: 'grid', placeItems: 'center', minHeight: 200, background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px dashed var(--muted-2)', color: 'var(--muted-text)', fontSize: 13, textAlign: 'center', padding: 24 }}>
          Clique em um ponto<br />para ver a ficha individual
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function PldAmlPage() {
  const [selected, setSelected]       = useState<Row | null>(null)
  const [filter, setFilter]           = useState('Todos')
  const [rowStatus, setRowStatus]     = useState<Record<number, string>>({})
  const [selectedPep, setSelectedPep] = useState<PepPoint | null>(null)

  function updateStatus(id: number, newStatus: string) {
    setRowStatus((prev) => ({ ...prev, [id]: newStatus }))
    if (newStatus === 'Arquivado' || newStatus === 'Comunicado COAF') setSelected(null)
  }

  const filtered = ROWS
    .filter((r) => {
      const s = rowStatus[r.id] || r.status
      if (filter === 'Todos')        return true
      if (filter === 'Aberto')       return s === 'Aberto'
      if (filter === 'Em análise')   return s === 'Em análise'
      if (filter === 'Crítico')      return r.sev === 'Crítico'
      if (filter === 'Estruturação') return r.flag === 'Estruturação'
      if (filter === 'vaidebet')     return r.marca.startsWith('vaidebet')
      return true
    })
    .sort((a, b) => (b.crit ? 1 : 0) - (a.crit ? 1 : 0))

  return (
    <main className="canvas">
      <div style={{ padding: 'clamp(16px,2vw,40px)', paddingBottom: 56 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 4 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>PLD / AML</h1>
              <div style={{ fontSize: 14, color: 'var(--muted-text)', marginTop: 5, lineHeight: 1.4 }}>
                Detectar, investigar e reportar operações suspeitas ao COAF — com trilha auditável.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '7px 13px', borderRadius: 999, color: 'var(--orange)', background: 'var(--orange-soft)', border: '1px solid var(--orange-line)', whiteSpace: 'nowrap' }}>
                ⚷ Acesso restrito · Compliance
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '7px 13px', borderRadius: 999, color: 'var(--muted-text)', background: 'var(--card)', border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                Junho/2026 · todas as marcas
              </span>
            </div>
          </div>

          {/* Indicadores — faixa plana */}
          <Sech>Visão geral</Sech>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            {KPI_DATA.map((kpi, i) => (
              <button key={kpi.label}
                style={{ textAlign: 'left', background: 'none', border: 'none', borderRight: i < 3 ? '1px solid var(--line)' : 'none', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 9, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <span style={{ fontSize: 13, color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: 5, lineHeight: 1.3 }}>
                  {kpi.label}
                  <span title={kpi.tooltip}
                    style={{ width: 15, height: 15, borderRadius: '50%', border: '1px solid var(--line)', color: 'var(--muted-text)', fontSize: 9.5, fontStyle: 'italic', fontWeight: 700, display: 'inline-grid', placeItems: 'center', flexShrink: 0, cursor: 'help', fontFamily: 'serif' }}>
                    i
                  </span>
                </span>
                <span style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)', lineHeight: 1 }}>
                  {kpi.value}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: kpi.deltaColor || 'var(--muted-text)' }}>
                  {kpi.delta}
                </span>
              </button>
            ))}
          </div>

          {/* COAF + PEP — 2 colunas, empilha abaixo de ~1100px via flex wrap */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 26 }}>
            <div style={{ flex: '1 1 460px', minWidth: 0 }}>
              <Sech style={{ margin: '0 0 11px' }}>Prazo COAF (24h)</Sech>
              <CoafTimeline onInvestigate={(row) => { setSelected(row); setTimeout(() => document.getElementById('pld-drawer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }} />
            </div>
            <div style={{ flex: '1 1 460px', minWidth: 0 }}>
              <Sech style={{ margin: '0 0 11px' }}>Pessoas politicamente expostas (PEP)</Sech>
              <PepSection selectedPep={selectedPep} setSelectedPep={setSelectedPep} />
            </div>
          </div>

          {/* WorkList */}
          <Sech>Fila de alertas (WorkList)</Sech>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-text)', marginRight: 2 }}>Filtros:</span>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setSelected(null) }}
                style={{ fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  background: filter === f ? 'var(--orange)' : 'var(--bg)',
                  color:      filter === f ? '#fff'          : 'var(--ink-2)' }}>
                {f}
              </button>
            ))}
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Apostador','Marca','Red flag','Score PLD','Severidade','SLA','Status','Responsável'].map((h) => (
                    <th key={h} style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--muted-text)', textAlign: 'left', fontWeight: 700, padding: '11px 14px', borderBottom: '1px solid var(--line)', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const status = rowStatus[row.id] || row.status
                  const sc     = SCORE_COLOR(row.score)
                  const sev    = SEV[row.sev]  || SEV['Médio']
                  const st     = ST[status]    || ST['Aberto']
                  const slaCol = row.slaC === 'r' ? 'var(--red)' : row.slaC === 'a' ? 'var(--amber)' : 'var(--muted-text)'
                  const isSel  = selected?.id === row.id
                  const bg     = isSel ? 'var(--orange-soft)' : undefined
                  return (
                    <tr key={row.id} onClick={() => setSelected(isSel ? null : row)}
                      style={{ cursor: 'pointer', boxShadow: row.crit ? 'inset 3px 0 0 var(--red)' : 'none' }}>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>{row.nome}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{row.cpf}</div>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', background: bg }}>{row.marca}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', background: bg }}>{row.flag}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}>
                        <span style={{ width: 84, height: 6, background: 'var(--line)', borderRadius: 999, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', marginRight: 7 }}>
                          <span style={{ display: 'block', height: '100%', borderRadius: 999, background: sc, width: `${row.score}%` }} />
                        </span>
                        <span style={{ fontWeight: 800, fontSize: 13.5, color: sc }}>{row.score}</span>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}><Pill c={sev.c} bg={sev.bg}>{row.sev}</Pill></td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13, color: slaCol, background: bg }}>{row.sla}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}><Pill c={st.c} bg={st.bg}>{status}</Pill></td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13, color: 'var(--muted-text)', background: bg }}>{row.resp}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Drawer */}
          <div id="pld-drawer">
            {selected && (
              <Drawer row={selected} rowStatus={rowStatus} onUpdateStatus={updateStatus} onClose={() => setSelected(null)} />
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
            <span style={{ fontSize: 12.5, color: 'var(--muted-text)' }}>Abrir páginas:</span>
            {['Perfil do apostador', 'Watchlist', 'Glossário COAF', 'Fluxos PLD'].map((label) => (
              <span key={label} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-2)', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}>
                {label}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 11.5, color: 'var(--muted-text)' }}>
            <span>⚷ Trilha auditável — autor + timestamp, imutável (5 anos)</span>
            <span>LGPD — CPF/nome/IP mascarados em tela</span>
            <span>Anti-tipping-off — nunca exibido ao apostador</span>
            <span>Export do RO ao COAF sem máscara (Lei 9.613, art. 11)</span>
          </div>

        </div>
      </div>
    </main>
  )
}
