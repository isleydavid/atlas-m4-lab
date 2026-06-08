# Prompt p/ Claude Code — AJUSTE: trocar popover do ℹ por modal central

> Rode em `atlas-m4-lab/`. A info rica já foi implementada como popover expandido no `InfoButton`, mas **estoura a tela** (corta à direita) e fica apertada. Troque a abordagem: **clicar abre um modal central**, com preview **grande** do gráfico, igual ao layout de `../Atlas_M4_Opcoes_Visualizacao.html`.

## Problema atual

O `.imenu` expandido é um popover ancorado ao card → em cards na borda direita ele vaza do viewport e o texto fica cortado. Não dá pra crescer o suficiente pra caber as opções + previews.

## Mudança de abordagem

1. **Clicar no ℹ abre um MODAL centralizado** (reusar o padrão `.modal-overlay`/`.modal` que já existe — mesmo do editor de mosaico). Remover a versão expandida do popover. (Opcional: manter um tooltip de 1 linha no hover, mas o clique vai pro modal.)
2. O modal mostra o **conceito do componente** no formato do HTML de referência, com **as visualizações maiores e lado a lado**.

## Conteúdo do modal (espelhar o HTML)

- **Cabeçalho:** título do componente + chip de **persona** (à direita). Subtítulo/descrição abaixo.
- **Grid de opções (A/B/C…):** uma por `slot.options`. Cada card de opção tem:
  - rótulo (letra + `label`),
  - **preview grande e ao vivo do gráfico real** — renderizar `<opt.Component dados={opt.dados} />` dentro de uma caixa de ~150–170px de altura (a opção atual pode vir um pouco maior),
  - `nota` (legenda curta) embaixo,
  - **★** na opção `recomendada` e destaque (borda laranja) na opção **atual**.
- **"Como o usuário lê":** bloco com o `info` da opção atual (estilo `.interp` do HTML, com o ícone 👁).
- **Recomendado:** linha verde com ✓ e `slot.recomendacao` (estilo `.reco`).
- **Rodapé:** botão "Fechar". Fechar também por ESC e clique no overlay.

> Os dados (persona, recomendada, recomendacao, nota) já estão no `module.md` migrado — só consumir.

## Implementação sugerida

- **Novo** `src/ui/InfoModal.jsx` (recebe `slot`, `currentKey`, `onClose`). Renderiza o conteúdo acima. Reaproveita `opt.Component`/`opt.dados` pros previews.
- `src/ui/InfoButton.jsx`: o clique passa a abrir o `InfoModal` (estado local `open`), em vez de expandir o `.imenu`.
- `src/ui/Card.jsx`: já passa `slot`/`opt`; garantir que o `InfoButton` recebe o `slot` completo e o `typeKey` atual.

## CSS (`theme.css`)

Reaproveitar `.modal-overlay`, `.modal`, `.modal-head`, `.modal-body`, `.modal-foot`, `.btn-ghost` já existentes. Adicionar:

```css
.modal.wide{width:880px}
.opts{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.opts.two{grid-template-columns:repeat(2,1fr)}
@media(max-width:760px){.opts,.opts.two{grid-template-columns:1fr}}
.opt{border:1px solid var(--line);border-radius:14px;padding:13px;background:#FCFCFD;position:relative}
.opt.current{border-color:var(--orange-line);background:linear-gradient(180deg,#fff,#FFFAF7)}
.otag{font-size:12px;font-weight:800;display:flex;align-items:center;gap:7px;margin-bottom:10px}
.otag i{font-style:normal;color:var(--orange)}
.star{margin-left:auto;font-size:10px;font-weight:800;color:#fff;background:var(--orange);padding:3px 8px;border-radius:999px}
.opt .preview{height:160px}                 /* caixa do gráfico ao vivo — usa o .body interno responsivo */
.ocap{font-size:11px;color:var(--muted);margin-top:9px;min-height:28px}
.interp{margin-top:14px;display:flex;gap:12px;background:#FAFAFB;border:1px solid var(--line);border-radius:13px;padding:13px 15px}
.interp .eye{width:26px;height:26px;flex:0 0 auto;border-radius:8px;background:var(--orange);color:#fff;display:grid;place-items:center}
.interp p{margin:0;font-size:13px} .interp b{font-weight:800}
.reco{margin-top:10px;font-size:12.5px;color:var(--green);font-weight:700;display:flex;align-items:center;gap:7px}
.reco .ck{width:18px;height:18px;border-radius:50%;background:var(--green-soft);color:var(--green);display:grid;place-items:center;font-size:11px}
.persona{font-size:11px;font-weight:800;color:var(--orange);background:var(--orange-soft);padding:6px 11px;border-radius:999px}
```

> Os componentes de gráfico usam `.body` com `ResponsiveContainer` (100% w/h). Garantir que o `<opt.Component/>` no modal fique dentro de um wrapper com altura definida (`.preview`) para o gráfico ocupar a caixa.

## Critérios de aceite

- Clicar no ℹ abre um modal **centralizado** que **nunca corta**, independente da posição do card (inclusive os da borda direita).
- O modal mostra **todas** as visualizações do componente, com **preview ao vivo grande** de cada uma; ★ na recomendada e destaque na atual.
- Mostra persona, "como o usuário lê" e a linha "Recomendado".
- Fecha por botão, ESC e clique no overlay; rola se o conteúdo passar de 90vh; responsivo (3→1 coluna).
- Sem libs novas; só tokens/classes de `theme.css`; `npm run dev` sem erros novos.
