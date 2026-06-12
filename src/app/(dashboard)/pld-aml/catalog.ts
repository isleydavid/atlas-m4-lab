// Catálogo de regras PLD/AML — fonte: REGRAS_CATALOGO.md

export interface PldRuleCatalog {
  id:              string
  nome:            string
  categoria:       string
  tipo:            'HIPÓTESE' | 'OBRIGATÓRIA'
  severidade:      string
  status:          'ATIVA' | 'INATIVA'
  objetivo:        string
  logicaDisparo:   string
  evento:          string
  frequencia:      string
  cadeiaImpacto:   string[]
  sla:             string
  flagGerado:      string | null
  params:          Record<string, { label: string; value: number | string; unit: string }>
  indicadores:     { id: string; nome: string; formula: string; fonte: string; status: string }[]
  fundamentoLegal: { lei: string; artigo: string; descricao: string }[]
  obrigatorio:     boolean
}

export interface RuleAuditEntry {
  ts:     string
  user:   string
  antes:  string
  depois: string
  motivo: string
}

export const RULE_AUDIT: Record<string, RuleAuditEntry[]> = {
  'EST-R01': [
    { ts: '15/05/2026 · 11:48', user: 'Marina Costa',  antes: 'janela 4h · qty_min 2',           depois: 'janela 24h · qty_min 3',           motivo: 'Janela aumentada para reduzir alarmes de baixo risco durante fins de semana (14 casos arquivados)' },
    { ts: '03/04/2026 · 09:20', user: 'Carlos Mendes', antes: 'limiar_individual R$ 1.500',        depois: 'limiar_individual R$ 2.000',        motivo: 'Alinhamento ao limiar de reporte automático da Portaria 1.143/2024 após consulta jurídica' },
  ],
  'SAQ-R01': [
    { ts: '09/06/2026 · 14:32', user: 'Marina Costa',  antes: 'pct_aposta ≤ 5% · janela 60 min', depois: 'pct_aposta ≤ 5% · janela 90 min', motivo: 'Redução de falsos positivos após revisão de 14 casos arquivados no mês anterior' },
    { ts: '18/03/2026 · 16:10', user: 'Carlos Mendes', antes: 'limiar_deposito R$ 500',            depois: 'limiar_deposito R$ 1.000',          motivo: 'Ajuste para focar em casos de maior relevância e reduzir volume de WorkList em 30%' },
  ],
  'COM-R01': [
    { ts: '02/06/2026 · 09:15', user: 'Marina Costa',  antes: 'delta_odds 5%',                    depois: 'delta_odds 10%',                    motivo: 'Threshold anterior gerava muitos alertas em apostadores com estratégia legítima de hedging' },
  ],
  'EST-R02': [
    { ts: '10/05/2026 · 10:05', user: 'Carlos Mendes', antes: 'min_contas 3 · janela 72h',        depois: 'min_contas 2 · janela 48h',         motivo: 'Smurfing com 2 contas é suficiente para caracterizar tipologia — ajuste recomendado pela auditoria' },
  ],
}

