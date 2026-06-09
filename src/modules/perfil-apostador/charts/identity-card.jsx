// IdentityCard — design system Atlas: Saira 15px base, Exo 2 títulos, Geist Mono números

const dummy = {
  iniciais: 'EP', nome: 'EVANDRO PANTA', email: 'ev••••••••••@gmail.com',
  kyc: { texto: 'KYC Verificado', verificado: true },
  documento: '•••.•••.•••-••', marca: 'vaidebet-ngx',
  dataRegistro: '22/05/2026', dataCaso: 'Nenhum caso analisado',
  telefone: '•••••••2338', ultimoAcesso: '05/06 · 17:13',
  id: '6a0fef2e60857e6c1bd388ee', alertas: 15,
  depositos: { valor: 'R$ 0,00', transacoes: '0 transações' },
  saques:    { valor: 'R$ 0,00', transacoes: '0 transações' },
  saldo:     { valor: 'R$ 1,00' },
}

const Eye = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" style={{ flex: '0 0 auto', opacity: .7 }}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="2.6" />
  </svg>
)

const Field = ({ label, value, mono, eye }) => (
  <div>
    <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 5, fontFamily: mono ? 'var(--font-mono)' : undefined }}>
      {value}{eye && <Eye />}
    </div>
  </div>
)

export default function IdentityCard({ dados = dummy }) {
  const d = dados
  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 11, overflow: 'auto' }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13, flex: '0 0 auto', fontFamily: 'var(--font-head)' }}>
          {d.iniciais}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-head)' }}>{d.nome}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{d.email}</div>
        </div>
        {d.kyc && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--orange-soft)', color: 'var(--orange)', fontWeight: 700, fontSize: 10.5, padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap', flex: '0 0 auto' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 11a7 7 0 0 1 14 0" /><path d="M7.5 12a4.5 4.5 0 0 1 9 0c0 3-1 5-1 6.5" />
              <path d="M12 12v3c0 2-.4 3.5-1.2 5" /><path d="M9.4 19.5c.6-1.4.6-3 .6-4.5" />
            </svg>
            {d.kyc.texto}
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'var(--line)' }} />

      {/* campos 2 colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 18px' }}>
        <Field label="Documento"        value={d.documento}    mono eye />
        <Field label="Marca"            value={d.marca}                />
        <Field label="Data de Registro" value={d.dataRegistro}         />
        <Field label="Data do Caso"     value={d.dataCaso}             />
        <Field label="Telefone"         value={d.telefone}     mono eye />
        <Field label="Último Acesso"    value={d.ultimoAcesso}         />
      </div>

      {/* id */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 10.5, color: 'var(--muted)', flexShrink: 0 }}>ID</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {d.id}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" style={{ flex: '0 0 auto' }}>
            <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        </span>
      </div>

      {/* risco badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 600 }}>Risco Atual</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--orange)', color: '#fff', fontWeight: 700, fontSize: 11.5, padding: '6px 13px', borderRadius: 8, fontFamily: 'var(--font-head)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".6" fill="currentColor" />
          </svg>
          {d.alertas} Alertas
        </span>
      </div>

      {/* stats 3 colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
        {[
          { k: 'Depósitos', val: d.depositos.valor, sub: d.depositos.transacoes },
          { k: 'Saques',    val: d.saques.valor,    sub: d.saques.transacoes    },
          { k: 'Saldo',     val: d.saldo.valor,     sub: null                   },
        ].map(({ k, val, sub }, i) => (
          <div key={k} style={{ padding: '9px 11px', borderLeft: i > 0 ? '1px solid var(--line)' : undefined }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px', fontWeight: 600 }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--orange)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>{val}</div>
            {sub && <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 2 }}>{sub}</div>}
          </div>
        ))}
      </div>

    </div>
  )
}
