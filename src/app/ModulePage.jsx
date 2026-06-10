import { useOutletContext } from 'react-router-dom'
import Dashboard from '../ui/Dashboard.jsx'

export default function ModulePage() {
  const { slots, slotState, allMosaics, activeMosaic, activeModule, onChangeType, onHide, onReset, aprovada, dataAprovacao, aprovar, onMoveSlot, onMoveToSection, sections } = useOutletContext()

  if (!activeModule || activeModule.status === 'soon') {
    return (
      <main className="canvas">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, opacity: 0.35, paddingTop: 80 }}>
          <span style={{ fontSize: 48 }}>{activeModule?.icone ?? '🔜'}</span>
          <span style={{ fontSize: 22 }}>{activeModule?.nome ?? 'Módulo'} — Em breve</span>
        </div>
      </main>
    )
  }

  return (
    <main className="canvas">
      <div style={{ padding: '18px 22px 10px', borderBottom: '1px solid var(--line)' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
          {activeModule.nome}
        </h1>
      </div>
      <Dashboard slots={slots} state={slotState} mosaic={activeMosaic} leitura={false} onChangeType={onChangeType} onHide={onHide} onMoveSlot={onMoveSlot} onMoveToSection={onMoveToSection} sections={sections} />
    </main>
  )
}
