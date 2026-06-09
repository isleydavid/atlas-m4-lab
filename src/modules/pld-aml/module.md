---
modulo:
  id: pld-aml
  nome: "PLD/AML"
  icone: "🛡️"

componentes:
  - id: kpis-pld
    titulo: "Indicadores PLD — MTD"
    subtitulo: "Jun/2026 · vaidebet"
    status: existente
    recomendada: chips
    tamanho: { w: 12, h: 2 }
    visivel: true
    visualizacoes:
      - tipo: chips
        rotulo: "Grade de KPIs"
        subtitulo: "7 indicadores de compliance"
        info: "Panorama PLD de relance: alertas abertos, SLA estourado, comunicações COAF e cobertura KYC. Ponto de partida do analista — define onde agir primeiro."
        dados:
          itens:
            - { k: "Alertas PLD abertos", v: "34 ▲8 D/D", tendencia: null }
            - { k: "Casos em análise", v: "12", tendencia: null }
            - { k: "SLA estourado (>30d)", v: "2 ⚠️", tendencia: null }
            - { k: "Comunicações COAF", v: "3 enviadas", tendencia: null }
            - { k: "Não-ocorrência 2026", v: "Pendente", tendencia: null }
            - { k: "% KYC classificados", v: "91,4%", tendencia: null }
            - { k: "Hits sanções ONU", v: "0 abertos", tendencia: null }

  - id: avaliacao-risco
    titulo: "Avaliação de Risco · art. 14"
    subtitulo: "Matriz por categoria de apostador"
    status: existente
    recomendada: heatmap
    tamanho: { w: 6, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: heatmap
        rotulo: "Heatmap de risco"
        subtitulo: "Categoria × nível de risco"
        info: "Avaliação interna de risco exigida pelo art. 14: probabilidade × impacto. Células mais quentes = concentração de risco que exige medidas reforçadas. PEP entra sempre na categoria alto."
        dados:
          matriz:
            - [12, 8, 3, 1]
            - [9, 14, 6, 2]
            - [4, 7, 11, 5]
            - [1, 3, 5, 4]

  - id: estruturacao
    titulo: "Estruturação · art. 25 XI"
    subtitulo: "Fracionamento de aportes/retiradas"
    status: existente
    recomendada: histograma
    tamanho: { w: 6, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: histograma
        rotulo: "Histograma de faixas"
        subtitulo: "Depósitos por valor · pico abaixo de R$ 2k"
        info: "Detecta fracionamento (smurfing): aportes em curto intervalo que sugerem dissimulação da operação real (art. 25 XI). Concentração logo abaixo de faixas redondas é sinal clássico."
        dados:
          barras:
            - { faixa: "< R$200", n: 6 }
            - { faixa: "200-500", n: 11 }
            - { faixa: "500-1k", n: 18 }
            - { faixa: "1k-2k", n: 31 }
            - { faixa: "2k-5k", n: 14 }
            - { faixa: "5k-10k", n: 7 }
            - { faixa: "> R$10k", n: 3 }
          limite: "1k-2k"

  - id: descasamento
    titulo: "Pass-through dep↔saque · art. 25 XII"
    subtitulo: "Saque logo após depósito sem aposta efetiva"
    status: existente
    recomendada: dispersao
    tamanho: { w: 6, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: dispersao
        rotulo: "Dispersão dep × saque"
        subtitulo: "Cada ponto = 1 apostador"
        info: "Detecta uso da conta como passagem de recursos: retirada logo após o depósito, sem aposta efetiva (art. 25 XII). Pontos próximos à diagonal = passagem quase total dos fundos."
        dados:
          pontos:
            - { x: 1200, y: 1150, pld: 0.92, nome: "#A-48217" }
            - { x: 850,  y: 820,  pld: 0.78, nome: "#A-50883" }
            - { x: 2300, y: 400,  pld: 0.35, nome: "#A-39102" }
            - { x: 500,  y: 490,  pld: 0.88, nome: "#A-41007" }
            - { x: 1800, y: 1750, pld: 0.95, nome: "#A-44092" }
            - { x: 3200, y: 300,  pld: 0.12, nome: "#A-36654" }
            - { x: 640,  y: 610,  pld: 0.82, nome: "#A-51002" }
            - { x: 1100, y: 950,  pld: 0.68, nome: "#A-49771" }
            - { x: 4000, y: 200,  pld: 0.05, nome: "#A-33219" }
            - { x: 900,  y: 880,  pld: 0.90, nome: "#A-50884" }

  - id: vinculos-pld
    titulo: "Vínculos e Intermediários · art. 25 XIII–XVI"
    subtitulo: "Rede de contas conectadas"
    status: existente
    recomendada: analise_riscos
    tamanho: { w: 6, h: 4 }
    visivel: true
    visualizacoes:
      - tipo: analise_riscos
        rotulo: "Grafo de vínculos"
        subtitulo: "Dispositivo / IP / aposta oposta"
        info: "Detecta uso de conta por terceiro/intermediador ou laranjas (art. 25 XIII–XV) e conluio em bolsa de apostas com apostas opostas (art. 25 XVI). Cada aresta é uma conexão verificada."
        dados:
          vinculosMesmoIP: true
          contasVinculadas: 5
          conta:
            nome: "Grupo Suspeito — #A-48217"
            marca: "vaidebet"
            cpf: "•••.•••.•••-17"
            ip: "200.148.x.x"
          score:
            valor: 92
            max: 100
            critico: true
          sinais:
            - "Vínculos com mesmo dispositivo/IP"
            - "Apostas opostas em bolsa (conluio)"
          grafo:
            nos:
              - { id: "A-48217", x: 210, y: 85,  principal: true  }
              - { id: "A-48220", x: 95,  y: 38,  principal: false }
              - { id: "A-48231", x: 88,  y: 135, principal: false }
              - { id: "A-50883", x: 330, y: 40,  principal: false }
              - { id: "A-50884", x: 340, y: 135, principal: false }
              - { id: "A-51002", x: 185, y: 160, principal: false }
            arestas:
              - ["A-48217", "A-48220"]
              - ["A-48217", "A-48231"]
              - ["A-48220", "A-48231"]
              - ["A-50883", "A-50884"]
              - ["A-50883", "A-51002"]
          descricao: "3 contas compartilham mesmo dispositivo/IP (#A-48217, #A-48220, #A-48231). 3 contas com apostas opostas em bolsa (#A-50883 ↔ #A-50884, #A-51002)."

  - id: fila-casos
    titulo: "Fila de Análise · SLA 30 dias"
    subtitulo: "art. 26 §2 — encerrar em 30 dias da operação"
    status: existente
    recomendada: timeline
    tamanho: { w: 8, h: 4 }
    visivel: true
    visualizacoes:
      - tipo: timeline
        rotulo: "Linha do tempo de casos"
        subtitulo: "Por estado de análise"
        info: "Fila auditável com SLA de 30 dias (art. 26 §2). Cada transição é logada com autor e timestamp (art. 32)."
        dados:
          itens:
            - { titulo: "#C-2026-0612 · SLA estourado ⚠️", sub: "#A-48217 · Estruturação · Em análise", cor: r }
            - { titulo: "#C-2026-0613 · SLA 09/jul", sub: "#A-50883 · Conluio · Em análise", cor: a }
            - { titulo: "#C-2026-0614 · Aguardando diligência", sub: "#A-39105 · PEP · Due diligence reforçada", cor: a }
            - { titulo: "#C-2026-0589 · SISCOAF pendente", sub: "#A-44092 · Comunicado", cor: a }
            - { titulo: "#C-2026-0541 · SIS-877-2026", sub: "#A-40017 · Enviado ao COAF", cor: g }
            - { titulo: "#C-2026-0503 · Arquivado", sub: "#A-36654 · Sem indício · doc. 5 anos", cor: g }
      - tipo: board
        rotulo: "Sinais de status"
        subtitulo: "Visão de chips"
        info: "Resumo de status da fila em chips coloridos."
        dados:
          sinais:
            - { nome: "#C-2026-0612 · SLA estourado", nivel: r }
            - { nome: "#C-2026-0613 · Em análise", nivel: a }
            - { nome: "#C-2026-0614 · Diligência", nivel: a }
            - { nome: "#C-2026-0589 · SISCOAF pendente", nivel: a }
            - { nome: "#C-2026-0541 · Enviado COAF", nivel: g }
            - { nome: "#C-2026-0503 · Arquivado", nivel: g }

  - id: caso-drawer
    titulo: "Drawer de Caso"
    subtitulo: "Análise detalhada + rascunho SISCOAF"
    status: existente
    recomendada: caso_drawer
    tamanho: { w: 4, h: 6 }
    visivel: true
    visualizacoes:
      - tipo: caso_drawer
        rotulo: "Drawer de caso PLD"
        subtitulo: "3 casos sintéticos · 3 desfechos"
        info: "Instrutor de análise: sinais identificados, fatos observados, conclusão e rascunho da comunicação (art. 27 §2). Toda a base legal está atrás do 'i' — a tela mostra só os dados do caso."
        dados: {}

  - id: comunicacoes-coaf
    titulo: "Comunicações COAF/SISCOAF"
    subtitulo: "art. 27–28 suspeita · art. 30 não-ocorrência"
    status: existente
    recomendada: comunicacoes
    tamanho: { w: 6, h: 4 }
    visivel: true
    visualizacoes:
      - tipo: comunicacoes
        rotulo: "Registro SISCOAF + SIGAP"
        subtitulo: "Suspeita e não-ocorrência"
        info: "Dois canais distintos: SISCOAF para operações suspeitas (art. 28) e SIGAP para não-ocorrência anual (art. 30). Sigilo obrigatório — art. 29."
        dados:
          siscoaf:
            - { id: "COM-2026-0031", caso: "#C-2026-0612", apostador: "#A-48217", status: "Enviada",   data: "11/jun/2026", canal: "SISCOAF", protocolo: "SIS-931-2026" }
            - { id: "COM-2026-0028", caso: "#C-2026-0589", apostador: "#A-44092", status: "Pendente",  data: "09/jun/2026", canal: "SISCOAF", protocolo: null }
            - { id: "COM-2026-0022", caso: "#C-2026-0541", apostador: "#A-40017", status: "Enviada",   data: "02/jun/2026", canal: "SISCOAF", protocolo: "SIS-877-2026" }
            - { id: "COM-2026-0018", caso: "#C-2026-0503", apostador: "#A-36654", status: "Arquivada", data: "28/mai/2026", canal: "SISCOAF", protocolo: null }
          sigap:
            ano: 2026
            status: "Pendente"
            prazo: "31/jan/2027"
            enviada: null
            protocolo: null
---
# PLD/AML — Manifesto do Módulo

Página de compliance/PLD-FTP do Atlas — implementa, em produto, os deveres da **Portaria SPA/MF nº 1.143/2024** sobre a Lei 9.613/1998 para operadores de apostas de quota fixa. Fiscalização e sanção em vigor desde 1º/jan/2025 (art. 36).

Personas: Analista PLD/AML (`compliance_analyst`) · Encarregado/Diretor (`compliance_admin`) · Auditoria (`auditor`, read-only) · Diretoria (`exec_viewer`, KPIs).

Gates obrigatórios: explicabilidade de todo sinal/score · sigilo art. 29 (RBAC) · trilha com autor + timestamp · SLA 30 dias (art. 26 §2) · comunicação até dia útil seguinte (art. 27 §3) · não-ocorrência anual via SIGAP (art. 30).
