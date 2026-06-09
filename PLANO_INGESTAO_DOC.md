# Plano — Ingestão de Documento → Gráficos (M4 Lab)

Planejamento para entregar ao Claude Code. Depende do `PLANO_MULTIMODULO.md`
(estrutura de módulos + rotas) — implementar aquele primeiro, ou junto.

## 1. Visão

Permitir que **um documento** descreva um módulo e o app **gere os gráficos** dele
automaticamente: os que já existem e os novos, com vários tipos de visualização por
página. No fim, a pessoa **organiza** (mosaico + arrastar), **aprova** a página e
**exporta o HTML** autocontido.

> **Onde roda cada coisa**
> - **Claude Code (no VS Code)** = faz a *ingestão*: lê o doc em prosa e **gera** o manifesto `module.md`. Uma vez, na hora de criar/atualizar o módulo.
> - **App (o site)** = só **lê** o `module.md` pronto e **renderiza** os gráficos. Não chama IA em tempo real.
> Ingestão dentro do navegador (upload na própria página) = futuro (seção 13).

## 2. Decisões tomadas

- **Ingestão assistida por IA:** o usuário escreve/joga um doc em prosa (ex.: o briefing
  do módulo); o **Claude Code gera o manifesto** estruturado (YAML) seguindo o schema abaixo.
- **Organização:** manter **mosaicos** (sempre preenchem) + **⋮** em cada card (trocar tipo / ocultar).
  **Drag-and-drop descartado.**

## 3. Fluxo ponta a ponta

```
Doc em prosa  →  (Claude Code gera)  →  manifesto YAML do módulo
   →  app parseia o manifesto  →  vira os SLOTS do módulo
   →  renderiza os gráficos (novos/existentes, no design system)
   →  usuário escolhe o mosaico (e ajusta cada card pelo ⋮)
   →  aprova a página  →  exporta HTML autocontido
```

## 4. Formato do manifesto (por módulo)

Arquivo `src/modules/<id>/module.md` — **frontmatter YAML** (lido pelo app) + prosa opcional.

```markdown
---
modulo:
  id: perfil-apostador
  nome: "Perfil do Apostador"
  icone: user
dados_disponiveis: [deposito_total, saque_total, score_risco, vinculos, transacoes]
secoes:                          # ordem + títulos visíveis das seções
  - { id: resumo, titulo: "Resumo" }
  - { id: risco, titulo: "Risco" }
  - { id: financeiro, titulo: "Financeiro" }
componentes:
  - id: verdict
    titulo: "Veredito de Risco"
    subtitulo: "Score consolidado"
    secao: resumo                # a qual seção pertence (ver `secoes`)
    status: existente            # existente | novo
    tamanho: { w: 4, h: 2 }
    visivel: true
    visualizacoes:               # 1+ opções; troca pelo ⋮
      - tipo: donut
        rotulo: "Donut + tendência"
        info: "Como o usuário lê este gráfico..."
        dados: { valor: 64, max: 100, rotulo: "RISCO MÉDIO-ALTO", delta: "+19 em 7d" }
  - id: cashflow
    titulo: "Fluxo de Caixa"
    secao: financeiro
    status: novo
    tamanho: { w: 7, h: 3 }
    visivel: true
    visualizacoes:
      - tipo: barras_empilhadas
        rotulo: "Depósitos × saques"
        info: "..."
        dados:
          series: [ {chave: dep, nome: "Depósitos"}, {chave: saq, nome: "Saques"} ]
          linhas: [ {dia: "29/05", dep: 1.2, saq: 0}, {dia: "30/05", dep: 2.0, saq: 0} ]
      - tipo: linha
        rotulo: "Saldo líquido"
        info: "..."
        dados: { linhas: [ {x: "29/05", y: 1.2}, {x: "30/05", y: 3.2} ] }
---
# Perfil do Apostador
(texto livre para humanos — não é lido pelo app)
```

Mapeamento: `componente` = slot; `visualizacoes[]` = `options[]` do ⋮; `status` = selo do card;
`tamanho` = w/h no mosaico.

**Vínculo doc → página (regra):** cada manifesto pertence a **exatamente um módulo = uma página**.
O vínculo é duplo — a **pasta** (`src/modules/<id>/module.md`) e o campo **`modulo.id`** — e a
rota **`#/<id>`** renderiza essa página. Um doc **não** espalha gráficos por várias páginas; para
outra área, cria-se outro `module.md` em outra pasta com outro `id`. (Sub-páginas dentro de um
módulo = escopo futuro.)

## 5. Biblioteca de gráficos genéricos (o pulo do gato)

Hoje cada gráfico é "fixo" e importa o mock direto. Para qualquer doc gerar gráficos,
trocar por **componentes genéricos guiados por dados**: um `<ChartRenderer tipo dados config />`
que despacha para o tipo certo. Tipos mínimos e o formato de `dados` de cada um:

