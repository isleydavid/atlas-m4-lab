import { MODULES, getModule } from "@/lib/modules"

interface Props {
  params: Promise<{ moduleId: string }>
}

export function generateStaticParams() {
  return MODULES.map((m) => ({ moduleId: m.id }))
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = await params
  const mod = getModule(moduleId)

  if (!mod || mod.status === "soon") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 opacity-40">
        <span className="text-5xl">{mod?.icone ?? "🔜"}</span>
        <span className="font-heading text-xl">{mod?.nome ?? "Módulo"} — Em breve</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="pb-4 mb-6 border-b border-border">
        <h1 className="font-heading text-xl font-bold text-foreground">{mod.nome}</h1>
      </div>
      <p className="text-sm text-muted-foreground">Migração em andamento — Fase 3</p>
    </div>
  )
}
