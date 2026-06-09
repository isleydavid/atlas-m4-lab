import { useOutletContext } from 'react-router-dom'
import Dashboard from '../ui/Dashboard.jsx'

function fmtData(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm} · ${hh}:${mi}`
}

export default function ModulePage() {
  const { slots, slotState, allMosaics, activeMosaic, activeModule, onChangeType, onHide, onReset, aprovada, dataAprovacao, aprovar, onMoveSlot, onMoveToSection, sections } = useOutletContext()

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
      <div
        className="cv-top"
        style={aprovada ? { background: 'rgba(46,158,91,0.06)', borderBottomColor: 'rgba(46,158,91,0.18)' } : undefined}
      >
        <div>
          <h1>{activeModule.nome} · Mosaico de Componentes</h1>
          <p>Mosaico "{activeMosaic.name}" · os componentes se adaptam às células · troque o tipo pelo ⋮. {visibleCount} de {slots.length} visíveis.</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
          background: aprovada ? 'var(--green)' : 'var(--amber-soft)',
          color: aprovada ? '#fff' : 'var(--amber)',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {aprovada ? `Aprovada · ${fmtData(dataAprovacao)}` : 'Rascunho'}
        </span>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={aprovar}
            className="btn-ghost"
            style={aprovada ? { color: 'var(--red)', borderColor: 'var(--red-soft)' } : undefined}
          >
            {aprovada ? 'Revogar aprovação' : 'Aprovar página'}
          </button>
          <button
            disabled={!aprovada}
            className="btn-ghost"
            title={aprovada ? 'Exportar HTML' : 'Aprove a página para exportar'}
          >
            Exportar HTML
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); onReset() }}
            style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 700, fontSize: 12, alignSelf: 'center' }}>
            resetar
          </a>
        </div>
      </div>
      <Dashboard slots={slots} state={slotState} mosaic={activeMosaic} onChangeType={onChangeType} onHide={onHide} onMoveSlot={onMoveSlot} onMoveToSection={onMoveToSection} sections={sections} />
    </main>
  )
}
