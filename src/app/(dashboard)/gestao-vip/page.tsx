"use client"
import { useState } from 'react'

// ── Color palette (hex only used where CSS vars unavailable, e.g. recharts) ─
const C = {
  orange:     '#F26122',
  orange2:    '#F08A52',
  orangeSoft: '#FDEDE6',
  ink:        '#1A1A1A',
  muted:      '#8A92A3',
  green:      '#3BA776',
  amber:      '#E0901F',
  red:        '#E54848',
  line:       '#E5E5E5',
}

const TIER_COLORS: Record<string, string> = {
  Legend:    '#C9A227',
  Elite:     C.orange,
  Exclusive: '#E08A4E',
  Black:     C.ink,
}

// ── Shared Panel wrapper ────────────────────────────────────────────────────
function Panel({ title, sub, children, style }: {
  title: string
  sub?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', ...style,
    }}>
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

// ── VIP Triage ──────────────────────────────────────────────────────────────
const TRIAGE = [
  { type: 'red',  label: 'Valor em risco',      value: 'R$ 6,8M',      desc: '31 VIPs Legend/Elite em churn alto' },
  { type: 'warn', label: 'Affordability / RG',  value: '9 VIPs',       desc: 'revisão trimestral pendente' },
  { type: 'warn', label: 'Quedas bruscas',       value: '14 VIPs',      desc: 'turnover −40%+ vs. mês anterior' },
  { type: 'info', label: 'Radar de novos VIPs', value: '7 detectados', desc: 'primeiros 14 dias (ML)' },
]

const TRIAGE_STYLE: Record<string, { bg: string; color: string }> = {
  red:  { bg: 'var(--red-soft)',    color: 'var(--red)'    },
  warn: { bg: 'var(--amber-soft)',  color: 'var(--amber)'  },
  info: { bg: 'var(--orange-soft)', color: 'var(--orange)' },
}

