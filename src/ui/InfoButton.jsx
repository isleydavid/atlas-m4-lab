import { useState, useRef, useEffect } from 'react'

// Ícone ℹ que abre um popover com "como o usuário lê" (proposta do gráfico).
export default function InfoButton({ text }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  if (!text) return null
  return (
    <div className="info" ref={ref}>
      <button className="ibtn" onClick={() => setOpen((o) => !o)} aria-label="Como ler este gráfico" title="Como ler este gráfico">i</button>
      {open && (
        <div className="imenu">
          <div className="ihead">Como o usuário lê</div>
          <p>{text}</p>
        </div>
      )}
    </div>
  )
}
