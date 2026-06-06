import MiniPreview from './MiniPreview.jsx'

// Sidebar: escolha do mosaico (divisão da página) + lista de componentes.
const GROUPS = [
  ['Perfil', ['identity', 'verdict', 'action', 'behavioral', 'alerts', 'transactions']],
  ['Score / XAI', ['xai', 'score-trend', 'dimensions']],
  ['Jogo Responsável', ['responsible']],
  ['Financeiro', ['cashflow']],
  ['Vínculos', ['vinculos']],
  ['PLD / AML', ['pld']],
  ['Pares', ['peer']],
  ['Intervenção', ['intervention']],
]

export default function ControlPanel({
  slots, state, mosaics, activeMosaic, collapsed,
  onSelectMosaic, onCreateMosaic, onDeleteMosaic, onToggle, onAll, onCollapse,
}) {
  const byId = Object.fromEntries(slots.map((s) => [s.id, s]))
  const activeCount = slots.filter((s) => state[s.id]?.visible).length
  if (collapsed) {
    return (
      <aside className="panel collapsed">
        <button className="collapse-btn" onClick={onCollapse} title="Expandir">☰</button>
      </aside>
    )
  }
  const currentLabel = (s) => (s.options.find((x) => x.key === state[s.id]?.type) || s.options[0]).label
  return (
    <aside className="panel">
      <div className="p-head">
        <div className="p-logo"><div className="sq">A</div><b>M4 Lab</b></div>
        <div className="p-sub">Escolha o mosaico (divisão da página) e ligue/desligue componentes. Troque o tipo de gráfico pelo ⋮ de cada card.</div>
      </div>
      <div className="p-body">
        <div className="cat">Mosaico da página</div>
        <div className="mosaics">
          {mosaics.map((m) => (
            <div key={m.id} className={`mosaic ${activeMosaic === m.id ? 'on' : ''}`} onClick={() => onSelectMosaic(m.id)} role="button">
              <div className="mosaic-thumb"><MiniPreview mosaic={m} active={activeMosaic === m.id} /></div>
              <div className="mosaic-meta"><b>{m.name}</b><small>{m.desc}</small></div>
              {m.custom && (
                <button className="mosaic-del" title="Excluir mosaico"
                  onClick={(e) => { e.stopPropagation(); onDeleteMosaic(m.id) }}>✕</button>
              )}
            </div>
          ))}
          <button className="mosaic-new" onClick={onCreateMosaic}>+ Criar mosaico</button>
        </div>

        <div className="cat" style={{ marginTop: 8 }}>Componentes</div>
        <div className="p-actions">
          <button onClick={() => onAll(true)}>Ativar tudo</button>
          <button onClick={() => onAll(false)}>Desativar tudo</button>
        </div>
        {GROUPS.map(([cat, ids]) => {
          const groupSlots = ids.map((id) => byId[id]).filter(Boolean)
          if (groupSlots.length === 0) return null
          return (
            <div key={cat}>
              <div className="cat sub">{cat}</div>
              {groupSlots.map((s) => {
                const on = state[s.id]?.visible
                return (
                  <div className={`toggle-row ${on ? '' : 'off'}`} key={s.id}>
                    <span className={`sw ${on ? 'on' : ''}`} onClick={() => onToggle(s.id)} />
                    <div className="nm">{s.title}<small>{on ? currentLabel(s) : 'inativo'}</small></div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <button className="collapse-btn" onClick={onCollapse}>◀ Recolher · {activeCount} ativos</button>
    </aside>
  )
}
