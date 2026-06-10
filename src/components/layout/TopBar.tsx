"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, RefreshCw, Bell, Sun, Moon, HelpCircle, FileText } from "lucide-react"

function fmt(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export default function TopBar() {
  const [time, setTime] = useState("")
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setTime(fmt(new Date()))
    const iv = setInterval(() => setTime(fmt(new Date())), 60_000)
    return () => clearInterval(iv)
  }, [])

  const toggleDark = useCallback(() => {
    setDark((v) => {
      const next = !v
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }, [])

  return (
    <header className="flex items-center gap-2 shrink-0 bg-card border-b border-border px-5 py-2 z-10">
      {/* Org selector */}
      <button className="flex items-center gap-2 bg-background border border-border rounded-[11px] px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
        <span className="w-[22px] h-[22px] rounded-md bg-foreground text-background flex items-center justify-center text-[11px] font-bold shrink-0">
          B
        </span>
        <span>BPX Group</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </button>

      {/* Last update time */}
      {time && (
        <div className="flex items-center gap-1.5 border border-border rounded-[11px] px-3 py-1.5 text-sm text-foreground">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span>Atualizado às {time}</span>
          <button
            onClick={() => setTime(fmt(new Date()))}
            title="Recarregar"
            className="text-muted-foreground hover:text-foreground transition-colors ml-0.5"
          >
            <RefreshCw className="size-3" />
          </button>
        </div>
      )}

      <span className="flex-1" />

      {/* Notifications */}
      <button className="flex items-center gap-1.5 bg-accent border border-border rounded-full px-2.5 py-1.5 text-sm font-bold text-primary cursor-pointer hover:bg-accent/80 transition-colors">
        <Bell className="size-3.5" />
        <span>+99</span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleDark}
        aria-label="Alternar tema"
        className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </button>

      {/* Help & Docs */}
      {(
        [
          { icon: <HelpCircle className="size-3.5" />, label: "Ajuda" },
          { icon: <FileText className="size-3.5" />, label: "Docs" },
        ] as const
      ).map(({ icon, label }) => (
        <button
          key={label}
          className="flex items-center gap-1.5 border border-border rounded-[11px] px-3 py-1.5 bg-background text-sm text-foreground hover:bg-accent/50 transition-colors"
        >
          {icon}
          <span className="hidden min-[900px]:inline">{label}</span>
        </button>
      ))}

      {/* Upgrade */}
      <Button
        size="sm"
        className="rounded-[11px] bg-primary text-primary-foreground font-bold hover:bg-primary/90 gap-1"
      >
        ↑ Upgrade
      </Button>
    </header>
  )
}
