# M7 · PLD/AML — Drawer único e adaptativo (spec)

Hoje há **vários drawers diferentes** (um layout por cenário: pass-through, fracionamento, estruturação, depósito suspeito…). Unificar em **UM único drawer (`Sheet`)** que **se adapta ao caso** — mostra só as seções com dado relevante — e **reaproveita os gráficos do Perfil do Apostador** para padronizar.

> Contexto: estamos **simulando o acompanhamento de apostadores** (dados mock por caso).

## Princípio

Um componente de drawer recebe o caso e **renderiza cada seção condicionalmente** (só aparece se houver dado). Acaba com as variações duplicadas — é o mesmo drawer pra todos os status.

## Estrutura

**Fixo (sempre):**
- **Topo:** botão **"Ver perfil completo →"** → navega para a página **Perfil do Apostador** (rota dedicada, passando o id do apostador) e fecha o drawer. *Motivo: o drawer é prévia; se a investigação exige tudo, o analista pula pro perfil inteiro.*
- **Header:** nome/ID mascarado · marca · score · severidade · SLA · ✕.
- **Resumo/motivo:** red flag + 1 linha do que foi achado.
- **Decisão + rodapé:** status + ações (Iniciar análise · → COAF · Arquivar) + nota de trilha (art. 32).

**Adaptativo (cada seção só aparece se o caso tiver o dado):**
- **Fluxo financeiro** — entradas/apostado/saídas + % não apostado (pass-through).
- **Saques recorrentes / valores semelhantes** — lista + média + variação (fracionamento).
- **Timeline de transações** — depósitos/saques.
- **Score factors (≥70)** — chips (obrigatório quando score ≥ 70).
- **Vínculos** — IP / contas / dispositivo.

## Padronização (reuso do Perfil) — regra central

**Qualquer seção que tenha equivalente no Perfil do Apostador deve reusar o MESMO componente** (drawer e perfil ficam idênticos e melhores). O que é específico de cenário e **não existe no Perfil, mantém como está aqui**.

| Seção do drawer | Componente do Perfil a reusar |
|---|---|
| Fluxo financeiro | `charts/cashflow.jsx` (Fluxo de caixa) |
| Timeline de transações | `charts/transacoes.jsx` |
| Vínculos | `charts/analise-riscos.jsx` / `charts/vinculos.jsx` (grafo de vínculos) |
| Score / score factors | `charts/score.jsx` / `score-risco.jsx` |
| Saques recorrentes (valores semelhantes) | — específico, manter |
| Pass-through (% não apostado) | — específico, manter |

> Regra geral: ao montar o drawer, **antes de criar um bloco, checar se já existe no `src/modules/perfil-apostador/charts/`** e reusar.

## Comportamento do "Ver perfil completo"

Navega para a página completa do **Perfil do Apostador** (ex.: `/perfil-apostador?id=<hash>` ou rota equivalente), levando o apostador selecionado. Sai do drawer.

## Regras

- **Só tokens do `globals.css`**; nada hard-coded (exceto `#fff` em texto sobre cor).
- **LGPD:** dados mascarados.
- Consolidar as variações de drawer existentes em **um componente adaptativo**; importar os componentes do Perfil para as seções reaproveitadas.
- Responsivo (sem corte em 1280/1512/1920).
