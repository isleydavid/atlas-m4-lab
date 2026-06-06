import { useState, useRef, useEffect } from 'react'

export default function Kebab({ slot, typeKey, onChangeType, onHide }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const multi = slot.options.length > 1
  return (
    <div className="kebab" ref={ref}>
      <button className="kbtn" onClick={() => setOpen((o) => !o)} aria-label="Opções do componente" title="Opções">⋮</button>
      {open && (
        <div className="kmenu">
          {multi && <div className="klabel">Tipo de gráfico</div>}
          {multi && slot.options.map((o) => (
            <button key={o.key} className={`kitem ${o.key === typeKey ? 'on' : ''}`}
              onClick={() => { onChangeType(slot.id, o.key); setOpen(false) }}>
              <span className="kradio">{o.key === typeKey ? '●' : '○'}</span>
              <span className="kt">{o.label}<small>{o.subtitle}</small></span>
            </button>
          ))}
          {multi && <div className="kdiv" />}
          <button className="kitem danger" onClick={() => { onHide(slot.id); setOpen(false) }}>
            <span className="kradio">⤫</span><span className="kt">Ocultar componente</span>
          </button>
        </div>
      )}
    </div>
  )
}
