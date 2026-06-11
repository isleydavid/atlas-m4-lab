# ATLAS — M7 · PLD/AML
**Spec de módulo · padrão Atlas** · Plataforma de Data Intelligence para iGaming · Lifters / TWInfo
v0.1 · Discovery → Definição · Junho/2026

> **Implementação ativa:** `src/app/(dashboard)/pld-aml/page.tsx` (Next.js App Router · `main`)

| Status | Plano | Personas | Roles (RBAC) |
| :-- | :-- | :-- | :-- |
| Planejado (H1) → em definição; bloqueado no menu (disponível H1/2026) | Enterprise | Compliance (Diretor + Analista), Risco | `org_admin`, `compliance`, `risk_analyst` |

> **Feature central:** a página é o **centro de operação de compliance anti-lavagem** — detectar, investigar e reportar operações suspeitas ao COAF com **rastreabilidade total**. Uma frase resume a leitura da página: *do sinal ao Registro de Ocorrência, com trilha auditável de 5 anos.* Base regulatória adotada (decisão de produto): **COAF Resolução 36/2021** — threshold de **R$ 2.000**, comunicação grave em **24h**. *Divergência em aberto (validar c/ jurídico): a Portaria SPA/MF 1.143/2024, específica de apostas, dispensa threshold fixo e usa 30 dias + dia útil seguinte; ver `BRIEFING.md`.*

## 1. Visão
O M7 é o módulo de compliance regulatório financeiro do Atlas (regulado pelo COAF — diferente do M6/Jogo Responsável, regulado pela SPA). Ele transforma o fluxo de apostas e transações em **red flags**, organiza-os numa **fila de trabalho (WorkList)** com SLA, e instrumenta a **comunicação ao COAF** e a trilha de auditoria. Não tem infraestrutura própria no MVP: consome o **Score Engine (M05)** (`score_pld_aml`, `score_factors[]`) e o ClickHouse/BigQuery via DataSourceRouter. Posicionamento: **investigação e compliance**, nunca marketing.

## 2. Problema
Operadores são **sujeitos obrigados** (Lei 9.613/1998) a comunicar operações suspeitas. Hoje, sem o M7: monitoram em planilhas, sem rastreabilidade de decisão, sem template de RO, abrindo várias ferramentas por apostador — e um operador fiscalizado **não consegue demonstrar que monitora e reporta** (risco criminal: omissão é crime, art. 11). A página colapsa isso em **detectar → investigar → reportar**, auditável.

## 3. Personas × página
- **Diretor de Compliance** (primária): assina as comunicações ao COAF, define política, responde à fiscalização. Lê os KPIs e aprova/escala casos.
- **Analista de Compliance / Risco** (diária): mora na WorkList, tria alertas, investiga no drawer, arquiva ou escala. `risk_analyst` não exporta RO (decisão é de compliance).
- **Anti-tipping-off:** a página **nunca** expõe ao apostador que há investigação.

## 4. Anatomia da página (a página inteira, de cima para baixo)
A página é uma **visão geral operacional que abre páginas dedicadas** — cada bloco resume e faz drill-down.

