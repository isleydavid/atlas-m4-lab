---
modulo:
  id: financiero
  nome: "Financeiro"
  icone: "💰"

dados_disponiveis:
  - depositos
  - saques
  - net_deposit
  - ggr
  - turnover
  - hold_casino
  - hold_sports
  - ftd
  - valor_ftd
  - ticket_medio_ftd
  - arpu
  - apostadores_ativos
  - wallet_exposure
  - acumulado_ggr
  - projecao_ggr
  - retencao_m1
  - ltv_projetado
  - aging_saques
  - distribuicao_tickets
  - cohort_safra
  - performance_marca
  - ocorrencias_ao_vivo

componentes:
  - id: visao-kpis
    titulo: "Indicadores Consolidados — MTD"
    subtitulo: "Mai/2026 · vaidebet"
    status: existente
    tamanho: { w: 8, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: chips
        rotulo: "Grade de KPIs"
        subtitulo: "8 indicadores-chave"
        info: "Panorama financeiro num relance: cada card traz o valor MTD e a variação vs. mês anterior. É o ponto de partida diário — define se a operação está saudável ou se algum KPI exige investigação."
        dados:
          itens:
            - { k: "Depósitos", v: "R$ 203,4M ▲22,4%", tendencia: null }
            - { k: "Saques", v: "R$ 178,3M ▲30,3%", tendencia: null }
            - { k: "Net Deposit", v: "R$ 25,1M", tendencia: null }
            - { k: "GGR", v: "R$ 21,65M ▼19,6%", tendencia: null }
            - { k: "Turnover", v: "R$ 793,8M ▲11,5%", tendencia: null }
            - { k: "FTD", v: "41.002 ▼50,2%", tendencia: null }
            - { k: "Wallet Exposure", v: "R$ 1,6B", tendencia: null }
            - { k: "LTV 12M", v: "R$ 156,07 ▼36,3%", tendencia: null }
            - { k: "Ticket FTD", v: "R$ 65,6", tendencia: null }

  - id: meta-ggr
    titulo: "Curva Acumulada GGR vs. Meta"
    subtitulo: "Necessário/dia para bater o mês"
    status: existente
    tamanho: { w: 4, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: kpi
        rotulo: "Acumulado + sparkline"
        subtitulo: "GGR no mês"
        info: "Acompanha quanto de GGR já entrou no mês contra o ritmo necessário. Se a curva achata e o necessário/dia sobe, dispara pressão tática sobre receita."
        dados:
          valor: "R$ 22,5M"
          delta: "Necessário R$ 1,28M/dia · 8 dias restantes"
          linhas:
            - { dia: "D1", risco: 0.9 }
            - { dia: "D5", risco: 4.6 }
            - { dia: "D9", risco: 8.3 }
            - { dia: "D13", risco: 12.0 }
            - { dia: "D17", risco: 15.8 }
            - { dia: "D21", risco: 19.2 }
            - { dia: "D25", risco: 22.5 }
      - tipo: gauge
        rotulo: "% da meta"
        subtitulo: "Acumulado / projeção"
        info: "Resume num só número o quão perto a operação está da projeção de fechamento (R$ 31,08M). Abaixo de ~80% no D25 = risco real de não bater a meta."
        dados:
          valor: 72
          rotulo: "% da meta"

  - id: fluxo-caixa
    titulo: "Depósitos × Saques"
    subtitulo: "Fluxo de caixa no período"
    status: existente
    tamanho: { w: 7, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras_empilhadas
        rotulo: "Barras dep/saque"
        subtitulo: "Por janela de 5 dias"
        info: "Compara entrada (depósitos) e saída (saques) ao longo do mês. Saques crescendo mais rápido que depósitos (+30,3% vs. +22,4%) acende alerta de liquidez."
        dados:
          series:
            - { chave: dep, nome: "Depósitos" }
            - { chave: saq, nome: "Saques" }
          linhas:
            - { dia: "01-05", dep: 38, saq: 30 }
            - { dia: "06-10", dep: 41, saq: 34 }
            - { dia: "11-15", dep: 40, saq: 36 }
            - { dia: "16-20", dep: 42, saq: 38 }
            - { dia: "21-25", dep: 43, saq: 40 }
      - tipo: cashflow_net
        rotulo: "Saldo líquido"
        subtitulo: "Net Deposit acumulado"
        info: "Trajetória do saldo líquido (depósitos − saques) acumulado. Mostra se a operação ainda gera caixa positivo à medida que os saques aceleram."
        dados:
          linhas:
            - { dia: "01-05", dep: 38, saq: 30 }
            - { dia: "06-10", dep: 41, saq: 34 }
            - { dia: "11-15", dep: 40, saq: 36 }
            - { dia: "16-20", dep: 42, saq: 38 }
            - { dia: "21-25", dep: 43, saq: 40 }

  - id: composicao-receita
    titulo: "Composição de Receita"
    subtitulo: "Casino vs. Sports"
    status: existente
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras_dimensoes
        rotulo: "Share por vertical"
        subtitulo: "% do GGR"
        info: "Quanto cada vertical pesa no GGR. Casino concentra 89% (R$ 19,3M) e Sports 11% (R$ 2,3M) — concentração alta significa que qualquer queda no Casino derruba a receita total."
        dados:
          dimensoes:
            - { nome: "Casino (R$ 19,3M)", valor: 89, cor: "#E8612C" }
            - { nome: "Sports (R$ 2,3M)", valor: 11, cor: "#E0901F" }
      - tipo: chips
        rotulo: "Detalhe por vertical"
        subtitulo: "GGR · Hold"
        info: "Abre a composição com GGR e hold de cada vertical lado a lado — útil para decidir alocação entre Casino e Sports."
        dados:
          itens:
            - { k: "Casino GGR", v: "R$ 19,3M", tendencia: null }
            - { k: "Casino Hold", v: "2,5% ▼0,58pp", tendencia: null }
            - { k: "Sports GGR", v: "R$ 2,3M", tendencia: null }
            - { k: "Sports Hold", v: "9,2% ▲8,6pp", tendencia: null }

  - id: ggr-12meses
    titulo: "GGR Mensal — 12 Meses"
    subtitulo: "Casino vs. Sports"
    status: existente
    tamanho: { w: 8, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras_empilhadas
        rotulo: "Barras empilhadas"
        subtitulo: "GGR por mês e vertical"
        info: "Tendência de receita no ano, decomposta por vertical. Permite ver sazonalidade esportiva e identificar se a queda recente do GGR é pontual ou estrutural."
        dados:
          series:
            - { chave: casino, nome: "Casino" }
            - { chave: sports, nome: "Sports" }
          linhas:
            - { dia: "Jul", casino: 21.5, sports: 4.8 }
            - { dia: "Ago", casino: 22.1, sports: 5.2 }
            - { dia: "Set", casino: 23.0, sports: 6.1 }
            - { dia: "Out", casino: 24.4, sports: 5.6 }
            - { dia: "Nov", casino: 25.1, sports: 6.8 }
            - { dia: "Dez", casino: 26.0, sports: 7.4 }
            - { dia: "Jan", casino: 24.8, sports: 5.9 }
            - { dia: "Fev", casino: 23.6, sports: 4.7 }
            - { dia: "Mar", casino: 22.9, sports: 5.1 }
            - { dia: "Abr", casino: 23.4, sports: 3.4 }
            - { dia: "Mai", casino: 19.3, sports: 2.3 }

  - id: hold-vertical
    titulo: "Hold % por Vertical"
    subtitulo: "Margem da casa"
    status: existente
    tamanho: { w: 4, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras_dimensoes
        rotulo: "Barras de hold"
        subtitulo: "Casino vs. Sports"
        info: "O hold é a margem retida sobre o turnover. Sports (9,2%) rende 3,7× o Casino (2,5%) — sinaliza oportunidade de realocar volume para a vertical mais rentável."
        dados:
          dimensoes:
            - { nome: "Hold Sports", valor: 9.2, cor: "#E8612C" }
            - { nome: "Hold Casino", valor: 2.5, cor: "#E0901F" }
      - tipo: chips
        rotulo: "Hold com variação"
        subtitulo: "vs. mês anterior"
        info: "Mostra a variação do hold em pontos percentuais. A compressão de margem do Casino (−0,58pp) é o que mais explica a queda do GGR total."
        dados:
          itens:
            - { k: "Hold Casino", v: "2,5% ▼0,58pp", tendencia: null }
            - { k: "Hold Sports", v: "9,2% ▲8,6pp", tendencia: null }

  - id: distribuicao-tickets
    titulo: "Distribuição de Tickets"
    subtitulo: "Depósitos por faixa de valor"
    status: existente
    tamanho: { w: 7, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: histograma
        rotulo: "Histograma de faixas"
        subtitulo: "7 faixas de valor"
        info: "Mostra onde se concentra o volume de depósitos. Cauda em tickets altos pesa em risco/PLD; concentração em tickets baixos indica base recreativa."
        dados:
          barras:
            - { faixa: "0-25", n: 9 }
            - { faixa: "25-50", n: 14 }
            - { faixa: "50-100", n: 21 }
            - { faixa: "100-200", n: 16 }
            - { faixa: "200-500", n: 8 }
            - { faixa: "500-1k", n: 4 }
            - { faixa: "1k+", n: 2 }

  - id: aging-saques
    titulo: "Aging de Saques Pendentes"
    subtitulo: "50 pendentes · R$ 18,5K"
    status: existente
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: histograma
        rotulo: "Pendentes por faixa"
        subtitulo: "SLA: 1h / 4h / 24h"
        info: "Distribui os saques pendentes pelas faixas de tempo de espera. A barra Crítico (>24h) é a prioridade — viola SLA e impacta reputação e compliance."
        dados:
          barras:
            - { faixa: "Recente", n: 28 }
            - { faixa: "Em Análise", n: 14 }
            - { faixa: "Atrasado", n: 6 }
            - { faixa: "Crítico", n: 2 }
          limite: "Crítico"
      - tipo: timeline
        rotulo: "Faixas de SLA"
        subtitulo: "Status por tempo"
        info: "Lê o aging como semáforo de SLA: verde dentro do prazo, âmbar em atenção, vermelho estourado. Aciona o time de operações sobre os casos críticos."
        dados:
          itens:
            - { titulo: "Recente · < 1h", sub: "28 saques · dentro do SLA", cor: g }
            - { titulo: "Em Análise · < 4h", sub: "14 saques · monitorar", cor: a }
            - { titulo: "Atrasado · < 24h", sub: "6 saques · atenção", cor: a }
            - { titulo: "Crítico · > 24h", sub: "2 saques · viola SLA", cor: r }

  - id: cohort-retencao
    titulo: "Cohort de Retenção"
    subtitulo: "Retenção % por safra de FTD"
    status: existente
    tamanho: { w: 7, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: heatmap
        rotulo: "Heatmap de cohort"
        subtitulo: "Safra × mês de vida"
        info: "Cada linha é uma safra de FTD; cada coluna, um mês de vida. Células mais claras à direita = base que para de voltar. Safras recentes mais frias = deterioração da retenção."
        dados:
          matriz:
            - [42, 31, 24, 19, 16]
            - [40, 29, 22, 18, 15]
            - [38, 27, 21, 17, 14]
            - [34, 24, 19, 15, 0]
            - [27, 18, 0, 0, 0]
      - tipo: tabela
        rotulo: "Tabela por safra"
        subtitulo: "M1 vs. benchmark"
        info: "Compara a retenção M1 de cada safra com o benchmark histórico (~26,9%). Safra de Abr/26 em 17,84% está 9,1pp abaixo — sinal crítico de qualidade de aquisição."
        dados:
          linhas:
            - { conta: "Jan/26", vinculo: "M1 38% · acima do benchmark", forca: "Alta" }
            - { conta: "Fev/26", vinculo: "M1 34% · acima do benchmark", forca: "Alta" }
            - { conta: "Mar/26", vinculo: "M1 27% · na média", forca: "Média" }
            - { conta: "Abr/26", vinculo: "M1 17,84% · −9,1pp benchmark", forca: "Baixa" }

  - id: curva-decaimento
    titulo: "Curva de Decaimento"
    subtitulo: "Cohort atual vs. benchmark"
    status: existente
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: linha
        rotulo: "Decaimento vs. benchmark"
        subtitulo: "Retenção ao longo dos meses"
        info: "A linha laranja é a safra atual; a âmbar, o benchmark histórico. Quando a atual cai mais rápido que o benchmark, o LTV projetado desaba — foi o que aconteceu (−36,3%)."
        dados:
          linhas:
            - { dia: "M0", risco: 100, pld: 100 }
            - { dia: "M1", risco: 18, pld: 27 }
            - { dia: "M2", risco: 13, pld: 21 }
            - { dia: "M3", risco: 10, pld: 17 }
            - { dia: "M4", risco: 8, pld: 14 }
            - { dia: "M5", risco: 7, pld: 12 }
      - tipo: kpi
        rotulo: "Retenção M1"
        subtitulo: "Tendência por safra"
        info: "Resume a deterioração da retenção M1 ao longo das safras recentes num único número com sparkline."
        dados:
          valor: "17,8%"
          delta: "▼9,1pp vs. benchmark"
          linhas:
            - { dia: "Jan", risco: 38 }
            - { dia: "Fev", risco: 34 }
            - { dia: "Mar", risco: 27 }
            - { dia: "Abr", risco: 18 }

  - id: performance-marca
    titulo: "Performance por Marca"
    subtitulo: "Cobertura no período"
    status: existente
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: tabela
        rotulo: "Marcas e cobertura"
        subtitulo: "Market share"
        info: "Mostra quais marcas têm dados no período. Hoje só vaidebet reporta (100% share); as demais sem dados podem indicar marca inativa ou falha de ingestão a investigar."
        dados:
          linhas:
            - { conta: "vaidebet", vinculo: "100% share · dados ativos", forca: "Alta" }
            - { conta: "betpix365", vinculo: "Sem dados no período", forca: "Baixa" }
            - { conta: "vaidebet-ngx", vinculo: "Sem dados no período", forca: "Baixa" }
            - { conta: "betpix365-ngx", vinculo: "Sem dados no período", forca: "Baixa" }

  - id: ocorrencias-ao-vivo
    titulo: "Ocorrências Ao Vivo"
    subtitulo: "Comportamentos atípicos"
    status: existente
    tamanho: { w: 4, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: alertas
        rotulo: "Feed em tempo real"
        subtitulo: "Compliance"
        info: "Feed de comportamentos atípicos detectados ao vivo (CPF mascarado + marca). Porta de entrada para acionar compliance ou abrir investigação no Perfil do Apostador."
        dados:
          alertas:
            - { tipo: "Horário Atípico", cpf: "CPF •••.•••.•••-12 · vaidebet", ago: "há 3 min" }
            - { tipo: "Aceleração de Depósitos", cpf: "CPF •••.•••.•••-77 · vaidebet", ago: "há 11 min" }
            - { tipo: "Super Ganhador", cpf: "CPF •••.•••.•••-04 · vaidebet", ago: "há 22 min" }
            - { tipo: "Conta Vinculada", cpf: "CPF •••.•••.•••-31 · vaidebet", ago: "há 36 min" }
      - tipo: timeline
        rotulo: "Linha do tempo"
        subtitulo: "Ordem de chegada"
        info: "Mesmas ocorrências como linha do tempo — útil para enxergar sequência e agrupamento temporal de eventos suspeitos."
        dados:
          itens:
            - { titulo: "Horário Atípico", sub: "vaidebet · há 3 min", cor: a }
            - { titulo: "Aceleração de Depósitos", sub: "vaidebet · há 11 min", cor: r }
            - { titulo: "Super Ganhador", sub: "vaidebet · há 22 min", cor: a }
            - { titulo: "Conta Vinculada", sub: "vaidebet · há 36 min", cor: r }

  - id: insights-auto
    titulo: "Insights Automáticos"
    subtitulo: "Leitura do mês"
    status: existente
    tamanho: { w: 3, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: semaforo
        rotulo: "Semáforo de insights"
        subtitulo: "5 sinais"
        info: "Resumo classificado dos principais sinais do mês: vermelho exige ação, âmbar atenção, verde positivo. Dá o veredito do mês sem precisar ler todos os gráficos."
        dados:
          sinais:
            - { nome: "GGR abaixo da meta (−25%)", nivel: r }
            - { nome: "FTD em queda (−50,2%)", nivel: r }
            - { nome: "Retenção M1 < benchmark", nivel: a }
            - { nome: "Turnover crescendo (+11,5%)", nivel: g }
            - { nome: "Hold Sports recuperando", nivel: g }

  - id: ltv-cohort
    titulo: "LTV Projetado 12M"
    subtitulo: "Valor por cohort de FTD"
    status: existente
    tamanho: { w: 4, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: kpi
        rotulo: "LTV + tendência"
        subtitulo: "Por safra"
        info: "Valor projetado de cada FTD em 12 meses. Queda de 36,3% vs. a cohort anterior conecta diretamente a piora da retenção ao retorno financeiro da aquisição."
        dados:
          valor: "R$ 156"
          delta: "▼36,3% vs. cohort anterior"
          linhas:
            - { dia: "Jan", risco: 245 }
            - { dia: "Fev", risco: 232 }
            - { dia: "Mar", risco: 198 }
            - { dia: "Abr", risco: 156 }

  - id: ngr-margem
    titulo: "NGR / Margem Líquida"
    subtitulo: "Proposta — não implementado"
    status: novo
    tamanho: { w: 4, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: kpi
        rotulo: "NGR estimado"
        subtitulo: "GGR − bônus/custos"
        info: "Gap apontado no assessment: o módulo mostra GGR mas não NGR (receita líquida após bônus e taxas). Sem NGR, a decisão de margem real fica cega. Valor ilustrativo."
        dados:
          valor: "R$ 18,9M"
          delta: "NGR estimado (proposta)"
          linhas:
            - { dia: "Fev", risco: 22.4 }
            - { dia: "Mar", risco: 20.8 }
            - { dia: "Abr", risco: 21.1 }
            - { dia: "Mai", risco: 18.9 }

  - id: alertas-meta
    titulo: "Alertas Proativos"
    subtitulo: "Proposta — não implementado"
    status: novo
    tamanho: { w: 4, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: semaforo
        rotulo: "Sinais de alerta"
        subtitulo: "Desvio · liquidez · risco"
        info: "Gap apontado no assessment: hoje não há alertas automáticos. Proposta de sensor proativo para desvio de meta de GGR, forecast de saques e concentração de wallet exposure."
        dados:
          sinais:
            - { nome: "Desvio de meta GGR", nivel: r }
            - { nome: "Forecast de saques 48h", nivel: a }
            - { nome: "Concentração wallet (top 100)", nivel: a }
---
# Financeiro — Manifesto do Módulo

Centro de inteligência de receita e fluxo de caixa da operação multi-marca de apostas.
Gerado a partir do conjunto de documentos de Product Assessment (Drive · Jun/2026), cobrindo
as 4 abas originais — Visão Geral, Depósitos & Saques, GGR & Turnover, Cohort & LTV — em uma
única página. Captura de referência: Mai/2026 · MTD · vaidebet.

Componentes marcados como `existente` refletem visuais já implementados no produto hoje.
Os marcados como `novo` (NGR/Margem e Alertas Proativos) são gaps levantados na análise e
entram como proposta de evolução. Valores numéricos das séries são ilustrativos/mock,
ancorados nos KPIs reais extraídos dos documentos (ex.: GGR R$ 21,65M, Hold Casino 2,5%,
Retenção M1 Abr/26 17,84%, LTV 12M R$ 156,07).
