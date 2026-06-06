import { useState, useRef, useEffect } from 'react'

export default function HiddenMenu({ hidden, onShow, onReset }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div className="hidden-wrap" ref={ref}>
      <button className="hidden-btn" onClick={() => setOpen((o) => !o)} disabled={hidden.length === 0}>
        + Componentes ocultos ({hidden.length})
      </button>
      {open && hidden.length > 0 && (
        <div className="hidden-menu">
          <div className="klabel">Mostrar na página</div>
          {hidden.map((s) => (
            <button key={s.id} className="kitem" onClick={() => { onShow(s.id); setOpen(false) }}>
              <span className="kradio">＋</span><span className="kt">{s.title}</span>
            </button>
          ))}
        </div>
      )}
      <a href="#" className="reset-link" onClick={(e) => { e.preventDefault(); onReset() }}>resetar</a>
    </div>
  )
}
