import type { Module, NavGroup } from "@/types/module"

export const MODULES: Module[] = [
  { id: "perfil-apostador", nome: "Perfil de Apostador", icone: "👤", status: "ready" },
  { id: "financeiro",       nome: "Financeiro",          icone: "📄", status: "soon"  },
  { id: "apostas",          nome: "Apostas Esportivas",  icone: "🎯", status: "soon"  },
  { id: "cassino",          nome: "Cassino",             icone: "🌐", status: "soon"  },
  { id: "pld-aml",          nome: "PLD / AML",           icone: "🛡️", status: "ready" },
  { id: "risco-fraude",     nome: "Risco & Fraude",      icone: "🚨", status: "soon"  },
  { id: "web-analytics",    nome: "Web Analytics",       icone: "📈", status: "soon"  },
]

export const NAV: NavGroup[] = [
  {
    group: null,
    items: [
      { id: "overview", icon: "🏠", label: "Overview", disabled: true },
    ],
  },
  {
    group: "Playground",
    items: [
      { id: "financeiro",       icon: "📄", label: "Financeiro" },
      { id: "apostas",          icon: "🎯", label: "Apostas Esportivas" },
      { id: "cassino",          icon: "🌐", label: "Cassino",             badge: "NEW" },
      { id: "perfil-apostador", icon: "👤", label: "Perfil de Apostador" },
      { id: "risco-fraude",     icon: "🛡️", label: "Risco e Fraude",     disabled: true },
      { id: "pld-aml",          icon: "🛡️", label: "PLD / AML" },
      { id: "web-analytics",    icon: "📈", label: "Web Analytics",       badge: "NEW" },
    ],
  },
  {
    group: "Research Preview",
    items: [
      { id: "ai-assistant", icon: "✦", label: "AI Assistant", disabled: true },
    ],
  },
]

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id)
}
