import { ScoreFactors, ScoreWaterfall, ScoreEvolution, ScoreMultiLine, ScoreSparkline, DimensionsBars } from '../modules/perfil-apostador/charts/score.jsx'
import { RgSemaforo, RgRadar, RgGauge } from '../modules/perfil-apostador/charts/responsible.jsx'
import { CashflowStacked, CashflowNet } from '../modules/perfil-apostador/charts/cashflow.jsx'

import { PldHistogram, PldScatter, PldHeatmap } from '../modules/perfil-apostador/charts/pld.jsx'
import { PeerBars, PeerPercentile, PeerRadar } from '../modules/perfil-apostador/charts/peer.jsx'
import { InterventionTimeline, InterventionBoard } from '../modules/perfil-apostador/charts/intervention.jsx'
import IdentityCard from '../modules/perfil-apostador/charts/identity-card.jsx'
import AnaliseRiscos from '../modules/perfil-apostador/charts/analise-riscos.jsx'
import { VinculosTable } from '../modules/perfil-apostador/charts/vinculos.jsx'
import Transacoes from '../modules/perfil-apostador/charts/transacoes.jsx'
import ScoreRisco from '../modules/perfil-apostador/charts/score-risco.jsx'
import { ActionCard, AlertsFeed, Behavioral } from '../modules/perfil-apostador/charts/profile.jsx'
import Comportamental from '../modules/perfil-apostador/charts/comportamental.jsx'
import { C } from '../modules/perfil-apostador/charts/colors.js'

const CHART_MAP = {
  kpi:               ScoreSparkline,
  barras:            ScoreFactors,
  barras_empilhadas: CashflowStacked,
  cashflow_net:      CashflowNet,
  linha:             ScoreMultiLine,
  area_faixas:       ScoreEvolution,
  waterfall:         ScoreWaterfall,
  semaforo:          RgSemaforo,
  radar:             RgRadar,
  gauge:             RgGauge,
  dispersao:         PldScatter,
  histograma:        PldHistogram,
  heatmap:           PldHeatmap,
  analise_riscos:    AnaliseRiscos,
  barras_pares:      PeerBars,
  percentil:         PeerPercentile,
  radar_pares:       PeerRadar,
  timeline:          InterventionTimeline,
  board:             InterventionBoard,
  chips:             Behavioral,
  barras_dimensoes:  DimensionsBars,
  tabela:            VinculosTable,
  ficha:             IdentityCard,
  comportamental:    Comportamental,
  acoes:             ActionCard,
  alertas:           AlertsFeed,
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
