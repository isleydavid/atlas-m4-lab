// ============================================================
//  REGISTRY DE COMPONENTES
//  Para adicionar um gráfico novo:
//    1. crie o componente em src/charts/ (deve preencher .body)
//    2. importe aqui e adicione um objeto na lista abaixo
//  Campos: id, title, subtitle, category, status, w (colunas 1-12),
//          h (linhas de 96px), enabled, Component
// ============================================================
import { RiskVerdict, ScoreFactors, ScoreWaterfall, ScoreEvolution, ScoreMultiLine, ScoreSparkline, DimensionsBars } from './modules/perfil-apostador/charts/score.jsx'
import { RgSemaforo, RgRadar, RgGauge } from './modules/perfil-apostador/charts/responsible.jsx'
import { CashflowStacked, CashflowNet } from './modules/perfil-apostador/charts/cashflow.jsx'
import { VinculosGraph, VinculosTable } from './modules/perfil-apostador/charts/vinculos.jsx'
import { PldHistogram, PldScatter, PldHeatmap } from './modules/perfil-apostador/charts/pld.jsx'
import { PeerBars, PeerPercentile, PeerRadar } from './modules/perfil-apostador/charts/peer.jsx'
import { InterventionTimeline, InterventionBoard } from './modules/perfil-apostador/charts/intervention.jsx'
import { IdentityCard, Behavioral, ActionCard, AlertsFeed, Transactions } from './modules/perfil-apostador/charts/profile.jsx'

