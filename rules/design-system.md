# RULE — Atlas Design System

## Fonte de verdade

Este arquivo consolida o design system oficial do projeto Atlas a partir destes nodes do Figma:

- Tipografia: `3:281`
- Fontes: `3:502`
- Cores: `3:159`

Se houver conflito entre implementacao local e este arquivo, o Figma e este arquivo vencem.

## Uso obrigatorio

- Toda tela, pagina, componente e estado visual deve usar este design system.
- O projeto continua usando `shadcn/ui` como base de componentes, mas a aparencia deve seguir os tokens Atlas abaixo.
- Nao introduzir novas familias tipograficas, escalas de texto ou paletas ad hoc sem atualizar este arquivo primeiro.
- `Exo 2` e a familia exclusiva para display e headings.
- `Saira` e a familia exclusiva para body, label, button, caption e KPI.
- Sempre preferir nomes semanticos de token em vez de valores soltos no codigo.

## Notas de interpretacao

- Inferencia: o Figma mostra dois laranjas muito proximos. Use `#F26122` como cor primaria principal de UI. Use `#F95F19` apenas como cor de acento/highlight quando a tela pedir esse tratamento explicitamente.
- Inferencia: no swatch `Alert / Error`, o texto `rgb/hsl` retornado pelo MCP nao bate com o hex do proprio swatch. O hex `#E54848` deve ser tratado como fonte de verdade.

## Familias tipograficas

| Papel | Familia | Pesos permitidos | Uso |
|---|---|---:|---|
| Display / Heading | `Exo 2` | `600`, `700` | Titulos, hero, headings e destaques editoriais |
| Body / UI | `Saira` | `400`, `500`, `600`, `700` | Texto corrido, labels, botoes, captions, KPI e UI geral |

### Importacao recomendada no projeto

```ts
import { Exo_2, Saira } from "next/font/google";
```

Pesos recomendados:

- `Exo_2`: `600`, `700`
- `Saira`: `400`, `500`, `600`, `700`

## Escala tipografica

### Display e headings

| Token | Familia | Peso | Tamanho | Line height | Letter spacing |
|---|---|---:|---:|---:|---:|
| `display-2xl` | `Exo 2` | `700` | `64px` | `72px` | `-2` |
| `display-xl` | `Exo 2` | `700` | `48px` | `56px` | `-2` |
| `display-lg` | `Exo 2` | `700` | `40px` | `48px` | `-1` |
| `heading-h1` | `Exo 2` | `700` | `32px` | `40px` | `-1` |
| `heading-h2` | `Exo 2` | `600` | `24px` | `32px` | `-0.5` |
| `heading-h3` | `Exo 2` | `600` | `20px` | `28px` | `0` |
| `heading-h4` | `Exo 2` | `600` | `16px` | `24px` | `0` |

### Body e UI

| Token | Familia | Peso | Tamanho | Line height | Letter spacing |
|---|---|---:|---:|---:|---:|
| `body-lg` | `Saira` | `400` | `18px` | `28px` | `0` |
| `body-md` | `Saira` | `400` | `16px` | `24px` | `0` |
| `body-sm` | `Saira` | `400` | `14px` | `20px` | `0` |
| `body-xs` | `Saira` | `400` | `12px` | `16px` | `0` |
| `label-lg` | `Saira` | `500` | `16px` | `24px` | `0` |
| `label-md` | `Saira` | `500` | `14px` | `20px` | `0.25` |
| `label-sm` | `Saira` | `500` | `12px` | `16px` | `0.25` |
| `button-lg` | `Saira` | `500` | `16px` | `24px` | `0` |
| `button-md` | `Saira` | `500` | `14px` | `20px` | `0.25` |
| `button-sm` | `Saira` | `500` | `12px` | `16px` | `0.25` |
| `caption-md` | `Saira` | `400` | `12px` | `16px` | `0.25` |
| `caption-sm` | `Saira` | `400` | `11px` | `16px` | `0.25` |
| `kpi-xl` | `Saira` | `700` | `40px` | `48px` | `-1.5` |
| `kpi-lg` | `Saira` | `700` | `32px` | `40px` | `-1` |
| `kpi-md` | `Saira` | `600` | `24px` | `32px` | `-0.5` |

