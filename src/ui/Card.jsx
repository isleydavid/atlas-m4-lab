import Kebab from './Kebab.jsx'
import InfoButton from './InfoButton.jsx'

const STATUS = {
  have: { cls: 'st-have', label: 'Temos' },
  part: { cls: 'st-part', label: 'Parcial' },
  new: { cls: 'st-new', label: 'Novo' },
}

export default function Card({ slot, typeKey, onChangeType, onHide }) {
  const opt = slot.options.find((o) => o.key === typeKey) || slot.options[0]
  const { Component } = opt
  const s = STATUS[opt.status]
  return (
    <div className="card">
      <div className="ch">
        <div className="ch-t">
          <h3>{slot.title}</h3>
          {opt.subtitle && <p>{opt.subtitle}</p>}
        </div>
        <div className="ch-r">
          {s && <span className={`st ${s.cls}`}>{s.label}</span>}
          <InfoButton slot={slot} opt={opt} />
          <Kebab slot={slot} typeKey={opt.key} onChangeType={onChangeType} onHide={onHide} />
        </div>
      </div>
      <Component dados={opt.dados} />
    </div>
  )
}
