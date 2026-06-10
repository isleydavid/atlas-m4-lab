# M7 · PLD / AML — Pesquisa de requisitos (Brasil)

Base regulatória para projetar o módulo. Fonte principal: **Portaria SPA/MF nº 1.143/2024**
(PLD/FTP para apostas de quota fixa) + **IN MF/SPA nº 4/2024**. Lei de Lavagem: 9.613/1998.

## O que a regulação exige (e vira função no módulo)

1. **Avaliação interna de risco (anual).** Matriz de risco documentada; classificação de risco do operador/clientes.
2. **Identificação e classificação de risco do cliente (KYC).** Due diligence; status **PEP** (pessoa exposta politicamente) e beneficiário final; due diligence reforçada para alto risco/PEP.
3. **Monitoramento, seleção e análise de operações** (de aposta e financeiras) para detectar suspeição.
4. **Comunicação ao COAF via SISCOAF** de operações suspeitas. ⚠️ Para apostas **NÃO há valor mínimo para comunicação automática** — é **baseada em risco/suspeição**, não em threshold fixo. (Corrige a suposição de "R$2.000" do rascunho do M9.)
5. **Comunicação de NÃO-OCORRÊNCIA** anual à SPA, quando nada a reportar no ano.
6. **Monitoramento das instituições de pagamento/financeiras** parceiras.
7. **Guarda de registros por ≥ 5 anos** + trilha auditável.
8. Fiscalização/sanção da SPA valendo desde 1º/jan/2025.

## Componentes que a página M7 precisa ter

**Topo — KPIs de compliance**
- Alertas PLD abertos · Casos em análise · Comunicações ao COAF (enviadas/pendentes) · Comunicação de não-ocorrência (status do ano) · % de clientes classificados por risco · valor/volume sob monitoramento.

**Avaliação de risco**
- Distribuição de clientes por nível de risco (baixo/médio/alto) — matriz/heat.
- Score PLD/AML (dimensão 3 do Score Engine, do M4).

**Monitoramento de operações / sinais de risco** (o coração)
- Estruturação/smurfing (histograma de valores vs. faixa) · descasamento depósito↔saque · velocidade/aceleração · uso de terceiros/contas vinculadas (grafo) · padrões atípicos. Reaproveita PldHistogram, PldScatter, grafo de vínculos.
- Ranking/lista de apostadores ou operações sinalizadas, com motivadores (Explainable AI).

**KYC / PEP / Listas**
- Status de verificação (KYC), flag **PEP**, beneficiário final, listas restritivas/sanções.

**Casos / fila de análise (workflow)**
- Estados: aberto → em análise → comunicado ao COAF → arquivado. SLA, responsável, histórico.

**Comunicações ao COAF (SISCOAF)**
- Lista de comunicações (suspeita + não-ocorrência), status, timestamp, autor, **export auditável**.

**Trilha de auditoria**
- Tudo logado (alerta, análise, decisão, comunicação) com autor + timestamp; retenção 5 anos.

## Observações de produto
- Posicionamento: **compliance/investigação**, não marketing (coerente com a estratégia Atlas).
- Reaproveita muito do que já existe: score PLD, grafo de vínculos, histograma PLD, alertas, trilha auditável (M4) e o filtro NL do M9 para isolar coortes PLD.
- Explicabilidade é **gate** (cada sinal/caso com `score_factors`).

## Fontes
- Portaria SPA/MF nº 1.143/2024 (PLD/FTP apostas): lefosse.com, netrin.com.br, caf.io, demarest.com.br, mattosfilho.com.br, gov.br/fazenda
- IN MF/SPA nº 4/2024: legisweb.com.br
- Lei 9.613/1998 (lavagem de dinheiro)
