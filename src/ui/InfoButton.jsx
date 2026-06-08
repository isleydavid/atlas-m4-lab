import { useState } from 'react'
import InfoModal from './InfoModal.jsx'

export default function InfoButton({ slot, opt }) {
  const [open, setOpen] = useState(false)
  if (!slot || !opt?.info) return null
  return (
    <>
      <button
        className="ibtn"
        onClick={() => setOpen(true)}
        aria-label="Como ler este gráfico"
        title="Como ler este gráfico"
      >i</button>
      {open && <InfoModal slot={slot} currentKey={opt.key} onClose={() => setOpen(false)} />}
    </>
  )
}