| tipo | dados esperados |
|---|---|
| `donut` / `kpi` | `{ valor, max, rotulo, delta? }` |
| `barras` | `{ linhas: [{x, y}] }` |
| `barras_empilhadas` | `{ series: [{chave,nome}], linhas: [{x, ...}] }` |
| `linha` / `area` | `{ linhas: [{x, y}] }` ou multi-série |
| `area_faixas` | `linhas` + `faixas: [{de, ate, cor}]` (score sobre zonas) |
| `radar` | `{ eixos: [{eixo, v, v2?}] }` |
| `dispersao` | `{ pontos: [{x, y}], limite? }` |
| `histograma` | `{ barras: [{faixa, n}], limite? }` |
| `heatmap` | `{ matriz: [[..]] }` |
| `semaforo` | `{ sinais: [{nome, nivel: g|a|r}] }` |
| `timeline` | `{ itens: [{titulo, sub, cor}] }` |
| `grafo` | `{ nos: [{id,x,y,principal?}], arestas: [[a,b]] }` |
| `tabela` | `{ colunas: [..], linhas: [[..]] }` |
| `chips` | `{ itens: [{k, v, tendencia?}] }` |
| `ficha` | `{ campos: [{k, v}], badges: [...] }` |

> Os componentes atuais em `src/charts/` já cobrem quase todos — o trabalho é **refatorá-los
> para receber `dados` por props** (em vez de importar o mock) e registrar num mapa `tipo → componente`.

## 6. Parser / loader

- Importar o `module.md` como texto (`?raw` no Vite) e parsear o frontmatter com **`js-yaml`**.
- Converter o objeto em `SLOTS` (cada componente → slot; cada visualização → option com
  `Component = ChartRenderer` ligado a `{tipo, dados}`).
- O `dados_disponiveis` é informativo (pode virar uma seção "dados da página" / ajudar a IA).

## 7. Organização da página — seções nomeadas

- A página é dividida em **seções com cabeçalho visível**, definidas em `secoes` no manifesto
  (ordem + título). Cada componente declara a que `secao` pertence.
- **Renderização:** para cada seção → um cabeçalho (no design system) + o grid de 12 colunas
  com os cards daquela seção, dimensionados pelo `tamanho` (w/h) de cada componente.
- Mosaico/⋮ continuam para ajustar a visualização; **drag-and-drop descartado** (sem arrastar).
- Componentes sem `secao` caem numa seção padrão sem título, no fim.

## 8. Aprovação da página

- Estado por módulo: `aprovada: boolean` (+ data). Botão **"Aprovar página"** no topo.
- Indicador visual (rascunho / aprovada). Exportar só habilita quando aprovada (regra simples).

## 9. Exportar HTML

- Botão **"Exportar HTML"**: gera um arquivo único autocontido da página atual.
- Implementação pragmática: montar uma string HTML com `<style>` (conteúdo do `theme.css`) +
  o HTML renderizado do `.dash` (os cards; o Recharts vira SVG, que serializa bem) e baixar
  como `.html`. Resultado parecido com os HTMLs estáticos que já entregamos.

## 10. Passo a passo de implementação

1. (Pré-requisito) Estrutura multi-módulo + rotas do `PLANO_MULTIMODULO.md`.
2. Refatorar `src/charts/*` para **componentes genéricos guiados por dados** + criar `ChartRenderer` (mapa `tipo → componente`).
3. Definir o **schema do manifesto** e criar o **loader** (`js-yaml` + `?raw`) que gera os `SLOTS` de um módulo a partir do `module.md`.
4. Migrar o Perfil do Apostador para um `module.md` (provar o conceito ponta a ponta).
5. Adicionar **aprovação** de página (estado + botão + selo).
6. Adicionar **exportar HTML**.
7. Validar com `npm run build` / `npm run dev`; commit + push (deploy automático).

## 11. Como a IA gera o manifesto (convenção)

No Claude Code, com o doc em prosa aberto, o usuário pede algo como:
> "Leia este briefing e gere `src/modules/<id>/module.md` seguindo o schema do
> `PLANO_INGESTAO_DOC.md` (seção 4). Marque cada componente como `existente` ou `novo`,
> proponha 1–2 visualizações por dado e preencha `dados` com exemplos coerentes."

Assim o doc não precisa de formato rígido — a IA o traduz para o manifesto.

## 12. Critérios de aceite

- [ ] Um `module.md` (manifesto) renderiza a página inteira do módulo.
- [ ] Componentes mostram selo `novo`/`existente` e respeitam o design system.
- [ ] Um dado pode ter mais de uma visualização (troca pelo ⋮).
- [ ] Componentes aparecem agrupados em **seções nomeadas**, na ordem de `secoes`.
- [ ] Página pode ser aprovada e exportada como HTML autocontido.
- [ ] `npm run build` passa; deploy funciona.

## 13. Fora de escopo (futuro)

- Ingestão **em runtime** pelo navegador (upload do doc na própria página) — começar com
  geração via Claude Code no editor é mais simples e confiável.
- Conexão com **API real** no lugar dos dados de exemplo.
- Edição visual do manifesto dentro do app.

## 14. Notas para o Claude Code

- Reusar UI existente (`Card`, `Kebab`, `InfoButton`, `MosaicEditor`, `Dashboard`) e `theme.css`.
- Gráficos genéricos devem usar `ResponsiveContainer` dentro de `<div className="body">`.
- Implementar **incremental** e validar com `npm run build` a cada passo.
- Novas dependências: `js-yaml`.
```
