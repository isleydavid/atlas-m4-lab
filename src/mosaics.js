// ============================================================
//  MOSAICOS = divisões da página (estruturas de células)
//  Os componentes VISÍVEIS são encaixados nas células na ordem,
//  e cada gráfico se adapta ao tamanho da célula em que cai.
//  w = colunas (1-12) · h = linhas (cada linha = 96px)
//
//  mode 'repeat'  -> o padrão se repete ao longo da página
//  mode 'prefix'  -> usa o padrão no início e 'fallback' no resto
// ============================================================
export const MOSAICS = [
  {
    id: 'uniforme',
    name: 'Grade uniforme',
    desc: 'Blocos do mesmo tamanho',
    mode: 'repeat',
    pattern: [{ w: 4, h: 3 }],
    fallback: { w: 4, h: 3 },
  },
  {
    id: 'duas-colunas',
    name: 'Duas colunas',
    desc: '4 cards em 2 colunas, depois largura total',
    mode: 'prefix',
    pattern: [{ w: 6, h: 3 }, { w: 6, h: 3 }, { w: 6, h: 3 }, { w: 6, h: 3 }],
    fallback: { w: 12, h: 3 },
  },
  {
    id: 'destaque',
    name: 'Destaque',
    desc: 'Bloco principal + grade',
    mode: 'prefix',
    pattern: [{ w: 8, h: 4 }, { w: 4, h: 4 }, { w: 4, h: 3 }, { w: 4, h: 3 }, { w: 4, h: 3 }],
    fallback: { w: 4, h: 3 },
  },
  {
    id: 'perfil-executivo',
    name: 'Perfil Executivo',
    desc: 'Identidade + score, faixa de KPIs e grade',
    mode: 'prefix',
    pattern: [
      { w: 7, h: 4 },
      { w: 5, h: 4 },
      { w: 4, h: 2 },
      { w: 4, h: 2 },
      { w: 4, h: 2 },
      { w: 8, h: 3 },
      { w: 4, h: 3 },
    ],
    fallback: { w: 4, h: 3 },
    density: 'confortavel',
  },
  {
    id: 'pld-aml',
    name: 'PLD/AML Compliance',
    desc: 'KPIs · sinais · fila de casos · comunicações',
    mode: 'prefix',
    pattern: [
      { w: 12, h: 2 }, // kpis-pld — faixa completa
      { w: 6,  h: 3 }, // avaliacao-risco (heatmap)
      { w: 6,  h: 3 }, // estruturacao (histograma)
      { w: 6,  h: 3 }, // descasamento (dispersao)
      { w: 6,  h: 4 }, // vinculos-pld (analise_riscos)
      { w: 8,  h: 4 }, // fila-casos (board)
      { w: 4,  h: 6 }, // caso-drawer
      { w: 6,  h: 4 }, // comunicacoes-coaf
    ],
    fallback: { w: 6, h: 3 },
    density: 'confortavel',
  },
]

// Tamanho da célula para o componente na posição `index` dentro do mosaico.
export function cellFor(mosaic, index) {
  if (!mosaic) return { w: 4, h: 3 }
  if (mosaic.mode === 'repeat') return mosaic.pattern[index % mosaic.pattern.length]
  return index < mosaic.pattern.length ? mosaic.pattern[index] : mosaic.fallback
}

// Empacotamento simples (shelf) para desenhar a miniatura do mosaico.
export function packPreview(mosaic, count = 8, cols = 12) {
  let x = 0, y = 0, rowH = 0
  const out = []
  for (let i = 0; i < count; i++) {
    const c = cellFor(mosaic, i)
    if (x + c.w > cols) { x = 0; y += rowH; rowH = 0 }
    out.push({ x, y, w: c.w, h: c.h })
    x += c.w; rowH = Math.max(rowH, c.h)
  }
  return out
}