// status: 'have' (temos) | 'part' (parcial) | 'new' (proposto)
export const REGISTRY = [
  // --- Perfil ---
  { id: 'identity', title: 'Identidade & KYC', subtitle: 'Campos mascarados + SIGAP', category: 'Perfil', status: 'have', w: 5, h: 3, enabled: true, Component: IdentityCard },
  { id: 'verdict', title: 'Veredito de Risco', subtitle: 'Score donut + tendência', category: 'Perfil', status: 'have', w: 4, h: 2, enabled: true, Component: RiskVerdict },
  { id: 'action', title: 'Ação recomendada', subtitle: 'O que fazer com o apostador', category: 'Perfil', status: 'new', w: 3, h: 2, enabled: true, Component: ActionCard },
  { id: 'alerts', title: 'Alertas / Ocorrências', subtitle: 'Feed por categoria', category: 'Perfil', status: 'have', w: 4, h: 3, enabled: false, Component: AlertsFeed },
  { id: 'behavioral', title: 'Classificação Comportamental', subtitle: 'Com tendência (sobe/cai)', category: 'Perfil', status: 'have', w: 4, h: 2, enabled: true, Component: Behavioral },
  { id: 'transactions', title: 'Transações / Bilhetes', subtitle: 'Evidência bruta', category: 'Perfil', status: 'have', w: 8, h: 3, enabled: false, Component: Transactions },

  // --- Score / XAI ---
  { id: 'xai-factors', title: 'Por que esse score (XAI)', subtitle: 'Fatores ponderados', category: 'Score / XAI', status: 'new', w: 8, h: 3, enabled: true, Component: ScoreFactors },
  { id: 'xai-waterfall', title: 'Waterfall do Score', subtitle: 'Contribuição acumulada', category: 'Score / XAI', status: 'new', w: 6, h: 3, enabled: false, Component: ScoreWaterfall },
  { id: 'score-evo', title: 'Evolução do Score', subtitle: 'Linha + faixas de risco', category: 'Score / XAI', status: 'new', w: 7, h: 3, enabled: true, Component: ScoreEvolution },
  { id: 'score-multi', title: 'Score Multi-dimensão', subtitle: 'Risco · PLD · JR', category: 'Score / XAI', status: 'new', w: 6, h: 3, enabled: false, Component: ScoreMultiLine },
  { id: 'score-spark', title: 'Score Sparkline', subtitle: 'Resumo p/ header', category: 'Score / XAI', status: 'new', w: 3, h: 2, enabled: false, Component: ScoreSparkline },
  { id: 'dimensions', title: 'Dimensões & JR', subtitle: 'Barras das 3 dimensões', category: 'Score / XAI', status: 'part', w: 5, h: 3, enabled: true, Component: DimensionsBars },

  // --- Jogo Responsável ---
  { id: 'rg-semaforo', title: 'JR — Semáforo de Sinais', subtitle: 'Portaria 1.231/2024', category: 'Jogo Responsável', status: 'new', w: 5, h: 2, enabled: true, Component: RgSemaforo },
  { id: 'rg-radar', title: 'JR — Radar', subtitle: 'Perfil multidimensional', category: 'Jogo Responsável', status: 'new', w: 4, h: 3, enabled: false, Component: RgRadar },
  { id: 'rg-gauge', title: 'JR — Gauge', subtitle: 'Resumo de uma dimensão', category: 'Jogo Responsável', status: 'new', w: 3, h: 2, enabled: false, Component: RgGauge },

  // --- Financeiro ---
  { id: 'cashflow', title: 'Fluxo de Caixa no Tempo', subtitle: 'Depósitos × saques/dia', category: 'Financeiro', status: 'new', w: 7, h: 3, enabled: true, Component: CashflowStacked },
  { id: 'cashflow-net', title: 'Saldo Líquido', subtitle: 'Acumulado no tempo', category: 'Financeiro', status: 'new', w: 5, h: 3, enabled: false, Component: CashflowNet },

  // --- Vínculos ---
  { id: 'vinculos-graph', title: 'Grafo de Vínculos', subtitle: 'IP · dispositivo · PIX', category: 'Vínculos', status: 'new', w: 5, h: 3, enabled: true, Component: VinculosGraph },
  { id: 'vinculos-table', title: 'Tabela de Vínculos', subtitle: 'Evidência exportável', category: 'Vínculos', status: 'new', w: 4, h: 3, enabled: false, Component: VinculosTable },

  // --- PLD / AML ---
  { id: 'pld-hist', title: 'PLD — Histograma', subtitle: 'Valores vs. limite', category: 'PLD / AML', status: 'new', w: 5, h: 3, enabled: true, Component: PldHistogram },
  { id: 'pld-scatter', title: 'PLD — Dispersão', subtitle: 'Depósitos no tempo', category: 'PLD / AML', status: 'new', w: 5, h: 3, enabled: false, Component: PldScatter },
  { id: 'pld-heat', title: 'PLD — Heatmap', subtitle: 'Dia × hora', category: 'PLD / AML', status: 'new', w: 4, h: 2, enabled: false, Component: PldHeatmap },

  // --- Pares ---
  { id: 'peer-bars', title: 'Pares — Barras', subtitle: 'Vezes a mediana', category: 'Pares', status: 'new', w: 4, h: 2, enabled: false, Component: PeerBars },
  { id: 'peer-pct', title: 'Pares — Percentil', subtitle: 'Posição na distribuição', category: 'Pares', status: 'new', w: 4, h: 3, enabled: true, Component: PeerPercentile },
  { id: 'peer-radar', title: 'Pares — Radar', subtitle: 'Apostador vs. cohort', category: 'Pares', status: 'new', w: 4, h: 3, enabled: false, Component: PeerRadar },

  // --- Intervenção ---
  { id: 'interv-timeline', title: 'Trilha de Intervenção', subtitle: 'Histórico p/ auditoria', category: 'Intervenção', status: 'new', w: 4, h: 3, enabled: true, Component: InterventionTimeline },
  { id: 'interv-board', title: 'Status Board', subtitle: 'Estado atual', category: 'Intervenção', status: 'new', w: 4, h: 2, enabled: false, Component: InterventionBoard },
]

export const CATEGORIES = [...new Set(REGISTRY.map((r) => r.category))]
