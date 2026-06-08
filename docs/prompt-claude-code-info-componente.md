# Prompt p/ Claude Code — info rica ao clicar no ℹ do componente

> Rode dentro de `atlas-m4-lab/`. O objetivo é trazer pro produto a documentação que já existe em `../Atlas_M4_Opcoes_Visualizacao.html` (persona, opções A/B/C, recomendada e "como o usuário lê"), expandindo o popover do botão ℹ que já existe em cada card.

## O que já existe (não recriar)

- `src/ui/Card.jsx` renderiza `<InfoButton text={opt.info} />`. O `info` por visualização já é o "Como o usuário lê".
- `src/ui/InfoButton.jsx` abre um popover `.imenu` (em `theme.css`) com esse texto.
- `src/modules/loader.jsx` lê o frontmatter do `module.md` e mapeia cada `visualizacao` em uma `option { key, label, subtitle, status, info, dados, Component }`. As várias `visualizacoes` de um componente **são** as alternativas A/B/C.
- Falta no manifesto: **persona**, **qual opção é a recomendada** e a **nota curta de cada opção** (o `ocap` do HTML).

## Tarefa

### 1. Estender o schema do `module.md`

Adicionar campos **opcionais** (tudo retrocompatível — se ausente, comporta como hoje):

- No **componente**: `persona`, `recomendada` (o `tipo` da visualização recomendada) e `recomendacao` (frase curta do porquê).
- Em cada **visualização**: `nota` (legenda curta = `ocap` do HTML).

Exemplo:

```yaml
  - id: cashflow
    titulo: "Fluxo de Caixa"
    status: novo
    persona: "Dir. de Risco"
    recomendada: barras_empilhadas
    recomendacao: "A — leitura em <3s e expõe o padrão de risco que importa."
    tamanho: { w: 7, h: 3 }
    visualizacoes:
      - tipo: barras_empilhadas
        rotulo: "Barras dep/saque"
        subtitulo: "Por dia"
        nota: "Pico diário salta aos olhos. Laranja = depósito, claro = saque."
        info: "Depósitos × saques por dia. Barras crescentes = aceleração (chasing/risco)."
        dados: { ... }
```

### 2. `loader.jsx` — propagar os campos

- No objeto do slot, repassar `persona`, `recomendada`, `recomendacao` do componente.
- Em cada option, adicionar `nota: vis.nota ?? ''` e `recomendada: comp.recomendada === vis.tipo` (booleano).

### 3. `Card.jsx` — passar o contexto pro ℹ

Trocar `<InfoButton text={opt.info} />` por `<InfoButton slot={slot} opt={opt} />` (mantendo `opt.info` como fallback).

### 4. `InfoButton.jsx` — popover rico

Quando houver dados ricos, o popover passa a mostrar, na ordem:

1. **Persona** (chip), se houver.
2. **"Como o usuário lê"** → `opt.info` da opção atual (o que já existe).
3. **Opções deste componente**: lista de `slot.options` com `label` + `nota`; marcar a opção atual e pôr ★ na `recomendada`.
4. **Recomendado** → `slot.recomendacao`, se houver (linha verde com ✓, como no HTML).

Sem dados ricos (`persona`/`recomendada`/`recomendacao` ausentes), cair no popover simples atual com `opt.info`. Manter fechar-ao-clicar-fora, `aria` e teclado.

### 5. `theme.css` — estilos do popover expandido

Reaproveitar os tokens e o visual do `.imenu` (fundo escuro `#23262F`). Alargar para ~280px e adicionar: chip de persona (use `--orange-soft`/`--orange` adaptado pro fundo escuro), lista de opções (item atual destacado, ★ na recomendada com `--orange-2`), e a linha "Recomendado" em `--green`. Espelhar o layout do bloco `.interp`/`.reco` do HTML de referência.

### 6. Migrar o conteúdo do HTML

Ler `../Atlas_M4_Opcoes_Visualizacao.html` e, para **cada "concept"**, mapear ao slot correspondente no `src/modules/perfil-apostador/module.md`, preenchendo `persona`, `recomendada`, `recomendacao` e o `nota` de cada opção. Mapa inicial (confirme lendo o HTML, há mais conceitos depois da linha 200):

| Concept (HTML) | slot | recomendada | persona |
|---|---|---|---|
| 01 Fluxo de Caixa | `cashflow` | `barras_empilhadas` | Dir. de Risco |
| 02 Evolução do Score | `score-trend` | `area_faixas` | Dir. de Risco |
| 03 XAI — Fatores | `xai` | `waterfall` | Risco + Compliance |
| 04 Vínculos | `vinculos` | `grafo` | Dir. de Risco |
| … (demais conceitos) | mapear pelo título | conforme ★ do HTML | conforme HTML |

Onde um conceito do HTML não tiver slot equivalente, listar no final do PR (não inventar slot).

## Critérios de aceite

- Clicar no ℹ de um componente com doc rica mostra: persona, "como lê", as opções (★ na recomendada, atual destacada) e a linha "Recomendado".
- Componente sem os campos novos continua exibindo o popover simples (zero regressão).
- Trocar a visualização pelo ⋮ atualiza o "como lê" e o destaque da opção atual no popover.
- `perfil-apostador` preenchido a partir do HTML; YAML válido; `npm run dev` sem erros novos.
- Sem libs novas; só tokens/classes de `theme.css`; popover acessível (foco, ESC, clique-fora).
