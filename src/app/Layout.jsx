import { useState, useEffect, useRef } from 'react'
import { useParams, Outlet, NavLink } from 'react-router-dom'
import { MODULES } from '../modules/registry.js'
import { MOSAICS } from '../mosaics.js'
import MiniPreview from '../ui/MiniPreview.jsx'
import FeedSidebar from '../ui/FeedSidebar.jsx'
import TopBar from './TopBar.jsx'
import { useModuleState, MOSAIC_KEY } from './useModuleState.js'

const NAV = [
  { group: null, items: [
    { id: 'overview', icon: '🏠', label: 'Overview', disabled: true },
  ]},
  { group: 'Playground', items: [
    { id: 'financiero',       icon: '📄', label: 'Financeiro' },
    { id: 'apostas',          icon: '🎯', label: 'Apostas Esportivas' },
    { id: 'cassino',          icon: '🌐', label: 'Cassino', badge: 'NEW' },
    { id: 'perfil-apostador', icon: '👤', label: 'Perfil de Apostador' },
    { id: 'risco-fraude',     icon: '🛡️', label: 'Risco e Fraude', disabled: true },
    { id: 'pld-aml',          icon: '🛡️', label: 'PLD / AML' },
    { id: 'web-analytics',    icon: '📈', label: 'Web Analytics', badge: 'NEW' },
  ]},
  { group: 'Research Preview', items: [
    { id: 'ai-assistant', icon: '✦', label: 'AI Assistant', disabled: true },
  ]},
]

const SEED_OCORRENCIAS = [
  { id: 1, tipo: 'Super Ganhador',       cpf: '•••.•••.123-45', ago: '2min',  marca: 'vaidebet' },
  { id: 2, tipo: 'Conta Vinculada',      cpf: '•••.•••.456-78', ago: '5min',  marca: 'vaidebet' },
  { id: 3, tipo: 'Aceleração Depósitos', cpf: '•••.•••.789-01', ago: '9min',  marca: 'vaidebet' },
  { id: 4, tipo: 'Horário Atípico',      cpf: '•••.•••.234-56', ago: '11min', marca: 'vaidebet' },
  { id: 5, tipo: 'Chasing',              cpf: '•••.•••.567-89', ago: '14min', marca: 'vaidebet' },
  { id: 6, tipo: 'Aposta Irregular',     cpf: '•••.•••.890-12', ago: '18min', marca: 'vaidebet' },
]

const POOL_TIPOS = ['Super Ganhador', 'Conta Vinculada', 'Aceleração Depósitos', 'Horário Atípico', 'Chasing', 'Aposta Irregular']
const POOL_CPF   = ['•••.•••.111-22', '•••.•••.333-44', '•••.•••.555-66', '•••.•••.777-88', '•••.•••.999-00', '•••.•••.212-34']
const POOL_MARCA = ['vaidebet', 'bet365', 'betano', 'sportingbet']

const FEED_KEY = 'atlas-m4-lab-feed-collapsed'

const DEFAULT_MOSAIC = 'destaque'

const GROUPS = [
  ['Perfil',           ['identity', 'verdict', 'action', 'behavioral', 'alerts', 'transactions']],
  ['Score / XAI',      ['xai', 'score-trend', 'dimensions']],
  ['Jogo Responsável', ['responsible']],
  ['Financeiro',       ['cashflow']],
  ['Vínculos',         ['vinculos']],
  ['PLD / AML',        ['pld']],
  ['Pares',            ['peer']],
  ['Intervenção',      ['intervention']],
]

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(MOSAIC_KEY) || '[]') } catch { return [] }
}

