import { useState } from 'react'

// ---------------------------------------------------------------------------
// Dados mock
// ---------------------------------------------------------------------------
const ROWS = [
  { id: 1, nome: 'EVANDRO P.',  cpf: '•••.•••.•••-70', marca: 'vaidebet-ngx', flag: 'Estruturação',           score: 92, sev: 'Crítico', sla: '3h',    slaC: 'r', status: 'Aberto',          resp: '—',      crit: true  },
  { id: 2, nome: 'ADIEL F.',    cpf: '•••.•••.•••-10', marca: 'betnacional',   flag: 'Saque atípico',          score: 88, sev: 'Crítico', sla: '7h',    slaC: 'r', status: 'Em análise',      resp: 'Marina', crit: true  },
  { id: 3, nome: 'J. SOUSA',    cpf: '•••.•••.•••-44', marca: 'vaidebet',      flag: 'Depósito suspeito',      score: 76, sev: 'Alto',    sla: '19h',   slaC: 'a', status: 'Aberto',          resp: '—',      crit: false },
  { id: 4, nome: 'R. LIMA',     cpf: '•••.•••.•••-29', marca: 'kto',           flag: 'Estruturação',           score: 71, sev: 'Alto',    sla: '1d 4h', slaC: 'm', status: 'Em análise',      resp: 'Caio',   crit: false },
  { id: 5, nome: 'T. ALVES',    cpf: '•••.•••.•••-83', marca: 'betano',        flag: 'Comport. inconsistente', score: 64, sev: 'Médio',   sla: '2d',    slaC: 'm', status: 'Aberto',          resp: '—',      crit: false },
  { id: 6, nome: 'M. COSTA',    cpf: '•••.•••.•••-05', marca: 'vaidebet',      flag: 'Saque atípico',          score: 58, sev: 'Médio',   sla: '—',     slaC: 'm', status: 'Comunicado COAF', resp: 'Marina', crit: false },
]

const DRAWER_DATA = {
  1: {
    timeline: [
      { desc: 'Depósito PIX R$ 1.980', ts: '09/06 14:02' },
      { desc: 'Depósito PIX R$ 1.950', ts: '09/06 14:09' },
      { desc: 'Depósito PIX R$ 1.990', ts: '09/06 14:21' },
      { desc: 'Saque R$ 5.800 sem aposta', ts: '09/06 14:35' },
    ],
    factors: ['Fracionamento < R$ 2.000 · ×3', 'Saque sem aposta', 'Velocidade atípica', 'Conta no mesmo IP de 2 contas'],
    vinculos: ['2 contas no mesmo IP', 'Mesma marca · dispositivo recorrente', 'PIX de 3 remetentes distintos'],
  },
  2: {
    timeline: [
      { desc: 'Depósito R$ 4.200',      ts: '08/06 09:14' },
      { desc: 'Aposta R$ 50',            ts: '08/06 09:17' },
      { desc: 'Saque R$ 4.100',         ts: '08/06 09:22' },
    ],
    factors: ['Saque logo após depósito', 'Aposta simbólica (R$ 50)', 'Ratio dep/saque > 97%'],
    vinculos: ['IP compartilhado com conta banida', 'PIX de origem variada'],
  },
  3: {
    timeline: [
      { desc: 'Depósito PIX R$ 8.500',  ts: '07/06 22:05' },
      { desc: 'Depósito PIX R$ 7.900',  ts: '07/06 22:31' },
      { desc: 'Sem apostas registradas', ts: '—' },
    ],
    factors: ['Volume atípico para perfil', 'Sem atividade de aposta', 'Horário suspeito (madrugada)'],
    vinculos: ['Nenhum vínculo identificado até o momento'],
  },
  4: {
    timeline: [
      { desc: 'Depósito R$ 1.900',       ts: '05/06 10:01' },
      { desc: 'Depósito R$ 1.850',       ts: '05/06 10:08' },
      { desc: 'Depósito R$ 1.980',       ts: '05/06 10:19' },
      { desc: 'Saque R$ 5.600',         ts: '05/06 10:44' },
    ],
    factors: ['Fracionamento < R$ 2.000 · ×3', 'Saque consolidado', 'Padrão similar ao caso #1'],
    vinculos: ['Dispositivo recorrente em 3 operações'],
  },
  5: {
    timeline: [
      { desc: 'Apostas em mercados opostos', ts: '04/06 — 06/06' },
    ],
    factors: ['Apostas em resultados opostos', 'Sem histórico de lucro consistente'],
    vinculos: ['Nenhum vínculo identificado'],
  },
  6: {
    timeline: [
      { desc: 'Saque R$ 12.000',         ts: '01/06 08:30' },
      { desc: 'Comunicação enviada COAF', ts: '02/06 09:00' },
    ],
    factors: ['Saque atípico para o perfil', 'Frequência de saques +4× no mês'],
    vinculos: ['Conta bancária de destino diferente do cadastrado'],
  },
}

