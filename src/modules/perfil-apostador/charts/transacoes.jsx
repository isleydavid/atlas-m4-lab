// Transacoes — painel oficial (abas Dep/Saq/Cas/Esp) + bilhetes do lab
// Tokens Atlas: var(--orange), var(--font-head), var(--font-mono)
import { useState } from 'react'

const dummy = {
  periodo: '08 jun – 09 jun 2026',
  rodape: '07/06/2026 — 08/06/2026',
  abas: [
    { id: 'depositos', label: 'Depósitos', tipo: 'fin', itens: [
      { tipo: 'Depósito', data: '09 Jun 2026', status: 'Aprovado', marca: 'vaidebet-ngx', id: '6a2778cd80949b25909559e0', valor: 'R$ 10,00', tempo: '02h 22m' },
      { tipo: 'Depósito', data: '09 Jun 2026', status: 'Pendente', marca: 'vaidebet-ngx', id: '06adbcb1-9dcb-48ec-8a30-31d2baa7f33a', valor: 'R$ 10,00', tempo: '02h 22m' },
      { tipo: 'Depósito', data: '09 Jun 2026', status: 'Aprovado', marca: 'vaidebet-ngx', id: '6a2778cd80949b25909559e0', valor: 'R$ 10,00', tempo: '02h 22m' },
    ] },
    { id: 'saques',     label: 'Saques',     tipo: 'fin', itens: [] },
    { id: 'cassino',    label: 'Cassino',    tipo: 'fin', itens: [] },
    { id: 'esportivas', label: 'Esportivas', tipo: 'esp', itens: [
      { titulo: 'Aposta Múltipla', status: 'NÃO PREMIADO', legs: [
        { ev: 'Rússia x Burkina Faso · GOALS_OVER_UNDER', odd: '1.24' },
        { ev: 'Canadá x Irlanda · GOALS_OVER_UNDER',      odd: '1.34' },
        { ev: 'Geórgia x Bahrain · GOALS_OVER_UNDER',     odd: '1.20' },
      ] },
      { titulo: 'Aposta Múltipla', status: 'NÃO PREMIADO', legs: [
        { ev: '04 Jun 2026 · 18h59m · 6 seleções', odd: 'BILHETE' },
      ] },
    ] },
  ],
}

export default function Transacoes({ dados = dummy }) {
  const [ativa, setAtiva] = useState(0)
  const aba = dados.abas[ativa]

  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>

      {/* cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>Transações</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--orange)', color: '#fff', fontWeight: 600, fontSize: 11, padding: '5px 10px', borderRadius: 999 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
          {dados.periodo}
        </div>
      </div>

      {/* abas */}
      <div style={{ display: 'flex', background: '#F1F2F4', borderRadius: 10, padding: 4, gap: 3, flexShrink: 0 }}>
        {dados.abas.map((a, i) => (
          <button key={a.id} onClick={() => setAtiva(i)} style={{
            flex: 1, textAlign: 'center', padding: '7px 6px', fontSize: 11.5, fontWeight: i === ativa ? 700 : 600,
            color: i === ativa ? '#fff' : 'var(--muted)', background: i === ativa ? 'var(--orange)' : 'transparent',
            border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>{a.label}</button>
        ))}
      </div>

      {/* conteúdo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {aba.itens.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: 12, padding: '20px 0', textAlign: 'center' }}>Sem registros no período.</div>
        )}

        {aba.tipo === 'fin' && aba.itens.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F7F7F8', borderRadius: 10, padding: '11px 13px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--orange)', flex: '0 0 auto' }} />
                {t.tipo}
                <span style={{ fontSize: 10, fontWeight: 700, color: t.status === 'Aprovado' ? 'var(--green)' : 'var(--amber)', background: t.status === 'Aprovado' ? 'var(--green-soft)' : 'var(--amber-soft)', padding: '2px 7px', borderRadius: 5 }}>{t.status}</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <span>{t.data}</span><span>·</span><span>{t.marca}</span><span>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{t.id}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{t.valor}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3 }}>{t.tempo}</div>
            </div>
          </div>
        ))}

        {aba.tipo === 'esp' && aba.itens.map((b, i) => (
          <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>
              {b.titulo}
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.4px', color: 'var(--muted)', background: '#EEF0F2', padding: '3px 8px', borderRadius: 5, whiteSpace: 'nowrap' }}>{b.status}</span>
            </div>
            {b.legs.map((l, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 7, gap: 8 }}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.ev}</span>
                <b style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{l.odd}</b>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* paginação + rodapé */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7, marginBottom: 8 }}>
          {['‹ Anterior', '1', 'Próximo ›'].map((label, i) => (
            <span key={label} style={{
              border: i === 1 ? 'none' : '1px solid var(--line)',
              background: i === 1 ? 'var(--orange)' : '#fff',
              color: i === 1 ? '#fff' : 'var(--muted)',
              borderRadius: 8, padding: '6px 11px', fontSize: 11.5, fontWeight: i === 1 ? 700 : 600,
              display: 'inline-flex', alignItems: 'center', cursor: 'pointer', minWidth: i === 1 ? 32 : undefined, justifyContent: 'center',
            }}>{label}</span>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--muted-2)' }}>{dados.rodape}</div>
      </div>

    </div>
  )
}
