import { packPreview } from '../mosaics.js'

// Desenho esquemático do mosaico (primeiras células).
export default function MiniPreview({ mosaic, active }) {
  const cells = packPreview(mosaic, 8)
  const cols = 12
  const rows = Math.max(...cells.map((c) => c.y + c.h), 1)
  const W = 100, gap = 2
  const unitW = W / cols
  const unitH = 8
  const H = rows * unitH
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
      {cells.map((c, i) => (
        <rect key={i}
          x={c.x * unitW + gap / 2} y={c.y * unitH + gap / 2}
          width={c.w * unitW - gap} height={c.h * unitH - gap}
          rx="2"
          fill={active ? 'var(--orange)' : '#D9DDE3'}
          opacity={active ? (0.55 + (i % 2) * 0.25) : (0.55 + (i % 2) * 0.2)} />
      ))}
    </svg>
  )
}
