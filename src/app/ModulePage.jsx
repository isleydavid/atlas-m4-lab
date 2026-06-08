import { useOutletContext } from 'react-router-dom'
import Dashboard from '../ui/Dashboard.jsx'

export default function ModulePage() {
  const { slots, slotState, allMosaics, activeMosaic, activeModule, onChangeType, onHide, onReset } = useOutletContext()

  if (!activeModule || activeModule.status === 'soon') {
    return (
      <main className="canvas">
        <div className="cv-top">
          <div>
            <h1>{activeModule ? activeModule.nome : 'Módulo'}</h1>
            <p>Este módulo está em desenvolvimento.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, opacity: 0.35 }}>
          <span style={{ fontSize: 48 }}>{activeModule?.icone ?? '🔜'}</span>
          <span style={{ fontSize: 22 }}>Em breve</span>
        </div>
      </main>
    )
  }

  const visibleCount = slots.filter((s) => slotState[s.id]?.visible).length

  return (
    <main className="canvas">
      <div className="cv-top">
        <div>
          <h1>{activeModule.nome} · Mosaico de Componentes</h1>
          <p>Mosaico "{activeMosaic.name}" · os componentes se adaptam às células · troque o tipo pelo ⋮. {visibleCount} de {slots.length} visíveis.</p>
        </div>
        <span className="count">
          <a href="#" onClick={(e) => { e.preventDefault(); onReset() }} style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 700 }}>resetar</a>
        </span>
      </div>
      <Dashboard slots={slots} state={slotState} mosaic={activeMosaic} onChangeType={onChangeType} onHide={onHide} />
    </main>
  )
}