## Cores

### Brand e neutras

| Token | Papel | Hex | RGB | HSL |
|---|---|---|---|---|
| `brand-primary` | Cor primaria principal da interface | `#F26122` | `rgb(242, 97, 34)` | `hsl(18, 89, 54)` |
| `brand-accent` | Acento editorial / destaque de display | `#F95F19` | `rgb(249, 95, 25)` | `hsl(19, 95, 54)` |
| `neutral-white` | Branco puro | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0, 100)` |
| `neutral-graffitte` | Preto profundo / base escura | `#1A1A1A` | `rgb(26, 26, 26)` | `hsl(0, 0, 10)` |
| `neutral-text-secondary` | Texto secundario | `#4B4B4B` | `rgb(75, 75, 75)` | `hsl(0, 0, 29)` |
| `neutral-border-divider` | Bordas e divisores | `#E5E5E5` | `rgb(229, 229, 229)` | `hsl(0, 0, 90)` |
| `neutral-background-soft` | Fundo suave | `#FFFFE9` | `rgb(255, 255, 233)` | `hsl(60, 100, 96)` |
| `neutral-card` | Fundo de card neutro | `#F7F7F7` | `rgb(247, 247, 247)` | `hsl(0, 0, 97)` |

### Feedback / status

| Token | Papel | Hex | RGB | HSL |
|---|---|---|---|---|
| `status-success` | Sucesso / confirmacao | `#3BA776` | `rgb(59, 167, 118)` | `hsl(153, 48, 43)` |
| `status-error` | Erro / alerta critico | `#E54848` | `rgb(229, 72, 72)` | `hsl(0, 75, 59)` |
| `status-info` | Info / estado informativo | `#A0A0A0` | `rgb(160, 160, 160)` | `hsl(0, 0, 63)` |

## Mapeamento recomendado para CSS custom properties

```css
:root {
  --atlas-font-display: "Exo 2", sans-serif;
  --atlas-font-body: "Saira", sans-serif;

  --atlas-color-brand-primary: #f26122;
  --atlas-color-brand-accent: #f95f19;
  --atlas-color-neutral-white: #ffffff;
  --atlas-color-neutral-graffitte: #1a1a1a;
  --atlas-color-neutral-text-secondary: #4b4b4b;
  --atlas-color-neutral-border-divider: #e5e5e5;
  --atlas-color-neutral-background-soft: #ffffe9;
  --atlas-color-neutral-card: #f7f7f7;
  --atlas-color-status-success: #3ba776;
  --atlas-color-status-error: #e54848;
  --atlas-color-status-info: #a0a0a0;
}
```

## Regras praticas de implementacao

- Nunca usar outra familia tipografica para UI de produto sem autorizacao explicita do usuario.
- Nunca usar roxo padrao, azul aleatorio ou cinzas arbitrarios fora dos tokens acima.
- Em componentes `shadcn/ui`, sobrescrever variantes e tokens para refletir o Atlas Design System.
- Textos de apoio e secundarios devem preferir `neutral-text-secondary`.
- Bordas, grids e divisores devem preferir `neutral-border-divider`.
- Cards claros devem preferir `neutral-card`; fundos suaves editoriais podem usar `neutral-background-soft`.
- Botoes e CTAs devem partir de `brand-primary`.
- Estados de erro, sucesso e informacao devem usar os tokens de feedback desta regra.

## Decisao em caso de duvida

1. Figma + este arquivo vencem.
2. Depois, aplicar os componentes e padroes do `shadcn/ui`.
3. Se ainda faltar algum token, atualizar este arquivo antes de inventar um novo.