export default function Layout() {
  const { moduleId } = useParams()
  const activeModule = MODULES.find((m) => m.id === moduleId) || null
  const slots = activeModule?.slots ?? []

  const { slotState, slotSections, orderedSlots, mosaic, setMosaic, setType, toggle, hide, setAll, reset, moveSlot, moveToSection, aprovada, dataAprovacao, aprovar } = useModuleState(moduleId, slots)
  const [custom, setCustom] = useState(loadCustom)
  const [collapsed, setCollapsed] = useState(false)
  const [feedCollapsed, setFeedCollapsed] = useState(() => localStorage.getItem(FEED_KEY) === 'true')
  const [ocorrencias, setOcorrencias] = useState(SEED_OCORRENCIAS)
  const nextId = useRef(SEED_OCORRENCIAS.length + 1)

  useEffect(() => { localStorage.setItem(MOSAIC_KEY, JSON.stringify(custom)) }, [custom])
  useEffect(() => { localStorage.setItem(FEED_KEY, String(feedCollapsed)) }, [feedCollapsed])

  useEffect(() => {
    const iv = setInterval(() => {
      const idx = nextId.current % POOL_TIPOS.length
      const novo = {
        id: nextId.current++,
        tipo:  POOL_TIPOS[idx],
        cpf:   POOL_CPF[idx % POOL_CPF.length],
        ago:   'agora',
        marca: POOL_MARCA[idx % POOL_MARCA.length],
      }
      setOcorrencias((prev) => [novo, ...prev.slice(0, 19)])
    }, 7000)
    return () => clearInterval(iv)
  }, [])

  const allMosaics = [...MOSAICS, ...custom]
  const activeMosaic = allMosaics.find((m) => m.id === mosaic) || MOSAICS[0]
  const activeCount = slots.filter((s) => slotState[s.id]?.visible).length
  const currentLabel = (s) => (s.options.find((x) => x.key === slotState[s.id]?.type) || s.options[0]).label
  const isReady = activeModule?.status === 'ready'

  const slotToSection = (id) => {
    if (slotSections[id]) return slotSections[id]
    const grp = GROUPS.find(([, ids]) => ids.includes(id))
    return grp ? grp[0] : null
  }
  const sidebarGroups = GROUPS.map(([cat]) => [cat, orderedSlots.filter((s) => slotToSection(s.id) === cat)]).filter(([, sl]) => sl.length > 0)
  const ungroupedInOrder = orderedSlots.filter((s) => slotToSection(s.id) === null)
  const moduleSections = sidebarGroups.map(([cat]) => cat)

  const onMoveToSection = (slotId, sectionName) => {
    const targetIds = orderedSlots.filter((s) => slotToSection(s.id) === sectionName).map((s) => s.id)
    moveToSection(slotId, sectionName, targetIds)
  }

  const deleteMosaic = (id) => {
    setCustom((prev) => prev.filter((x) => x.id !== id))
    setMosaic((cur) => (cur === id ? DEFAULT_MOSAIC : cur))
  }

  const outletContext = { slots: orderedSlots, slotState, allMosaics, activeMosaic, activeModule, onChangeType: setType, onHide: hide, onReset: reset, aprovada, dataAprovacao, aprovar, onMoveSlot: moveSlot, onMoveToSection, sections: moduleSections }
  const showFeed = moduleId === 'perfil-apostador'
  const feedProps = { ocorrencias, collapsed: feedCollapsed, onCollapse: () => setFeedCollapsed((v) => !v) }

  const sidebarContent = (
    <div className="p-body">
      {NAV.map(({ group, items }) => (
        <div key={group ?? 'root'}>
          {group && <div className="nav-group">{group}</div>}
          {items.map((it) => {
            const mod = MODULES.find((m) => m.id === it.id)
            const isDisabled = it.disabled || !mod || mod.status !== 'ready'
            return isDisabled
              ? (
                <span key={it.id} className="nav-item disabled">
                  <span className="ico">{it.icon}</span>{it.label}
                  {it.badge && <span className="nav-badge">{it.badge}</span>}
                </span>
              )
              : (
                <NavLink key={it.id} to={`/${it.id}`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                  <span className="ico">{it.icon}</span>{it.label}
                  {it.badge && <span className={`nav-badge${it.badge === 'PULSE' ? ' pulse' : ''}`}>{it.badge}</span>}
                </NavLink>
              )
          })}
        </div>
      ))}

    </div>
  )

  if (collapsed) {
    return (
      <div className="app">
        <aside className="panel collapsed">
          <button className="collapse-btn" onClick={() => setCollapsed(false)} title="Expandir">☰</button>
        </aside>
        {showFeed && <FeedSidebar {...feedProps} />}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar />
          <Outlet context={outletContext} />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className="panel">
        <div className="p-head">
          <div className="p-logo"><div className="sq">A</div><b>M4 Lab</b></div>
          <div className="p-sub">Dashboard multi-módulo de análise do apostador.</div>
        </div>
        {sidebarContent}
        <button className="collapse-btn" onClick={() => setCollapsed(true)}>◀ Recolher · {activeCount} ativos</button>
      </aside>
      {showFeed && <FeedSidebar {...feedProps} />}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <Outlet context={outletContext} />
      </div>
    </div>
  )
}
