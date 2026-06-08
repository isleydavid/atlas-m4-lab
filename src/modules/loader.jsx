import { load as yamlLoad } from 'js-yaml'
import ChartRenderer from '../ui/ChartRenderer.jsx'

const STATUS_MAP = {
  existente: 'have',
  novo:      'new',
  parcial:   'part',
}

function extractFrontmatter(raw) {
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---')) return null
  const rest = trimmed.slice(3)
  const end = rest.indexOf('\n---')
  if (end === -1) return null
  return rest.slice(0, end)
}

/**
 * loadModule(rawText)
 * rawText — string from:  import rawText from './module.md?raw'
 *
 * Returns { id, nome, icone, status: 'ready', slots[] }
 * Slot:   { id, title, w, h, visible, options[] }
 * Option: { key, label, subtitle?, status, Component, dados, info }
 */
export function loadModule(rawText) {
  const yamlStr = extractFrontmatter(rawText)
  if (!yamlStr) throw new Error('loadModule: frontmatter YAML not found in module.md')

  const doc = yamlLoad(yamlStr)
  const { modulo, componentes = [] } = doc

  const slots = componentes.map((comp) => {
    const optionStatus = STATUS_MAP[comp.status] ?? 'new'
    const visualizacoes = comp.visualizacoes ?? []

    const options = visualizacoes.map((vis) => {
      const tipo = vis.tipo
      const Component = ({ dados }) => <ChartRenderer tipo={tipo} dados={dados} />
      Component.displayName = `ManifestSlot_${comp.id}_${tipo}`

      return {
        key:         tipo,
        label:       vis.rotulo ?? tipo,
        ...(vis.subtitulo ? { subtitle: vis.subtitulo } : {}),
        status:      optionStatus,
        Component,
        dados:       vis.dados ?? {},
        info:        vis.info ?? '',
        nota:        vis.nota ?? '',
        recomendada: comp.recomendada === tipo,
      }
    })

    return {
      id:           comp.id,
      title:        comp.titulo ?? comp.id,
      w:            comp.tamanho?.w ?? 4,
      h:            comp.tamanho?.h ?? 3,
      visible:      comp.visivel ?? true,
      persona:      comp.persona ?? '',
      recomendada:  comp.recomendada ?? '',
      recomendacao: comp.recomendacao ?? '',
      options,
    }
  })

  return {
    id:     modulo.id,
    nome:   modulo.nome,
    icone:  modulo.icone ?? '',
    status: 'ready',
    slots,
  }
}