function VipTriagePanel() {
  return (
    <Panel title="VIP — Triagem" sub="O que requer ação agora">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {TRIAGE.map((t) => {
          const s = TRIAGE_STYLE[t.type]
          return (
            <div key={t.label} style={{
              background: s.bg, borderRadius: 12, padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 5,
            }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: s.color, textTransform: 'uppercase' as const, letterSpacing: '.5px' }}>
                {t.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                {t.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-text)', lineHeight: 1.4 }}>
                {t.desc}
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

// ── VIP KPIs ────────────────────────────────────────────────────────────────
const KPIS = [
  { lbl: 'VIPs ativos',     val: '1.284',     varStr: '+6,2%',  dir: 'up',   note: null },
  { lbl: 'GGR da carteira', val: 'R$ 18,4M',  varStr: '+9,1%',  dir: 'up',   note: '68% do GGR total' },
  { lbl: 'NGR da carteira', val: 'R$ 12,6M',  varStr: '+7,4%',  dir: 'up',   note: null },
  { lbl: 'ARPPU (GGR)',     val: 'R$ 14.330', varStr: '+3,1%',  dir: 'up',   note: 'receita média por VIP' },
  { lbl: 'Hold médio',      val: '6,8%',      varStr: null,     dir: null,   note: 'GGR ÷ turnover' },
  { lbl: 'Bônus / GGR',     val: '11,2%',     varStr: '+1,4pp', dir: 'down', note: 'monitorar custo' },
  { lbl: 'Net Cash (MTD)',  val: 'R$ 11,9M',  varStr: '+4,3%',  dir: 'up',   note: null },
  { lbl: 'Score médio',     val: '78',        varStr: null,     dir: null,   note: '4% em alto/crítico' },
]

const SPARK = [3, 5, 4, 6, 5, 7, 8]

function Sparkline({ up }: { up: boolean }) {
  const max = Math.max(...SPARK), min = Math.min(...SPARK)
  const w = 48, h = 22
  const pts = SPARK.map((v, i) =>
    `${(i / (SPARK.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`
  ).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={up ? C.orange : C.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function VipKpisPanel() {
  return (
    <Panel title="VIP — Saúde da carteira" sub="GGR · NGR · ARPPU · Hold">
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 1, background: 'var(--line)', border: '1px solid var(--line)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {KPIS.map((k) => {
          const isDown = k.dir === 'down'
          const dirColor = k.dir === 'up' ? 'var(--green)' : k.dir === 'down' ? 'var(--red)' : 'var(--muted-text)'
          const arrow = k.dir === 'up' ? '▲' : k.dir === 'down' ? '▼' : ''
          return (
            <div key={k.lbl} style={{ background: 'var(--card)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.4px' }}>
                {k.lbl}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {k.val}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                {k.varStr ? (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: dirColor }}>{arrow} {k.varStr}</span>
                ) : (
                  <span style={{ fontSize: 10.5, color: 'var(--muted-text)' }}>{k.note ?? '—'}</span>
                )}
                {k.varStr && <Sparkline up={!isDown} />}
              </div>
              {k.varStr && k.note && (
                <div style={{ fontSize: 9.5, color: 'var(--muted-2)' }}>{k.note}</div>
              )}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

// ── VIP Tier Bars ───────────────────────────────────────────────────────────
const TIERS = [
  { name: 'Legend',    subs: [180, 120, 90, 60] },
  { name: 'Elite',     subs: [160, 110, 85, 45] },
  { name: 'Exclusive', subs: [120, 80,  55, 35] },
  { name: 'Black',     subs: [60,  45,  25, 14] },
]
const TIER_MAX = Math.max(...TIERS.map((t) => t.subs.reduce((a, b) => a + b, 0)))

function VipTierBarsPanel() {
  return (
    <Panel title="VIP — Tiers e subtiers" sub="Composição por tier e score">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TIERS.map((t) => {
          const total = t.subs.reduce((a, b) => a + b, 0)
          const widthPct = (total / TIER_MAX) * 100
          const color = TIER_COLORS[t.name]
          return (
            <div key={t.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                  {t.name}
                </span>
                <span style={{ color: 'var(--muted-text)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{total}</span>
              </div>
              <div style={{ height: 10, borderRadius: 6, background: '#F0F1F4', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${widthPct}%`, display: 'flex', overflow: 'hidden', borderRadius: 6 }}>
                  {t.subs.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        height: '100%',
                        width: `${(s / total) * 100}%`,
                        background: color,
                        opacity: 1 - i * 0.18,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {t.subs.map((s, i) => (
                  <span key={i} style={{ fontSize: 9.5, color: 'var(--muted-2)' }}>S{i + 1}: {s}</span>
                ))}
              </div>
            </div>
          )
        })}

        <div style={{ marginTop: 4, padding: '10px 12px', background: 'var(--orange-soft)', borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.3px', fontWeight: 600 }}>Total VIPs ativos</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--orange)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>1.284</div>
        </div>
      </div>
    </Panel>
  )
}

// ── VIP Roster ──────────────────────────────────────────────────────────────
const ROSTER = [
  { name: 'Marcos A.',  id: 'usr_8f3a91', tier: 'Legend',    sub: 1, vertical: 'Cassino', risco: '412.800', ltv: '480k',  ggr: '180.300', hold: '9,5%', score: 82, rfm: 'Camp.', flag: true,  churn: 'high' },
  { name: 'Rafael S.',  id: 'usr_5b22e0', tier: 'Legend',    sub: 3, vertical: 'Híbrido', risco: '246.600', ltv: '390k',  ggr: '118.900', hold: '8,1%', score: 74, rfm: 'Leal',  flag: false, churn: 'med'  },
  { name: 'Beatriz L.', id: 'usr_2a77f1', tier: 'Elite',     sub: 2, vertical: 'Cassino', risco: '201.300', ltv: '230k',  ggr: '61.200',  hold: '7,4%', score: 69, rfm: 'Risco', flag: true,  churn: 'high' },
  { name: 'Diego F.',   id: 'usr_9e34c2', tier: 'Elite',     sub: 4, vertical: 'Esporte', risco: '144.900', ltv: '188k',  ggr: '42.500',  hold: '5,2%', score: 58, rfm: 'Aten.', flag: true,  churn: 'med'  },
  { name: 'Carla M.',   id: 'usr_1f55d7', tier: 'Exclusive', sub: 1, vertical: 'Cassino', risco: '86.400',  ltv: '140k',  ggr: '33.800',  hold: '8,8%', score: 80, rfm: 'Leal',  flag: false, churn: 'med'  },
  { name: 'Helena C.',  id: 'usr_7c10aa', tier: 'Legend',    sub: 1, vertical: 'Esporte', risco: '60.400',  ltv: '305k',  ggr: '96.700',  hold: '6,1%', score: 88, rfm: 'Camp.', flag: false, churn: 'low'  },
  { name: 'Bruno T.',   id: 'usr_3c92a4', tier: 'Black',     sub: 4, vertical: 'Híbrido', risco: '37.500',  ltv: '62k',   ggr: '12.900',  hold: '5,9%', score: 61, rfm: 'Risco', flag: true,  churn: 'high' },
  { name: 'Paula N.',   id: 'usr_4d88b9', tier: 'Elite',     sub: 1, vertical: 'Híbrido', risco: '25.100',  ltv: '167k',  ggr: '74.000',  hold: '9,1%', score: 85, rfm: 'Camp.', flag: false, churn: 'low'  },
]

const CHURN_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  high: { bg: 'var(--red-soft)',   color: 'var(--red)',   label: 'Alto'  },
  med:  { bg: 'var(--amber-soft)', color: 'var(--amber)', label: 'Médio' },
  low:  { bg: 'var(--green-soft)', color: 'var(--green)', label: 'Baixo' },
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ height: 4, width: 40, borderRadius: 3, background: '#EEF0F2', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)', fontSize: 12 }}>{score}</span>
    </div>
  )
}

function VipRosterPanel() {
  const [hovered, setHovered] = useState<number | null>(null)
  const TH_STYLE: React.CSSProperties = {
    textAlign: 'left', padding: '6px 10px', fontSize: 10, fontWeight: 700,
    color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '.3px',
    borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap',
  }
  return (
    <Panel title="VIP — Carteira priorizada" sub="Ordenada por valor em risco">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {['#', 'Jogador', 'Tier', 'GGR MTD', 'Valor em Risco', 'Hold%', 'Score', 'Churn'].map((h) => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROSTER.map((r, i) => {
              const churnS = CHURN_STYLE[r.churn]
              const tierColor = TIER_COLORS[r.tier]
              const isTop3 = i < 3
              const isHov = hovered === i
              return (
                <tr
                  key={r.id}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: isHov ? C.orangeSoft : isTop3 ? '#FBE7E7' : 'transparent',
                    transition: 'background .15s',
                  }}
                >
                  <td style={{ padding: '9px 10px', color: 'var(--muted-text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {r.flag && <span style={{ color: 'var(--amber)', marginRight: 5 }}>⚑</span>}
                      {r.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{r.id}</div>
                  </td>
                  <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: tierColor }}>{r.tier}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--muted-text)', marginLeft: 4 }}>S{r.sub}</span>
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                    R$ {r.ggr}
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--orange)', whiteSpace: 'nowrap' }}>
                    R$ {r.risco}
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                    {r.hold}
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <ScoreBar score={r.score} />
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: churnS.color, background: churnS.bg, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                      {churnS.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

// ── VIP Opportunities ───────────────────────────────────────────────────────
const OPPS = [
  { tag: 'Retenção',   title: 'Alto valor em risco', desc: 'Legend/Elite com churn alto — maior impacto por intervenção.',   stat: '31',  unit: 'R$ 6,8M em LTV'       },
  { tag: 'Cross-sell', title: 'Cassino → Esporte',   desc: 'VIPs cassino-puros sem esporte em 90d.',                         stat: '146', unit: 'R$ 2,1M GGR potencial' },
  { tag: 'Upsell',     title: 'Quase Elite',          desc: 'Exclusive S1 a <8% do piso de Elite.',                           stat: '54',  unit: 'upgrade provável'      },
  { tag: 'Reativação', title: 'Legends adormecidos', desc: 'Ex-Legends com LTV alto fora do tier no mês.',                   stat: '19',  unit: 'LTV médio R$ 210k'     },
]

function VipOpportunitiesPanel() {
  return (
    <Panel title="VIP — Oportunidades" sub="Retenção · upsell · reativação">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
        {OPPS.map((o) => (
          <div key={o.title} style={{
            border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <span style={{
              fontSize: 9.5, fontWeight: 800, color: 'var(--orange)',
              background: 'var(--orange-soft)', padding: '2px 8px', borderRadius: 4,
              display: 'inline-block', textTransform: 'uppercase' as const, letterSpacing: '.4px', alignSelf: 'flex-start',
            }}>
              {o.tag}
            </span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>
              {o.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-text)', lineHeight: 1.45, flex: 1 }}>
              {o.desc}
            </div>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--ink)', lineHeight: 1 }}>{o.stat}</span>
              <span style={{ fontSize: 10.5, color: 'var(--muted-text)' }}>{o.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function GestaoVipPage() {
  return (
    <main className="canvas">
      <div style={{ padding: 'clamp(16px,2vw,40px)', paddingBottom: 56 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
              Gestão VIP
            </h1>
            <div style={{ fontSize: 14, color: 'var(--muted-text)', marginTop: 5 }}>
              Centro de Operação — carteira, triagem, oportunidades e saúde da receita VIP.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Triagem — full width */}
            <VipTriagePanel />

            {/* Saúde da carteira — full width */}
            <VipKpisPanel />

            {/* Tiers (5/12) + Oportunidades (7/12) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 14, alignItems: 'stretch' }}>
              <VipTierBarsPanel />
              <VipOpportunitiesPanel />
            </div>

            {/* Carteira priorizada — full width */}
            <VipRosterPanel />

          </div>
        </div>
      </div>
    </main>
  )
}
