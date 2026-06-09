import Card from './Card.jsx'
import { cellFor } from '../mosaics.js'

// Mosaico fixo: grid de 12 colunas com empacotamento denso.
// O tamanho de cada componente vem do MOSAICO escolhido (por posição);
// os gráficos são responsivos e se adaptam à célula.
export default function Dashboard({ slots, state, mosaic, leitura, onChangeType, onHide, onMoveSlot, onMoveToSection, sections }) {
  const visible = slots.filter((s) => state[s.id]?.visible)
  return (
    <div className={`dash${leitura ? ' leitura' : ''}`} data-density={mosaic?.density ?? 'confortavel'}>
      {visible.length === 0 && (
        <div className="empty">Nenhum componente visível. Ative algum na lista da esquerda.</div>
      )}
      {visible.map((s, i) => {
        const c = cellFor(mosaic, i)
        const slotIndex = slots.indexOf(s)
        return (
          <div key={s.id} className="cell" style={{ gridColumn: `span ${c.w}`, gridRow: `span ${c.h}` }}>
            <Card slot={s} typeKey={state[s.id].type} onChangeType={onChangeType} onHide={onHide}
              slotIndex={slotIndex} totalSlots={slots.length} onMoveSlot={onMoveSlot} onMoveToSection={onMoveToSection} sections={sections} />
          </div>
        )
      })}
    </div>
  )
}
