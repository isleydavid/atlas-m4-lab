// Dados ILUSTRATIVOS do apostador (EVANDRO PANTA) para o laboratório de componentes.
// Troque por dados reais via API quando integrar.

export const C = {
  orange: '#E8612C', orange2: '#F08A52', orangeSoft: '#FDEDE6', line: '#ECEEF2',
  ink: '#23262F', muted: '#8A92A3', green: '#2E9E5B', amber: '#E0901F', red: '#E23B3B',
}

export const player = {
  nome: 'EVANDRO PANTA',
  email: 'ev••••••••••@gmail.com',
  id: '6a0fe98…c8fb',
  doc: '•••.•••.•••-••',
  marca: 'vaidebet-ngx',
  telefone: '•••••••2338',
  registro: '22/05/2026',
  ultimoAcesso: '05/06 · 17:13',
  saldo: 'R$ 1,00',
  score: 64,
  faixa: 'RISCO MÉDIO-ALTO',
  deltaScore: '+19 em 7 dias',
  alertas: 15,
}

export const scoreFactors = [
  { nome: 'Aceleração de depósitos vs. baseline', pts: 28 },
  { nome: 'Recuperação de perdas (chasing)', pts: 21 },
  { nome: 'Conta vinculada (mesmo IP + PIX)', pts: 15 },
  { nome: 'Apostas em horário atípico', pts: 9 },
]

export const scoreEvolution = [
  { dia: '29/05', risco: 22, jr: 18, pld: 30 },
  { dia: '30/05', risco: 24, jr: 20, pld: 32 },
  { dia: '31/05', risco: 28, jr: 26, pld: 35 },
  { dia: '01/06', risco: 41, jr: 34, pld: 40 },
  { dia: '02/06', risco: 52, jr: 48, pld: 45 },
  { dia: '03/06', risco: 60, jr: 56, pld: 52 },
  { dia: '04/06', risco: 64, jr: 61, pld: 58 },
]

export const dimensions = [
  { nome: 'Risco / Fraude', valor: 72, cor: C.orange },
  { nome: 'PLD / AML', valor: 58, cor: C.amber },
  { nome: 'Jogo Responsável', valor: 61, cor: C.amber },
]

export const rgSignals = [
  { nome: 'Perdas crescentes', nivel: 'r' },
  { nome: 'Apostas madrugada (14%)', nivel: 'a' },
  { nome: 'Sem autolimitação', nivel: 'a' },
  { nome: 'Sem autoexclusão', nivel: 'g' },
  { nome: 'Velocidade de aposta', nivel: 'g' },
]

export const rgRadar = [
  { eixo: 'Perdas', v: 80 }, { eixo: 'Tempo', v: 45 }, { eixo: 'Madrugada', v: 70 },
  { eixo: 'Frequência', v: 65 }, { eixo: 'Velocidade', v: 40 },
]

export const cashflow = [
  { dia: '29/05', dep: 1.2, saq: 0 },
  { dia: '30/05', dep: 2.0, saq: 0 },
  { dia: '31/05', dep: 2.8, saq: 0.5 },
  { dia: '01/06', dep: 3.6, saq: 0 },
  { dia: '02/06', dep: 4.8, saq: 0 },
  { dia: '03/06', dep: 6.0, saq: 0.9 },
  { dia: '04/06', dep: 6.6, saq: 0 },
]

export const vinculos = {
  nodes: [
    { id: 'EP', x: 50, y: 50, main: true },
    { id: 'IP', x: 22, y: 22 }, { id: 'A2', x: 20, y: 80 },
    { id: 'A3', x: 80, y: 24 }, { id: 'PIX', x: 82, y: 80 },
  ],
  edges: [['EP','IP'],['EP','A2'],['EP','A3'],['EP','PIX'],['A3','PIX']],
  table: [
    { conta: 'A2', vinculo: 'Mesmo IP + PIX', forca: 'Alta' },
    { conta: 'A3', vinculo: 'Mesmo dispositivo', forca: 'Média' },
    { conta: 'PIX-X', vinculo: 'Conta bancária', forca: 'Alta' },
    { conta: 'A5', vinculo: 'Mesmo IP', forca: 'Baixa' },
  ],
}

export const pldHistogram = [
  { faixa: '0-50', n: 1 }, { faixa: '50-100', n: 2 }, { faixa: '100-150', n: 6 },
  { faixa: '150-190', n: 9 }, { faixa: '190-200', n: 8 }, { faixa: '200-250', n: 2 }, { faixa: '250+', n: 1 },
]
export const pldScatter = [
  { t: 1, v: 60 }, { t: 2, v: 80 }, { t: 3, v: 120 }, { t: 4, v: 150 },
  { t: 5, v: 175 }, { t: 6, v: 185 }, { t: 7, v: 190 }, { t: 8, v: 188 },
]
export const pldHeatmap = [
  [1,2,4,3,1,0,1], [3,4,6,5,2,1,2], [1,1,3,1,1,0,1], [0,2,2,3,1,1,0],
]

export const peerBars = [
  { metrica: 'Ticket médio', x: 2.1 },
  { metrica: 'Frequência', x: 1.4 },
  { metrica: 'Vel. depósito', x: 3.0 },
]
export const peerRadar = [
  { eixo: 'Ticket', jogador: 78, cohort: 50 },
  { eixo: 'Freq.', jogador: 70, cohort: 55 },
  { eixo: 'Vel. dep.', jogador: 92, cohort: 50 },
  { eixo: 'Volume', jogador: 80, cohort: 52 },
  { eixo: 'Madrugada', jogador: 66, cohort: 40 },
]

export const behavioral = [
  { k: 'Depósitos', v: 'Alto', tr: 'up' },
  { k: 'Saques', v: 'Baixo', tr: 'flat' },
  { k: 'Ticket Médio', v: 'R$ 3,73', tr: null },
  { k: 'Frequência', v: 'Alta', tr: 'up' },
  { k: 'Ganhos', v: 'Baixo', tr: 'down' },
  { k: 'Tipo', v: 'Múltipla', tr: null },
]

export const interventions = [
  { titulo: 'Mensagem de JR enviada', sub: 'WhatsApp · 02/06 · entregue', cor: 'g' },
  { titulo: 'Caso de revisão aberto', sub: 'SLA 48h · pendente há 2 dias', cor: 'a' },
  { titulo: 'Consulta SIGAP', sub: 'Módulo de Impedidos · não integrado', cor: 'm' },
]

export const alerts = [
  { tipo: 'Chasing', cpf: 'CPF: 101.•••.•••-70', ago: 'há 3 min' },
  { tipo: 'Aceleração de Depósitos', cpf: 'CPF: 101.•••.•••-70', ago: 'há 12 min' },
  { tipo: 'Conta Vinculada', cpf: 'CPF: 102.•••.•••-01', ago: 'há 28 min' },
  { tipo: 'Horário Atípico', cpf: 'CPF: 010.•••.•••-73', ago: 'há 36 min' },
]

export const transactions = [
  { tipo: 'Aposta Múltipla', status: 'NÃO PREMIADO', legs: [
    { ev: 'Rússia x Burkina Faso · GOALS_OVER_UNDER', odd: '1.24' },
    { ev: 'Canadá x Irlanda · GOALS_OVER_UNDER', odd: '1.34' },
    { ev: 'Geórgia x Bahrain · GOALS_OVER_UNDER', odd: '1.20' },
  ]},
  { tipo: 'Aposta Múltipla', status: 'NÃO PREMIADO', legs: [
    { ev: '04 Jun 2026 · 18h59m · 6 seleções', odd: 'BILHETE' },
  ]},
]