const SCORE_COLOR = (s) => s >= 85 ? 'var(--red)' : s >= 70 ? 'var(--amber)' : 'var(--muted)'

// Mapeamentos de severidade / status usando tokens do theme.css
const SEV = {
  'Crítico': { c: 'var(--red)',    bg: 'var(--red-soft)'    },
  'Alto':    { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
  'Médio':   { c: 'var(--ink-2)', bg: 'var(--bg)'           },
}
const ST = {
  'Aberto':          { c: 'var(--orange)', bg: 'var(--orange-soft)' },
  'Em análise':      { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
  'Comunicado COAF': { c: 'var(--green)',  bg: 'var(--green-soft)'  },
  'Arquivado':       { c: 'var(--muted)',  bg: 'var(--bg)'          },
}

const FILTERS = ['Todos', 'Aberto', 'Em análise', 'Crítico', 'Estruturação', 'vaidebet']

// Sparklines pré-definidos
const SP_UP   = 'M2,18 11,16 20,14 29,12 38,11 47,8 54,4'
const SP_FLAT = 'M2,16 11,12 20,14 29,7 38,8 47,6 54,3'
const SP_MID  = 'M2,18 11,15 20,16 29,11 38,9 47,7 54,4'

function Spark({ points, color = 'var(--muted)' }) {
  return (
    <svg width="56" height="22" viewBox="0 0 56 22" style={{ flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Pill({ c, bg, children }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap', color: c, background: bg }}>
      {children}
    </span>
  )
}

function Sech({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--muted)', margin: '26px 0 11px' }}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal (COAF ou Arquivar)
// ---------------------------------------------------------------------------
function Modal({ type, justificativa, setJustificativa, onConfirm, onClose }) {
  const isCoaf = type === 'coaf'
  const valid  = isCoaf || justificativa.trim().length >= 50
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,31,.45)', display: 'grid', placeItems: 'center', zIndex: 200, padding: 20 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', width: 480, maxWidth: '100%', padding: '24px 26px', boxShadow: '0 16px 48px rgba(16,24,40,.22)' }}>
        <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)', marginBottom: 10 }}>
          {isCoaf ? '→ Escalar para COAF' : 'Arquivar caso'}
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          {isCoaf
            ? 'Confirma a comunicação ao COAF? Registrado em trilha auditável e irreversível. O RO será gerado sem mascaramento de CPF/nome (Lei 9.613, art. 11).'
            : 'Justificativa obrigatória (mín. 50 caracteres). Registrada em trilha auditável.'}
        </p>
        {!isCoaf && (
          <>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva o motivo do arquivamento..."
              rows={4}
              style={{ width: '100%', resize: 'vertical', borderRadius: 10, border: '1px solid var(--line)', padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--ink)' }}
            />
            <div style={{ fontSize: 11, color: justificativa.trim().length >= 50 ? 'var(--green)' : 'var(--muted)', marginTop: 5 }}>
              {justificativa.trim().length}/50 caracteres mínimos
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button
            disabled={!valid}
            onClick={valid ? onConfirm : undefined}
            className={valid ? 'btn-primary' : undefined}
            style={!valid ? { padding: '9px 18px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13, background: 'var(--line)', color: 'var(--muted)', cursor: 'not-allowed' } : { background: isCoaf ? 'var(--orange)' : 'var(--red)' }}>
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
function Drawer({ row, rowStatus, onUpdateStatus, onClose }) {
  const [modal, setModal]          = useState(null)
  const [justif, setJustif]        = useState('')
  const d      = DRAWER_DATA[row.id] || {}
  const status = rowStatus[row.id] || row.status
  const sc     = SCORE_COLOR(row.score)

  function confirm() {
    if (modal === 'coaf')    onUpdateStatus(row.id, 'Comunicado COAF')
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

          {/* Esquerda — dados */}
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>{row.nome}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '3px 9px', borderRadius: 7 }}>{row.marca}</span>
              <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: sc }}>{row.score}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>
              {row.cpf} · {row.flag} · {row.sev} · SLA {row.sla}
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted)', margin: '16px 0 8px' }}>
              Timeline de transações
            </div>
            <div style={{ position: 'relative', paddingLeft: 16 }}>
              <div style={{ position: 'absolute', left: 4, top: 3, bottom: 3, width: 2, background: 'var(--line)' }} />
              {d.timeline?.map((t, i) => (
                <div key={i} style={{ position: 'relative', padding: '5px 0 5px 4px', fontSize: 12.5, color: 'var(--ink)' }}>
                  <span style={{ position: 'absolute', left: -15, top: 9, width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', display: 'block' }} />
                  {t.desc} <span style={{ color: 'var(--muted)', fontSize: 11 }}>— {t.ts}</span>
                </div>
              ))}
            </div>

            {row.score >= 70 && (
              <>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted)', margin: '16px 0 8px' }}>
                  Score factors (≥ 70 · obrigatório)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {d.factors?.map((f) => (
                    <span key={f} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--amber)', background: 'var(--amber-soft)', border: '1px solid var(--orange-line)', padding: '4px 9px', borderRadius: 7 }}>{f}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Direita — vínculos + decisão */}
          <div style={{ padding: '16px 18px', background: '#FCFCFD', borderLeft: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Vínculos</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.75 }}>
              {d.vinculos?.map((v, i) => <div key={i}>• {v}</div>)}
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted)', margin: '16px 0 8px' }}>Decisão</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.6 }}>
              Status: <b>{status}</b>
              {status === 'Aberto' && (
                <span style={{ color: 'var(--muted)', display: 'block', marginTop: 4, fontSize: 12 }}>
                  → Inicie a análise para habilitar a comunicação.
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {status === 'Aberto' && (
                <button className="btn-primary" onClick={() => onUpdateStatus(row.id, 'Em análise')}>
                  Iniciar análise
                </button>
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

            <div style={{ marginTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
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
// KPI tile
// ---------------------------------------------------------------------------
function KpiCard({ label, tooltip, value, small, delta, deltaColor, drill, sparkPoints, sparkColor, children }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', padding: '14px 15px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.3 }}>
        {label}
        <span title={tooltip} style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--line)', color: 'var(--muted)', fontSize: 10, fontStyle: 'italic', fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0, cursor: 'help' }}>i</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginTop: 7 }}>
        <span style={{ fontSize: small ? 19 : 27, fontWeight: 800, lineHeight: 1, color: 'var(--ink)', fontFamily: small ? 'var(--font-body)' : undefined }}>
          {value}
        </span>
        {sparkPoints && <Spark points={sparkPoints} color={sparkColor} />}
        {children}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: deltaColor || 'var(--muted)' }}>{delta}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>{drill} ↗</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function PldAmlPage() {
  const [selected, setSelected]   = useState(null)
  const [filter, setFilter]       = useState('Todos')
  const [rowStatus, setRowStatus] = useState({})

  function updateStatus(id, newStatus) {
    setRowStatus((prev) => ({ ...prev, [id]: newStatus }))
    // se mudou para Arquivado/Comunicado, fechar drawer
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

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 4 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
                PLD / AML
              </h1>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 5, lineHeight: 1.4 }}>
                Detectar, investigar e reportar operações suspeitas ao COAF — com trilha auditável.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, padding: '7px 13px', borderRadius: 999, color: 'var(--orange)', background: 'var(--orange-soft)', border: '1px solid var(--orange-line)', whiteSpace: 'nowrap' }}>
                ⚷ Acesso restrito · Compliance
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, padding: '7px 13px', borderRadius: 999, color: 'var(--muted)', background: 'var(--card)', border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                Junho/2026 · todas as marcas
              </span>
            </div>
          </div>

          {/* ── KPIs ── */}
          <Sech>Visão geral</Sech>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            <KpiCard
              label="Apostadores com flag ativo"
              tooltip="Qtd. de apostadores com pelo menos 1 red flag ativo (não arquivado)."
              value="27" sparkPoints={SP_UP} sparkColor="var(--red)"
              delta="▲ +4 no período" deltaColor="var(--red)" drill="abrir watchlist"
            />
            <KpiCard
              label="Alertas gerados"
              tooltip="Total de alertas criados no período selecionado."
              value="38" sparkPoints={SP_FLAT} sparkColor="var(--muted)"
              delta="no período" drill="abrir fila"
            />
            <KpiCard
              label="Volume sob análise"
              tooltip="Soma do volume financeiro dos apostadores atualmente em análise."
              value="R$ 1,24 mi" small sparkPoints={SP_MID} sparkColor="var(--muted)"
              delta="▲ +R$ 180 mil" deltaColor="var(--amber)" drill="abrir fila"
            />
            <KpiCard
              label="Red flags por categoria"
              tooltip="Distribuição: estruturação · saque atípico · depósito suspeito · comportamento inconsistente."
              value="34"
              delta="4 categorias" drill="abrir fila">
              {/* barra de distribuição de categorias */}
              <div style={{ display: 'flex', height: 8, width: 64, borderRadius: 999, overflow: 'hidden', alignSelf: 'center', background: 'var(--line)' }}>
                <span style={{ width: '41%', background: 'var(--red)' }} />
                <span style={{ width: '26%', background: 'var(--amber)' }} />
                <span style={{ width: '21%', background: 'var(--orange)' }} />
                <span style={{ width: '12%', background: 'var(--muted)' }} />
              </div>
            </KpiCard>
          </div>

          {/* ── Contexto: countdown + severidade ── */}
          <Sech>Prazo &amp; distribuição</Sech>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', padding: '15px 17px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
                Prazo COAF — críticos (24h)
              </h3>
              {[
                { nome: 'EVANDRO P.', marca: 'vaidebet-ngx', left: 'faltam 3h',  cor: 'var(--red)'   },
                { nome: 'ADIEL F.',   marca: 'betnacional',  left: 'faltam 7h',  cor: 'var(--red)'   },
                { nome: 'J. SOUSA',   marca: 'vaidebet',     left: 'faltam 19h', cor: 'var(--amber)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}>{item.nome}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>{item.marca}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: item.cor, whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>{item.left}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', padding: '15px 17px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
                Alertas por severidade
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[
                  { label: 'Crítico', pct: 34, cor: 'var(--red)',   n: 13 },
                  { label: 'Alto',    pct: 45, cor: 'var(--amber)', n: 17 },
                  { label: 'Médio',   pct: 21, cor: 'var(--muted)', n: 8  },
                ].map((b) => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)', width: 60, flexShrink: 0 }}>{b.label}</span>
                    <div style={{ flex: 1, height: 9, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.pct}%`, borderRadius: 999, background: b.cor }} />
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, width: 24, textAlign: 'right', color: 'var(--ink-2)' }}>{b.n}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── WorkList ── */}
          <Sech>Fila de alertas (WorkList)</Sech>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', marginRight: 2 }}>Filtros:</span>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setSelected(null) }}
                style={{ fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  background: filter === f ? 'var(--orange)' : 'var(--bg)',
                  color:      filter === f ? '#fff' : 'var(--ink-2)' }}>
                {f}
              </button>
            ))}
          </div>

          {/* tabela — wrapper div para border-radius funcionar */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Apostador', 'Marca', 'Red flag', 'Score PLD', 'Severidade', 'SLA', 'Status', 'Responsável'].map((h) => (
                    <th key={h} style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--muted)', textAlign: 'left', fontWeight: 700, padding: '11px 14px', borderBottom: '1px solid var(--line)', background: '#FCFCFD', fontFamily: 'var(--font-body)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const status = rowStatus[row.id] || row.status
                  const sc     = SCORE_COLOR(row.score)
                  const sev    = SEV[row.sev]  || SEV['Médio']
                  const st     = ST[status]    || ST['Aberto']
                  const slaCol = row.slaC === 'r' ? 'var(--red)' : row.slaC === 'a' ? 'var(--amber)' : 'var(--muted)'
                  const isSel  = selected?.id === row.id
                  return (
                    <tr key={row.id} onClick={() => setSelected(isSel ? null : row)}
                      style={{ cursor: 'pointer', boxShadow: row.crit ? 'inset 3px 0 0 var(--red)' : 'none' }}>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: isSel ? 'var(--orange-soft)' : undefined }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>{row.nome}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{row.cpf}</div>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', background: isSel ? 'var(--orange-soft)' : undefined }}>{row.marca}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', background: isSel ? 'var(--orange-soft)' : undefined }}>{row.flag}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: isSel ? 'var(--orange-soft)' : undefined }}>
                        <span style={{ width: 84, height: 6, background: 'var(--line)', borderRadius: 999, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', marginRight: 7 }}>
                          <span style={{ display: 'block', height: '100%', borderRadius: 999, background: sc, width: `${row.score}%` }} />
                        </span>
                        <span style={{ fontWeight: 800, fontSize: 13.5, color: sc }}>{row.score}</span>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: isSel ? 'var(--orange-soft)' : undefined }}>
                        <Pill c={sev.c} bg={sev.bg}>{row.sev}</Pill>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13, color: slaCol, background: isSel ? 'var(--orange-soft)' : undefined }}>{row.sla}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: isSel ? 'var(--orange-soft)' : undefined }}>
                        <Pill c={st.c} bg={st.bg}>{status}</Pill>
                      </td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13, color: 'var(--muted)', background: isSel ? 'var(--orange-soft)' : undefined }}>{row.resp}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ── Drawer ── */}
          {selected && (
            <Drawer row={selected} rowStatus={rowStatus} onUpdateStatus={updateStatus} onClose={() => setSelected(null)} />
          )}

          {/* ── Footer drills + lembretes ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Abrir páginas:</span>
            {['Perfil do apostador', 'Watchlist', 'Glossário COAF', 'Fluxos PLD'].map((label) => (
              <span key={label} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-2)', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 999, padding: '8px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 11.5, color: 'var(--muted)' }}>
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
