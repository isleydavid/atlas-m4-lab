// ============================================================
//  TEMPLATE DE SLOTS (mosaico fixo)
//  Cada slot tem opções de gráfico (trocáveis pelo ⋮). Cada opção
//  traz `info` = "como o usuário lê" (mostrado no ícone ℹ do card).
//  O tamanho da célula vem do MOSAICO selecionado (src/mosaics.js).
// ============================================================
import { RiskVerdict, ScoreFactors, ScoreWaterfall, ScoreEvolution, ScoreMultiLine, ScoreSparkline, DimensionsBars } from './charts/score.jsx'
import { RgSemaforo, RgRadar, RgGauge } from './charts/responsible.jsx'
import { CashflowStacked, CashflowNet } from './charts/cashflow.jsx'
import { VinculosGraph, VinculosTable } from './charts/vinculos.jsx'
import { PldHistogram, PldScatter, PldHeatmap } from './charts/pld.jsx'
import { PeerBars, PeerPercentile, PeerRadar } from './charts/peer.jsx'
import { InterventionTimeline, InterventionBoard } from './charts/intervention.jsx'
import { IdentityCard, Behavioral, ActionCard, AlertsFeed, Transactions } from './charts/profile.jsx'

// status: 'have' | 'part' | 'new'
export const SLOTS = [
  {
    id: 'identity', title: 'Identidade & KYC', w: 5, h: 3, visible: true,
    options: [{ key: 'card', label: 'Ficha do apostador', subtitle: 'Mascarado + SIGAP', status: 'have', Component: IdentityCard,
      info: 'Quem é o apostador, com dados mascarados (LGPD). KYC/SIGAP ao lado do nome diz, num relance, se há pendência regulatória antes de qualquer decisão.' }],
  },
  {
    id: 'verdict', title: 'Veredito de Risco', w: 4, h: 2, visible: true,
    options: [{ key: 'donut', label: 'Donut + tendência', subtitle: 'Score consolidado', status: 'have', Component: RiskVerdict,
      info: 'O número-resumo do risco. A seta de tendência mostra se está piorando — o usuário decide num olhada se o caso merece atenção agora.' }],
  },
  {
    id: 'action', title: 'Ação recomendada', w: 3, h: 2, visible: true,
    options: [{ key: 'list', label: 'Lista de ações', subtitle: 'O que fazer', status: 'new', Component: ActionCard,
      info: 'Traduz o risco em próximos passos. Em vez de só ler dados, o operador clica na ação exigida (ex.: comunicação de JR ou abrir caso PLD).' }],
  },
  {
    id: 'xai', title: 'Por que esse score', w: 8, h: 3, visible: true,
    options: [
      { key: 'bars', label: 'Barras ponderadas', subtitle: 'Ranking de fatores', status: 'new', Component: ScoreFactors,
        info: 'Ranking do que mais pesa no score. Responde “por que esse score?” em segundos — o fator no topo é o principal motivador.' },
      { key: 'waterfall', label: 'Waterfall', subtitle: 'Contribuição acumulada', status: 'new', Component: ScoreWaterfall,
        info: 'Conta a história do score: começa neutro e cada fator soma até o valor final. É a leitura que sustenta a justificativa numa auditoria.' },
    ],
  },
  {
    id: 'score-trend', title: 'Evolução do Score', w: 7, h: 3, visible: true,
    options: [
      { key: 'band', label: 'Linha + faixa de risco', subtitle: 'Trajetória sobre as faixas', status: 'new', Component: ScoreEvolution,
        info: 'A linha sobre as faixas verde/âmbar/vermelha mostra a posição: cruzar para o âmbar = gatilho de revisão. Melhor que um número solto.' },
      { key: 'multi', label: 'Multi-linha (3 dimensões)', subtitle: 'Risco · PLD · JR', status: 'new', Component: ScoreMultiLine,
        info: 'Compara as 3 dimensões no tempo. Útil para ver divergência — ex.: risco subindo enquanto PLD fica estável.' },
      { key: 'spark', label: 'Sparkline', subtitle: 'Resumo compacto', status: 'new', Component: ScoreSparkline,
        info: 'Resumo compacto da tendência, para caber ao lado do número. Mostra direção, não detalhe.' },
    ],
  },
  {
    id: 'dimensions', title: 'Dimensões & JR', w: 5, h: 3, visible: true,
    options: [{ key: 'bars', label: 'Barras das dimensões', subtitle: 'Risco · PLD · JR', status: 'part', Component: DimensionsBars,
      info: 'Abre o score nas 3 dimensões (Risco, PLD, JR). Mostra qual eixo está puxando o risco para cima.' }],
  },
  {
    id: 'cashflow', title: 'Fluxo de Caixa', w: 7, h: 3, visible: true,
    options: [
      { key: 'stacked', label: 'Barras dep/saque', subtitle: 'Por dia', status: 'new', Component: CashflowStacked,
        info: 'Depósitos × saques por dia. Barras crescentes = aceleração (chasing/risco); saque no mesmo dia = ciclo depósito→saque rápido.' },
      { key: 'net', label: 'Saldo líquido', subtitle: 'Acumulado no tempo', status: 'new', Component: CashflowNet,
        info: 'Trajetória do saldo acumulado. Boa para a tendência geral; esconde o pico de um dia específico.' },
    ],
  },
  {
    id: 'vinculos', title: 'Vínculos', w: 5, h: 3, visible: true,
    options: [
      { key: 'graph', label: 'Grafo de nós', subtitle: 'IP · dispositivo · PIX', status: 'new', Component: VinculosGraph,
        info: 'A topologia revela o anel: muitas contas no mesmo IP/PIX = fraude coordenada, percebida num relance.' },
      { key: 'table', label: 'Tabela de conexões', subtitle: 'Evidência exportável', status: 'new', Component: VinculosTable,
        info: 'Lista auditável das conexões e a força de cada vínculo. Formato de evidência para anexar ao caso.' },
    ],
  },
  {
    id: 'responsible', title: 'Jogo Responsável', w: 5, h: 2, visible: true,
    options: [
      { key: 'semaforo', label: 'Semáforo de sinais', subtitle: 'Portaria 1.231/2024', status: 'new', Component: RgSemaforo,
        info: 'Sinais de jogo responsável por cor: vermelho/âmbar pedem intervenção (monitoramento exigido pela Portaria 1.231/2024).' },
      { key: 'radar', label: 'Radar', subtitle: 'Perfil multidimensional', status: 'new', Component: RgRadar,
        info: 'A forma do polígono = perfil de risco de JR. Bom para comparar o formato de risco entre apostadores.' },
      { key: 'gauge', label: 'Gauge', subtitle: 'Resumo de 1 dimensão', status: 'new', Component: RgGauge,
        info: 'Resumo de uma só dimensão de JR. Rápido de ler, mas esconde quais sinais dispararam.' },
    ],
  },
  {
    id: 'pld', title: 'Padrões PLD / AML', w: 5, h: 3, visible: true,
    options: [
      { key: 'hist', label: 'Histograma + limite', subtitle: 'Detecta estruturação', status: 'new', Component: PldHistogram,
        info: 'Pico de depósitos logo abaixo do limite de reporte = assinatura clássica de estruturação/smurfing.' },
      { key: 'scatter', label: 'Dispersão no tempo', subtitle: 'Depósitos vs. limite', status: 'new', Component: PldScatter,
        info: 'Depósitos no tempo vs. o limite. Pontos colando na linha = fracionamento ao longo dos dias.' },
      { key: 'heat', label: 'Heatmap dia × hora', subtitle: 'Automação por horário', status: 'new', Component: PldHeatmap,
        info: 'Concentração de atividade num horário fixo = comportamento automatizado (possível robô).' },
    ],
  },
  {
    id: 'peer', title: 'Comparação com Pares', w: 4, h: 3, visible: true,
    options: [
      { key: 'pct', label: 'Percentil', subtitle: 'Posição na distribuição', status: 'new', Component: PeerPercentile,
        info: 'Posição na distribuição dos pares. “Top 4%” comunica raridade melhor que um número absoluto.' },
      { key: 'bars', label: 'Barras vs. mediana', subtitle: 'Vezes o típico', status: 'new', Component: PeerBars,
        info: 'Quantas vezes acima da mediana dos pares. Leitura simples e direta para um briefing.' },
      { key: 'radar', label: 'Radar vs. cohort', subtitle: 'Forma do desvio', status: 'new', Component: PeerRadar,
        info: 'Apostador vs. mediana do grupo em várias métricas — mostra o “excesso” como forma.' },
    ],
  },
  {
    id: 'behavioral', title: 'Classificação Comportamental', w: 4, h: 2, visible: true,
    options: [{ key: 'chips', label: 'Chips com tendência', subtitle: 'Sobe / cai', status: 'have', Component: Behavioral,
      info: 'Classificação qualitativa com seta de tendência (subindo/caindo). Dá contexto rápido do comportamento.' }],
  },
  {
    id: 'intervention', title: 'Trilha de Intervenção', w: 4, h: 3, visible: true,
    options: [
      { key: 'timeline', label: 'Linha do tempo', subtitle: 'Histórico p/ auditoria', status: 'new', Component: InterventionTimeline,
        info: 'Sequência de ações com data e canal — o histórico defensável que uma auditoria da SPA exige.' },
      { key: 'board', label: 'Status board', subtitle: 'Estado atual', status: 'new', Component: InterventionBoard,
        info: 'Estado atual das ações (JR, SLA, SIGAP). Bom para painel; fraco como registro histórico.' },
    ],
  },
  {
    id: 'alerts', title: 'Alertas / Ocorrências', w: 4, h: 3, visible: false,
    options: [{ key: 'feed', label: 'Feed por categoria', subtitle: 'Alertas ativos', status: 'have', Component: AlertsFeed,
      info: 'Ocorrências ativas por categoria. Porta de entrada para investigar o que disparou no apostador.' }],
  },
  {
    id: 'transactions', title: 'Transações / Bilhetes', w: 8, h: 3, visible: false,
    options: [{ key: 'list', label: 'Lista de bilhetes', subtitle: 'Evidência bruta', status: 'have', Component: Transactions,
      info: 'Evidência bruta das apostas — a base que sustenta os scores e a Explainable AI.' }],
  },
]
