export type ModuleStatus = "ready" | "soon"

export interface Module {
  id: string
  nome: string
  icone: string
  status: ModuleStatus
}

export interface NavItem {
  id: string
  icon: string
  label: string
  badge?: string
  disabled?: boolean
}

export interface NavGroup {
  group: string | null
  items: NavItem[]
}
