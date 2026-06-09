// AnaliseRiscos — painel "Análise de Riscos" do Atlas oficial + grafo do lab
// Tokens: var(--orange #f26122), var(--font-head Exo 2), var(--font-mono Geist Mono)

const dummy = {
  vinculosMesmoIP: true,
  contasVinculadas: 1,
  conta: { nome: 'ADIEL FERREIRA', marca: 'vaidebet-ngx', cpf: '076.161.543-10', ip: '2804:29b8:517b:87b6:32be:efe9:1c98:f334' },
  score: { valor: 100, max: 100, critico: true },
  sinais: ['Vínculos com mesmo IP'],
  grafo: {
    nos: [
      { id: 'EP',  x: 210, y: 85,  principal: true  },
      { id: 'IP',  x: 95,  y: 38,  principal: false },
      { id: 'A2',  x: 88,  y: 135, principal: false },
      { id: 'A3',  x: 330, y: 40,  principal: false },
      { id: 'PIX', x: 340, y: 135, principal: false },
    ],
    arestas: [['EP', 'IP'], ['EP', 'A2'], ['EP', 'A3'], ['EP', 'PIX'], ['A3', 'PIX']],
  },
  descricao: 'Foram identificados 1 alerta(s), com destaque para vínculos com mesmo IP. O último IP observado também foi utilizado por 1 outra(s) conta(s) dentro do recorte selecionado.',
}

const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
    <path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".6" fill="var(--orange)" />
  </svg>
)

const Divider = () => <div style={{ height: 1, background: 'var(--line)' }} />

const Row = ({ label, info, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
    <span style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
      {label}
      {info && (
        <span style={{ width: 15, height: 15, borderRadius: '50%', border: '1.5px solid var(--muted-2)', color: 'var(--muted-2)', display: 'inline-grid', placeItems: 'center', fontSize: 9, fontStyle: 'italic', fontWeight: 700, flex: '0 0 auto' }}>i</span>
      )}
    </span>
    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>{children}</span>
  </div>
)

export default function AnaliseRiscos({ dados = dummy }) {
  const d = dados
  const node = (id) => d.grafo.nos.find((n) => n.id === id)

  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>

      {/* cabeçalho da seção */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>Análise de Riscos</div>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>Sinais, vínculos e criticidade do caso</div>
      </div>

      <Divider />

      {/* linhas de métricas */}
      <Row label="Vínculos com mesmo IP">
        {d.vinculosMesmoIP ? 'Sim' : 'Não'}{d.vinculosMesmoIP && <WarnIcon />}
      </Row>
      <Row label="Contas Vinculadas">
        {d.contasVinculadas} conta{d.contasVinculadas !== 1 ? 's' : ''}
      </Row>

      {/* conta vinculada */}
      <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', flex: '0 0 auto' }} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.conta.nome}</span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '2px 7px', borderRadius: 6, whiteSpace: 'nowrap', flex: '0 0 auto' }}>{d.conta.marca}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 7, gap: 8 }}>
          <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>
            CPF <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)', fontWeight: 600 }}>{d.conta.cpf}</span>
          </div>
          <div style={{ textAlign: 'right', minWidth: 0 }}>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px' }}>IP</div>
            <div style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--muted-2)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{d.conta.ip}</div>
          </div>
        </div>
      </div>

      <Row label="Score Comportamental" info>
        <span style={{ fontFamily: 'var(--font-mono)' }}>{d.score.valor}/{d.score.max}</span>
        {d.score.critico && <WarnIcon />}
      </Row>

      <Divider />

      {/* sinais */}
      <div>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.6px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Sinais identificados</div>
        {d.sinais.map((s) => (
          <div key={s} style={{ background: 'var(--red-soft)', color: 'var(--red)', textAlign: 'center', fontSize: 11, padding: '8px 10px', borderRadius: 9, fontWeight: 600, marginBottom: 5 }}>{s}</div>
        ))}
      </div>

      {/* grafo */}
      <div style={{ border: '1px solid var(--line)', borderRadius: 11, padding: '10px 12px', background: 'linear-gradient(180deg,#fff,#FFFBF9)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          Topologia dos vínculos
          <span style={{ marginLeft: 'auto', fontSize: 9.5, fontWeight: 700, color: '#fff', background: 'var(--orange)', padding: '2px 7px', borderRadius: 999 }}>★ Recomendado</span>
        </div>
        <svg width="100%" height="140" viewBox="0 0 420 170">
          {d.grafo.arestas.map(([a, b], i) => {
            const na = node(a), nb = node(b)
            if (!na || !nb) return null
            return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#F0C9B6" strokeWidth="2" strokeDasharray={a !== 'EP' ? '5 4' : undefined} />
          })}
          {d.grafo.nos.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.principal ? 22 : 15} fill={n.principal ? 'var(--orange)' : '#FDEDE6'} stroke={n.principal ? 'none' : 'var(--orange)'} strokeWidth="1.2" />
              <text x={n.x} y={n.y + (n.principal ? 4 : 3)} textAnchor="middle" fill={n.principal ? '#fff' : 'var(--orange)'} fontSize={n.principal ? 11 : 9} fontWeight="700" fontFamily="var(--font-head)">{n.id}</text>
            </g>
          ))}
        </svg>
        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 4, textAlign: 'center' }}>Contas no mesmo IP formam um cluster suspeito.</div>
      </div>

      {/* descrição */}
      <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)', marginBottom: 5 }}>Descrição da suspeita</div>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', lineHeight: 1.55 }}>{d.descricao}</p>
      </div>

    </div>
  )
}
