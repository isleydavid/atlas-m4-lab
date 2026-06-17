"use client"
import { useState } from 'react'

// ── Color palette ───────────────────────────────────────────────────────────
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

// ── Tipo compartilhado de navegação ────────────────────────────────────────
type GoToClientesOpts = {
  churn?:    string[]
  rfm?:      string[]
  tag?:      string
  vertical?: string
  sort?:     { field: string; dir: 'asc' | 'desc' }
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
  { lbl: 'VIPs ativos',     val: '1.284',     varStr: '+6,2%',  dir: 'up',   note: null,                    click: {} as GoToClientesOpts },
  { lbl: 'GGR da carteira', val: 'R$ 18,4M',  varStr: '+9,1%',  dir: 'up',   note: '68% do GGR total',      click: { sort: { field: 'ggr', dir: 'desc' as const } } as GoToClientesOpts },
  { lbl: 'NGR da carteira', val: 'R$ 12,6M',  varStr: '+7,4%',  dir: 'up',   note: null,                    click: {} as GoToClientesOpts },
  { lbl: 'ARPPU (GGR)',     val: 'R$ 14.330', varStr: '+3,1%',  dir: 'up',   note: 'receita média por VIP',  click: undefined },
  { lbl: 'Hold médio',      val: '6,8%',      varStr: null,     dir: null,   note: 'GGR ÷ turnover',         click: undefined },
  { lbl: 'Bônus / GGR',     val: '11,2%',     varStr: '+1,4pp', dir: 'down', note: 'monitorar custo',        click: undefined },
  { lbl: 'Net Cash (MTD)',  val: 'R$ 11,9M',  varStr: '+4,3%',  dir: 'up',   note: null,                    click: {} as GoToClientesOpts },
  { lbl: 'Score médio',     val: '78',        varStr: null,     dir: null,   note: '4% em alto/crítico',     click: undefined },
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

function VipKpisPanel({ onCardClick }: { onCardClick?: (opts: GoToClientesOpts) => void }) {
  const [hov, setHov] = useState<number | null>(null)
  return (
    <Panel title="VIP — Saúde da carteira" sub="GGR · NGR · ARPPU · Hold">
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 1, background: 'var(--line)', border: '1px solid var(--line)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {KPIS.map((k, i) => {
          const isDown    = k.dir === 'down'
          const dirColor  = k.dir === 'up' ? 'var(--green)' : k.dir === 'down' ? 'var(--red)' : 'var(--muted-text)'
          const arrow     = k.dir === 'up' ? '▲' : k.dir === 'down' ? '▼' : ''
          const clickable = onCardClick !== undefined && k.click !== undefined
          const isHov     = hov === i
          return (
            <div
              key={k.lbl}
              onClick={clickable ? () => onCardClick!(k.click!) : undefined}
              onMouseEnter={() => { if (clickable) setHov(i) }}
              onMouseLeave={() => setHov(null)}
              style={{
                background: isHov ? C.orangeSoft : 'var(--card)',
                padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4,
                cursor: clickable ? 'pointer' : 'default',
                transition: 'background .15s',
              }}
            >
              <div style={{ fontSize: 9.5, fontWeight: 700, color: isHov ? 'var(--orange)' : 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.4px', transition: 'color .15s' }}>
                {k.lbl} {clickable && <span style={{ fontSize: 9 }}>→</span>}
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
                    <div key={i} style={{ height: '100%', width: `${(s / total) * 100}%`, background: color, opacity: 1 - i * 0.18 }} />
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

// ── VIP Roster data ─────────────────────────────────────────────────────────
const ROSTER = [
  { name: 'Marcos A.',  id: 'usr_8f3a91', tier: 'Legend',    sub: 1, vertical: 'Cassino', risco: '412.800', ltv: '480k',  ggr: '180.300', hold: '9,5%', score: 82, rfm: 'Camp.', flag: true,  churn: 'critical', turnover_90d: 2_150_000, casino_t90: 2_040_000, sport_t90:   110_000 },
  { name: 'Rafael S.',  id: 'usr_5b22e0', tier: 'Legend',    sub: 3, vertical: 'Híbrido', risco: '246.600', ltv: '390k',  ggr: '118.900', hold: '8,1%', score: 74, rfm: 'Leal',  flag: false, churn: 'med',      turnover_90d: 1_480_000, casino_t90:   740_000, sport_t90:   740_000 },
  { name: 'Beatriz L.', id: 'usr_2a77f1', tier: 'Elite',     sub: 2, vertical: 'Cassino', risco: '201.300', ltv: '230k',  ggr: '61.200',  hold: '7,4%', score: 69, rfm: 'Risco', flag: true,  churn: 'critical', turnover_90d: 1_080_000, casino_t90: 1_030_000, sport_t90:    50_000 },
  { name: 'Diego F.',   id: 'usr_9e34c2', tier: 'Elite',     sub: 4, vertical: 'Esporte', risco: '144.900', ltv: '188k',  ggr: '42.500',  hold: '5,2%', score: 58, rfm: 'Aten.', flag: true,  churn: 'med',      turnover_90d:   860_000, casino_t90:    45_000, sport_t90:   815_000 },
  { name: 'Carla M.',   id: 'usr_1f55d7', tier: 'Exclusive', sub: 1, vertical: 'Cassino', risco: '86.400',  ltv: '140k',  ggr: '33.800',  hold: '8,8%', score: 80, rfm: 'Leal',  flag: false, churn: 'high',     turnover_90d:   380_000, casino_t90:   360_000, sport_t90:    20_000 },
  { name: 'Helena C.',  id: 'usr_7c10aa', tier: 'Legend',    sub: 1, vertical: 'Esporte', risco: '60.400',  ltv: '305k',  ggr: '96.700',  hold: '6,1%', score: 88, rfm: 'Camp.', flag: false, churn: 'low',      turnover_90d: 1_580_000, casino_t90:    80_000, sport_t90: 1_500_000 },
  { name: 'Bruno T.',   id: 'usr_3c92a4', tier: 'Black',     sub: 4, vertical: 'Híbrido', risco: '37.500',  ltv: '62k',   ggr: '12.900',  hold: '5,9%', score: 61, rfm: 'Risco', flag: true,  churn: 'critical', turnover_90d:   230_000, casino_t90:   120_000, sport_t90:   110_000 },
  { name: 'Paula N.',   id: 'usr_4d88b9', tier: 'Elite',     sub: 1, vertical: 'Híbrido', risco: '25.100',  ltv: '167k',  ggr: '74.000',  hold: '9,1%', score: 85, rfm: 'Camp.', flag: false, churn: 'low',      turnover_90d:   820_000, casino_t90:   410_000, sport_t90:   410_000 },
]

const CHURN_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  critical: { bg: '#FBE7E7',           color: '#E23B3B',      label: 'Crítico' },
  high:     { bg: 'var(--red-soft)',   color: 'var(--red)',   label: 'Alto'    },
  med:      { bg: 'var(--amber-soft)', color: 'var(--amber)', label: 'Médio'   },
  low:      { bg: 'var(--green-soft)', color: 'var(--green)', label: 'Baixo'   },
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

function fmtTurnover(v: number): string {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace('.', ',')}M`
  return `R$ ${Math.round(v / 1000)}k`
}

function parseGgr(s: string): number {
  return parseFloat(s.replace(/\./g, ''))
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
                <tr key={r.id}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ background: isHov ? C.orangeSoft : isTop3 ? '#FBE7E7' : 'transparent', transition: 'background .15s' }}
                >
                  <td style={{ padding: '9px 10px', color: 'var(--muted-text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{String(i + 1).padStart(2, '0')}</td>
                  <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{r.flag && <span style={{ color: 'var(--amber)', marginRight: 5 }}>⚑</span>}{r.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{r.id}</div>
                  </td>
                  <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: tierColor }}>{r.tier}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--muted-text)', marginLeft: 4 }}>S{r.sub}</span>
                  </td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>R$ {r.ggr}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--orange)', whiteSpace: 'nowrap' }}>R$ {r.risco}</td>
                  <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>{r.hold}</td>
                  <td style={{ padding: '9px 10px' }}><ScoreBar score={r.score} /></td>
                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: churnS.color, background: churnS.bg, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>{churnS.label}</span>
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
          <div key={o.title} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '2px 8px', borderRadius: 4, display: 'inline-block', textTransform: 'uppercase' as const, letterSpacing: '.4px', alignSelf: 'flex-start' }}>
              {o.tag}
            </span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>{o.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted-text)', lineHeight: 1.45, flex: 1 }}>{o.desc}</div>
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

// ── Revenue Intelligence ────────────────────────────────────────────────────
const RI_CARDS = [
  {
    label: 'Revenue at Risk', borderColor: 'var(--red)',
    stat: '31', unit: 'VIPs', detail: 'R$ 6,8M em valor exposto',
    badge: 'Crítico + Alto', badgeColor: '#E23B3B', badgeBg: '#FBE7E7',
    opts: { churn: ['critical', 'high'] } as GoToClientesOpts,
  },
  {
    label: 'Upgrade Opportunity', borderColor: C.green,
    stat: '54', unit: 'VIPs', detail: 'Exclusive S1 próximos do Elite',
    badge: 'Elegível', badgeColor: C.green, badgeBg: 'var(--green-soft)',
    opts: { tag: 'Elegível Upgrade' } as GoToClientesOpts,
  },
  {
    label: 'Cross Sell Opportunity', borderColor: '#5B9BD5',
    stat: '146', unit: 'VIPs', detail: 'Cassino-puros sem esporte em 90d',
    badge: 'Cassino', badgeColor: '#5B9BD5', badgeBg: '#E5EEF8',
    opts: { vertical: 'Cassino' } as GoToClientesOpts,
  },
  {
    label: 'VIPs Críticos', borderColor: 'var(--orange)',
    stat: '3', unit: 'VIPs', detail: 'Marcos A., Beatriz L., Bruno T.',
    badge: 'Crítico', badgeColor: C.orange, badgeBg: 'var(--orange-soft)',
    opts: { churn: ['critical'] } as GoToClientesOpts,
  },
]

function RevenueIntelligenceSection({ onCardClick }: { onCardClick: (opts: GoToClientesOpts) => void }) {
  const [hovCard, setHovCard] = useState<number | null>(null)
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 10 }}>
        Revenue Intelligence
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {RI_CARDS.map((card, i) => {
          const isHov = hovCard === i
          return (
            <div key={card.label}
              onClick={() => onCardClick(card.opts)}
              onMouseEnter={() => setHovCard(i)}
              onMouseLeave={() => setHovCard(null)}
              title={`${card.label} — clique para ver em Clientes VIP`}
              style={{
                background: 'var(--card)', border: '1px solid var(--line)', borderLeft: `4px solid ${card.borderColor}`,
                borderRadius: 'var(--radius)', boxShadow: isHov ? '0 4px 12px rgba(0,0,0,.09)' : 'var(--shadow-card)',
                padding: '14px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6,
                opacity: isHov ? 1 : 0.93, transition: 'opacity .15s, box-shadow .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.4px', lineHeight: 1.3 }}>
                  {card.label}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: card.badgeColor, background: card.badgeBg, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                  {card.badge}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--ink)', lineHeight: 1 }}>{card.stat}</span>
                <span style={{ fontSize: 11, color: 'var(--muted-text)' }}>{card.unit}</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--muted-text)', lineHeight: 1.4 }}>{card.detail}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: isHov ? 'var(--orange)' : 'var(--muted-text)', transition: 'color .15s' }}>→</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Ticket Médio por Tier (novo) ────────────────────────────────────────────
const TICKET_MEDIO = [
  { tier: 'Legend',    val: 'R$ 41k', color: '#C9A227' },
  { tier: 'Elite',     val: 'R$ 28k', color: C.orange  },
  { tier: 'Exclusive', val: 'R$ 17k', color: '#E08A4E' },
  { tier: 'Black',     val: 'R$ 8k',  color: C.ink     },
]

function TicketMedioPorTierCard({ onClick }: { onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => { if (onClick) setHov(true)  }}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--card)', border: '1px solid var(--line)',
        borderRadius: 'var(--radius)', boxShadow: hov ? '0 4px 12px rgba(0,0,0,.08)' : 'var(--shadow-card)',
        overflow: 'hidden', cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow .15s',
      }}
    >
      <div style={{ padding: '12px 15px 10px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>Ticket Médio por Tier</div>
          <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 2 }}>GGR ÷ VIPs ativos · mensal</div>
        </div>
        {onClick && <span style={{ fontSize: 15, fontWeight: 700, color: hov ? 'var(--orange)' : 'var(--muted-text)', transition: 'color .15s' }}>→</span>}
      </div>
      <div style={{ padding: '12px 15px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 0 }}>
        {TICKET_MEDIO.map(t => (
          <div key={t.tier} style={{ background: hov ? C.orangeSoft : 'var(--card)', padding: '12px 14px', transition: 'background .15s' }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: t.color, textTransform: 'uppercase' as const, letterSpacing: '.4px', marginBottom: 6 }}>
              {t.tier}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--ink)', lineHeight: 1 }}>
              {t.val}
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted-2)', marginTop: 4 }}>GGR / VIP</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Clientes VIP — filtros ──────────────────────────────────────────────────
const CHURN_BUTTONS = [
  { key: 'critical', label: 'Crítico', color: '#E23B3B',        bg: '#FBE7E7'           },
  { key: 'high',     label: 'Alto',    color: 'var(--red)',      bg: 'var(--red-soft)'   },
  { key: 'med',      label: 'Médio',   color: 'var(--amber)',    bg: 'var(--amber-soft)' },
  { key: 'low',      label: 'Baixo',   color: 'var(--green)',    bg: 'var(--green-soft)' },
]

const RFM_BUTTONS = [
  { key: 'Camp.', label: 'Champions' },
  { key: 'Leal',  label: 'Loyal'     },
  { key: 'Risco', label: 'At Risk'   },
  { key: 'Aten.', label: 'Atenção'   },
]

const TIER_FILTER_BUTTONS = ['Todos', 'Legend', 'Elite', 'Exclusive', 'Black']

function ClientesFilterBar({
  churnFilter,   setChurnFilter,
  rfmFilter,     setRfmFilter,
  tierFilter,    setTierFilter,
  tagFilter,     setTagFilter,
  search,        setSearch,
  verticalFilter, setVerticalFilter,
  total,         filtered,
}: {
  churnFilter:    string[]; setChurnFilter:    (v: string[]) => void
  rfmFilter:      string[]; setRfmFilter:      (v: string[]) => void
  tierFilter:     string;   setTierFilter:     (v: string)   => void
  tagFilter:      string[]; setTagFilter:      (v: string[]) => void
  search:         string;   setSearch:         (v: string)   => void
  verticalFilter: string;   setVerticalFilter: (v: string)   => void
  total: number; filtered: number
}) {
  function toggleMulti(arr: string[], key: string, setFn: (v: string[]) => void) {
    setFn(arr.includes(key) ? arr.filter(k => k !== key) : [...arr, key])
  }

  const filterBtnBase: React.CSSProperties = {
    padding: '5px 12px', fontSize: 11.5, fontWeight: 700, borderRadius: 8,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
  }

  const activeTags: { label: string; remove: () => void }[] = [
    ...churnFilter.map(k => {
      const b = CHURN_BUTTONS.find(c => c.key === k)
      return { label: `Churn: ${b?.label ?? k}`, remove: () => setChurnFilter(churnFilter.filter(c => c !== k)) }
    }),
    ...rfmFilter.map(k => {
      const b = RFM_BUTTONS.find(r => r.key === k)
      return { label: `RFM: ${b?.label ?? k}`, remove: () => setRfmFilter(rfmFilter.filter(r => r !== k)) }
    }),
    ...(tierFilter !== 'Todos' ? [{ label: `Tier: ${tierFilter}`, remove: () => setTierFilter('Todos') }] : []),
    ...tagFilter.map(t => ({ label: t, remove: () => setTagFilter(tagFilter.filter(f => f !== t)) })),
    ...(verticalFilter !== '' ? [{ label: `Tipo: ${verticalFilter}`, remove: () => setVerticalFilter('') }] : []),
  ]

  function clearAll() {
    setChurnFilter([])
    setRfmFilter([])
    setTierFilter('Todos')
    setTagFilter([])
    setSearch('')
    setVerticalFilter('')
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 14,
    }}>
      {/* Search + CSV */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--muted-text)', pointerEvents: 'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou ID..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: 12, border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none', background: 'var(--bg)', boxSizing: 'border-box' as const }}
          />
        </div>
        <button style={{ padding: '8px 14px', fontSize: 11.5, fontWeight: 700, border: '1px solid var(--line)', borderRadius: 8, background: 'transparent', color: 'var(--muted-text)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const }}>
          ↓ CSV
        </button>
      </div>

      {/* Churn */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.4px', width: 44, flexShrink: 0 }}>Churn</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {CHURN_BUTTONS.map(b => {
            const active = churnFilter.includes(b.key)
            return (
              <button key={b.key} onClick={() => toggleMulti(churnFilter, b.key, setChurnFilter)}
                style={{ ...filterBtnBase, border: `1px solid ${active ? 'transparent' : 'var(--line)'}`, background: active ? b.bg : 'transparent', color: active ? b.color : 'var(--muted-text)' }}>
                {b.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* RFM */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.4px', width: 44, flexShrink: 0 }}>RFM</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {RFM_BUTTONS.map(b => {
            const active = rfmFilter.includes(b.key)
            return (
              <button key={b.key} onClick={() => toggleMulti(rfmFilter, b.key, setRfmFilter)}
                style={{ ...filterBtnBase, border: `1px solid ${active ? 'transparent' : 'var(--line)'}`, background: active ? 'var(--orange)' : 'transparent', color: active ? '#fff' : 'var(--muted-text)' }}>
                {b.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' as const, letterSpacing: '.4px', width: 44, flexShrink: 0 }}>Tier</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {TIER_FILTER_BUTTONS.map(t => {
            const active = tierFilter === t
            const col = t !== 'Todos' ? TIER_COLORS[t] : undefined
            return (
              <button key={t} onClick={() => setTierFilter(active && t !== 'Todos' ? 'Todos' : t)}
                style={{ ...filterBtnBase, border: `1px solid ${active ? 'transparent' : 'var(--line)'}`, background: active ? (col ? `${col}22` : 'var(--orange)') : 'transparent', color: active ? (col ?? '#fff') : 'var(--muted-text)', fontWeight: active ? 800 : 700 }}>
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active filter tags */}
      {activeTags.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
          {activeTags.map(t => (
            <span key={t.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '3px 8px', borderRadius: 6 }}>
              {t.label}
              <button onClick={t.remove} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, color: 'var(--orange)', lineHeight: 1 }}>×</button>
            </span>
          ))}
          <button onClick={clearAll} style={{ fontSize: 11, color: 'var(--muted-text)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>
            Limpar tudo
          </button>
        </div>
      )}

      {/* Counter */}
      <div style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>
        Exibindo <strong style={{ color: 'var(--ink)' }}>{filtered}</strong> de <strong style={{ color: 'var(--ink)' }}>{total}</strong> VIPs
      </div>
    </div>
  )
}

// ── VIP Drawer ─────────────────────────────────────────────────────────────
type RosterRow = typeof ROSTER[number]

function VipDrawer({ row, idx, total, onPrev, onNext, onClose }: {
  row:    RosterRow
  idx:    number
  total:  number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}) {
  const tierColor = TIER_COLORS[row.tier]
  const churnS    = CHURN_STYLE[row.churn]

  const ggrNum     = parseGgr(row.ggr)
  const ngrNum     = Math.round(ggrNum * 0.70)
  const netCashNum = Math.round(row.turnover_90d * 0.023)

  const casinoPct = row.turnover_90d > 0 ? Math.round(row.casino_t90 / row.turnover_90d * 100) : 0
  const sportPct  = row.turnover_90d > 0 ? Math.round(row.sport_t90  / row.turnover_90d * 100) : 0

  function fmtK(n: number): string {
    if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
    return `R$ ${Math.round(n / 1000)}k`
  }

  let opp = 'VIP em monitoramento regular.'
  if      (row.churn === 'critical')                        opp = 'VIP em churn crítico — acionar account manager imediatamente.'
  else if (row.churn === 'high')                            opp = 'Risco de churn elevado — contato proativo recomendado em 48h.'
  else if (row.tier === 'Exclusive' && row.sub === 1)       opp = 'Elegível para upgrade para Elite — 8% abaixo do limiar.'
  else if (row.rfm === 'Camp.')                             opp = 'Champion VIP ativo — candidato a benefícios exclusivos de subtier.'

  const SLBL: React.CSSProperties = { fontSize: 9, fontWeight: 800, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 10 }
  const LBL:  React.CSSProperties = { fontSize: 11.5, color: 'var(--muted-text)', fontWeight: 600, minWidth: 80 }
  const VAL:  React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }
  const ROW:  React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--line)', marginBottom: 8, gap: 10 }
  const ROWL: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }

  const navBtn = (disabled: boolean): React.CSSProperties => ({
    padding: '5px 10px', fontSize: 11, fontWeight: 700,
    border: '1px solid var(--line)', borderRadius: 7, background: 'transparent',
    color: disabled ? 'var(--muted-2)' : 'var(--ink)',
    cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
  })

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.28)', zIndex: 50 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 410, background: 'var(--card)', boxShadow: '-4px 0 32px rgba(0,0,0,.14)', zIndex: 51, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onPrev} disabled={idx === 0}         style={navBtn(idx === 0)}>← Anterior</button>
            <button onClick={onNext} disabled={idx === total - 1} style={navBtn(idx === total - 1)}>Próximo →</button>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button style={{ padding: '5px 10px', fontSize: 11, fontWeight: 700, border: '1px solid var(--orange)', borderRadius: 7, background: 'transparent', color: 'var(--orange)', cursor: 'pointer', fontFamily: 'inherit' }}>
              ↗ Ver completo
            </button>
            <button onClick={onClose} style={{ padding: '4px 10px', fontSize: 18, border: 'none', background: 'none', color: 'var(--muted-text)', cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1.2 }}>
                {row.flag && <span style={{ color: 'var(--amber)', marginRight: 6 }}>⚑</span>}{row.name}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>{row.id}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: tierColor, background: `${tierColor}18`, padding: '3px 8px', borderRadius: 5 }}>{row.tier} S{row.sub}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: churnS.color, background: churnS.bg, padding: '3px 8px', borderRadius: 5 }}>{churnS.label}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted-text)', background: 'var(--bg)', border: '1px solid var(--line)', padding: '3px 8px', borderRadius: 5 }}>{row.rfm}</span>
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--muted-text)' }}>{row.vertical} · {String(idx + 1).padStart(2, '0')} de {total}</div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '0 18px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* FINANCEIRO */}
          <div style={{ paddingTop: 18 }}>
            <div style={SLBL}>Financeiro (MTD)</div>
            {[
              { lbl: 'GGR',      val: `R$ ${row.ggr}` },
              { lbl: 'NGR',      val: fmtK(ngrNum)     },
              { lbl: 'Net Cash', val: fmtK(netCashNum)  },
              { lbl: 'Turnover', val: fmtTurnover(row.turnover_90d) + ' (90d)' },
            ].map((item, ii, arr) => (
              <div key={item.lbl} style={ii < arr.length - 1 ? ROW : ROWL}>
                <span style={LBL}>{item.lbl}</span>
                <span style={VAL}>{item.val}</span>
              </div>
            ))}
          </div>

          {/* SCORES */}
          <div>
            <div style={SLBL}>Scores</div>

            <div style={ROW}>
              <span style={LBL}>Subtier</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 5, borderRadius: 3, background: '#EEF0F2', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(row.sub / 4) * 100}%`, background: tierColor, borderRadius: 3 }} />
                </div>
                <span style={VAL}>S{row.sub} / S4</span>
              </div>
            </div>

            <div style={ROW}>
              <span style={LBL}>Score</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 5, borderRadius: 3, background: '#EEF0F2', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${row.score}%`, background: row.score >= 80 ? 'var(--green)' : row.score >= 60 ? 'var(--amber)' : 'var(--red)', borderRadius: 3 }} />
                </div>
                <span style={VAL}>{row.score}</span>
              </div>
            </div>

            <div style={ROW}>
              <span style={LBL}>Churn Risk</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: churnS.color, background: churnS.bg, padding: '2px 8px', borderRadius: 5 }}>{churnS.label}</span>
            </div>

            <div style={ROWL}>
              <span style={LBL}>RFM</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', background: 'var(--bg)', border: '1px solid var(--line)', padding: '2px 8px', borderRadius: 5 }}>{row.rfm}</span>
            </div>
          </div>

          {/* PERFIL DE APOSTAS */}
          {row.turnover_90d > 0 && (
            <div>
              <div style={SLBL}>Perfil de Apostas</div>

              <div style={{ ...ROW }}>
                <span style={{ ...LBL, minWidth: 52 }}>Casino</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#EEF0F2', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${casinoPct}%`, background: 'var(--orange)', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', minWidth: 32, textAlign: 'right' as const }}>{casinoPct}%</span>
                </div>
                <span style={{ ...VAL, minWidth: 60, textAlign: 'right' as const }}>{fmtK(row.casino_t90)}</span>
              </div>

              <div style={ROWL}>
                <span style={{ ...LBL, minWidth: 52 }}>Sports</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#EEF0F2', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${sportPct}%`, background: 'var(--green)', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', minWidth: 32, textAlign: 'right' as const }}>{sportPct}%</span>
                </div>
                <span style={{ ...VAL, minWidth: 60, textAlign: 'right' as const }}>{fmtK(row.sport_t90)}</span>
              </div>
            </div>
          )}

          {/* OPORTUNIDADES */}
          <div style={{ padding: '14px 16px', background: 'var(--orange-soft)', borderRadius: 12, border: '1px solid var(--orange-line)' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase' as const, letterSpacing: '.6px', marginBottom: 8 }}>Oportunidades</div>
            <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.55 }}>{opp}</div>
          </div>

        </div>
      </div>
    </>
  )
}

