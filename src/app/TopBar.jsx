import { useState, useEffect } from 'react'

function fmt(d) {
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export default function TopBar() {
  const [time, setTime] = useState(() => fmt(new Date()))
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => setTime(fmt(new Date())), 60_000)
    return () => clearInterval(iv)
  }, [])

  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      background: 'var(--card)', borderBottom: '1px solid var(--border-default)',
      padding: '9px 20px', zIndex: 10,
    }}>
      {/* org selector */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1px solid var(--border-default)',
        borderRadius: 11, padding: '6px 11px', cursor: 'pointer',
        fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--foreground)',
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6, background: 'var(--ink)',
          color: '#fff', display: 'grid', placeItems: 'center',
          fontSize: 11.5, fontWeight: 700, flexShrink: 0,
        }}>B</span>
        <span style={{ fontWeight: 500 }}>BPX Group</span>
        <span style={{ color: 'var(--muted)', fontSize: 11 }}>▾</span>
      </button>

      {/* atualizado */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        border: '1px solid var(--border-default)', borderRadius: 11,
        padding: '6px 11px', fontSize: 13, color: 'var(--foreground)',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
        <span>Atualizado às {time}</span>
        <button onClick={() => setTime(fmt(new Date()))} title="Recarregar"
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, fontSize: 13, lineHeight: 1 }}>
          ↻
        </button>
      </div>

      <span style={{ flex: 1 }} />

      {/* notificações */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--orange-soft)', border: '1px solid var(--orange-line)',
        borderRadius: 999, padding: '5px 10px', color: 'var(--orange)',
        fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
      }}>
        <span>🔔</span><span>+99</span>
      </div>

      {/* tema */}
      <button onClick={() => setDark((v) => !v)} aria-label="Alternar tema"
        title={dark ? 'Modo escuro' : 'Modo claro'}
        style={{
          width: 34, height: 34, borderRadius: 999,
          border: '1px solid var(--border-default)', background: '#fff',
          color: 'var(--muted)', cursor: 'pointer', fontSize: 15, lineHeight: 1,
          display: 'grid', placeItems: 'center',
        }}>
        {dark ? '🌙' : '☀'}
      </button>

      {/* ajuda + docs — rótulo some em telas estreitas */}
      {[['?', 'Ajuda'], ['📄', 'Docs']].map(([ico, label]) => (
        <button key={label} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid var(--border-default)', borderRadius: 11,
          padding: '6px 11px', background: '#fff', cursor: 'pointer',
          fontSize: 13, color: 'var(--foreground)', fontFamily: 'var(--font-body)',
        }}>
          <span>{ico}</span>
          <span className="tb-label">{label}</span>
        </button>
      ))}

      {/* upgrade */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--orange)', color: '#fff', border: 'none',
        borderRadius: 11, padding: '7px 14px', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'var(--font-body)',
      }}>
        ↑ Upgrade
      </button>
    </header>
  )
}
