"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MODULES, NAV } from "@/lib/modules"
import type { NavItem } from "@/types/module"

interface SidebarProps {
  collapsed: boolean
  onCollapse: () => void
}

function isEnabled(item: NavItem): boolean {
  if (item.disabled) return false
  const mod = MODULES.find((m) => m.id === item.id)
  return !!mod && mod.status === "ready"
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname()

  function isActive(id: string) {
    return pathname === `/${id}` || pathname === `/${id}/`
  }

  if (collapsed) {
    return (
      <aside className="flex flex-col items-center w-12 border-r border-border bg-card shrink-0 py-3 gap-2">
        <button
          onClick={onCollapse}
          className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground"
          title="Expandir"
        >
          ☰
        </button>
      </aside>
    )
  }

  return (
    <aside className="flex flex-col w-56 shrink-0 border-r border-border bg-card overflow-y-auto">
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            A
          </div>
          <span className="font-heading font-bold text-foreground">M4 Lab</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-tight">
          Dashboard multi-módulo de análise do apostador.
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ group, items }) => (
          <div key={group ?? "root"}>
            {group && (
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mt-2">
                {group}
              </p>
            )}
            {items.map((item) => {
              const enabled = isEnabled(item)
              const active = isActive(item.id)

              if (!enabled) {
                return (
                  <span
                    key={item.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground/50 cursor-not-allowed select-none"
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold uppercase bg-muted text-muted-foreground/50 px-1 rounded">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )
              }

              return (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-foreground hover:bg-accent/60"
                  )}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase bg-primary/10 text-primary px-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse */}
      <button
        onClick={onCollapse}
        className="flex items-center gap-2 px-4 py-3 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ◀ Recolher
      </button>
    </aside>
  )
}
