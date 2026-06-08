---
modulo:
  id: perfil-apostador
  nome: "Perfil do Apostador"
  icone: "👤"

componentes:
  - id: identity
    titulo: "Identidade & KYC"
    status: existente
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: ficha
        rotulo: "Ficha do apostador"
        subtitulo: "Mascarado + SIGAP"
        info: "Quem é o apostador, com dados mascarados (LGPD). KYC/SIGAP ao lado do nome diz, num relance, se há pendência regulatória antes de qualquer decisão."
        dados:
          iniciais: "EP"
          nome: "EVANDRO PANTA"
          email: "ev••••••••••@gmail.com"
          alertas: 15
          campos:
            - ["Documento", "•••.•••.•••-••"]
            - ["Marca", "vaidebet-ngx"]
            - ["Telefone", "•••••••2338"]
            - ["Registro", "22/05/2026"]
            - ["Último acesso", "05/06 · 17:13"]
            - ["Saldo", "R$ 1,00"]

  - id: verdict
    titulo: "Veredito de Risco"
    status: existente
    tamanho: { w: 4, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: donut
        rotulo: "Donut + tendência"
        subtitulo: "Score consolidado"
        info: "O número-resumo do risco. A seta de tendência mostra se está piorando — o usuário decide num olhada se o caso merece atenção agora."
        dados:
          valor: 64
          max: 100
          rotulo: "RISCO MÉDIO-ALTO"
          delta: "+19 em 7 dias"
          alertas: 15

  - id: action
    titulo: "Ação recomendada"
    status: novo
    tamanho: { w: 3, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: acoes
        rotulo: "Lista de ações"
        subtitulo: "O que fazer"
        info: "Traduz o risco em próximos passos. Em vez de só ler dados, o operador clica na ação exigida (ex.: comunicação de JR ou abrir caso PLD)."
        dados:
          acoes:
            - titulo: "Enviar comunicação de Jogo Responsável"
              sub: "Exigido pela Portaria 1.231/2024 · registra na trilha"
            - titulo: "Abrir caso de revisão PLD"
              sub: "Padrão de depósitos sugere estruturação"

  - id: xai
    titulo: "Por que esse score"
    status: novo
    tamanho: { w: 8, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras
        rotulo: "Barras ponderadas"
        subtitulo: "Ranking de fatores"
        info: "Ranking do que mais pesa no score. Responde 'por que esse score?' em segundos — o fator no topo é o principal motivador."
        dados:
          fatores:
            - { nome: "Aceleração de depósitos vs. baseline", pts: 28 }
            - { nome: "Recuperação de perdas (chasing)",      pts: 21 }
            - { nome: "Conta vinculada (mesmo IP + PIX)",     pts: 15 }
            - { nome: "Apostas em horário atípico",           pts: 9  }
      - tipo: waterfall
        rotulo: "Waterfall"
        subtitulo: "Contribuição acumulada"
        info: "Conta a história do score: começa neutro e cada fator soma até o valor final. É a leitura que sustenta a justificativa numa auditoria."
        dados:
          base: 8
          fatores:
            - { nome: "Aceleração de depósitos vs. baseline", pts: 28 }
            - { nome: "Recuperação de perdas (chasing)",      pts: 21 }
            - { nome: "Conta vinculada (mesmo IP + PIX)",     pts: 15 }
            - { nome: "Apostas em horário atípico",           pts: 9  }

  - id: score-trend
    titulo: "Evolução do Score"
    status: novo
    tamanho: { w: 7, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: area_faixas
        rotulo: "Linha + faixa de risco"
        subtitulo: "Trajetória sobre as faixas"
        info: "A linha sobre as faixas verde/âmbar/vermelha mostra a posição: cruzar para o âmbar = gatilho de revisão."
        dados:
          linhas:
            - { dia: "29/05", risco: 22, jr: 18, pld: 30 }
            - { dia: "30/05", risco: 24, jr: 20, pld: 32 }
            - { dia: "31/05", risco: 28, jr: 26, pld: 35 }
            - { dia: "01/06", risco: 41, jr: 34, pld: 40 }
            - { dia: "02/06", risco: 52, jr: 48, pld: 45 }
            - { dia: "03/06", risco: 60, jr: 56, pld: 52 }
            - { dia: "04/06", risco: 64, jr: 61, pld: 58 }
      - tipo: linha
        rotulo: "Multi-linha (3 dimensões)"
        subtitulo: "Risco · PLD · JR"
        info: "Compara as 3 dimensões no tempo. Útil para ver divergência — ex.: risco subindo enquanto PLD fica estável."
        dados:
          linhas:
            - { dia: "29/05", risco: 22, jr: 18, pld: 30 }
            - { dia: "30/05", risco: 24, jr: 20, pld: 32 }
            - { dia: "31/05", risco: 28, jr: 26, pld: 35 }
            - { dia: "01/06", risco: 41, jr: 34, pld: 40 }
            - { dia: "02/06", risco: 52, jr: 48, pld: 45 }
            - { dia: "03/06", risco: 60, jr: 56, pld: 52 }
            - { dia: "04/06", risco: 64, jr: 61, pld: 58 }
      - tipo: kpi
        rotulo: "Sparkline"
        subtitulo: "Resumo compacto"
        info: "Resumo compacto da tendência, para caber ao lado do número. Mostra direção, não detalhe."
        dados:
          valor: 64
          delta: "+19 em 7 dias"
          linhas:
            - { dia: "29/05", risco: 22, jr: 18, pld: 30 }
            - { dia: "30/05", risco: 24, jr: 20, pld: 32 }
            - { dia: "31/05", risco: 28, jr: 26, pld: 35 }
            - { dia: "01/06", risco: 41, jr: 34, pld: 40 }
            - { dia: "02/06", risco: 52, jr: 48, pld: 45 }
            - { dia: "03/06", risco: 60, jr: 56, pld: 52 }
            - { dia: "04/06", risco: 64, jr: 61, pld: 58 }

  - id: dimensions
    titulo: "Dimensões & JR"
    status: parcial
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras_dimensoes
        rotulo: "Barras das dimensões"
        subtitulo: "Risco · PLD · JR"
        info: "Abre o score nas 3 dimensões (Risco, PLD, JR). Mostra qual eixo está puxando o risco para cima."
        dados:
          dimensoes:
            - { nome: "Risco / Fraude",    valor: 72, cor: "#E8612C" }
            - { nome: "PLD / AML",         valor: 58, cor: "#E0901F" }
            - { nome: "Jogo Responsável",  valor: 61, cor: "#E0901F" }

  - id: cashflow
    titulo: "Fluxo de Caixa"
    status: novo
    tamanho: { w: 7, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras_empilhadas
        rotulo: "Barras dep/saque"
        subtitulo: "Por dia"
        info: "Depósitos × saques por dia. Barras crescentes = aceleração (chasing/risco); saque no mesmo dia = ciclo depósito→saque rápido."
        dados:
          series:
            - { chave: dep, nome: "Depósitos" }
            - { chave: saq, nome: "Saques" }
          linhas:
            - { dia: "29/05", dep: 1.2, saq: 0 }
            - { dia: "30/05", dep: 2.0, saq: 0 }
            - { dia: "31/05", dep: 2.8, saq: 0.5 }
            - { dia: "01/06", dep: 3.6, saq: 0 }
            - { dia: "02/06", dep: 4.8, saq: 0 }
            - { dia: "03/06", dep: 6.0, saq: 0.9 }
            - { dia: "04/06", dep: 6.6, saq: 0 }
      - tipo: cashflow_net
        rotulo: "Saldo líquido"
        subtitulo: "Acumulado no tempo"
        info: "Trajetória do saldo acumulado. Boa para a tendência geral; esconde o pico de um dia específico."
        dados:
          linhas:
            - { dia: "29/05", dep: 1.2, saq: 0 }
            - { dia: "30/05", dep: 2.0, saq: 0 }
            - { dia: "31/05", dep: 2.8, saq: 0.5 }
            - { dia: "01/06", dep: 3.6, saq: 0 }
            - { dia: "02/06", dep: 4.8, saq: 0 }
            - { dia: "03/06", dep: 6.0, saq: 0.9 }
            - { dia: "04/06", dep: 6.6, saq: 0 }

  - id: vinculos
    titulo: "Vínculos"
    status: novo
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: grafo
        rotulo: "Grafo de nós"
        subtitulo: "IP · dispositivo · PIX"
        info: "A topologia revela o anel: muitas contas no mesmo IP/PIX = fraude coordenada, percebida num relance."
        dados:
          nos:
            - { id: "EP",  x: 50, y: 50, principal: true  }
            - { id: "IP",  x: 22, y: 22, principal: false }
            - { id: "A2",  x: 20, y: 80, principal: false }
            - { id: "A3",  x: 80, y: 24, principal: false }
            - { id: "PIX", x: 82, y: 80, principal: false }
          arestas:
            - ["EP", "IP"]
            - ["EP", "A2"]
            - ["EP", "A3"]
            - ["EP", "PIX"]
            - ["A3", "PIX"]
      - tipo: tabela
        rotulo: "Tabela de conexões"
        subtitulo: "Evidência exportável"
        info: "Lista auditável das conexões e a força de cada vínculo. Formato de evidência para anexar ao caso."
        dados:
          linhas:
            - { conta: "A2",    vinculo: "Mesmo IP + PIX",    forca: "Alta"  }
            - { conta: "A3",    vinculo: "Mesmo dispositivo", forca: "Média" }
            - { conta: "PIX-X", vinculo: "Conta bancária",    forca: "Alta"  }
            - { conta: "A5",    vinculo: "Mesmo IP",          forca: "Baixa" }

  - id: responsible
    titulo: "Jogo Responsável"
    status: novo
    tamanho: { w: 5, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: semaforo
        rotulo: "Semáforo de sinais"
        subtitulo: "Portaria 1.231/2024"
        info: "Sinais de jogo responsável por cor: vermelho/âmbar pedem intervenção (monitoramento exigido pela Portaria 1.231/2024)."
        dados:
          sinais:
            - { nome: "Perdas crescentes",       nivel: r }
            - { nome: "Apostas madrugada (14%)", nivel: a }
            - { nome: "Sem autolimitação",        nivel: a }
            - { nome: "Sem autoexclusão",         nivel: g }
            - { nome: "Velocidade de aposta",     nivel: g }
      - tipo: radar
        rotulo: "Radar"
        subtitulo: "Perfil multidimensional"
        info: "A forma do polígono = perfil de risco de JR. Bom para comparar o formato de risco entre apostadores."
        dados:
          eixos:
            - { eixo: "Perdas",     v: 80 }
            - { eixo: "Tempo",      v: 45 }
            - { eixo: "Madrugada",  v: 70 }
            - { eixo: "Frequência", v: 65 }
            - { eixo: "Velocidade", v: 40 }
      - tipo: gauge
        rotulo: "Gauge"
        subtitulo: "Resumo de 1 dimensão"
        info: "Resumo de uma só dimensão de JR. Rápido de ler, mas esconde quais sinais dispararam."
        dados:
          valor: 61
          rotulo: "JR"

  - id: pld
    titulo: "Padrões PLD / AML"
    status: novo
    tamanho: { w: 5, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: histograma
        rotulo: "Histograma + limite"
        subtitulo: "Detecta estruturação"
        info: "Pico de depósitos logo abaixo do limite de reporte = assinatura clássica de estruturação/smurfing."
        dados:
          barras:
            - { faixa: "0-50",    n: 1 }
            - { faixa: "50-100",  n: 2 }
            - { faixa: "100-150", n: 6 }
            - { faixa: "150-190", n: 9 }
            - { faixa: "190-200", n: 8 }
            - { faixa: "200-250", n: 2 }
            - { faixa: "250+",    n: 1 }
          limite: "190-200"
      - tipo: dispersao
        rotulo: "Dispersão no tempo"
        subtitulo: "Depósitos vs. limite"
        info: "Depósitos no tempo vs. o limite. Pontos colando na linha = fracionamento ao longo dos dias."
        dados:
          pontos:
            - { t: 1, v: 60  }
            - { t: 2, v: 80  }
            - { t: 3, v: 120 }
            - { t: 4, v: 150 }
            - { t: 5, v: 175 }
            - { t: 6, v: 185 }
            - { t: 7, v: 190 }
            - { t: 8, v: 188 }
          limite: 200
      - tipo: heatmap
        rotulo: "Heatmap dia × hora"
        subtitulo: "Automação por horário"
        info: "Concentração de atividade num horário fixo = comportamento automatizado (possível robô)."
        dados:
          matriz:
            - [1, 2, 4, 3, 1, 0, 1]
            - [3, 4, 6, 5, 2, 1, 2]
            - [1, 1, 3, 1, 1, 0, 1]
            - [0, 2, 2, 3, 1, 1, 0]

  - id: peer
    titulo: "Comparação com Pares"
    status: novo
    tamanho: { w: 4, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: percentil
        rotulo: "Percentil"
        subtitulo: "Posição na distribuição"
        info: "Posição na distribuição dos pares. 'Top 4%' comunica raridade melhor que um número absoluto."
        dados:
          percentil: 96
          descricao: "Velocidade de depósito no top 4% dos pares."
      - tipo: barras_pares
        rotulo: "Barras vs. mediana"
        subtitulo: "Vezes o típico"
        info: "Quantas vezes acima da mediana dos pares. Leitura simples e direta para um briefing."
        dados:
          barras:
            - { metrica: "Ticket médio",  x: 2.1 }
            - { metrica: "Frequência",    x: 1.4 }
            - { metrica: "Vel. depósito", x: 3.0 }
      - tipo: radar_pares
        rotulo: "Radar vs. cohort"
        subtitulo: "Forma do desvio"
        info: "Apostador vs. mediana do grupo em várias métricas — mostra o 'excesso' como forma."
        dados:
          eixos:
            - { eixo: "Ticket",    jogador: 78, cohort: 50 }
            - { eixo: "Freq.",     jogador: 70, cohort: 55 }
            - { eixo: "Vel. dep.", jogador: 92, cohort: 50 }
            - { eixo: "Volume",    jogador: 80, cohort: 52 }
            - { eixo: "Madrugada", jogador: 66, cohort: 40 }

  - id: behavioral
    titulo: "Classificação Comportamental"
    status: existente
    tamanho: { w: 4, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: chips
        rotulo: "Chips com tendência"
        subtitulo: "Sobe / cai"
        info: "Classificação qualitativa com seta de tendência (subindo/caindo). Dá contexto rápido do comportamento."
        dados:
          itens:
            - { k: "Depósitos",    v: "Alto",     tendencia: up   }
            - { k: "Saques",       v: "Baixo",    tendencia: flat }
            - { k: "Ticket Médio", v: "R$ 3,73",  tendencia: null }
            - { k: "Frequência",   v: "Alta",     tendencia: up   }
            - { k: "Ganhos",       v: "Baixo",    tendencia: down }
            - { k: "Tipo",         v: "Múltipla", tendencia: null }

  - id: intervention
    titulo: "Trilha de Intervenção"
    status: novo
    tamanho: { w: 4, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: timeline
        rotulo: "Linha do tempo"
        subtitulo: "Histórico p/ auditoria"
        info: "Sequência de ações com data e canal — o histórico defensável que uma auditoria da SPA exige."
        dados:
          itens:
            - { titulo: "Mensagem de JR enviada", sub: "WhatsApp · 02/06 · entregue",         cor: g }
            - { titulo: "Caso de revisão aberto", sub: "SLA 48h · pendente há 2 dias",        cor: a }
            - { titulo: "Consulta SIGAP",         sub: "Módulo de Impedidos · não integrado", cor: m }
      - tipo: board
        rotulo: "Status board"
        subtitulo: "Estado atual"
        info: "Estado atual das ações (JR, SLA, SIGAP). Bom para painel; fraco como registro histórico."
        dados:
          sinais:
            - { nome: "JR: enviado", nivel: g }
            - { nome: "SLA: 48h",    nivel: a }
            - { nome: "SIGAP: off",  nivel: r }

  - id: alerts
    titulo: "Alertas / Ocorrências"
    status: existente
    tamanho: { w: 4, h: 3 }
    visivel: false
    visualizacoes:
      - tipo: alertas
        rotulo: "Feed por categoria"
        subtitulo: "Alertas ativos"
        info: "Ocorrências ativas por categoria. Porta de entrada para investigar o que disparou no apostador."
        dados:
          alertas:
            - { tipo: "Chasing",                cpf: "CPF: 101.•••.•••-70", ago: "há 3 min"  }
            - { tipo: "Aceleração de Depósitos", cpf: "CPF: 101.•••.•••-70", ago: "há 12 min" }
            - { tipo: "Conta Vinculada",         cpf: "CPF: 102.•••.•••-01", ago: "há 28 min" }
            - { tipo: "Horário Atípico",         cpf: "CPF: 010.•••.•••-73", ago: "há 36 min" }

  - id: transactions
    titulo: "Transações / Bilhetes"
    status: existente
    tamanho: { w: 8, h: 3 }
    visivel: false
    visualizacoes:
      - tipo: bilhetes
        rotulo: "Lista de bilhetes"
        subtitulo: "Evidência bruta"
        info: "Evidência bruta das apostas — a base que sustenta os scores e a Explainable AI."
        dados:
          transacoes:
            - tipo: "Aposta Múltipla"
              status: "NÃO PREMIADO"
              legs:
                - { ev: "Rússia x Burkina Faso · GOALS_OVER_UNDER", odd: "1.24" }
                - { ev: "Canadá x Irlanda · GOALS_OVER_UNDER",      odd: "1.34" }
                - { ev: "Geórgia x Bahrain · GOALS_OVER_UNDER",     odd: "1.20" }
            - tipo: "Aposta Múltipla"
              status: "NÃO PREMIADO"
              legs:
                - { ev: "04 Jun 2026 · 18h59m · 6 seleções", odd: "BILHETE" }
---
# Perfil do Apostador

Manifesto completo — 15 componentes. Fonte de verdade para os SLOTS do Dashboard.
