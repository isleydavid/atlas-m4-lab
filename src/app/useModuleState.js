import { useState, useEffect, useRef } from 'react'
import { MODULES } from '../modules/registry.js'

const MOSAIC_KEY = 'atlas-m4-lab-mosaics'
const DEFAULT_MOSAIC = 'destaque'

function storeKey(moduleId)    { return `atlas-m4-lab-v5/${moduleId}` }
function approvalKey(moduleId) { return `atlas-m4-lab-v5/${moduleId}/approval` }

function loadApproval(moduleId) {
  try {
    const saved = JSON.parse(localStorage.getItem(approvalKey(moduleId)) || 'null')
    if (saved && typeof saved.aprovada === 'boolean') return saved
  } catch { /* ignore */ }
  return { aprovada: false, dataAprovacao: null }
}

function defaultSlots(slots) {
  const base = {}
  slots.forEach((s) => { base[s.id] = { type: s.options[0].key, visible: s.visible } })
  return base
}

function load(moduleId, slots) {
  const base = defaultSlots(slots)
  let mosaic = DEFAULT_MOSAIC
  let order = slots.map((s) => s.id)
  let sections = {}
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
      if (Array.isArray(saved.order)) {
        const knownIds = new Set(slots.map((s) => s.id))
        const kept = saved.order.filter((id) => knownIds.has(id))
        const added = slots.map((s) => s.id).filter((id) => !kept.includes(id))
        order = [...kept, ...added]
      }
      if (saved.sections && typeof saved.sections === 'object') sections = saved.sections
    }
  } catch { /* ignore */ }
  return { mosaic, slots: base, order, sections }
}

export function useModuleState(moduleId, slots) {
  const [{ slots: iSlots, mosaic: iMosaic, order: iOrder, sections: iSections }] = useState(() => load(moduleId, slots))
  const [slotState,    setSlotState]    = useState(iSlots)
  const [mosaic,       setMosaic]       = useState(iMosaic)
  const [slotOrder,    setSlotOrder]    = useState(iOrder)
  const [slotSections, setSlotSections] = useState(iSections)
  const [aprovada,     setAprovada]     = useState(() => loadApproval(moduleId).aprovada)
  const [dataAprovacao, setDataAprovacao] = useState(() => loadApproval(moduleId).dataAprovacao)

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    const mod = MODULES.find((m) => m.id === moduleId)
    const s = mod?.slots ?? []
    const init = load(moduleId, s)
    setSlotState(init.slots)
    setMosaic(init.mosaic)
    setSlotOrder(init.order)
    setSlotSections(init.sections)
    const approval = loadApproval(moduleId)
    setAprovada(approval.aprovada)
    setDataAprovacao(approval.dataAprovacao)
  }, [moduleId])

  useEffect(() => {
    if (slots.length > 0) {
      localStorage.setItem(storeKey(moduleId), JSON.stringify({ mosaic, slots: slotState, order: slotOrder, sections: slotSections }))
    }
  }, [mosaic, slotState, slotOrder, slotSections])

  useEffect(() => {
    localStorage.setItem(approvalKey(moduleId), JSON.stringify({ aprovada, dataAprovacao }))
  }, [aprovada, dataAprovacao])

  const orderedSlots = [...slots].sort((a, b) => {
    const ai = slotOrder.indexOf(a.id)
    const bi = slotOrder.indexOf(b.id)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  const setType  = (id, type) => setSlotState((p) => ({ ...p, [id]: { ...p[id], type } }))
  const toggle   = (id) => setSlotState((p) => ({ ...p, [id]: { ...p[id], visible: !p[id].visible } }))
  const hide     = (id) => setSlotState((p) => ({ ...p, [id]: { ...p[id], visible: false } }))
  const setAll   = (val) => setSlotState((p) => {
    const n = { ...p }
    slots.forEach((s) => { n[s.id] = { ...p[s.id], visible: val } })
    return n
  })
  const reset = () => {
    localStorage.removeItem(storeKey(moduleId))
    const init = load(moduleId, slots)
    setSlotState(init.slots)
    setMosaic(init.mosaic)
    setSlotOrder(init.order)
    setSlotSections(init.sections)
  }

  const moveSlot = (id, dir) => setSlotOrder((prev) => {
    const arr = [...prev]
    const i = arr.indexOf(id)
    if (i < 0) return prev
    if (dir === 'up'     && i > 0)              { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]] }
    else if (dir === 'down' && i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]] }
    else if (dir === 'top')    { arr.splice(i, 1); arr.unshift(id) }
    else if (dir === 'bottom') { arr.splice(i, 1); arr.push(id) }
    return arr
  })

  const moveToSection = (id, sectionName, targetSectionCurrentIds) => {
    setSlotSections((prev) => ({ ...prev, [id]: sectionName }))
    setSlotOrder((prev) => {
      const arr = [...prev]
      const fromIdx = arr.indexOf(id)
      if (fromIdx < 0) return prev
      arr.splice(fromIdx, 1)
      const targetIds = (targetSectionCurrentIds || []).filter((tid) => tid !== id)
      let insertAt = arr.length
      for (let j = arr.length - 1; j >= 0; j--) {
        if (targetIds.includes(arr[j])) { insertAt = j + 1; break }
      }
      arr.splice(insertAt, 0, id)
      return arr
    })
  }

  const aprovar = () => {
    if (aprovada) { setAprovada(false); setDataAprovacao(null) }
    else          { setAprovada(true);  setDataAprovacao(new Date().toISOString()) }
  }

  return { slotState, slotSections, orderedSlots, mosaic, setMosaic, setType, toggle, hide, setAll, reset, moveSlot, moveToSection, aprovada, dataAprovacao, aprovar }
}

export { MOSAIC_KEY }
