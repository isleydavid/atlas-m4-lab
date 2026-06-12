# Perfil do Apostador — organização de layout (spec)

Reorganizar a **ordem e o layout** da página `src/app/(dashboard)/perfil-apostador/page.tsx`. **Não recriar os gráficos** — só reordenar/agrupar nas linhas abaixo.

## Regra de layout (IMPORTANTE — a tentativa anterior colapsou tudo em 1 coluna)

- A página é uma sequência de **linhas**.
- Uma linha tem **1 gráfico em largura total** OU **2 gráficos LADO A LADO** (máx. 2 colunas).
- **As linhas marcadas com "/" abaixo são 2 colunas — os dois gráficos ficam na MESMA linha, dividindo a largura (50/50), NÃO empilhados.**
- Cada linha de 2 colunas = um container `display:grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap` com **os dois cards dentro**. Use `minmax(0,1fr)` (não `1fr 1fr`) para o grid **não colapsar em 1 coluna** quando o conteúdo é largo. Cards com a **mesma altura** (`align-items: stretch`).
- Só empilhar em 1 coluna **abaixo de ~1100px** (media query).

## Ordem das linhas

```
┌─────────────────────┬─────────────────────┐
│  Identidade & KYC    │  Score de Risco     │   linha 1 — 2 colunas
├─────────────────────┼─────────────────────┤
│  Class. comportam.   │  Fluxo de caixa     │   linha 2 — 2 colunas
├─────────────────────┴─────────────────────┤
│  Vínculos                                  │   linha 3 — largura total
├────────────────────────────────────────────┤
│  Transações                                │   linha 4 — largura total
├─────────────────────┬─────────────────────┤
│  Ação recomendada    │  Trilha de interv.  │   linha 5 — 2 colunas
├─────────────────────┼─────────────────────┤
│  Evolução de score   │  Comparação pares   │   linha 6 — 2 colunas
└─────────────────────┴─────────────────────┘
```

1. **2 colunas:** Identidade & KYC **/** Score de Risco
2. **2 colunas:** Classificação comportamental **/** Fluxo de caixa
3. **largura total:** Vínculos
4. **largura total:** Transações
5. **2 colunas:** Ação recomendada **/** Trilha de intervenção
6. **2 colunas:** Evolução de score **/** Comparação com pares

## Regras gerais

- **Só tokens do `globals.css`**; nada hard-coded.
- Reaproveitar os componentes/gráficos que já existem (identidade, score, comportamental, fluxo de caixa, vínculos, transações, ação recomendada, trilha de intervenção, evolução de score, comparação de pares) — **apenas reposicioná-los** nesta ordem/layout.
- Responsivo (sem corte em 1280/1512/1920).
