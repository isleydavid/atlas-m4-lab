import { useState } from 'react'
import MiniPreview from './MiniPreview.jsx'

const WIDTHS = [3, 4, 5, 6, 8, 12]
const HEIGHTS = [2, 3, 4]

export default function MosaicEditor({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || 'Meu mosaico')
  const [mode, setMode] = useState(initial?.mode || 'repeat')
  const [cells, setCells] = useState(initial?.pattern ? initial.pattern.map((c) => ({ ...c })) : [{ w: 8, h: 3 }, { w: 4, h: 3 }])

  const preview = { id: 'preview', name, mode, pattern: cells.length ? cells : [{ w: 4, h: 3 }], fallback: { w: 4, h: 3 } }

  const setCell = (i, patch) => setCells((p) => p.map((c, j) => (j === i ? { ...c, ...patch } : c)))
  const addCell = () => setCells((p) => [...p, { w: 4, h: 3 }])
  const removeCell = (i) => setCells((p) => p.filter((_, j) => j !== i))

  const save = () => {
    if (cells.length === 0) return
    onSave({
      id: initial?.id || `custom-${Date.now()}`,
      name: name.trim() || 'Meu mosaico',
      desc: `${cells.length} blocos · ${mode === 'repeat' ? 'repete' : 'início + preenche'}`,
      mode,
      pattern: cells,
      fallback: { w: 4, h: 3 },
      custom: true,
    })
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{initial ? 'Editar mosaico' : 'Criar mosaico'}</h3>
          <button className="kbtn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Visão Risco" />
          </div>

          <div className="field">
            <label>Como preencher a página</label>
            <div className="seg">
              <button className={mode === 'repeat' ? 'on' : ''} onClick={() => setMode('repeat')}>Repetir padrão</button>
              <button className={mode === 'prefix' ? 'on' : ''} onClick={() => setMode('prefix')}>Início + preencher 4×3</button>
            </div>
            <p className="hint">{mode === 'repeat'
              ? 'A sequência de blocos se repete até preencher a página.'
              : 'Os blocos abaixo aparecem no início; o resto vira blocos 4×3.'}</p>
          </div>

          <div className="field">
            <label>Blocos (largura × altura)</label>
            <div className="cells-edit">
              {cells.map((c, i) => (
                <div className="cell-row" key={i}>
                  <span className="cell-n">{i + 1}</span>
                  <select value={c.w} onChange={(e) => setCell(i, { w: +e.target.value })}>
                    {WIDTHS.map((w) => <option key={w} value={w}>{w} col</option>)}
                  </select>
                  <span className="x">×</span>
                  <select value={c.h} onChange={(e) => setCell(i, { h: +e.target.value })}>
                    {HEIGHTS.map((h) => <option key={h} value={h}>{h} lin</option>)}
                  </select>
                  <button className="rm" onClick={() => removeCell(i)} disabled={cells.length <= 1} title="Remover">✕</button>
                </div>
              ))}
              <button className="add-cell" onClick={addCell}>+ Adicionar bloco</button>
            </div>
          </div>

          <div className="field">
            <label>Pré-visualização</label>
            <div className="editor-preview"><MiniPreview mosaic={preview} active /></div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={save}>Salvar mosaico</button>
        </div>
      </div>
    </div>
  )
}
