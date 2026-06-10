# M9 · AI Assistant — Handoff para o Claude Code

Pacote nesta pasta: **SPEC.md** (o quê/regras), **mockup.html** (alvo visual), este **PROMPT.md** (passos).

## Contexto
- Novo módulo `ai-assistant` = uma **página própria** (rota `#/ai-assistant`), seguindo `PLANO_MULTIMODULO.md`.
- Diferente dos outros módulos (vários cards): o M9 é **um único componente full-page** interativo.
- Respeita o mosaico como **1 bloco full-width** e **só aparece na página dele**.
- Não é gráfico gerado de manifesto — é **feature construída** (React + estado). Use dados mock.
- Design system: fonte **Saira**, laranja **#f26122**, tokens do `DESIGN_SYSTEM.md`. Replique o visual do `mockup.html`.

## Passos (incremental — pare para revisão após cada um)

1. **Registrar o módulo** no registry: `{ id:'ai-assistant', nome:'AI Assistant', status:'ready' }`, com rota `#/ai-assistant`, aparecendo na sidebar de módulos.

2. **Criar a página** `src/modules/ai-assistant/` com o componente full-page `AiAssistant.jsx` reproduzindo o `mockup.html`:
   - **Campo NL** (input grande, ícone IA, atalhos como chips, botão "Gerar consulta").
   - **Atlas Query** estruturada **visível e editável** (condições como chips com remover/editar + "Adicionar condição"), a query "crua" abaixo, indicador de **confiança**, botão "Rodar consulta".
   - **Resultado** com toggle **Coorte (por pessoa) / Agregado**, contagem + "RBAC aplicado", e ações (Salvar segmento, Encaminhar p/ caso, Agendar, **Exportar c/ timestamp**).
   - **Coorte explicável**: linhas mascaradas (nome/CPF) + score + **"Por quê"** com `score_factors` em chips. Rodapé LGPD/auditoria + bandeira "Utiliza IA. Verifique os resultados.".

3. **Guardrails (mesmo que mock):** RBAC por dado, mascaramento LGPD, modo rascunho quando confiança baixa, trilha de auditoria. Deixar pontos de integração marcados com TODO.

4. **Validar:** `npm run build`; testar a rota `#/ai-assistant` e a responsividade (preencher a tela / TV, conforme `DESIGN_SYSTEM.md`).

## Escopo desta entrega
Apenas **Fase 1 (filtro NL)** com dados mock e UI fiel ao mockup. Fases 2–4 (handoffs, chat, síntese, relatório) ficam para depois.
