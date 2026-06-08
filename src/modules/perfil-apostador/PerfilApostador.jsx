import { useState, useEffect } from 'react'
import { SLOTS } from './slots.jsx'
import { MOSAICS } from '../../mosaics.js'
import Dashboard from '../../ui/Dashboard.jsx'
import ControlPanel from '../../ui/ControlPanel.jsx'
import MosaicEditor from '../../ui/MosaicEditor.jsx'

const STORE_KEY = 'atlas-m4-lab-v4'
const MOSAIC_KEY = 'atlas-m4-lab-mosaics'
const DEFAULT_MOSAIC = 'destaque'

function defaultSlots() {
  const base = {}
  SLOTS.forEach((s) => { base[s.id] = { type: s.options[0].key, visible: s.visible } })
  return base
}

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(MOSAIC_KEY) || '[]') } catch { return [] }
}

function load() {
  const slots = defaultSlots()
  let mosaic = DEFAULT_MOSAIC
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
    if (saved) {
      if (saved.mosaic) mosaic = saved.mosaic
      if (saved.slots) {
        SLOTS.forEach((s) => {
          const sv = saved.slots[s.id]
          if (sv) {
            const okType = s.options.some((o) => o.key === sv.type)
            slots[s.id] = { type: okType ? sv.type : s.options[0].key, visible: sv.visible ?? s.visible }
          }
        })
      }
    }
  } catch { /* ignore */ }
  return { mosaic, slots }
}

export default function PerfilApostador() {
  const init = load()
  const [slots, setSlots] = useState(init.slots)
  const [mosaic, setMosaic] = useState(init.mosaic)
  const [custom, setCustom] = useState(loadCustom)
  const [editing, setEditing] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify({ mosaic, slots })) }, [mosaic, slots])
  useEffect(() => { localStorage.setItem(MOSAIC_KEY, JSON.stringify(custom)) }, [custom])

  const allMosaics = [...MOSAICS, ...custom]

  const setType = (id, type) => setSlots((p) => ({ ...p, [id]: { ...p[id], type } }))
  const toggle = (id) => setSlots((p) => ({ ...p, [id]: { ...p[id], visible: !p[id].visible } }))
  const hide = (id) => setSlots((p) => ({ ...p, [id]: { ...p[id], visible: false } }))
  const setAll = (val) => setSlots((p) => {
    const n = { ...p }
    SLOTS.forEach((s) => { n[s.id] = { ...p[s.id], visible: val } })
    return n
  })
  const reset = () => { localStorage.removeItem(STORE_KEY); const d = load(); setSlots(d.slots); setMosaic(d.mosaic) }

  const saveMosaic = (m) => { setCustom((prev) => [...prev.filter((x) => x.id !== m.id), m]); setMosaic(m.id); setEditing(false) }
  const deleteMosaic = (id) => {
    setCustom((prev) => prev.filter((x) => x.id !== id))
    setMosaic((cur) => (cur === id ? DEFAULT_MOSAIC : cur))
  }

  const activeMosaic = allMosaics.find((m) => m.id === mosaic) || MOSAICS[0]
  const visibleCount = SLOTS.filter((s) => slots[s.id]?.visible).length

  return (
    <div className="app">
      <ControlPanel
        slots={SLOTS}
        state={slots}
        mosaics={allMosaics}
        activeMosaic={mosaic}
        collapsed={collapsed}
        onSelectMosaic={setMosaic}
        onCreateMosaic={() => setEditing(true)}
        onDeleteMosaic={deleteMosaic}
        onToggle={toggle}
        onAll={setAll}
        onCollapse={() => setCollapsed((c) => !c)}
      />
      <main className="canvas">
        <div className="cv-top">
          <div>
            <h1>Perfil do Apostador · Mosaico de Componentes</h1>
            <p>Mosaico "{activeMosaic.name}" · os componentes se adaptam às células · troque o tipo pelo ⋮. {visibleCount} de {SLOTS.length} visíveis.</p>
          </div>
          <span className="count">
            <a href="#" onClick={(e) => { e.preventDefault(); reset() }} style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 700 }}>resetar</a>
          </span>
        </div>
        <Dashboard slots={SLOTS} state={slots} mosaic={activeMosaic} onChangeType={setType} onHide={hide} />
      </main>

      {editing && <MosaicEditor onSave={saveMosaic} onClose={() => setEditing(false)} />}
    </div>
  )
}
