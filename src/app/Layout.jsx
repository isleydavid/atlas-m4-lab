import { useState, useEffect } from 'react'
import { useParams, Outlet, NavLink } from 'react-router-dom'
import { MODULES } from '../modules/registry.js'
import { MOSAICS } from '../mosaics.js'
import MiniPreview from '../ui/MiniPreview.jsx'
import MosaicEditor from '../ui/MosaicEditor.jsx'
import { useModuleState, MOSAIC_KEY } from './useModuleState.js'

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

  const { slotState, mosaic, setMosaic, setType, toggle, hide, setAll, reset, aprovada, dataAprovacao, aprovar } = useModuleState(moduleId, slots)
  const [custom, setCustom] = useState(loadCustom)
  const [editing, setEditing] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => { setEditing(false) }, [moduleId])
  useEffect(() => { localStorage.setItem(MOSAIC_KEY, JSON.stringify(custom)) }, [custom])

  const allMosaics = [...MOSAICS, ...custom]
  const byId = Object.fromEntries(slots.map((s) => [s.id, s]))
  const activeMosaic = allMosaics.find((m) => m.id === mosaic) || MOSAICS[0]
  const activeCount = slots.filter((s) => slotState[s.id]?.visible).length
  const currentLabel = (s) => (s.options.find((x) => x.key === slotState[s.id]?.type) || s.options[0]).label
  const groupedIds = new Set(GROUPS.flatMap(([, ids]) => ids))
  const ungroupedSlots = slots.filter((s) => !groupedIds.has(s.id))
  const isReady = activeModule?.status === 'ready'

  const saveMosaic = (m) => { setCustom((prev) => [...prev.filter((x) => x.id !== m.id), m]); setMosaic(m.id); setEditing(false) }
  const deleteMosaic = (id) => {
    setCustom((prev) => prev.filter((x) => x.id !== id))
    setMosaic((cur) => (cur === id ? DEFAULT_MOSAIC : cur))
  }

  const outletContext = { slots, slotState, allMosaics, activeMosaic, activeModule, onChangeType: setType, onHide: hide, onReset: reset, aprovada, dataAprovacao, aprovar }

  const sidebarContent = (
    <div className="p-body">
      <div className="cat">Módulos</div>
      {MODULES.map((m) =>
        m.status === 'ready' ? (
          <NavLink
            key={m.id}
            to={`/${m.id}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 0', textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--orange)' : 'inherit',
            })}
          >
            <span>{m.icone}</span><span>{m.nome}</span>
          </NavLink>
        ) : (
          <span key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', opacity: 0.4, cursor: 'default' }}>
            <span>{m.icone}</span><span>{m.nome}</span>
            <small style={{ marginLeft: 'auto', fontSize: 10, background: 'var(--c3)', borderRadius: 4, padding: '1px 5px' }}>em breve</small>
          </span>
        )
      )}

      {isReady && (
        <>
          <div className="cat" style={{ marginTop: 12 }}>Mosaico da página</div>
          <div className="mosaics">
            {allMosaics.map((m) => (
              <div key={m.id} className={`mosaic ${activeMosaic.id === m.id ? 'on' : ''}`} onClick={() => setMosaic(m.id)} role="button">
                <div className="mosaic-thumb"><MiniPreview mosaic={m} active={activeMosaic.id === m.id} /></div>
                <div className="mosaic-meta"><b>{m.name}</b><small>{m.desc}</small></div>
                {m.custom && (
                  <button className="mosaic-del" title="Excluir mosaico"
                    onClick={(e) => { e.stopPropagation(); deleteMosaic(m.id) }}>✕</button>
                )}
              </div>
            ))}
            <button className="mosaic-new" onClick={() => setEditing(true)}>+ Criar mosaico</button>
          </div>
        </>
      )}

      {isReady && slots.length > 0 && (
        <>
          <div className="cat" style={{ marginTop: 8 }}>Componentes</div>
          <div className="p-actions">
            <button onClick={() => setAll(true)}>Ativar tudo</button>
            <button onClick={() => setAll(false)}>Desativar tudo</button>
          </div>
          {GROUPS.map(([cat, ids]) => {
            const groupSlots = ids.map((id) => byId[id]).filter(Boolean)
            if (groupSlots.length === 0) return null
            return (
              <div key={cat}>
                <div className="cat sub">{cat}</div>
                {groupSlots.map((s) => {
                  const on = slotState[s.id]?.visible
                  return (
                    <div className={`toggle-row ${on ? '' : 'off'}`} key={s.id}>
                      <span className={`sw ${on ? 'on' : ''}`} onClick={() => toggle(s.id)} />
                      <div className="nm">{s.title}<small>{on ? currentLabel(s) : 'inativo'}</small></div>
                    </div>
                  )
                })}
              </div>
            )
          })}
          {ungroupedSlots.map((s) => {
            const on = slotState[s.id]?.visible
            return (
              <div className={`toggle-row ${on ? '' : 'off'}`} key={s.id}>
                <span className={`sw ${on ? 'on' : ''}`} onClick={() => toggle(s.id)} />
                <div className="nm">{s.title}<small>{on ? currentLabel(s) : 'inativo'}</small></div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )

  if (collapsed) {
    return (
      <div className="app">
        <aside className="panel collapsed">
          <button className="collapse-btn" onClick={() => setCollapsed(false)} title="Expandir">☰</button>
        </aside>
        <Outlet context={outletContext} />
        {editing && <MosaicEditor onSave={saveMosaic} onClose={() => setEditing(false)} />}
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
      <Outlet context={outletContext} />
      {editing && <MosaicEditor onSave={saveMosaic} onClose={() => setEditing(false)} />}
    </div>
  )
}
