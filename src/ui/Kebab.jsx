import { useState, useRef, useEffect } from 'react'

export default function Kebab({ slot, typeKey, onChangeType, onHide, slotIndex, totalSlots, onMoveSlot, onMoveToSection, sections }) {
  const [open, setOpen] = useState(false)
  const [sectionOpen, setSectionOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSectionOpen(false) } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const close = () => { setOpen(false); setSectionOpen(false) }
  const multi = slot.options.length > 1
  const canUp = slotIndex > 0
  const canDown = slotIndex < totalSlots - 1
  const hasSections = sections?.length > 0
  return (
    <div className="kebab" ref={ref}>
      <button className="kbtn" onClick={() => setOpen((o) => !o)} aria-label="Opções do componente" title="Opções">⋮</button>
      {open && (
        <div className="kmenu">
          {multi && <div className="klabel">Tipo de gráfico</div>}
          {multi && slot.options.map((o) => (
            <button key={o.key} className={`kitem ${o.key === typeKey ? 'on' : ''}`}
              onClick={() => { onChangeType(slot.id, o.key); close() }}>
              <span className="kradio">{o.key === typeKey ? '●' : '○'}</span>
              <span className="kt">{o.label}<small>{o.subtitle}</small></span>
            </button>
          ))}
          {multi && <div className="kdiv" />}
          <div className="klabel">Ordenar</div>
          <button className="kitem" disabled={!canUp} onClick={() => { onMoveSlot(slot.id, 'top'); close() }}>
            <span className="kradio">⇑</span><span className="kt">Mover para o topo</span>
          </button>
          <button className="kitem" disabled={!canUp} onClick={() => { onMoveSlot(slot.id, 'up'); close() }}>
            <span className="kradio">↑</span><span className="kt">Mover para cima</span>
          </button>
          <button className="kitem" disabled={!canDown} onClick={() => { onMoveSlot(slot.id, 'down'); close() }}>
            <span className="kradio">↓</span><span className="kt">Mover para baixo</span>
          </button>
          <button className="kitem" disabled={!canDown} onClick={() => { onMoveSlot(slot.id, 'bottom'); close() }}>
            <span className="kradio">⇓</span><span className="kt">Mover para o fim</span>
          </button>
          {hasSections && (
            <>
              <button className="kitem" onClick={() => setSectionOpen((o) => !o)}>
                <span className="kradio">→</span>
                <span className="kt">Mover para seção<span className="kmeta">{sectionOpen ? ' ▲' : ' ▶'}</span></span>
              </button>
              {sectionOpen && (
                <div className="ksublist">
                  {sections.map((sec) => (
                    <button key={sec} className="kitem" onClick={() => { onMoveToSection(slot.id, sec); close() }}>
                      <span className="kradio" style={{ width: 16 }} />
                      <span className="kt">{sec}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="kdiv" />
          <button className="kitem danger" onClick={() => { onHide(slot.id); close() }}>
            <span className="kradio">⤫</span><span className="kt">Ocultar componente</span>
          </button>
        </div>
      )}
    </div>
  )
}
