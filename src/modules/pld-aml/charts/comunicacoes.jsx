// Comunicacoes — registro SISCOAF (suspeita) + SIGAP (não-ocorrência)
// Regra de UX: dados visíveis, base legal atrás do "i".
// RBAC (art. 29): no produto real, este card só renderiza para compliance_analyst/admin e auditor.

import { useState } from 'react'

const dummy = {
  siscoaf: [
    { id: 'COM-2026-0031', caso: '#C-2026-0612', apostador: '#A-48217', status: 'Enviada',   data: '11/jun/2026', canal: 'SISCOAF', protocolo: 'SIS-931-2026' },
    { id: 'COM-2026-0028', caso: '#C-2026-0589', apostador: '#A-44092', status: 'Pendente',  data: '09/jun/2026', canal: 'SISCOAF', protocolo: null },
    { id: 'COM-2026-0022', caso: '#C-2026-0541', apostador: '#A-40017', status: 'Enviada',   data: '02/jun/2026', canal: 'SISCOAF', protocolo: 'SIS-877-2026' },
    { id: 'COM-2026-0018', caso: '#C-2026-0503', apostador: '#A-36654', status: 'Arquivada', data: '28/mai/2026', canal: 'SISCOAF', protocolo: null },
  ],
  sigap: {
    ano: 2026,
    status: 'Pendente',
    prazo: '31/jan/2027',
    enviada: null,
    protocolo: null,
  },
}

const STATUS_COR = {
  Enviada:   { c: 'var(--green)',  bg: 'var(--green-soft)'  },
  Pendente:  { c: 'var(--amber)', bg: 'var(--amber-soft)'  },
  Arquivada: { c: 'var(--muted)', bg: '#F3F4F6'            },
}

function Info({ head, children }) {
  const [open, setOpen] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle' }}>
      <button className="ibtn" onClick={() => setOpen((o) => !o)}
        style={{ width: 16, height: 16, fontSize: 10 }}>i</button>
      {open && (
        <span className="imenu" role="tooltip" onClick={() => setOpen(false)} style={{ width: 240, cursor: 'default' }}>
          <span className="ihead">{head}</span>
          <p>{children}</p>
        </span>
      )}
    </span>
  )
}

export default function Comunicacoes({ dados = dummy }) {
  const { siscoaf, sigap } = dados

  const sigapCor = sigap.status === 'Enviada'
    ? STATUS_COR.Enviada
    : STATUS_COR.Pendente

  return (
    <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>

      {/* SISCOAF — operações suspeitas */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.6px', color: 'var(--muted)', textTransform: 'uppercase' }}>
            SISCOAF · Operações suspeitas
          </span>
          <Info head="Comunicação de suspeita · art. 27–28">
            Após análise com indício de LD/FTP, comunicar ao COAF via SISCOAF até o dia útil seguinte à conclusão (art. 27 §3 / art. 28). Conteúdo mínimo: elementos da análise, intermediário, características e KYC (art. 27 §2).
          </Info>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {siscoaf.map((com) => {
            const sc = STATUS_COR[com.status] || STATUS_COR.Pendente
            return (
              <div key={com.id} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{com.id}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{com.data}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    Caso <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }}>{com.caso}</span>
                    {' · '}Apostador <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-2)' }}>{com.apostador}</span>
                    {com.protocolo && <span style={{ color: 'var(--green)', fontWeight: 600 }}> · {com.protocolo}</span>}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: sc.c, background: sc.bg, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {com.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* separador */}
      <div style={{ height: 1, background: 'var(--line)' }} />

      {/* SIGAP — não-ocorrência anual */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.6px', color: 'var(--muted)', textTransform: 'uppercase' }}>
            SIGAP · Não-ocorrência anual
          </span>
          <Info head="Comunicação de não-ocorrência · art. 30">
            Quando não há nada a reportar no ano civil, o operador deve enviar a comunicação de não-ocorrência via SIGAP (art. 30 da Portaria 1.143/2024). Canal distinto do SISCOAF — não confundir.
          </Info>
        </div>
        <div style={{ border: `1px solid ${sigapCor.c === 'var(--green)' ? 'rgba(46,158,91,.25)' : 'rgba(217,119,6,.25)'}`, borderRadius: 10, padding: '12px 14px', background: sigapCor.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
                Ano civil {sigap.ano}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                Prazo: <b style={{ color: 'var(--ink-2)' }}>{sigap.prazo}</b>
                {sigap.enviada && <span style={{ marginLeft: 8, color: 'var(--green)', fontWeight: 600 }}>Enviada em {sigap.enviada} · {sigap.protocolo}</span>}
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: sigapCor.c, background: '#fff', border: `1px solid ${sigapCor.c}`, padding: '5px 12px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {sigap.status}
            </span>
          </div>
          {sigap.status === 'Pendente' && (
            <button className="btn-ghost" style={{ marginTop: 10, width: '100%', fontSize: 12 }}>
              Registrar não-ocorrência no SIGAP
            </button>
          )}
        </div>
      </div>

      {/* aviso de sigilo */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--red-soft)', borderRadius: 10, padding: '10px 12px' }}>
        <Info head="Sigilo obrigatório · art. 29">
          É proibido informar ao apostador, a terceiros ou a outros funcionários fora do círculo de compliance sobre a existência ou o conteúdo das comunicações ao COAF. Violação sujeita o operador e administradores às sanções do art. 12 da Lei 9.613/1998.
        </Info>
        <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600, lineHeight: 1.4 }}>
          Sigilo obrigatório — visível apenas para compliance_analyst, compliance_admin e auditor.
        </span>
      </div>

    </div>
  )
}
