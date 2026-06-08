import { useState, useEffect, useRef } from 'react'

const TIPOS = ['Todos', 'Super Ganhador', 'Conta Vinculada', 'Aceleração Depósitos', 'Horário Atípico', 'Chasing', 'Aposta Irregular']

export default function FeedSidebar({ ocorrencias = [], collapsed, onCollapse }) {
  const [tipo, setTipo] = useState('Todos')
  const [newestId, setNewestId] = useState(null)
  const prevFirstId = useRef(null)

  useEffect(() => {
    if (ocorrencias.length === 0) return
    const firstId = ocorrencias[0]?.id
    if (prevFirstId.current !== null && firstId !== prevFirstId.current) {
      setNewestId(firstId)
      const t = setTimeout(() => setNewestId(null), 600)
      prevFirstId.current = firstId
      return () => clearTimeout(t)
    }
    prevFirstId.current = firstId
  }, [ocorrencias])

  if (collapsed) {
    return (
      <aside className="feed collapsed">
        <button className="collapse-btn" onClick={onCollapse} style={{ writingMode: 'vertical-rl', padding: '16px 14px' }}>⟩</button>
      </aside>
    )
  }

  const itens = tipo === 'Todos' ? ocorrencias : ocorrencias.filter((o) => o.tipo === tipo)

  return (
    <aside className="feed">
      <div className="feed-head">
        <span className="live" />
        <b>Ocorrências Ao Vivo</b>
        <span className="clock">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="feed-filters">
        {TIPOS.map((t) => (
          <button key={t} className={`fchip ${tipo === t ? 'on' : ''}`} onClick={() => setTipo(t)}>{t}</button>
        ))}
      </div>
      <div className="feed-body">
        {itens.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, padding: '32px 0' }}>Nenhuma ocorrência</div>
        )}
        {itens.map((o) => (
          <div className={`feed-card${o.id === newestId ? ' is-new' : ''}`} key={o.id}>
            <div className="top"><span className="cd r" />{o.tipo}<span className="ago">{o.ago}</span></div>
            <div className="cpf">CPF: {o.cpf}</div>
            <span className="brand">{o.marca}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
