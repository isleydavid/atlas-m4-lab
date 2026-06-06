# Atlas M4 Lab — Laboratório de Componentes

Projeto React + Vite para **compor e testar visualizações do Perfil do Apostador (M4)**.
Você escolhe a divisão da página (mosaico), liga/desliga componentes, troca o tipo de
gráfico de cada um e vê a explicação de leitura — tudo no design system do Atlas.

> Dados são **ilustrativos** (`src/data/mock.js`). Trocar pela API real depois.

---

## Rodar localmente

Precisa de Node.js 18+.

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera dist/ (deploy)
```

---

## O que dá para fazer na tela

- **Mosaico da página** (sidebar, topo): 3 divisões prontas — *Grade uniforme*,
  *Duas colunas*, *Destaque* — com miniatura. **+ Criar mosaico** abre um editor para
  montar o seu (blocos largura×altura, com preview ao vivo). Os seus podem ser excluídos (✕).
- **Componentes** (sidebar): liga/desliga cada bloco; ativos mostram o tipo atual.
- **⋮ em cada card:** troca o tipo de gráfico compatível ou oculta o componente.
- **ℹ em cada card:** mostra "como o usuário lê" aquele gráfico (a proposta).
- Tudo é **salvo no navegador** (localStorage). Botão **resetar** no topo.

> ⚠️ As personalizações (mosaicos criados, o que está ligado) ficam **no navegador**,
> não no código. Trocar de máquina/navegador ou limpar o cache reinicia. O **código**
> (componentes, mosaicos prontos) está sempre salvo nos arquivos.

---

## Estrutura

```
src/
  charts/        componentes de gráfico (Recharts + custom)
  ui/            Card, Kebab, InfoButton, ControlPanel, MiniPreview,
                 MosaicEditor, Dashboard
  data/mock.js   dados ILUSTRATIVOS (trocar por API)
  slots.jsx      ← TEMPLATE de slots + opções de gráfico + textos "como lê"
  mosaics.js     mosaicos prontos (divisões da página)
  App.jsx        estado + persistência
  theme.css      tokens do design system Atlas
```

---

## Como adicionar um COMPONENTE novo

1. **Crie o gráfico** em `src/charts/` (ou adicione a um arquivo existente).
   Ele deve renderizar dentro de `<div className="body">` ocupando 100% da altura.
   Para gráficos, use `ResponsiveContainer` do Recharts (assim ele se adapta à célula):

   ```jsx
   import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
   export function MeuGrafico() {
     return (
       <div className="body">
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={[/* ... */]}><XAxis dataKey="x" /><YAxis /><Bar dataKey="y" /></BarChart>
         </ResponsiveContainer>
       </div>
     )
   }
   ```

2. **Registre em `src/slots.jsx`.** Importe o componente e:
   - para um **tipo novo** de um slot existente → adicione um item em `options`:
     ```jsx
     { key: 'meu', label: 'Meu gráfico', subtitle: '...', status: 'new',
       Component: MeuGrafico, info: 'Como o usuário lê este gráfico...' }
     ```
   - para um **slot novo** → adicione um objeto em `SLOTS`:
     ```jsx
     { id: 'meu-slot', title: 'Meu Slot', w: 5, h: 3, visible: true,
       options: [{ key: 'meu', label: '...', subtitle: '...', status: 'new',
                   Component: MeuGrafico, info: '...' }] }
     ```
   Se criar um slot novo, inclua o `id` no grupo certo dentro de `GROUPS`
   em `src/ui/ControlPanel.jsx` (para ele aparecer agrupado na sidebar).

3. Pronto — ele aparece na sidebar, no ⋮ e com o ℹ. `w`=colunas (1–12), `h`=linhas.

## Como adicionar um MOSAICO pronto

Edite `src/mosaics.js` e some um objeto em `MOSAICS` (ou crie pelo editor na tela).

---

## Publicar no GitHub Pages

Ver **DEPLOY.md** (passo a passo). Resumo: criar repo → `git init/add/commit/push`
→ Settings → Pages → Source = GitHub Actions. O deploy é automático a cada push.