1. **Cabeçalho — 4 KPIs** (já construído): apostadores com flag ativo · alertas gerados (período) · volume sob análise (R$) · red flags por categoria. Cada tile com mini-tendência (o de categoria com barra), tooltip leve no "i", e link "abrir → página".
2. **Prazo COAF (24h)** (faixa inteira): countdown dos alertas críticos se aproximando das 24h, com **barra de urgência por caso** (tempo decorrido; crítico ao restar < 8h). A distribuição por categoria já vive no 4º KPI do cabeçalho.
3. **PEP — exposição × risco + ficha** (no lugar do antigo painel de severidade): quadrante geral dos PEP (cada ponto uma pessoa, cor por tipo de vínculo — titular/familiar 2º grau/representante/colaborador; zona de ação = alta exposição + alto risco) e, ao clicar num ponto, a **ficha individual** da pessoa (cargo/esfera, aging dos 5 anos, comportamento financeiro, vínculos, status da DD). *Tipo/cargo/aging dependem do feed do provedor; o eixo de risco roda com dado interno (M4/M5).*
4. **Fila de Alertas (WorkList) — o coração:** tabela com status (ABERTO · EM_ANÁLISE · COMUNICADO_COAF · ARQUIVADO), severidade (Médio/Alto/Crítico), score bar, badge de SLA, responsável e marca; filtros por status/severidade/tipo/marca. Críticos (score ≥ 85) sobem ao topo. Clique na linha → drawer.
5. **Drawer de Investigação** (overlay): timeline de transações, `score_factors[]` (obrigatório p/ score ≥ 70), vínculos (IP/marca). Ações: Iniciar análise → **Escalar p/ COAF** (modal de RO, justificativa obrigatória) ou **Arquivar** (justificativa mín. 50 chars). Tudo grava no audit trail.
6. **Atalhos/drill para páginas dedicadas:** Perfil do Apostador (scores 3D), **Watchlist**, **Glossário COAF** (14 termos), **Fluxos PLD** (4 árvores de decisão).

Leitura da página num relance: *"o que chegou (KPIs) → o que está perto do prazo (countdown) → o que eu trabalho agora (WorkList) → investigo e decido (drawer) → registro com prova (audit/RO)."*

## 5. Telas e rotas (6 views + 4 overlays)
Views: `dashboard` · `alertas` (WorkList) · `apostador` (perfil) · `watchlist` · `glossario` · `fluxos`. Overlays: drawer de investigação · modal COAF · modal arquivar · tooltip de KPI.

## 6. Dados (via M05 + DataSourceRouter, filtrados por RBAC)
Consome `score_pld_aml` e `score_factors[]` do **M05**; `transactions` do **ClickHouse** (0–90d) e `transactions_historical` do **BigQuery** (90+d). Tabelas novas: `flags`, `pld_alerts`, `pld_audit_log` (append-only, imutável). RO exportado vai para **S3** (retenção 5 anos). Os 4 red flags: **Estruturação, Saque Atípico, Depósito Suspeito, Comportamento Inconsistente**.

## 7. Guardrails
**LGPD:** CPF/nome/IP/e-mail mascarados em 100% das telas; **exceção** — a exportação do RO ao COAF vai sem máscara (base legal Lei 9.613, art. 11). **RBAC:** só `compliance`/`risk_analyst`/`org_admin`; `risk_analyst` não exporta RO. **Audit trail:** 100% das ações com autor + timestamp, imutável. **Explicabilidade:** `score_factors[]` é gate para score ≥ 70. **Anti-tipping-off:** nunca expor status de investigação ao apostador. **Notificação:** crítico sem ação > 20h → e-mail ao Diretor de Compliance.

## 8. Faseamento (H1 MVP)
Sprint 1 fundação de dados (3 tabelas + job dos 4 red flags em dry-run; corrigir bug 500 da aba Compliance no módulo Esportivo). Sprint 2 dashboard + WorkList + RBAC. Sprint 3 investigação (timeline, score_factors, vínculos). Sprint 4 ações + RO + audit trail. Sprint 5 notificações + carga + revisão jurídica. **Critério de entrada:** M05 em produção calculando `score_pld_aml`; critérios dos red flags validados com jurídico do operador piloto.

## 9. Riscos
P0 critérios de red flag mal calibrados → falsos positivos ou subnotificação (validar c/ piloto). P1 dependência do M05 (score em PROCESSANDO). P1 formato do RO desatualizado (verificar em coaf.fazenda.gov.br). P1 imutabilidade do audit trail (append-only no ClickHouse). P2 bug 500 visível a auditor/SPA (corrigir/ocultar já). P3 `tipping off` acidental.

---
*Documento-fonte (não lido pelo app). Base para construir a página. Complementa `BRIEFING.md` (regulatório profundo) e o discovery do guia (`PM_ONBOARDING_GUIDE.md`).*
