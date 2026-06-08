# Prompt p/ Claude Code — ajustes na sidebar "Ocorrências Ao Vivo"

> A `FeedSidebar` já existe. Aplique só os 3 ajustes abaixo. Não recrie o componente nem o CSS base.

1. **Só no Perfil de Apostador.** Em `src/app/Layout.jsx`, renderize a `<FeedSidebar/>` apenas quando `moduleId === 'perfil-apostador'` (inclusive no ramo com a `.panel` recolhida). Nos outros módulos ela não aparece e o canvas ocupa tudo.

2. **Animação de chegada.** Nova ocorrência entra no topo com `feedIn` (slide+fade ~300ms) + `feedFlash`; marque o item recém-inserido com `.is-new`. Se as keyframes ainda não existirem, adicione em `theme.css` e respeite `prefers-reduced-motion`.

3. **Recolher + reflow.** Botão alterna `~288px ↔ ~48px` (padrão `.panel.collapsed`/`.collapse-btn` já existente). Como `.app` é flex e `.canvas` é `flex:1`, confirme que a página se reajusta sem scroll horizontal. Persista o estado em `localStorage`.

**Aceite:** `/perfil-apostador` mostra a coluna; `/financiero` não. Chegada animada visível. Recolher expande o canvas e o estado sobrevive a reload. Sem libs novas, só tokens do `theme.css`.
