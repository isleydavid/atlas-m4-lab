import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function InfoModal({ slot, currentKey, onClose }) {
  const currentOpt = slot.options.find((o) => o.key === currentKey) || slot.options[0]

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal wide" role="dialog" aria-modal="true" aria-label={slot.title}>
        <div className="modal-head">
          <div>
            <h3>{slot.title}</h3>
          </div>
          {slot.persona && <span className="persona">{slot.persona}</span>}
        </div>

        <div className="modal-body">
          <div className={`opts${slot.options.length <= 2 ? ' two' : ''}`}>
            {slot.options.map((opt, i) => (
              <div key={opt.key} className={`opt${opt.key === currentKey ? ' current' : ''}`}>
                <div className="otag">
                  <i>{LETTERS[i]}</i>{opt.label}
                  {opt.recomendada && <span className="star">★ Recomendado</span>}
                </div>
                <div className="preview" style={{ width: '100%', position: 'relative' }}>
                  <opt.Component dados={opt.dados} />
                </div>
                {opt.nota && <div className="ocap">{opt.nota}</div>}
              </div>
            ))}
          </div>

          {currentOpt.info && (
            <div className="interp">
              <div className="eye">👁</div>
              <p><b>Como o usuário lê:</b> {currentOpt.info}</p>
            </div>
          )}

          {slot.recomendacao && (
            <div className="reco">
              <span className="ck">✓</span>
              Recomendado: {slot.recomendacao}
            </div>
          )}
        </div>

        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