export const RULES_CATALOG: PldRuleCatalog[] = [
  {
    id: 'EST-R01',
    nome: 'Fracionamento de Depósitos (Janela)',
    categoria: 'Estruturação',
    tipo: 'HIPÓTESE',
    severidade: 'P2 — ALTA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar usuário que realiza múltiplos depósitos de baixo valor em curto espaço de tempo, somando montante relevante, para evitar limiares de controle.',
    logicaDisparo: `COUNT(deposits WHERE value < limiar_individual) >= qty_min
AND SUM(deposits) >= limiar_total
WITHIN janela_horas`,
    evento: 'transaction.deposit.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['EST-R01', 'ALT-EST-001', 'INV-MANUAL'],
    sla: '48h · INV-MANUAL',
    flagGerado: 'Estruturação',
    params: {
      limiar_individual: { label: 'Limiar por depósito', value: 2000, unit: 'R$' },
      qty_min:           { label: 'Qtd. mínima de depósitos', value: 3, unit: 'depósitos' },
      limiar_total:      { label: 'Soma mínima no período', value: 5000, unit: 'R$' },
      janela_horas:      { label: 'Janela de tempo', value: 24, unit: 'h' },
    },
    indicadores: [
      { id: 'IND-01', nome: 'Volume de Depósitos (Janela)', formula: 'SUM(valor_depósito) por user_id em janela', fonte: 'Tabela de transações', status: 'AVAILABLE' },
      { id: 'IND-02', nome: 'Contagem de Depósitos (Janela)', formula: 'COUNT(depósitos) por user_id em janela', fonte: 'Tabela de transações', status: 'AVAILABLE' },
    ],
    fundamentoLegal: [
      { lei: 'Lei 9.613/1998', artigo: 'Art. 1º', descricao: 'Crimes de lavagem de dinheiro — base de toda a tipologia AML' },
      { lei: 'Lei 9.613/1998', artigo: 'Art. 16', descricao: 'Estruturação como crime autônomo; ocorre mesmo sem lavagem confirmada' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XI', descricao: 'Aporte ou retirada de fundos em curto período com fracionamento' },
    ],
  },
  {
    id: 'EST-R02',
    nome: 'Smurfing entre Contas Vinculadas',
    categoria: 'Estruturação',
    tipo: 'HIPÓTESE',
    severidade: 'P1 — CRÍTICA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar uso coordenado de múltiplas contas (mesma rede de IP, dispositivo ou PIX de origem) para fracionar depósitos que individualmente não acionam alertas, mas em conjunto configuram estruturação.',
    logicaDisparo: `COUNT(distinct accounts WHERE shared_ip OR shared_device OR shared_pix_origin)
  >= min_contas_vinculadas
AND EXISTS(EST-R01 triggered IN any linked account)
WITHIN janela_horas`,
    evento: 'account.link.detected + transaction.deposit.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['EST-R02', 'ALT-EST-002', 'INV-DEEP', 'INV-COAF'],
    sla: '24h · INV-DEEP',
    flagGerado: 'Estruturação',
    params: {
      min_contas_vinculadas: { label: 'Contas vinculadas mínimas', value: 2, unit: 'contas' },
      janela_horas:          { label: 'Janela de tempo', value: 48, unit: 'h' },
    },
    indicadores: [
      { id: 'IND-03', nome: 'Contas no mesmo IP', formula: 'COUNT(accounts) por ip em janela', fonte: 'Tabela de sessões', status: 'AVAILABLE' },
      { id: 'IND-04', nome: 'Contas no mesmo dispositivo', formula: 'COUNT(accounts) por device_fingerprint', fonte: 'Tabela de sessões', status: 'AVAILABLE' },
      { id: 'IND-05', nome: 'PIX de origem comum', formula: 'COUNT(accounts) com mesmo pix_sender', fonte: 'Tabela de transações', status: 'AVAILABLE' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XIII', descricao: 'Uso de conta por interpostas pessoas' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XIV', descricao: 'Operações fracionadas entre contas vinculadas' },
      { lei: 'Lei 9.613/1998', artigo: 'Art. 1º §1º', descricao: 'Lavagem via ocultação da origem' },
    ],
  },
  {
    id: 'SAQ-R01',
    nome: 'Pass-Through (dep → aposta simbólica → saque)',
    categoria: 'Saque',
    tipo: 'HIPÓTESE',
    severidade: 'P1 — CRÍTICA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar padrão de lavagem onde o apostador deposita, faz uma aposta simbólica para "justificar" a movimentação, e saca praticamente o valor integral.',
    logicaDisparo: `deposit_value > limiar_deposito
AND bet_total / deposit_value <= pct_aposta_max
AND (deposit_value - bet_total - saque_value) / deposit_value <= pct_residuo_max
WITHIN janela_minutos`,
    evento: 'transaction.withdrawal.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['SAQ-R01', 'ALT-SAQ-001', 'INV-DEEP', 'INV-COAF'],
    sla: '24h · INV-DEEP + INV-COAF',
    flagGerado: 'Saque atípico',
    params: {
      limiar_deposito:  { label: 'Depósito mínimo', value: 1000, unit: 'R$' },
      pct_aposta_max:   { label: 'Aposta máx. sobre depósito', value: 5, unit: '%' },
      pct_residuo_max:  { label: 'Resíduo máx. após saque', value: 3, unit: '%' },
      janela_minutos:   { label: 'Janela de tempo', value: 60, unit: 'min' },
    },
    indicadores: [
      { id: 'IND-06', nome: 'Ratio Depósito/Saque', formula: '(saque) / (depósito) por user_id em janela', fonte: 'Tabela de transações', status: 'AVAILABLE' },
      { id: 'IND-07', nome: 'Volume de Apostas (Janela)', formula: 'SUM(valor_aposta) por user_id em janela', fonte: 'Tabela de apostas', status: 'AVAILABLE' },
      { id: 'IND-08', nome: 'Intervalo dep→saque (min)', formula: 'MIN(ts_saque - ts_deposito) por user_id', fonte: 'Tabela de transações', status: 'AVAILABLE' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XII', descricao: 'Saque logo após depósito sem atividade de aposta proporcional' },
      { lei: 'GAFI/FATF', artigo: 'Vulnerabilities of Casinos', descricao: 'Pass-through como tipologia primária de cassinos' },
      { lei: 'Lei 9.613/1998', artigo: 'Art. 1º §1º II', descricao: 'Ocultação de origem mediante operações financeiras' },
    ],
  },
  {
    id: 'SAQ-R02',
    nome: 'Saques Recorrentes de Valor Similar',
    categoria: 'Saque',
    tipo: 'HIPÓTESE',
    severidade: 'P2 — ALTA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar padrão de saques repetidos de valor próximo em curto espaço de tempo, sugerindo automação ou intenção de fracionar saques.',
    logicaDisparo: `COUNT(withdrawals WHERE ABS(value - AVG(recent_withdrawals)) / AVG <= pct_variacao)
  >= qty_min
WITHIN janela_horas`,
    evento: 'transaction.withdrawal.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['SAQ-R02', 'ALT-SAQ-002', 'INV-MANUAL'],
    sla: '48h · INV-MANUAL',
    flagGerado: 'Saque atípico',
    params: {
      pct_variacao: { label: 'Variação máx. entre saques', value: 10, unit: '%' },
      qty_min:      { label: 'Qtd. mínima de saques', value: 3, unit: 'saques' },
      janela_horas: { label: 'Janela de tempo', value: 48, unit: 'h' },
    },
    indicadores: [
      { id: 'IND-09', nome: 'Coeficiente de variação de saques', formula: 'STDDEV(saques) / AVG(saques) por user_id em janela', fonte: 'Tabela de transações', status: 'AVAILABLE' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XII', descricao: 'Retiradas recorrentes com padrão atípico' },
      { lei: 'GAFI/FATF', artigo: 'Indicadores de automação', descricao: 'Saques recorrentes de valor similar como indicador de mula' },
    ],
  },
  {
    id: 'DEP-R01',
    nome: 'Volume Incompatível com Perfil Financeiro',
    categoria: 'Depósito',
    tipo: 'HIPÓTESE',
    severidade: 'P2 — ALTA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar depósito cujo volume é incompatível com o perfil econômico-financeiro declarado ou estimado do apostador.',
    logicaDisparo: `deposit_value > AVG(user_historical_deposits) * multiplo_desvio
OR deposit_value > renda_estimada * pct_renda`,
    evento: 'transaction.deposit.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['DEP-R01', 'ALT-DEP-001', 'INV-MANUAL'],
    sla: '30 dias · INV-MANUAL',
    flagGerado: 'Depósito suspeito',
    params: {
      multiplo_desvio: { label: 'Múltiplo da média histórica', value: 5, unit: '×' },
      pct_renda:       { label: '% da renda mensal estimada', value: 50, unit: '%' },
    },
    indicadores: [
      { id: 'IND-10', nome: 'Média histórica de depósitos', formula: 'AVG(valor_depósito) por user_id, últimos 90 dias', fonte: 'ClickHouse', status: 'AVAILABLE' },
      { id: 'IND-11', nome: 'Renda estimada', formula: 'renda_declarada ou estimada por faixa de perfil', fonte: 'KYC / M4 Score', status: 'PARCIAL' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, IX', descricao: 'Incompatibilidade com perfil / ocupação / situação financeira' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 15–18', descricao: 'KYC: compatibilidade econômico-financeira obrigatória' },
    ],
  },
  {
    id: 'DEP-R02',
    nome: 'Depósito de Jurisdição de Alto Risco (GAFI)',
    categoria: 'Depósito',
    tipo: 'OBRIGATÓRIA',
    severidade: 'P2 — ALTA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar depósito originado de jurisdição classificada pelo GAFI como de alto risco ou sob monitoramento reforçado, ou de país com tributação favorecida.',
    logicaDisparo: `pix_origin_country IN gafi_high_risk_list
OR pix_origin_country IN tax_haven_list`,
    evento: 'transaction.deposit.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['DEP-R02', 'ALT-DEP-002', 'INV-DEEP'],
    sla: '24h · INV-DEEP',
    flagGerado: 'Depósito suspeito',
    params: {},
    indicadores: [
      { id: 'IND-12', nome: 'País de origem do PIX', formula: 'pix_sender_country por transação', fonte: 'Dados do PIX / KYC', status: 'PARCIAL' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, III', descricao: 'Jurisdição com deficiências em PLD/FTP (lista GAFI)' },
      { lei: 'GAFI/FATF', artigo: 'Lista de jurisdições', descricao: 'Jurisdições de alto risco — atualização trimestral' },
    ],
  },
  {
    id: 'DEP-R03',
    nome: 'Origem Suspeita de Recursos',
    categoria: 'Depósito',
    tipo: 'HIPÓTESE',
    severidade: 'P3 — MÉDIA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar depósito cuja origem apresenta características suspeitas: remetente pessoa jurídica, remetente sem histórico, ou remetente com flag de risco em outras contas.',
    logicaDisparo: `pix_sender_type = 'PJ'
OR pix_sender_id IN flagged_senders_list
OR pix_sender_id NOT IN known_senders AND value > limiar_pj`,
    evento: 'transaction.deposit.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['DEP-R03', 'ALT-DEP-003', 'INV-MANUAL'],
    sla: '30 dias · INV-MANUAL',
    flagGerado: 'Depósito suspeito',
    params: {
      limiar_pj: { label: 'Limiar para remetente PJ', value: 500, unit: 'R$' },
    },
    indicadores: [
      { id: 'IND-13', nome: 'Tipo do remetente PIX', formula: 'pix_sender_type (PF/PJ) por transação', fonte: 'Dados do PIX', status: 'AVAILABLE' },
      { id: 'IND-14', nome: 'Remetentes com flag', formula: 'lista de CPF/CNPJ com histórico suspeito', fonte: 'pld_flagged_senders', status: 'A CONSTRUIR' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, VI', descricao: 'Operações com origem de recursos suspeita' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XIII', descricao: 'Uso de interpostas pessoas (PJ como intermediador)' },
    ],
  },
  {
    id: 'COM-R01',
    nome: 'Conluio / Apostas em Mercados Opostos',
    categoria: 'Comportamento',
    tipo: 'HIPÓTESE',
    severidade: 'P1 — CRÍTICA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar apostadores que apostam em resultados opostos do mesmo evento, possivelmente em coordenação com terceiros, para transferir valor de forma disfarçada.',
    logicaDisparo: `EXISTS(
  bet_A WHERE event_id = X AND outcome = 'A'
  AND bet_B WHERE event_id = X AND outcome = 'NOT A'
  AND (bet_A.user_id = bet_B.user_id
       OR bet_A.user_id IN linked_accounts(bet_B.user_id))
)
AND ABS(bet_A.value - bet_B.value) / MAX(bet_A.value, bet_B.value) <= pct_delta_odds`,
    evento: 'bet.placed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['COM-R01', 'ALT-COM-001', 'INV-DEEP', 'INV-COAF'],
    sla: '24h · INV-DEEP + INV-COAF',
    flagGerado: 'Comportamento inconsistente',
    params: {
      pct_delta_odds: { label: 'Delta máx. entre apostas opostas', value: 10, unit: '%' },
    },
    indicadores: [
      { id: 'IND-15', nome: 'Apostas opostas por evento', formula: 'par de apostas no mesmo evento com outcomes opostos', fonte: 'Tabela de apostas', status: 'A CONSTRUIR' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XVI', descricao: 'Conluio em bolsas de apostas para transferência de valor' },
      { lei: 'Lei 14.597/2023', artigo: 'Art. 177', descricao: 'Manipulação de resultados esportivos' },
    ],
  },
  {
    id: 'COM-R02',
    nome: 'Velocidade Atípica / Automação',
    categoria: 'Comportamento',
    tipo: 'HIPÓTESE',
    severidade: 'P2 — ALTA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar sequências de transações com intervalos impossíveis para um humano, sugerindo uso de bot ou ferramenta automatizada para movimentar recursos.',
    logicaDisparo: `MIN(time_between_transactions) < intervalo_minimo_segundos
AND COUNT(transactions) >= qty_min
WITHIN janela_minutos`,
    evento: 'transaction.any.completed',
    frequencia: 'REALTIME',
    cadeiaImpacto: ['COM-R02', 'ALT-COM-002', 'INV-MANUAL'],
    sla: '48h · INV-MANUAL',
    flagGerado: 'Comportamento inconsistente',
    params: {
      intervalo_minimo_segundos: { label: 'Intervalo mínimo entre transações', value: 3, unit: 's' },
      qty_min:                   { label: 'Qtd. mínima de transações', value: 5, unit: 'tx' },
      janela_minutos:            { label: 'Janela de tempo', value: 10, unit: 'min' },
    },
    indicadores: [
      { id: 'IND-16', nome: 'Intervalo mínimo entre transações', formula: 'MIN(delta_ts) por user_id em janela', fonte: 'Tabela de transações', status: 'AVAILABLE' },
      { id: 'IND-17', nome: 'Taxa de transações por minuto', formula: 'COUNT(tx) / janela_min por user_id', fonte: 'Tabela de transações', status: 'AVAILABLE' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, X', descricao: 'Movimentação atípica sugerindo ferramenta automatizada' },
    ],
  },
  {
    id: 'COM-R03',
    nome: 'Match-Fixing / Manipulação de Resultados',
    categoria: 'Comportamento',
    tipo: 'HIPÓTESE',
    severidade: 'P1 — CRÍTICA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar padrão de apostas em eventos com odds anormais ou em mercados de baixa liquidez com volume desproporcional, sugerindo conhecimento prévio do resultado.',
    logicaDisparo: `bet_value > limiar_volume_mercado * pct_mercado
AND (odds < odds_min_suspeito OR market_liquidity < liquidez_min)
AND win_rate_historico > pct_win_rate_max`,
    evento: 'bet.settled',
    frequencia: 'BATCH (diário)',
    cadeiaImpacto: ['COM-R03', 'ALT-COM-003', 'INV-DEEP', 'INV-COAF'],
    sla: '24h · INV-DEEP + INV-COAF',
    flagGerado: 'Comportamento inconsistente',
    params: {
      pct_mercado:      { label: '% máx. do volume do mercado', value: 30, unit: '%' },
      pct_win_rate_max: { label: 'Win rate máx. em 30 dias', value: 80, unit: '%' },
    },
    indicadores: [
      { id: 'IND-18', nome: 'Win rate histórico', formula: 'COUNT(bets won) / COUNT(bets) por user_id, 30 dias', fonte: 'Tabela de apostas', status: 'AVAILABLE' },
      { id: 'IND-19', nome: 'Participação no mercado', formula: 'bet_value / market_total_volume', fonte: 'Tabela de odds/mercados', status: 'PARCIAL' },
    ],
    fundamentoLegal: [
      { lei: 'Lei 14.597/2023', artigo: 'Art. 177', descricao: 'Manipulação de resultado esportivo como crime' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, VIII', descricao: 'Aposta suspeita de estar associada a resultado manipulado' },
    ],
  },
  {
    id: 'COM-R04',
    nome: 'Resistência / Informação Falsa no KYC',
    categoria: 'Comportamento',
    tipo: 'HIPÓTESE',
    severidade: 'P3 — MÉDIA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Detectar apostadores que dificultam a coleta de informações cadastrais, fornecem dados inconsistentes ou apresentam divergências entre o cadastro e o comportamento financeiro.',
    logicaDisparo: `kyc_status IN ('FAILED', 'INCONSISTENT', 'REFUSED')
OR (kyc_data.renda_declarada > 0
    AND deposit_30d > kyc_data.renda_declarada * multiplo_renda)`,
    evento: 'kyc.event + transaction.deposit.completed',
    frequencia: 'EVENT-DRIVEN',
    cadeiaImpacto: ['COM-R04', 'ALT-COM-004', 'INV-MANUAL'],
    sla: '30 dias · INV-MANUAL',
    flagGerado: 'Comportamento inconsistente',
    params: {
      multiplo_renda: { label: 'Múltiplo da renda declarada', value: 3, unit: '×' },
    },
    indicadores: [
      { id: 'IND-20', nome: 'Status KYC', formula: 'kyc_status por user_id', fonte: 'KYC service / M4', status: 'PARCIAL' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XVIII', descricao: 'Dificuldade para coletar/validar informações de cadastro' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, IV–V', descricao: 'Resistência a fornecer informações ou informações falsas' },
    ],
  },
  {
    id: 'PEP-R01',
    nome: 'Pessoa Politicamente Exposta (PEP)',
    categoria: 'PEP',
    tipo: 'OBRIGATÓRIA',
    severidade: 'P2 — ALTA',
    status: 'ATIVA',
    obrigatorio: false,
    objetivo: 'Identificar apostadores que são PEP, seus familiares até 2º grau, representantes e colaboradores, e ativar diligência reforçada automaticamente.',
    logicaDisparo: `user_id IN pep_list
OR user_id IN pep_family_list (grau <= 2)
OR user_id IN pep_representatives_list
AND pep_condition_expiry > NOW()`,
    evento: 'user.kyc.updated + pep_list.updated',
    frequencia: 'EVENT-DRIVEN',
    cadeiaImpacto: ['PEP-R01', 'Watchlist', 'INV-MANUAL'],
    sla: 'Monitoramento contínuo; caso acionado: 30 dias',
    flagGerado: null,
    params: {
      aging_pep_anos: { label: 'Duração da condição PEP após cargo', value: 5, unit: 'anos' },
    },
    indicadores: [
      { id: 'IND-21', nome: 'Flag PEP', formula: 'is_pep + tipo_vinculo + cargo + esfera + expiry', fonte: 'Feed externo PEP', status: 'A INTEGRAR' },
      { id: 'IND-22', nome: 'Aging PEP', formula: '(expiry_date - NOW()) em meses', fonte: 'Feed externo PEP', status: 'A INTEGRAR' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 16 §único', descricao: 'PEP, familiares 2º grau, representantes, colaboradores; condição perdura 5 anos' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 25, XVII', descricao: 'Conta de PEP como sinal de atenção' },
    ],
  },
  {
    id: 'SAN-R01',
    nome: 'Hit em Lista de Sanções ONU/CSNU',
    categoria: 'Sanções',
    tipo: 'OBRIGATÓRIA',
    severidade: 'P1 — CRÍTICA',
    status: 'ATIVA',
    obrigatorio: true,
    objetivo: 'Identificar correspondência do apostador com pessoas ou entidades designadas pelo CSNU/ONU para indisponibilidade de ativos. Ação imediata e sem demora exigida por lei.',
    logicaDisparo: `fuzzy_match(user.nome + user.cpf, sanctions_list, threshold >= 0.90)
OR exact_match(user.cpf, sanctions_list)`,
    evento: 'user.registered + sanctions_list.updated',
    frequencia: 'EVENT-DRIVEN + BATCH diário',
    cadeiaImpacto: ['SAN-R01', 'ALT-SAN-001', 'INV-ONU'],
    sla: 'Imediato (art. 31)',
    flagGerado: null,
    params: {},
    indicadores: [
      { id: 'IND-23', nome: 'Score de correspondência em listas', formula: 'fuzzy_score por user_id vs. cada lista', fonte: 'Sanctions screening service', status: 'A INTEGRAR' },
    ],
    fundamentoLegal: [
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 31', descricao: 'Cumprir indisponibilidade de ativos do CSNU sem demora' },
      { lei: 'Lei 13.810/2019', artigo: '—', descricao: 'Indisponibilidade de ativos por designação ONU' },
      { lei: 'Lei 13.260/2016', artigo: '—', descricao: 'Financiamento do terrorismo' },
    ],
  },
  {
    id: 'KYC-R01',
    nome: 'Impedido de Apostar (art. 26 Lei 14.790/2023)',
    categoria: 'KYC',
    tipo: 'OBRIGATÓRIA',
    severidade: 'P1 — CRÍTICA',
    status: 'ATIVA',
    obrigatorio: true,
    objetivo: 'Identificar apostadores que constam na lista de impedidos da SPA: menores de 18 anos, servidores públicos relacionados à regulação de apostas, atletas e árbitros.',
    logicaDisparo: `user_id IN spa_impedidos_list
OR user.age < 18`,
    evento: 'user.registered + spa_impedidos_list.updated',
    frequencia: 'EVENT-DRIVEN',
    cadeiaImpacto: ['KYC-R01', 'ALT-KYC-001', 'INV-BLOCK'],
    sla: 'Imediato',
    flagGerado: null,
    params: {},
    indicadores: [
      { id: 'IND-24', nome: 'Status na lista de impedidos SPA', formula: 'is_impedido por user_id', fonte: 'Feed SPA/SIGAP', status: 'A INTEGRAR' },
    ],
    fundamentoLegal: [
      { lei: 'Lei 14.790/2023', artigo: 'Art. 26', descricao: 'Lista de impedidos de apostar (rol taxativo)' },
      { lei: 'Portaria SPA/MF 1.143/2024', artigo: 'Art. 15', descricao: 'Identificação e bloqueio de impedidos' },
    ],
  },
]