// ── Clientes VIP — tabela filtrada e ordenável ──────────────────────────────

const SORTABLE_COLS: Record<string, { field: string; label: string }> = {
  'GGR MTD':       { field: 'ggr',          label: 'GGR MTD' },
  'Turnover 90d':  { field: 'turnover_90d',  label: 'Turnover 90d' },
  'Valor em Risco':{ field: 'risco',         label: 'Valor em Risco' },
}

function ClientesVipTable({
  rows, sortBy, sortDir, onSort, onRowClick,
}: {
  rows: RosterRow[]
  sortBy: string | null
  sortDir: 'asc' | 'desc'
  onSort: (field: string) => void
  onRowClick?: (idx: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  function ThSort({ label }: { label: string }) {
    const col = SORTABLE_COLS[label]
    if (!col) {
      return (
        <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: 10, fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '.3px', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
          {label}
        </th>
      )
    }
    const active = sortBy === col.field
    const indicator = active ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕'
    return (
      <th
        onClick={() => onSort(col.field)}
        style={{ textAlign: 'left', padding: '6px 10px', fontSize: 10, fontWeight: 700, color: active ? 'var(--orange)' : 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '.3px', borderBottom: `2px solid ${active ? 'var(--orange)' : 'var(--line)'}`, whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' }}>
        {label}<span style={{ opacity: active ? 1 : 0.4 }}>{indicator}</span>
      </th>
    )
  }

  const COLS = ['#', 'Jogador', 'Tier', 'GGR MTD', 'Turnover 90d', 'Valor em Risco', 'Hold%', 'Score', 'Churn']

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 15px 10px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>Clientes VIP</div>
        <div style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 2 }}>
          {sortBy ? `Ordenada por ${SORTABLE_COLS[COLS.find(c => SORTABLE_COLS[c]?.field === sortBy) ?? '']?.label ?? sortBy} ${sortDir === 'desc' ? '↓' : '↑'}` : 'Ordenada por valor em risco'}
        </div>
      </div>
      <div style={{ padding: '0 4px 12px', overflowX: 'auto' }}>
        {rows.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted-text)', fontSize: 13 }}>
            Nenhum VIP corresponde aos filtros selecionados.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {COLS.map(h => <ThSort key={h} label={h} />)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const churnS    = CHURN_STYLE[r.churn]
                const tierColor = TIER_COLORS[r.tier]
                const isHov     = hovered === i
                return (
                  <tr key={r.id}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onRowClick?.(i)}
                    style={{ background: isHov ? C.orangeSoft : 'transparent', transition: 'background .15s', cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    <td style={{ padding: '9px 10px', color: 'var(--muted-text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{r.flag && <span style={{ color: 'var(--amber)', marginRight: 5 }}>⚑</span>}{r.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{r.id}</div>
                    </td>
                    <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: tierColor }}>{r.tier}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--muted-text)', marginLeft: 4 }}>S{r.sub}</span>
                    </td>
                    <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>R$ {r.ggr}</td>
                    <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{fmtTurnover(r.turnover_90d)}</td>
                    <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--orange)', whiteSpace: 'nowrap' }}>R$ {r.risco}</td>
                    <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>{r.hold}</td>
                    <td style={{ padding: '9px 10px' }}><ScoreBar score={r.score} /></td>
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
        )}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function GestaoVipPage() {
  const [aba,            setAba]            = useState<'visao-geral' | 'clientes-vip'>('visao-geral')
  const [churnFilter,    setChurnFilter]    = useState<string[]>([])
  const [rfmFilter,      setRfmFilter]      = useState<string[]>([])
  const [tierFilter,     setTierFilter]     = useState('Todos')
  const [tagFilter,      setTagFilter]      = useState<string[]>([])
  const [search,         setSearch]         = useState('')
  const [verticalFilter, setVerticalFilter] = useState('')
  const [sortBy,         setSortBy]         = useState<string | null>(null)
  const [sortDir,        setSortDir]        = useState<'asc' | 'desc'>('desc')
  const [selectedVipIdx, setSelectedVipIdx] = useState<number | null>(null)

  function goToClientes(opts: GoToClientesOpts) {
    setChurnFilter(opts.churn ?? [])
    setRfmFilter(opts.rfm ?? [])
    setTagFilter(opts.tag ? [opts.tag] : [])
    setTierFilter('Todos')
    setVerticalFilter(opts.vertical ?? '')
    if (opts.sort) { setSortBy(opts.sort.field); setSortDir(opts.sort.dir) }
    else setSortBy(null)
    setAba('clientes-vip')
  }

  function handleSort(field: string) {
    if (sortBy === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('desc') }
  }

  const filteredRoster = ROSTER.filter(r => {
    const matchChurn    = churnFilter.length === 0    || churnFilter.includes(r.churn)
    const matchRfm      = rfmFilter.length === 0      || rfmFilter.includes(r.rfm)
    const matchTier     = tierFilter === 'Todos'      || r.tier === tierFilter
    const matchTag      = tagFilter.length === 0      || (tagFilter.includes('Elegível Upgrade') && r.tier === 'Exclusive' && r.sub === 1)
    const matchSearch   = search === ''               || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search)
    const matchVertical = verticalFilter === ''       || r.vertical === verticalFilter
    return matchChurn && matchRfm && matchTier && matchTag && matchSearch && matchVertical
  })

  const sortedRoster = [...filteredRoster].sort((a, b) => {
    if (!sortBy) return 0
    let av = 0, bv = 0
    if (sortBy === 'ggr')         { av = parseGgr(a.ggr);        bv = parseGgr(b.ggr)        }
    if (sortBy === 'turnover_90d'){ av = a.turnover_90d;          bv = b.turnover_90d          }
    if (sortBy === 'risco')       { av = parseGgr(a.risco);      bv = parseGgr(b.risco)       }
    return sortDir === 'desc' ? bv - av : av - bv
  })

  const ABAS_VIP = [
    { id: 'visao-geral',  label: 'Visão Geral'  },
    { id: 'clientes-vip', label: 'Clientes VIP' },
  ] as const

  return (
    <main className="canvas">
      <div style={{ padding: 'clamp(16px,2vw,40px)', paddingBottom: 56 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 0 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
              Gestão VIP
            </h1>
            <div style={{ fontSize: 14, color: 'var(--muted-text)', marginTop: 5 }}>
              Centro de Operação — carteira, triagem, oportunidades e saúde da receita VIP.
            </div>
          </div>

          {/* Barra de Abas */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, borderBottom: '1px solid var(--line)', marginTop: 18, marginBottom: 20 }}>
            {ABAS_VIP.map((a) => {
              const active = aba === a.id
              return (
                <button key={a.id} onClick={() => setAba(a.id)}
                  style={{ padding: '10px 18px', fontSize: 13, fontWeight: active ? 800 : 600, fontFamily: 'var(--font-body)', background: 'none', border: 'none', cursor: 'pointer',
                    color:        active ? 'var(--orange)'           : 'var(--muted-text)',
                    borderBottom: active ? '2px solid var(--orange)' : '2px solid transparent',
                    marginBottom: -1 }}>
                  {a.label}
                </button>
              )
            })}
          </div>

          {/* ── Visão Geral ── */}
          {aba === 'visao-geral' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <VipKpisPanel onCardClick={goToClientes} />
              <TicketMedioPorTierCard onClick={() => goToClientes({})} />
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 14, alignItems: 'stretch' }}>
                <VipTierBarsPanel />
                <VipOpportunitiesPanel />
              </div>
              <VipTriagePanel />
              <RevenueIntelligenceSection onCardClick={goToClientes} />
            </div>
          )}

          {/* ── Clientes VIP ── */}
          {aba === 'clientes-vip' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <ClientesFilterBar
                churnFilter={churnFilter}       setChurnFilter={setChurnFilter}
                rfmFilter={rfmFilter}           setRfmFilter={setRfmFilter}
                tierFilter={tierFilter}         setTierFilter={setTierFilter}
                tagFilter={tagFilter}           setTagFilter={setTagFilter}
                search={search}                 setSearch={setSearch}
                verticalFilter={verticalFilter} setVerticalFilter={setVerticalFilter}
                total={ROSTER.length}           filtered={sortedRoster.length}
              />
              <ClientesVipTable
                rows={sortedRoster}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
                onRowClick={setSelectedVipIdx}
              />
            </div>
          )}

        </div>
      </div>

      {/* VIP Drawer */}
      {selectedVipIdx !== null && sortedRoster[selectedVipIdx] && (
        <VipDrawer
          row={sortedRoster[selectedVipIdx]}
          idx={selectedVipIdx}
          total={sortedRoster.length}
          onPrev={() => setSelectedVipIdx(i => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setSelectedVipIdx(i => (i !== null && i < sortedRoster.length - 1 ? i + 1 : i))}
          onClose={() => setSelectedVipIdx(null)}
        />
      )}
    </main>
  )
}
