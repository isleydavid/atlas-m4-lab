import { RiskVerdict, ScoreFactors, ScoreWaterfall, ScoreEvolution, ScoreMultiLine, ScoreSparkline, DimensionsBars } from '../modules/perfil-apostador/charts/score.jsx'
import { RgSemaforo, RgRadar, RgGauge } from '../modules/perfil-apostador/charts/responsible.jsx'
import { CashflowStacked, CashflowNet } from '../modules/perfil-apostador/charts/cashflow.jsx'

import { VinculosGraph, VinculosTable } from '../modules/perfil-apostador/charts/vinculos.jsx'
import { PldHistogram, PldScatter, PldHeatmap } from '../modules/perfil-apostador/charts/pld.jsx'
import { PeerBars, PeerPercentile, PeerRadar } from '../modules/perfil-apostador/charts/peer.jsx'
import { InterventionTimeline, InterventionBoard } from '../modules/perfil-apostador/charts/intervention.jsx'
import IdentityCard from '../modules/perfil-apostador/charts/identity-card.jsx'
import AnaliseRiscos from '../modules/perfil-apostador/charts/analise-riscos.jsx'
import Transacoes from '../modules/perfil-apostador/charts/transacoes.jsx'
import ScoreRisco from '../modules/perfil-apostador/charts/score-risco.jsx'
import { Behavioral, ActionCard, AlertsFeed, Transactions } from '../modules/perfil-apostador/charts/profile.jsx'
import { C } from '../modules/perfil-apostador/charts/colors.js'

const CHART_MAP = {
  donut:             RiskVerdict,
  kpi:               ScoreSparkline,
  barras:            ScoreFactors,
  barras_empilhadas: CashflowStacked,
  cashflow_net:      CashflowNet,
  linha:             ScoreMultiLine,
  area_faixas:       ScoreEvolution,
  waterfall:         ScoreWaterfall,
  barras_dimensoes:  DimensionsBars,
  semaforo:          RgSemaforo,
  radar:             RgRadar,
  gauge:             RgGauge,
  dispersao:         PldScatter,
  histograma:        PldHistogram,
  heatmap:           PldHeatmap,
  grafo:             VinculosGraph,
  tabela:            VinculosTable,
  analise_riscos:    AnaliseRiscos,
  barras_pares:      PeerBars,
  percentil:         PeerPercentile,
  radar_pares:       PeerRadar,
  timeline:          InterventionTimeline,
  board:             InterventionBoard,
  ficha:             IdentityCard,
  chips:             Behavioral,
  acoes:             ActionCard,
  alertas:           AlertsFeed,
  bilhetes:          Transactions,
  transacoes:        Transacoes,
  score_risco:       ScoreRisco,
}

export default function ChartRenderer({ tipo, dados }) {
  const Component = CHART_MAP[tipo]
  if (!Component) {
    return (
      <div className="body" style={{ display: 'grid', placeItems: 'center', color: C.muted, fontSize: 12 }}>
        Tipo "{tipo}" não reconhecido
      </div>
    )
  }
  return <Component dados={dados} />
}
