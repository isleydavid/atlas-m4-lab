# Barra superior (global) — handoff

Componente **global** da casca do app: aparece em **todos os módulos**, não em uma página específica. Implementar na `src/app/Layout.jsx` (topo do `.canvas`, acima do conteúdo do módulo). Usar **somente tokens do `theme.css`** (já alinhado ao Figma).

## Estrutura (esquerda → direita)

**Esquerda**
1. **Seletor de organização** (multi-tenant): quadrado com inicial (ex.: "B") + nome (`BPX Group`) + chevron. Abre dropdown para trocar de organização. Reflete o isolamento por tenant (RBAC).
2. **Status de atualização**: ponto laranja + `Atualizado às HH:MM` + ícone de recarregar (`↻`) que refaz a consulta.

**Direita**
3. **Notificações**: sino + badge (`+99`). Abre painel de notificações.
4. **Alternador de tema**: ícone sol/lua (claro/escuro).
5. **Ajuda**: ícone `?` + "Ajuda" (link).
6. **Docs**: ícone documento + "Docs" (link).
7. **Upgrade**: botão laranja preenchido (CTA de plano).

> A coluna **"Ocorrências Ao Vivo"** (feed lateral) é **opcional** — não aparece sempre. Não faz parte da barra superior; é uma sidebar condicional.

## Referência visual (HTML com tokens do theme.css)

```html
<header class="topbar" style="display:flex;align-items:center;gap:12px;background:var(--card);border-bottom:1px solid var(--border-default);padding:12px 22px;">
  <!-- org selector -->
  <button class="tb-org" style="display:flex;align-items:center;gap:9px;background:#fff;border:1px solid var(--border-default);border-radius:11px;padding:7px 12px;">
    <span style="width:22px;height:22px;border-radius:6px;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:600;">B</span>
    <span style="font-size:14px;font-weight:500;">BPX Group</span>
    <i class="chevron-down" style="color:var(--muted);"></i>
  </button>
  <!-- atualizado -->
  <div style="display:flex;align-items:center;gap:8px;border:1px solid var(--border-default);border-radius:11px;padding:7px 12px;">
    <span style="width:8px;height:8px;border-radius:50%;background:var(--orange);"></span>
    <span style="font-size:13.5px;">Atualizado às 14:21</span>
    <i class="refresh" style="color:var(--muted);"></i>
  </div>

  <span style="flex:1;"></span>

  <!-- ações -->
  <div style="display:flex;align-items:center;gap:7px;background:var(--orange-soft);border:1px solid var(--orange-line);border-radius:999px;padding:6px 11px;color:var(--orange);">
    <i class="bell"></i><span style="font-size:13px;font-weight:600;">+99</span>
  </div>
  <button aria-label="Tema" style="width:34px;height:34px;border-radius:999px;border:1px solid var(--border-default);background:#fff;color:var(--muted);"><i class="sun"></i></button>
  <button style="display:flex;align-items:center;gap:7px;border:1px solid var(--border-default);border-radius:11px;padding:7px 12px;font-size:13.5px;"><i class="help"></i>Ajuda</button>
  <button style="display:flex;align-items:center;gap:7px;border:1px solid var(--border-default);border-radius:11px;padding:7px 12px;font-size:13.5px;"><i class="doc"></i>Docs</button>
  <button style="display:flex;align-items:center;gap:7px;background:var(--orange);color:#fff;border:none;border-radius:11px;padding:8px 14px;font-size:13.5px;font-weight:600;"><i class="up"></i>Upgrade</button>
</header>
```

## Comportamento

- **Sticky** no topo do `.canvas` (rola com o conteúdo abaixo).
- Org selector e tema persistem a escolha (sem `localStorage` em componentes de chart, mas o estado de app pode usar o mecanismo de estado existente).
- Responsivo: em telas estreitas, colapsar rótulos (Ajuda/Docs viram só ícone); manter org selector + upgrade.
- Tokens: texto `var(--foreground)`, bordas `var(--border-default)`, marca `var(--orange)`, suaves `var(--muted)`. Nada hard-coded.
