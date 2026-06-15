"use client"

import React, { useRef, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Tipos internos da animação
// ---------------------------------------------------------------------------
interface AmlNode { x: number; y: number; pulseT: number; nextPulse: number }
interface AmlEdge { a: number; b: number; cpX: number; cpY: number }
interface AmlPart { edge: number; t: number; speed: number; size: number }

// ---------------------------------------------------------------------------
// Canvas — rede de nós, conexões e partículas
// ---------------------------------------------------------------------------
function AmlNetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COLOR = 'rgba(242,101,34,'

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      canvas!.width  = rect.width  || 800
      canvas!.height = rect.height || 400
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    function buildGraph() {
      const W = canvas!.width, H = canvas!.height
      const nodes: AmlNode[] = []
      const cols = 7, rows = 4
      const cellW = W / cols, cellH = H / rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            x: cellW * c + cellW * (0.2 + Math.random() * 0.6),
            y: cellH * r + cellH * (0.2 + Math.random() * 0.6),
            pulseT: 0,
            nextPulse: 2 + Math.random() * 8,
          })
        }
      }
      return nodes
    }

    function buildEdges(nodes: AmlNode[]): AmlEdge[] {
      const edges: AmlEdge[] = []
      const DIST = (canvas!.width / 7) * 1.6
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          if (Math.sqrt(dx * dx + dy * dy) < DIST) {
            edges.push({
              a: i, b: j,
              cpX: (nodes[i].x + nodes[j].x) / 2 + (Math.random() - 0.5) * 60,
              cpY: (nodes[i].y + nodes[j].y) / 2 + (Math.random() - 0.5) * 40,
            })
          }
        }
      }
      return edges
    }

    function buildParticles(edges: AmlEdge[]): AmlPart[] {
      const count = Math.min(edges.length, 20)
      return Array.from({ length: count }, () => ({
        edge:  Math.floor(Math.random() * edges.length),
        t:     Math.random(),
        speed: 0.0008 + Math.random() * 0.0012,
        size:  1.5 + Math.random() * 1.5,
      }))
    }

    function bezier(t: number, x0: number, y0: number, cpX: number, cpY: number, x1: number, y1: number) {
      const mt = 1 - t
      return {
        x: mt * mt * x0 + 2 * mt * t * cpX + t * t * x1,
        y: mt * mt * y0 + 2 * mt * t * cpY + t * t * y1,
      }
    }

    let nodes    = buildGraph()
    let edges    = buildEdges(nodes)
    let parts    = buildParticles(edges)
    let lastRebuild = 0
    let raf: number
    let last = performance.now()

    function draw(now: number) {
      const dt = (now - last) / 1000
      last = now

      const W = canvas!.width, H = canvas!.height
      ctx!.clearRect(0, 0, W, H)

      if (now - lastRebuild > 3000) {
        nodes  = buildGraph()
        edges  = buildEdges(nodes)
        parts  = buildParticles(edges)
        lastRebuild = now
      }

      ctx!.lineWidth = 0.8
      for (const e of edges) {
        const na = nodes[e.a], nb = nodes[e.b]
        ctx!.beginPath()
        ctx!.moveTo(na.x, na.y)
        ctx!.quadraticCurveTo(e.cpX, e.cpY, nb.x, nb.y)
        ctx!.strokeStyle = COLOR + '0.05)'
        ctx!.stroke()
      }

      for (const n of nodes) {
        n.nextPulse -= dt
        if (n.nextPulse <= 0) {
          n.pulseT    = 1
          n.nextPulse = 5 + Math.random() * 12
        }
        if (n.pulseT > 0) n.pulseT = Math.max(0, n.pulseT - dt * 1.2)

        if (n.pulseT > 0) {
          const pr = (1 - n.pulseT) * 18
          const pa = n.pulseT * 0.12
          ctx!.beginPath()
          ctx!.arc(n.x, n.y, pr, 0, Math.PI * 2)
          ctx!.strokeStyle = COLOR + pa + ')'
          ctx!.lineWidth   = 1
          ctx!.stroke()
        }

        ctx!.beginPath()
        ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = COLOR + (n.pulseT > 0 ? '0.20' : '0.07') + ')'
        ctx!.fill()
      }

      for (const p of parts) {
        p.t += p.speed
        if (p.t > 1) {
          p.t    = 0
          p.edge = Math.floor(Math.random() * edges.length)
        }

        const e  = edges[p.edge]
        if (!e) continue
        const na = nodes[e.a], nb = nodes[e.b]
        const pt = bezier(p.t, na.x, na.y, e.cpX, e.cpY, nb.x, nb.y)

        const grd = ctx!.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, p.size * 2.5)
        grd.addColorStop(0, COLOR + '0.35)')
        grd.addColorStop(1, COLOR + '0.00)')
        ctx!.beginPath()
        ctx!.arc(pt.x, pt.y, p.size * 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = grd
        ctx!.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width:  '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Dados
// ---------------------------------------------------------------------------
interface Stage { value: string; label: string; conv: string | null; h: number }

const STAGES: Stage[] = [
  { value: '850.000', label: 'Transações\nMonitoradas', conv: null,    h: 112 },
  { value: '18.200',  label: 'Regras\nAcionadas',       conv: '2,1%',  h: 95  },
  { value: '3.420',   label: 'Alertas\nGerados',        conv: '18,8%', h: 80  },
  { value: '740',     label: 'Em\nInvestigação',        conv: '21,6%', h: 65  },
  { value: '112',     label: 'Casos\nAbertos',          conv: '15,1%', h: 50  },
  { value: '18',      label: 'Comunicações\nCOAF',      conv: '2,4%',  h: 38  },
]

interface KpiItem { label: string; value: string; sub: string; deltaPos: boolean | null }

const KPIS: KpiItem[] = [
  { label: 'Taxa de Conversão AML',         value: '0,0021%',    sub: 'Monitorado → COAF',        deltaPos: null  },
  { label: 'Tempo Médio de Investigação',   value: '2,4 dias',   sub: '−0,6 vs. 30 dias ant.',    deltaPos: false },
  { label: 'Volume Financeiro Investigado', value: 'R$ 48,7 MM', sub: '+12% vs. 30 dias ant.',    deltaPos: true  },
  { label: 'Contas Envolvidas',             value: '1.256',      sub: '+8% vs. 30 dias ant.',     deltaPos: true  },
]

const BG        = ['#F26122','#F47340','#F68B62','#F8A585','#FABFAA','#FCDACF']
const TEXT_DARK = ['#fff','#fff','#fff','#fff','#fff','#F26122']

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export function PipelineAml() {
  const maxH   = Math.max(...STAGES.map(s => s.h))
  const topRow = maxH + 40

  return (
    <div style={{
      position: 'relative',
      background: 'var(--card)',
      border: '1px solid var(--border-default)',
      borderRadius: 16,
      padding: '20px 24px 14px',
      boxShadow: 'var(--shadow-card)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>

      <AmlNetworkCanvas />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)', margin: 0, lineHeight: 1.3 }}>
              Quantas transações chegaram ao COAF?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted-text)', fontFamily: 'var(--font-body)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
              Funil de detecção AML · Últimos 30 dias.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-text)', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>HOJE</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1, letterSpacing: '-0.5px' }}>18</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-head)' }}>COMUNICAÇÕES COAF</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ color: 'var(--orange)', fontSize: 10 }}>▲</span>
            <span style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>+5 vs. 30 dias anteriores</span>
          </div>
        </div>

        {/* Funil */}
        <div style={{ position: 'relative', height: topRow, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
          {STAGES.map((s, i) => {
            const isLast = i === STAGES.length - 1
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>

                <div style={{ height: topRow - maxH - 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 }}>
                  {s.conv && (
                    <>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', lineHeight: 1, fontFamily: 'var(--font-body)' }}>{s.conv}</span>
                      <span style={{ fontSize: 9, color: 'var(--muted-text)', lineHeight: 1.2, fontFamily: 'var(--font-body)' }}>taxa de conversão</span>
                      <span style={{ fontSize: 10, color: 'var(--muted-text)', lineHeight: 1, marginTop: 1 }}>↓</span>
                    </>
                  )}
                </div>

                <div
                  style={{
                    width: '100%', height: s.h,
                    background: BG[i],
                    clipPath: isLast ? 'none' : 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
                    borderRadius: isLast ? 4 : 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '6px 14px 6px 6px', boxSizing: 'border-box', overflow: 'hidden',
                  }}>
                  <span style={{ fontSize: s.h > 70 ? 18 : s.h > 50 ? 14 : 11, fontWeight: 900, color: TEXT_DARK[i], fontFamily: 'var(--font-head)', lineHeight: 1, letterSpacing: '-0.3px', textAlign: 'center' }}>
                    {s.value}
                  </span>
                  <span style={{ fontSize: s.h > 70 ? 9 : 8, color: i < 5 ? 'rgba(255,255,255,0.85)' : 'var(--orange)', lineHeight: 1.3, textAlign: 'center', marginTop: 3, whiteSpace: 'pre-line', fontFamily: 'var(--font-body)' }}>
                    {s.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Timeline dots */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 16px 0' }}>
          {STAGES.map((_, i) => (
            <React.Fragment key={i}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: i === 0 ? 'var(--orange)' : 'var(--muted-2)' }} />
              {i < STAGES.length - 1 && <div style={{ flex: 1, height: 1, background: 'var(--muted-2)' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* KPIs rodapé */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border-default)' }}>
          {KPIS.map((k, i) => {
            const deltaColor = k.deltaPos === null ? 'var(--muted-text)' : k.deltaPos ? 'var(--green)' : 'var(--red)'
            return (
              <div key={i} style={{ padding: '12px 14px', borderLeft: i === 0 ? '3px solid var(--orange)' : '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 10, color: 'var(--muted-text)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', fontFamily: 'var(--font-head)', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 10, color: deltaColor, marginTop: 3, fontFamily: 'var(--font-body)' }}>{k.sub}</div>
              </div>
            )
          })}
        </div>

        {/* Nota */}
        <div style={{ fontSize: 10, color: 'var(--muted-text)', marginTop: 8, fontFamily: 'var(--font-body)' }}>
          ⓘ Dados referentes aos últimos 30 dias. Atualizado hoje às 08:30.
        </div>

      </div>
    </div>
  )
}

export default PipelineAml
