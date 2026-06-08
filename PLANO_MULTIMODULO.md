# Plano — Evolução do M4 Lab para Dashboard Multi-módulo

Documento de planejamento para entregar ao Claude Code. Descreve **o quê** construir e
**em que ordem**, mantendo o design system e os padrões atuais.

## 1. Visão

Hoje o projeto é um laboratório de **uma** página (Perfil do Apostador) com componentes +
mosaicos. A meta é transformá-lo num **dashboard multi-módulo**: várias áreas (módulos),
cada uma sendo uma página própria, navegáveis pela sidebar. Ao entrar num módulo, a sidebar
lista os **mosaicos** (divisões de página) e os **componentes** daquele módulo.

## 2. Decisões já tomadas

- **Módulo = uma página.** (sem sub-páginas por enquanto)
- **Componentes próprios de cada módulo.** Cada módulo define seus gráficos/slots.
- **Roteamento por URL** com hash routing (ex.: `#/perfil-apostador`) — linkável e sobrevive ao refresh no GitHub Pages.
- **Mosaicos compartilhados** (as divisões de página são as mesmas para todos os módulos; os customizados ficam globais). Só os componentes mudam por módulo.

## 3. Conceito de dados

- **Módulo:** `{ id, nome, icone, status: 'ready' | 'soon', slots[] }`.
- **Slot:** igual ao atual — `{ id, title, w, h, visible, options[] }`, e cada `option` tem `{ key, label, subtitle, status, Component, info }`.
- **Mosaico:** igual ao atual (`src/mosaics.js`), global + customizados globais.

## 4. Estrutura de pastas alvo

```
src/
  app/
    Layout.jsx          # sidebar + área roteada (Outlet)
    router.jsx          # HashRouter + rotas
    useModuleState.js   # estado persistido POR módulo (mosaico + slots)
  modules/
    registry.js         # lista de módulos (id, nome, ícone, status, slots)
    perfil-apostador/
      slots.jsx         # (migrar o src/slots.jsx atual pra cá)
      charts/           # (migrar src/charts/ relativos a este módulo)
      data/mock.js      # (migrar src/data/mock.js)
    financeiro/         # exemplo de módulo "soon" (placeholder)
    risco-fraude/       # exemplo de módulo "soon" (placeholder)
  ui/                   # Card, Kebab, InfoButton, MosaicEditor, MiniPreview, Dashboard (reuso)
  mosaics.js            # mosaicos globais (mantém)
  theme.css             # design system (mantém)
  main.jsx
  App.jsx               # monta o router
```

## 5. Roteamento

- Usar **react-router-dom v6** com **`HashRouter`** (compatível com GitHub Pages, sem config de servidor).
- Rotas:
  - `/` → redireciona para o primeiro módulo `ready`.
  - `/:moduleId` → renderiza a página do módulo (ou placeholder se `status: 'soon'` ou id inexistente).
- A sidebar usa `<NavLink>` para cada módulo (destaca o ativo).

## 6. Sidebar (novo layout)

Três seções, de cima para baixo:
1. **Módulos** — lista navegável (todos os módulos; os `soon` aparecem esmaecidos com selo "em breve").
2. **Mosaico da página** — seletor atual (3 prontos + "Criar mosaico") — **só aparece em módulo `ready`**.
3. **Componentes** — lista de ativos/inativos **do módulo ativo** (igual hoje, mas escopado ao módulo).

## 7. Estado e persistência

- Hook **`useModuleState(moduleId)`**: carrega/salva no `localStorage` a chave `atlas-m4-lab/<moduleId>` com `{ mosaic, slots: { [slotId]: { type, visible } } }`.
- Cada módulo lembra seu próprio layout (mosaico + componentes ligados + tipos), de forma independente.
- Mosaicos customizados continuam globais na chave `atlas-m4-lab/mosaics`.
- `Layout` segura o estado do módulo ativo e passa para a Sidebar e para o Dashboard (ambos precisam do mesmo estado).

## 8. Passo a passo de implementação (ordem sugerida)

1. **Instalar** `react-router-dom`. Montar `HashRouter` + rotas em `src/app/router.jsx` e usar no `App.jsx`.
2. **Migrar** o módulo atual: mover `src/slots.jsx` → `src/modules/perfil-apostador/slots.jsx`, `src/charts/*` → `src/modules/perfil-apostador/charts/*`, `src/data/mock.js` → `src/modules/perfil-apostador/data/mock.js`. Ajustar imports.
3. **Criar** `src/modules/registry.js` com a lista de módulos: `perfil-apostador` (ready) + 1–2 placeholders (`financeiro`, `risco-fraude`) com `status: 'soon'`.
4. **Criar** `src/app/Layout.jsx`: sidebar (módulos + mosaico + componentes do módulo ativo) + `<Outlet/>`.
5. **Criar** `src/app/useModuleState.js` (persistência por módulo).
6. **Página de módulo:** componente que lê `moduleId` da rota, pega os `slots` do módulo no registry e renderiza o `Dashboard` atual com o estado do módulo + mosaico selecionado.
7. **Placeholder** para módulos `soon` ("Em breve").
8. **Verificar:** `npm run build` e `npm run dev` — trocar de módulo muda a URL e a página; cada módulo mantém seu layout; refresh na URL do módulo funciona; o Perfil do Apostador segue idêntico ao de hoje, agora em `/perfil-apostador`.
9. **Publicar:** `git add . && git commit -m "dashboard multi-módulo" && git push` (deploy automático).

## 9. Critérios de aceite

- [ ] Sidebar lista os módulos; clicar troca a URL (`#/financeiro`) e a página.
- [ ] Cada módulo mostra **seus** componentes + os mosaicos; toggles/tipos/mosaico persistem por módulo, de forma independente.
- [ ] Recarregar a página de um módulo mantém você nele (HashRouter).
- [ ] O módulo Perfil do Apostador funciona exatamente como antes.
- [ ] Módulos `soon` mostram placeholder, sem quebrar a navegação.
- [ ] `npm run build` passa; deploy no Pages funciona.

## 10. Fora de escopo (futuro)

- **Ingestão de documento** para gerar componentes automaticamente (a ideia do "doc de entrada"). É um recurso bem maior — tratar como fase separada.
- Conexão com **API real** no lugar dos mocks.
- Sub-páginas dentro de um módulo, busca/filtro na lista de componentes, export/import de layouts.

## 11. Notas para o Claude Code

- **Reusar** os componentes de UI existentes: `Card`, `Kebab`, `InfoButton`, `MosaicEditor`, `MiniPreview`, `Dashboard`. Não recriar.
- **Manter** o design system de `theme.css` (tokens laranja, cards, etc.).
- Gráficos novos devem usar `ResponsiveContainer` (Recharts) dentro de `<div className="body">` que ocupa 100% da altura — para se adaptarem à célula do mosaico.
- Validar sempre com `npm run build` antes de commitar.
- O workflow de deploy (`.github/workflows/deploy.yml`) já existe — não precisa recriar.
- Fazer a migração de forma **incremental** (passo a passo acima), garantindo que o Perfil do Apostador continue funcionando a cada etapa.
```
