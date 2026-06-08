import { useState, useEffect, useRef } from 'react'
import { MODULES } from '../modules/registry.js'

const MOSAIC_KEY = 'atlas-m4-lab-mosaics'
const DEFAULT_MOSAIC = 'destaque'

function storeKey(moduleId) { return `atlas-m4-lab-v4/${moduleId}` }

function defaultSlots(slots) {
  const base = {}
  slots.forEach((s) => { base[s.id] = { type: s.options[0].key, visible: s.visible } })
  return base
}

function load(moduleId, slots) {
  const base = defaultSlots(slots)
  let mosaic = DEFAULT_MOSAIC
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey(moduleId)) || 'null')
    if (saved) {
      if (saved.mosaic) mosaic = saved.mosaic
      if (saved.slots) {
        slots.forEach((s) => {
          const sv = saved.slots[s.id]
          if (sv) {
            const okType = s.options.some((o) => o.key === sv.type)
            base[s.id] = { type: okType ? sv.type : s.options[0].key, visible: sv.visible ?? s.visible }
          }
        })
      }
    }
  } catch { /* ignore */ }
  return { mosaic, slots: base }
}

export function useModuleState(moduleId, slots) {
  const [slotState, setSlotState] = useState(() => load(moduleId, slots).slots)
  const [mosaic, setMosaic] = useState(() => load(moduleId, slots).mosaic)

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    const mod = MODULES.find((m) => m.id === moduleId)
    const s = mod?.slots ?? []
    const init = load(moduleId, s)
    setSlotState(init.slots)
    setMosaic(init.mosaic)
  }, [moduleId])

  useEffect(() => {
    if (slots.length > 0) {
      localStorage.setItem(storeKey(moduleId), JSON.stringify({ mosaic, slots: slotState }))
    }
  }, [mosaic, slotState])

  const setType = (id, type) => setSlotState((p) => ({ ...p, [id]: { ...p[id], type } }))
  const toggle = (id) => setSlotState((p) => ({ ...p, [id]: { ...p[id], visible: !p[id].visible } }))
  const hide = (id) => setSlotState((p) => ({ ...p, [id]: { ...p[id], visible: false } }))
  const setAll = (val) => setSlotState((p) => {
    const n = { ...p }
    slots.forEach((s) => { n[s.id] = { ...p[s.id], visible: val } })
    return n
  })
  const reset = () => {
    localStorage.removeItem(storeKey(moduleId))
    const init = load(moduleId, slots)
    setSlotState(init.slots)
    setMosaic(init.mosaic)
  }

  return { slotState, mosaic, setMosaic, setType, toggle, hide, setAll, reset }
}

export { MOSAIC_KEY }
