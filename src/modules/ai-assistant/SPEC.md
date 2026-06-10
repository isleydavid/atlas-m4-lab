# ATLAS — M9 · AI Assistant
**Spec de módulo · padrão Atlas** · Plataforma de Data Intelligence para iGaming · Lifters / TWInfo
v0.1 · Discovery → Definição · Junho/2026

| Status | Plano | Personas | Roles (RBAC) |
| :-- | :-- | :-- | :-- |
| Planejado (H2) → entrando em definição | Enterprise | Transversal (todas as 8 personas) | herda o role do usuário |

> **Feature central:** filtro inteligente em linguagem natural — o usuário descreve o que quer em texto comum, a IA gera uma **consulta estruturada visível e editável**, e devolve uma **coorte (por pessoa) ou um resultado agregado**, sempre explicável e dentro do RBAC + LGPD. Inspiração de UX: filtro NL → JQL do Jira; aplicação no eixo **risco/compliance** do Atlas.

## 1. Visão
M9 é o assistente de IA standalone do Atlas: LLM + RAG sobre os dados já ingeridos (M1–M8). A IA hoje existe embarcada no M4; o M9 a torna transversal, acessível por todas as personas, sob o mesmo RBAC. A peça-identidade é o **filtro em linguagem natural**: o usuário escreve a pergunta e o Atlas devolve a coorte pronta, com a consulta estruturada à mostra e o porquê de cada apostador estar na lista.

**Não-objetivo:** o M9 não é segmentação de marketing/retenção para CRM (Optimove/Smartico/Fast Track). O valor do filtro NL aqui é **investigação, risco e compliance**. Handoffs alimentam casos/compliance, não campanhas.

## 2. Problema
8 personas diretivas, vocabulários e urgências diferentes — o desafio é cognitivo. Hoje, para isolar um grupo, o usuário precisa saber em qual módulo o dado mora, filtrar tela a tela, cruzar de cabeça e ainda fica sem trilha. O M9 colapsa isso em **uma frase → uma coorte explicável**, auditável.

## 3. Personas × filtro
- **Guardião** (Compliance, PLD, Risco, COO): "Quem cruzou o threshold COAF de R$2.000 esta semana e ainda não tem caso?" → coorte por pessoa, motivadores, exportável com timestamp.
- **Estrategista** (CEO, CFO, CTO): "GGR por marca este mês vs. anterior, só cassino" → agregado/tabela, variação M/M.
- **Motor de Crescimento** (Mkt, CRM, Operações): "Queda de atividade 30d mas LTV alto" → coorte para suporte com contexto (não campanha).

O mecanismo é o mesmo; muda o **escopo liberado pelo RBAC** e o tipo de saída (pessoa vs. agregado).

## 4. Feature central — filtro NL
**Fluxo:** (1) entrada NL (PT/EN/ES, com atalhos) → (2) tradução para **Atlas Query estruturada, sempre visível e editável** → (3) execução via DataSourceRouter (ClickHouse 0–90d / BigQuery 90+d) → (4) resultado em **coorte (por pessoa, mascarada + hash LGPD)** ou **agregado** → (5) **explicabilidade obrigatória** (`score_factors {factor_id, factor_label, weight, value}`; bandeira "Utiliza IA. Verifique os resultados.") → (6) ações: salvar segmento, encaminhar p/ caso (M5/M6/M7), agendar relatório, exportar com timestamp.

**Diferencial:** linguagem natural **sobre um modelo de risco auditável e explicável** (não "também temos NL"). Cada consulta é transparente/editável, cada coorte diz o porquê, tudo logável.

**Guardrails:** RBAC por dado (não só por tela); LGPD (mascarado + hash; export deliberado e auditado); trilha de auditoria (query, edição, export com autor+timestamp); honestidade da IA (modo rascunho quando baixa confiança).

## 5. Demais capacidades (módulo completo)
Chat conversacional (LLM+RAG); síntese cross-módulo; narração de anomalias (z-score 30d); atalhos por persona; geração de relatório executivo em NL. Todos sob os mesmos guardrails.

## 6. Dados acessíveis (via RAG + DataSourceRouter, filtrados por RBAC)
M1 financeiro · M2 esportivas · M3 casino · M4 perfil+score · M5/M6/M7 risco/RG/PLD · M8 web analytics. Regras: GGR exclui freebets/ROLLBACK; Hold% = GGR/Stake×100; dados de usuário mascarados + hash.

## 7. Métricas
Adoção transversal; taxa de sucesso da query (roda sem edição); taxa de edição; tempo até coorte; ações pós-resultado; **cobertura de explicabilidade 100% (gate)**.

## 8. Faseamento
- **Fase 1 — Filtro NL (núcleo):** entrada NL → query visível/editável → coorte/agregado explicável (RBAC+LGPD+auditoria), salvar segmento, exportar com timestamp.
- **Fase 2 — Ações/handoffs:** encaminhar p/ caso (M5/M6/M7) + agendar relatório (agendador M1).
- **Fase 3 — Chat + síntese cross-módulo + narração de anomalias.**
- **Fase 4 — Relatório executivo em NL + atalhos por persona.**
Dependências: Score Engine estável (score do M4 em PROCESSANDO — P1) e RBAC granular por dado.

## 9. Riscos
P0 alucinação de query (mitigação: query visível/editável + modo rascunho) · P1 dependência do Score Engine · P1 RBAC por dado · P2 escopo de export (não virar pipeline de marketing) · P3 latência em janelas longas (sinalizar custo/tempo).

---
*Documento-fonte (não lido pelo app). Serve de base para construir a feature.*
