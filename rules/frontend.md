# RULE — Frontend React com Next.js, TypeScript e shadcn/ui

## Stack obrigatória
Este projeto frontend deve seguir obrigatoriamente estas definições:

- **Framework:** Next.js
- **Linguagem:** TypeScript
- **Biblioteca de UI:** shadcn/ui
- **Base do projeto:** React
- **Estilização:** utilizar o padrão compatível com shadcn/ui
- **Componentização:** sempre priorizar componentes reutilizáveis

---

## Diretrizes principais

### 1. UI padronizada com shadcn/ui
Toda a interface do projeto deve ser construída utilizando **shadcn/ui** como biblioteca principal de componentes.

Além disso, toda a camada visual deve seguir obrigatoriamente `rules/design-system.md`.

#### Regras:
- Sempre priorizar componentes do **shadcn/ui** antes de criar componentes customizados.
- Botões, inputs, dialogs, dropdowns, tables, cards, sheets, popovers, tabs, badges e demais elementos visuais devem seguir o padrão do **shadcn/ui**.
- Evitar uso de bibliotecas de UI paralelas como:
  - Material UI
  - Ant Design
  - Chakra UI
  - PrimeReact
  - Bootstrap React
- Só criar componente próprio quando não existir solução adequada no shadcn/ui.
- Quando criar componente customizado, ele deve manter a mesma linguagem visual do shadcn/ui.

---

### 2. TypeScript obrigatório
Todo o código deve ser escrito em **TypeScript**.

#### Regras:
- Nunca usar JavaScript puro.
- Sempre tipar:
  - props de componentes
  - retornos de funções
  - estados complexos
  - respostas de API
  - hooks customizados
- Evitar `any`.
- Quando necessário, preferir:
  - `type`
  - `interface`
  - generics
  - union types
  - utility types
- Modelos de dados devem ficar organizados e reutilizáveis.

---

### 3. Next.js como padrão do projeto
Toda a estrutura da aplicação deve seguir boas práticas de **Next.js**.

#### Regras:
- Utilizar organização compatível com Next.js.
- Priorizar separação clara entre:
  - componentes de UI
  - páginas/rotas
  - hooks
  - serviços
  - tipos
  - utilitários
- Sempre respeitar a estratégia correta entre:
  - Server Components
  - Client Components
- Só usar `"use client"` quando realmente necessário.
- Evitar transformar telas inteiras em client component sem necessidade.
- Sempre pensar em performance e renderização adequada no Next.js.

---

## Padrões de implementação

### 4. Componentes
- Criar componentes pequenos, reutilizáveis e coesos.
- Evitar componentes muito grandes com múltiplas responsabilidades.
- Componentes visuais devem ser desacoplados da lógica sempre que possível.
- Sempre que fizer sentido:
  - separar container e presentation
  - extrair trechos repetidos
  - reutilizar componentes do shadcn/ui

---

### 5. Estilo de código
- Escrever código limpo e legível.
- Priorizar clareza ao invés de complexidade.
- Evitar duplicação de código.
- Seguir consistência de nomenclatura.
- Preferir composição ao invés de excesso de herança ou abstrações desnecessárias.

---

### 6. Organização de pastas
Estrutura sugerida:

```txt
src/
  app/
  components/
    ui/
    shared/
    layout/
    feature/
  hooks/
  lib/
  services/
  types/
  utils/
