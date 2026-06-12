"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { CashflowStacked } from '@/modules/perfil-apostador/charts/cashflow'
import Transacoes from '@/modules/perfil-apostador/charts/transacoes'
import AnaliseRiscos from '@/modules/perfil-apostador/charts/analise-riscos'
import { ScoreFactors } from '@/modules/perfil-apostador/charts/score'
import { PipelineAml } from './PipelineAml'
import { CoafTimelineV2 } from './CoafTimelineV2'
import { PepSectionV2 } from './PepSectionV2'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Row {
  id: number; nome: string; cpf: string; marca: string; flag: string
  score: number; sev: string; sla: string; slaH: number | null; slaC: string
  status: string; resp: string; crit: boolean
}
interface DrawerEntry {
  timeline: Array<{ desc: string; ts: string }>
  factors: string[]
  vinculos: string[]
}
interface StyleToken { c: string; bg: string }
interface WatchRow {
  id: number; nome: string; cpf: string; score: number
  classe: 'Alto' | 'Médio' | 'Baixo'
  motivo: string; marca: string; ultima: string
  status: 'Em observação' | 'Escalado' | 'Removido'
}
interface FluxoPoint {
  id: string; conta: string; volume: number; pctSemJogo: number
  padrao: 'pass-through' | 'saques-recorrentes' | 'normal'
  saquesRepetidos: number; ip: string; contasVinculadas: string
  entradas: number; saidas: number; jogouV: number; rendaMedia: string
  valorSaque?: number
}

// ---------------------------------------------------------------------------
// Dados mock — WorkList
// ---------------------------------------------------------------------------
const ROWS: Row[] = [
  { id: 1, nome: 'EVANDRO P.',  cpf: '•••.•••.•••-70', marca: 'vaidebet-ngx', flag: 'Estruturação',           score: 92, sev: 'Crítico', sla: '3h',    slaH: 3,    slaC: 'r', status: 'Aberto',          resp: '—',      crit: true  },
  { id: 2, nome: 'ADIEL F.',    cpf: '•••.•••.•••-10', marca: 'betnacional',   flag: 'Saque atípico',          score: 88, sev: 'Crítico', sla: '7h',    slaH: 7,    slaC: 'r', status: 'Em análise',      resp: 'Marina', crit: true  },
  { id: 3, nome: 'J. SOUSA',    cpf: '•••.•••.•••-44', marca: 'vaidebet',      flag: 'Depósito suspeito',      score: 76, sev: 'Alto',    sla: '19h',   slaH: 19,   slaC: 'a', status: 'Aberto',          resp: '—',      crit: false },
  { id: 4, nome: 'R. LIMA',     cpf: '•••.•••.•••-29', marca: 'kto',           flag: 'Estruturação',           score: 71, sev: 'Alto',    sla: '1d 4h', slaH: 28,   slaC: 'm', status: 'Em análise',      resp: 'Caio',   crit: false },
  { id: 5, nome: 'T. ALVES',    cpf: '•••.•••.•••-83', marca: 'betano',        flag: 'Comport. inconsistente', score: 64, sev: 'Médio',   sla: '2d',    slaH: 48,   slaC: 'm', status: 'Aberto',          resp: '—',      crit: false },
  { id: 6, nome: 'M. COSTA',    cpf: '•••.•••.•••-05', marca: 'vaidebet',      flag: 'Saque atípico',          score: 58, sev: 'Médio',   sla: '—',     slaH: null, slaC: 'm', status: 'Comunicado COAF', resp: 'Marina', crit: false },
]

const DRAWER_DATA: Record<number, DrawerEntry> = {
  1: {
    timeline: [
      { desc: 'Depósito PIX R$ 1.980', ts: '09/06 14:02' }, { desc: 'Depósito PIX R$ 1.950', ts: '09/06 14:09' },
      { desc: 'Depósito PIX R$ 1.990', ts: '09/06 14:21' }, { desc: 'Saque R$ 5.800 sem aposta', ts: '09/06 14:35' },
    ],
    factors: ['Fracionamento < R$ 2.000 · ×3', 'Saque sem aposta', 'Velocidade atípica', 'Conta no mesmo IP de 2 contas'],
    vinculos: ['2 contas no mesmo IP', 'Mesma marca · dispositivo recorrente', 'PIX de 3 remetentes distintos'],
  },
  2: {
    timeline: [
      { desc: 'Depósito R$ 4.200', ts: '08/06 09:14' }, { desc: 'Aposta R$ 50', ts: '08/06 09:17' },
      { desc: 'Saque R$ 4.100', ts: '08/06 09:22' },
    ],
    factors: ['Saque logo após depósito', 'Aposta simbólica (R$ 50)', 'Ratio dep/saque > 97%'],
    vinculos: ['IP compartilhado com conta banida', 'PIX de origem variada'],
  },
  3: {
    timeline: [
      { desc: 'Depósito PIX R$ 8.500', ts: '07/06 22:05' }, { desc: 'Depósito PIX R$ 7.900', ts: '07/06 22:31' },
      { desc: 'Sem apostas registradas', ts: '—' },
    ],
    factors: ['Volume atípico para perfil', 'Sem atividade de aposta', 'Horário suspeito (madrugada)'],
    vinculos: ['Nenhum vínculo identificado até o momento'],
  },
  4: {
    timeline: [
      { desc: 'Depósito R$ 1.900', ts: '05/06 10:01' }, { desc: 'Depósito R$ 1.850', ts: '05/06 10:08' },
      { desc: 'Depósito R$ 1.980', ts: '05/06 10:19' }, { desc: 'Saque R$ 5.600', ts: '05/06 10:44' },
    ],
    factors: ['Fracionamento < R$ 2.000 · ×3', 'Saque consolidado', 'Padrão similar ao caso #1'],
    vinculos: ['Dispositivo recorrente em 3 operações'],
  },
  5: {
    timeline: [{ desc: 'Apostas em mercados opostos', ts: '04/06 — 06/06' }],
    factors: ['Apostas em resultados opostos', 'Sem histórico de lucro consistente'],
    vinculos: ['Nenhum vínculo identificado'],
  },
  6: {
    timeline: [
      { desc: 'Saque R$ 12.000', ts: '01/06 08:30' }, { desc: 'Comunicação enviada COAF', ts: '02/06 09:00' },
    ],
    factors: ['Saque atípico para o perfil', 'Frequência de saques +4× no mês'],
    vinculos: ['Conta bancária de destino diferente do cadastrado'],
  },
}

// ---------------------------------------------------------------------------
// Dados de vínculos por row — alimenta AnaliseRiscos do Perfil
// ---------------------------------------------------------------------------
const ANALISE_DATA: Record<number, {
  vinculosMesmoIP: boolean; contasVinculadas: number
  conta: { nome: string; marca: string; cpf: string; ip: string }
  score: { valor: number; max: number; critico: boolean }
  sinais: string[]
  grafo: { nos: { id: string; x: number; y: number; principal: boolean }[]; arestas: [string, string][] }
  descricao: string
}> = {
  1: {
    vinculosMesmoIP: true, contasVinculadas: 2,
    conta: { nome: 'EVANDRO P.', marca: 'vaidebet-ngx', cpf: '•••.•••.•••-70', ip: '177.200.xx.xx' },
    score: { valor: 92, max: 100, critico: true },
    sinais: ['Vínculos com mesmo IP', 'Dispositivo recorrente'],
    grafo: {
      nos: [
        { id: 'EP',  x: 210, y: 85,  principal: true  },
        { id: 'A2',  x: 88,  y: 135, principal: false },
        { id: 'A3',  x: 88,  y: 38,  principal: false },
        { id: 'IP',  x: 340, y: 85,  principal: false },
      ],
      arestas: [['EP', 'IP'], ['EP', 'A2'], ['EP', 'A3'], ['A2', 'IP'], ['A3', 'IP']],
    },
    descricao: 'Foram identificadas 2 contas vinculadas ao mesmo IP, com dispositivo recorrente em 3 operações distintas.',
  },
  2: {
    vinculosMesmoIP: true, contasVinculadas: 1,
    conta: { nome: 'ADIEL F.', marca: 'betnacional', cpf: '•••.•••.•••-10', ip: '177.201.xx.xx' },
    score: { valor: 88, max: 100, critico: true },
    sinais: ['IP compartilhado com conta banida'],
    grafo: {
      nos: [
        { id: 'EP',  x: 210, y: 85,  principal: true  },
        { id: 'BAN', x: 90,  y: 85,  principal: false },
        { id: 'IP',  x: 330, y: 85,  principal: false },
      ],
      arestas: [['EP', 'IP'], ['BAN', 'IP']],
    },
    descricao: 'IP compartilhado com conta previamente banida. PIX de origens variadas detectado nas últimas 48h.',
  },
  4: {
    vinculosMesmoIP: false, contasVinculadas: 0,
    conta: { nome: 'R. LIMA', marca: 'kto', cpf: '•••.•••.•••-29', ip: '—' },
    score: { valor: 71, max: 100, critico: false },
    sinais: ['Dispositivo recorrente em múltiplas operações'],
    grafo: {
      nos: [
        { id: 'EP',  x: 210, y: 85,  principal: true  },
        { id: 'D1',  x: 100, y: 50,  principal: false },
        { id: 'D2',  x: 100, y: 120, principal: false },
        { id: 'D3',  x: 330, y: 85,  principal: false },
      ],
      arestas: [['EP', 'D1'], ['EP', 'D2'], ['EP', 'D3']],
    },
    descricao: 'Dispositivo recorrente identificado em 3 operações distintas nos últimos 7 dias.',
  },
  6: {
    vinculosMesmoIP: false, contasVinculadas: 1,
    conta: { nome: 'M. COSTA', marca: 'vaidebet', cpf: '•••.•••.•••-05', ip: '—' },
    score: { valor: 58, max: 100, critico: false },
    sinais: ['Conta bancária divergente do cadastro'],
    grafo: {
      nos: [
        { id: 'EP',  x: 210, y: 85,  principal: true  },
        { id: 'CB',  x: 340, y: 85,  principal: false },
      ],
      arestas: [['EP', 'CB']],
    },
    descricao: 'Conta bancária de destino diferente do cadastrado. Frequência de saques aumentou +4× no mês.',
  },
}

// ---------------------------------------------------------------------------
// Dados mock — COAF (9 casos · do mockup)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Dados mock — KPIs (faixa plana)
// ---------------------------------------------------------------------------
const KPI_DATA = [
  { label: 'Apostadores com flag ativo', tooltip: 'Qtd. de apostadores com pelo menos 1 red flag ativo (não arquivado).', value: '27',        delta: '▲ +4 no período', deltaColor: 'var(--red)'   as string | undefined },
  { label: 'Alertas gerados',            tooltip: 'Total de alertas criados no período selecionado.',                       value: '38',        delta: 'no período',       deltaColor: undefined                              },
  { label: 'Volume sob análise',         tooltip: 'Soma do volume financeiro dos apostadores atualmente em análise.',       value: 'R$ 1,24 mi', delta: '▲ +R$ 180 mil',   deltaColor: 'var(--amber)' as string | undefined },
  { label: 'SLA crítico em risco',        tooltip: 'Alertas críticos sem ação há mais de 20h',                                        value: '3',  delta: '▼ −1,0%',       deltaColor: 'var(--green)'  as string | undefined },
]

// ---------------------------------------------------------------------------
// Dados mock — Aba Regras PLD/AML
// ---------------------------------------------------------------------------
interface PldRule { id: string; grupo: string; nome: string; base: string; flag: string | null; afetados: number; obrigatorio: boolean; severidade: 'P1' | 'P2' | 'P3'; tipo: 'HIPÓTESE' | 'OBRIGATÓRIA'; investigacao: string; params?: string }
const PLD_RULES: PldRule[] = [
  // Estruturação
  { id:'EST-R01', grupo:'Estruturação',               nome:'Fracionamento de Depósitos (Janela)',            base:'art. 25, XI',                           flag:'Estruturação',               afetados:8,  obrigatorio:false, severidade:'P2', tipo:'HIPÓTESE',    investigacao:'INV-MANUAL',            params:'limiar R$ 2.000 · qty_min 3 · janela 24h' },
  { id:'EST-R02', grupo:'Estruturação',               nome:'Smurfing entre Contas Vinculadas',               base:'art. 25, XIII–XIV',                     flag:'Estruturação',               afetados:6,  obrigatorio:false, severidade:'P1', tipo:'HIPÓTESE',    investigacao:'INV-DEEP → INV-COAF',   params:'min_contas 2 · janela 48h' },
  // Saque Atípico
  { id:'SAQ-R01', grupo:'Saque Atípico',              nome:'Pass-Through (dep → aposta simbólica → saque)',  base:'art. 25, XII',                          flag:'Saque atípico',              afetados:9,  obrigatorio:false, severidade:'P1', tipo:'HIPÓTESE',    investigacao:'INV-DEEP → INV-COAF',   params:'pct_aposta ≤ 5% · janela 60 min' },
  { id:'SAQ-R02', grupo:'Saque Atípico',              nome:'Saques Recorrentes de Valor Similar',            base:'art. 25, XII',                          flag:'Saque atípico',              afetados:6,  obrigatorio:false, severidade:'P2', tipo:'HIPÓTESE',    investigacao:'INV-MANUAL',            params:'pct_variação 10% · qty_min 3 · janela 48h' },
  // Depósito Suspeito
  { id:'DEP-R01', grupo:'Depósito Suspeito',          nome:'Volume Incompatível com Perfil Financeiro',      base:'art. 25, IX',                           flag:'Depósito suspeito',          afetados:6,  obrigatorio:false, severidade:'P2', tipo:'HIPÓTESE',    investigacao:'INV-MANUAL',            params:'múltiplo 5× · pct_renda 50%/mês' },
  { id:'DEP-R02', grupo:'Depósito Suspeito',          nome:'Depósito de Jurisdição de Alto Risco (GAFI)',    base:'art. 25, III',                          flag:'Depósito suspeito',          afetados:2,  obrigatorio:false, severidade:'P2', tipo:'OBRIGATÓRIA', investigacao:'INV-DEEP' },
  { id:'DEP-R03', grupo:'Depósito Suspeito',          nome:'Origem Suspeita de Recursos',                    base:'art. 25, VI + art. 25, XIII',           flag:'Depósito suspeito',          afetados:4,  obrigatorio:false, severidade:'P3', tipo:'HIPÓTESE',    investigacao:'INV-MANUAL',            params:'limiar_PJ R$ 500' },
  // Comportamento Inconsistente
  { id:'COM-R01', grupo:'Comportamento Inconsistente', nome:'Conluio / Apostas em Mercados Opostos',         base:'art. 25, XVI',                          flag:'Comportamento inconsistente', afetados:1, obrigatorio:false, severidade:'P1', tipo:'HIPÓTESE',    investigacao:'INV-DEEP → INV-COAF',   params:'delta_odds 10%' },
  { id:'COM-R02', grupo:'Comportamento Inconsistente', nome:'Velocidade Atípica / Automação',                base:'art. 25, X',                            flag:'Comportamento inconsistente', afetados:3, obrigatorio:false, severidade:'P2', tipo:'HIPÓTESE',    investigacao:'INV-MANUAL',            params:'intervalo mín 3s · qty_min 5 · janela 10 min' },
  { id:'COM-R03', grupo:'Comportamento Inconsistente', nome:'Match-Fixing / Manipulação de Resultados',      base:'art. 25, VIII + art. 177 Lei 14.597',   flag:'Comportamento inconsistente', afetados:1, obrigatorio:false, severidade:'P1', tipo:'HIPÓTESE',    investigacao:'INV-DEEP → INV-COAF',   params:'pct_mercado 30% · win_rate_max 80%/30d' },
  { id:'COM-R04', grupo:'Comportamento Inconsistente', nome:'Resistência / Informação Falsa no KYC',         base:'art. 25, IV–V + art. 25, XVIII',        flag:'Comportamento inconsistente', afetados:3, obrigatorio:false, severidade:'P3', tipo:'HIPÓTESE',    investigacao:'INV-MANUAL',            params:'múltiplo_renda 3×' },
  // PEP e Listas
  { id:'PEP-R01', grupo:'PEP e Listas',               nome:'Pessoa Politicamente Exposta (PEP)',             base:'art. 25, XVII + art. 16 §único',        flag:null,                         afetados:11, obrigatorio:false, severidade:'P2', tipo:'OBRIGATÓRIA', investigacao:'Watchlist → INV-MANUAL', params:'aging PEP 5 anos' },
  { id:'SAN-R01', grupo:'PEP e Listas',               nome:'Hit em Lista de Sanções ONU/CSNU',               base:'art. 31',                               flag:null,                         afetados:0,  obrigatorio:true,  severidade:'P1', tipo:'OBRIGATÓRIA', investigacao:'INV-ONU (imediato)' },
  { id:'KYC-R01', grupo:'PEP e Listas',               nome:'Impedido de Apostar (art. 26 Lei 14.790)',       base:'art. 26 Lei 14.790 + art. 15 Portaria', flag:null,                         afetados:1,  obrigatorio:true,  severidade:'P1', tipo:'OBRIGATÓRIA', investigacao:'INV-BLOCK (imediato)' },
]

interface ExtList { id: string; nome: string; base: string; atualizada: string; obrigatorio: boolean }
const EXT_LISTS: ExtList[] = [
  { id:'onu',  nome:'Lista ONU/CSNU',    base:'art. 31',            atualizada:'08/06/2026', obrigatorio:true  },
  { id:'ofac', nome:'OFAC (EUA)',         base:'—',                  atualizada:'07/06/2026', obrigatorio:false },
  { id:'ue',   nome:'Listas UE',          base:'—',                  atualizada:'05/06/2026', obrigatorio:false },
  { id:'fbi',  nome:'FBI Most Wanted',    base:'—',                  atualizada:'—',          obrigatorio:false },
  { id:'spa',  nome:'Impedidos SPA',      base:'art. 26 Lei 14.790', atualizada:'10/06/2026', obrigatorio:true  },
]

const AUDIT_LOG_RULES = [
  { ts:'09/06/2026 · 14:32', user:'Marina Costa', role:'compliance_admin', sinal:'Pass-through',    antes:'janela 10 min · dep/saque ≥ 95%',       depois:'janela 15 min · dep/saque ≥ 90%',       motivo:'Redução de falsos positivos após revisão de 14 casos arquivados',             dryRun:true, impacto:'−2 alertas/dia (estimado)' },
  { ts:'02/06/2026 · 09:15', user:'Carlos Mendes', role:'org_admin',        sinal:'Threshold Crítico', antes:'score ≥ 90',                           depois:'score ≥ 85',                            motivo:'Alinhamento com nova diretriz regulatória SPA junho/2026',                    dryRun:true, impacto:'+3 casos críticos' },
  { ts:'15/05/2026 · 11:48', user:'Marina Costa', role:'compliance_admin', sinal:'Estruturação',    antes:'janela 4h · mín 2 transações',           depois:'janela 6h · mín 3 transações',           motivo:'Janela aumentada para reduzir alarmes de baixo risco durante fins de semana', dryRun:true, impacto:'−5 alertas/semana (estimado)' },
]


function fluxoToRow(f: FluxoPoint): Row {
  const score = f.padrao === 'pass-through' ? 89 : f.padrao === 'saques-recorrentes' ? 74 : 32
  const vinculo = f.contasVinculadas !== '—' ? ' · Vínculos: ' + f.contasVinculadas : ''
  return {
    id: parseInt(f.id.replace('fx-', '')) + 200,
    nome: f.conta, cpf: f.conta, marca: '—',
    flag: f.padrao === 'pass-through'
      ? `Estruturação — IP: ${f.ip}${vinculo}`
      : f.padrao === 'saques-recorrentes'
      ? `Saque atípico — ${f.saquesRepetidos} saques recorrentes${vinculo}`
      : 'Comportamento normal',
    score, sev: score >= 85 ? 'Crítico' : score >= 70 ? 'Alto' : 'Médio',
    sla: '—', slaH: null, slaC: 'm',
    status: 'Aberto', resp: '—', crit: score >= 85,
  }
}


// Fluxo chart: X = volume R$0–500k; Y = % sem jogo 0–100 (viewBox 640×260)
const FX = (v: number) => 70 + (Math.min(v, 500000) / 500000) * 550
const FY = (v: number) => 220 - (v / 100) * 190

// ---------------------------------------------------------------------------
// Token maps
// ---------------------------------------------------------------------------
const SEV: Record<string, StyleToken> = {
  'Crítico': { c: 'var(--red)',   bg: 'var(--red-soft)'   },
  'Alto':    { c: 'var(--amber)', bg: 'var(--amber-soft)' },
  'Médio':   { c: 'var(--atlas-color-status-info)', bg: 'var(--bg)' },
}
const ST: Record<string, StyleToken> = {
  'Aberto':          { c: 'var(--orange)', bg: 'var(--orange-soft)' },
  'Em análise':      { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
  'Comunicado COAF': { c: 'var(--green)',  bg: 'var(--green-soft)'  },
  'Arquivado':       { c: 'var(--muted-text)', bg: 'var(--bg)'      },
}
const DILIG: Record<string, StyleToken> = {
  'pendente':     { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
  'em andamento': { c: 'var(--orange)', bg: 'var(--orange-soft)' },
  'ok':           { c: 'var(--green)',  bg: 'var(--green-soft)'  },
}
const WS: Record<string, StyleToken> = {
  'Em observação': { c: 'var(--ink-2)',     bg: 'var(--bg)'          },
  'Escalado':      { c: 'var(--orange)',    bg: 'var(--orange-soft)' },
  'Removido':      { c: 'var(--muted-text)', bg: 'var(--bg)'         },
}
const WM: Record<string, StyleToken> = {
  'PEP':          { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
  'Reincidência': { c: 'var(--red)',    bg: 'var(--red-soft)'    },
  'Alto volume':  { c: 'var(--amber)',  bg: 'var(--amber-soft)'  },
}

const SCORE_COLOR = (s: number) =>
  s >= 85 ? 'var(--red)' : s >= 70 ? 'var(--amber)' : 'var(--atlas-color-status-info)'

const REDFLAG_CATS = [
  { label: 'Estruturação',               count: 9, color: 'var(--red)'    },
  { label: 'Saque atípico',              count: 7, color: 'var(--orange)' },
  { label: 'Depósito suspeito',          count: 4, color: 'var(--amber)'  },
  { label: 'Comportamento inconsistente', count: 3, color: 'var(--muted-2)' },
] as const

const VOLUME_DATA = [
  { day: 'Sex', v: 1.05 },
  { day: 'Sáb', v: 1.15 },
  { day: 'Dom', v: 0.98 },
  { day: 'Seg', v: 1.28 },
  { day: 'Ter', v: 1.40 },
  { day: 'Qua', v: 1.62 },
  { day: 'Qui', v: 1.85 },
] as const

// ---------------------------------------------------------------------------
// Dados mock — Fluxo financeiro × jogo
// ---------------------------------------------------------------------------
const FLUXO_DATA: FluxoPoint[] = [
  // pass-through: alto volume, quase sem jogo → canto superior direito
  { id: 'fx-1',  conta: '•••.•••.•••-14', volume: 420000, pctSemJogo: 96, padrao: 'pass-through',       saquesRepetidos: 1,  ip: '177.32.xx.xx', contasVinculadas: 'J. COSTA', entradas: 442000, saidas: 418000, jogouV:  17000, rendaMedia: 'R$ 4.200/mês' },
  { id: 'fx-2',  conta: '•••.•••.•••-37', volume: 480000, pctSemJogo: 98, padrao: 'pass-through',       saquesRepetidos: 1,  ip: '200.18.xx.xx', contasVinculadas: '—',        entradas: 492000, saidas: 478000, jogouV:   9000, rendaMedia: 'R$ 3.800/mês' },
  { id: 'fx-3',  conta: '•••.•••.•••-88', volume: 310000, pctSemJogo: 94, padrao: 'pass-through',       saquesRepetidos: 2,  ip: '45.67.xx.xx',  contasVinculadas: 'D. MELO',  entradas: 318000, saidas: 303000, jogouV:  18000, rendaMedia: 'R$ 5.100/mês' },
  // saques-recorrentes: baixo volume individual, muitos saques de valor semelhante → canto superior esquerdo
  { id: 'fx-4',  conta: '•••.•••.•••-52', volume: 65000,  pctSemJogo: 92, padrao: 'saques-recorrentes', saquesRepetidos: 12, ip: '192.0.xx.xx',  contasVinculadas: '—',        entradas:  68000, saidas:  60000, jogouV:   5000, rendaMedia: 'R$ 1.800/mês', valorSaque:  5000 },
  { id: 'fx-5',  conta: '•••.•••.•••-09', volume: 45000,  pctSemJogo: 95, padrao: 'saques-recorrentes', saquesRepetidos: 9,  ip: '10.20.xx.xx',  contasVinculadas: 'F. ROCHA', entradas:  48000, saidas:  43000, jogouV:   2000, rendaMedia: 'R$ 1.500/mês', valorSaque:  4800 },
  { id: 'fx-6',  conta: '•••.•••.•••-73', volume: 80000,  pctSemJogo: 89, padrao: 'saques-recorrentes', saquesRepetidos: 6,  ip: '172.16.xx.xx', contasVinculadas: '—',        entradas:  83000, saidas:  74000, jogouV:   9000, rendaMedia: 'R$ 2.400/mês', valorSaque: 12300 },
  // normais: jogou de forma regular → espalhados na base
  { id: 'fx-7',  conta: '•••.•••.•••-21', volume:  30000, pctSemJogo: 18, padrao: 'normal',             saquesRepetidos: 1,  ip: '—', contasVinculadas: '—', entradas:  32000, saidas:  6000, jogouV:  25000, rendaMedia: 'R$ 3.200/mês' },
  { id: 'fx-8',  conta: '•••.•••.•••-65', volume: 120000, pctSemJogo: 25, padrao: 'normal',             saquesRepetidos: 1,  ip: '—', contasVinculadas: '—', entradas: 125000, saidas: 28000, jogouV:  90000, rendaMedia: 'R$ 8.500/mês' },
  { id: 'fx-9',  conta: '•••.•••.•••-03', volume: 240000, pctSemJogo: 30, padrao: 'normal',             saquesRepetidos: 1,  ip: '—', contasVinculadas: '—', entradas: 252000, saidas: 72000, jogouV: 168000, rendaMedia: 'R$ 22.000/mês' },
  { id: 'fx-10', conta: '•••.•••.•••-47', volume: 170000, pctSemJogo: 12, padrao: 'normal',             saquesRepetidos: 1,  ip: '—', contasVinculadas: '—', entradas: 175000, saidas: 21000, jogouV: 150000, rendaMedia: 'R$ 15.000/mês' },
]
const FLUXO_COLORS: Record<string, string> = {
  'pass-through':       'var(--red)',
  'saques-recorrentes': 'var(--amber)',
  'normal':             'var(--muted-2)',
}

// ---------------------------------------------------------------------------
// Histograma de estruturação (Gráfico 2 — valores recorrentes)
// ---------------------------------------------------------------------------
const HIST_BINS: { id: string; label: string; count: number; peak: boolean; fluxoId?: string }[] = [
  { id: 'h1', label: '≤ 500',    count: 4,  peak: false },
  { id: 'h2', label: '500–1k',   count: 7,  peak: false },
  { id: 'h3', label: '1k–1,5k',  count: 11, peak: false },
  { id: 'h4', label: '1,5–1,8k', count: 16, peak: false },
  { id: 'h5', label: '1,8k–2k',  count: 43, peak: true,  fluxoId: 'fx-4' },
  { id: 'h6', label: '2k–3k',    count: 8,  peak: false },
  { id: 'h7', label: '3k–5k',    count: 5,  peak: false },
  { id: 'h8', label: '5k+',      count: 2,  peak: false, fluxoId: 'fx-6' },
]
// viewBox 0 0 640 260 — mesmo do scatter para altura renderizada igual nos dois cards
const HX_STEP = 71
const HX_BAR  = 66
const HX_L    = 55
const HX_B    = 210
const HX_T    = 22
const HX_MAX  = 47
const HBX = (i: number) => HX_L + i * HX_STEP + 2.5
const HBY = (cnt: number) => HX_B - Math.round((cnt / HX_MAX) * (HX_B - HX_T))
const H_THRESH_X = Math.round(HBX(4) + HX_BAR + 2)  // ≈ 410 — início da zona acima do limiar

const WATCH_DATA: WatchRow[] = [
  { id: 101, nome: 'J. COSTA',    cpf: '•••.•••.•••-14', score: 93, classe: 'Alto',  motivo: 'PEP',          marca: 'vaidebet',     ultima: 'há 1h',  status: 'Em observação' },
  { id: 102, nome: 'R. FERREIRA', cpf: '•••.•••.•••-37', score: 92, classe: 'Alto',  motivo: 'Reincidência', marca: 'vaidebet-ngx', ultima: 'há 3h',  status: 'Escalado'      },
  { id: 103, nome: 'G. NUNES',    cpf: '•••.•••.•••-88', score: 82, classe: 'Alto',  motivo: 'PEP',          marca: 'kto',          ultima: 'há 6h',  status: 'Em observação' },
  { id: 104, nome: 'L. ALMEIDA',  cpf: '•••.•••.•••-52', score: 71, classe: 'Médio', motivo: 'PEP',          marca: 'vaidebet',     ultima: 'há 1d',  status: 'Em observação' },
  { id: 105, nome: 'C. ROCHA',    cpf: '•••.•••.•••-09', score: 64, classe: 'Médio', motivo: 'Alto volume',  marca: 'betnacional',  ultima: 'há 2d',  status: 'Em observação' },
  { id: 106, nome: 'M. DIAS',     cpf: '•••.•••.•••-73', score: 58, classe: 'Médio', motivo: 'Reincidência', marca: 'vaidebet',     ultima: 'há 3d',  status: 'Em observação' },
  { id: 107, nome: 'T. ALVES',    cpf: '•••.•••.•••-21', score: 45, classe: 'Baixo', motivo: 'Alto volume',  marca: 'betano',       ultima: 'há 8d',  status: 'Removido'      },
]

const WATCH_STATUS_F = ['Todos', 'Em observação', 'Escalado', 'Removido']
const WATCH_MOTIVO_F = ['Todos', 'PEP', 'Reincidência', 'Alto volume']

const FILTERS  = ['Todos', 'Aberto', 'Em análise', 'Crítico', 'Estruturação', 'vaidebet']
const PERIODOS = ['Hoje', 'Ontem', '7 dias', '15 dias', 'MTD', 'Trimestre']
const ABAS     = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'alertas',     label: 'Alertas'     },
  { id: 'watchlist',   label: 'Watchlist'   },
  { id: 'regras',      label: 'Regras'      },
] as const
type AbaId = typeof ABAS[number]['id']

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------
function Pill({ c, bg, children }: { c: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap', color: c, background: bg }}>
      {children}
    </span>
  )
}

function Sech({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--muted-text)', margin: '26px 0 11px', ...style }}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Red Flags Donut
// ---------------------------------------------------------------------------
function RedFlagsDonut() {
  const total = REDFLAG_CATS.reduce((s, c) => s + c.count, 0)
  const R = 54, CX = 64, CY = 64, GAP = 2.5
  const C = 2 * Math.PI * R

  let accumulated = 0
  const segments = REDFLAG_CATS.map(cat => {
    const arcLen      = (cat.count / total) * C - GAP
    const dashOffset  = -accumulated
    accumulated      += (cat.count / total) * C
    return { ...cat, arcLen: Math.max(0, arcLen), dashOffset, pct: Math.round(cat.count / total * 100) }
  })

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '20px 24px 14px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
      {/* Cabeçalho */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--muted-text)', fontFamily: 'var(--font-body)', lineHeight: 1, marginBottom: 16 }}>
        Red flags por categoria
      </div>
      {/* Corpo: donut + legenda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
        {/* Anel SVG */}
        <div style={{ flexShrink: 0, position: 'relative', width: 128, height: 128 }}>
          <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
            {/* trilha cinza */}
            <circle cx={CX} cy={CY} r={R} fill="none" strokeWidth={20} style={{ stroke: 'var(--line)' }} />
            {/* segmentos */}
            {segments.map(seg => (
              <circle key={seg.label}
                cx={CX} cy={CY} r={R}
                fill="none"
                strokeWidth={20}
                strokeLinecap="butt"
                strokeDasharray={`${seg.arcLen} ${C}`}
                strokeDashoffset={seg.dashOffset}
                transform={`rotate(-90 ${CX} ${CY})`}
                style={{ stroke: seg.color }}
              />
            ))}
          </svg>
          {/* total no centro */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)', lineHeight: 1 }}>{total}</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted-text)', marginTop: 3, fontFamily: 'var(--font-body)' }}>ativos</span>
          </div>
        </div>
        {/* Legenda */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {segments.map(seg => (
            <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)', fontFamily: 'var(--font-body)', lineHeight: 1.3 }}>{seg.label}</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)', marginLeft: 6 }}>{seg.count}</span>
              <span style={{ fontSize: 12, color: 'var(--muted-text)', width: 38, textAlign: 'right', fontFamily: 'var(--font-body)' }}>{seg.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal COAF / Arquivar
// ---------------------------------------------------------------------------
function Modal({ type, justificativa, setJustificativa, onConfirm, onClose }: {
  type: 'coaf' | 'arquivar'
  justificativa: string
  setJustificativa: (v: string) => void
  onConfirm: () => void
  onClose: () => void
}) {
  const isCoaf = type === 'coaf'
  const valid  = isCoaf || justificativa.trim().length >= 50
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,31,.45)', display: 'grid', placeItems: 'center', zIndex: 200, padding: 20 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', width: 480, maxWidth: '100%', padding: '24px 26px', boxShadow: '0 16px 48px rgba(16,24,40,.22)' }}>
        <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)', marginBottom: 10 }}>
          {isCoaf ? '→ Escalar para COAF' : 'Arquivar caso'}
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--muted-text)', lineHeight: 1.6 }}>
          {isCoaf
            ? 'Confirma a comunicação ao COAF? Registrado em trilha auditável e irreversível. O RO será gerado sem mascaramento de CPF/nome (Lei 9.613, art. 11).'
            : 'Justificativa obrigatória (mín. 50 caracteres). Registrada em trilha auditável.'}
        </p>
        {!isCoaf && (
          <>
            <textarea value={justificativa} onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva o motivo do arquivamento..." rows={4}
              style={{ width: '100%', resize: 'vertical', borderRadius: 10, border: '1px solid var(--line)', padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box', color: 'var(--ink)' }} />
            <div style={{ fontSize: 11, color: justificativa.trim().length >= 50 ? 'var(--green)' : 'var(--muted-text)', marginTop: 5 }}>
              {justificativa.trim().length}/50 caracteres mínimos
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button disabled={!valid} onClick={valid ? onConfirm : undefined}
            className={valid ? 'btn-primary' : undefined}
            style={!valid ? { padding: '9px 18px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13, background: 'var(--line)', color: 'var(--muted-text)', cursor: 'not-allowed' }
                          : { background: isCoaf ? 'var(--orange)' : 'var(--red)' }}>
            {isCoaf ? 'Confirmar → COAF' : 'Arquivar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Drawer de investigação — painel lateral único e adaptativo
// ---------------------------------------------------------------------------
function DrawerPanel({ row, rowStatus, onUpdateStatus, onClose }: {
  row: Row
  rowStatus: Record<number, string>
  onUpdateStatus: (id: number, newStatus: string) => void
  onClose: () => void
}) {
  const router = useRouter()
  const [modal, setModal] = useState<'coaf' | 'arquivar' | null>(null)
  const [justif, setJustif] = useState('')
  const d       = DRAWER_DATA[row.id] ?? { timeline: [], factors: [], vinculos: [] }
  const status  = rowStatus[row.id] || row.status
  const sc      = SCORE_COLOR(row.score)
  const fluxo   = FLUXO_DATA.find(f => parseInt(f.id.replace('fx-', '')) + 200 === row.id)
  const analise = ANALISE_DATA[row.id] ?? null

  function confirm() {
    if (modal === 'coaf')     onUpdateStatus(row.id, 'Comunicado COAF')
    if (modal === 'arquivar') onUpdateStatus(row.id, 'Arquivado')
    setModal(null); setJustif('')
  }

  // Adapter: timeline → Transacoes dados
  const transacoesDados = {
    periodo: `caso #${row.id}`,
    rodape: d.timeline[0]?.ts ?? '—',
    abas: [{
      id: 'registros', label: 'Registros', tipo: 'fin' as const,
      itens: d.timeline.map((t, i) => ({
        tipo: /dep/i.test(t.desc) ? 'Depósito' : 'Saque',
        data: t.ts, status: 'Registrado',
        marca: row.marca === '—' ? '—' : row.marca,
        id: `tx-${row.id}-${i}`,
        valor: t.desc.match(/R\$\s?[\d.,]+/)?.[0] ?? '—',
        tempo: '—',
      })),
    }],
  }

  // Adapter: factors[] → ScoreFactors dados
  const scoreFactoresDados = {
    fatores: d.factors.map((f, i) => ({ nome: f, pts: Math.max(8, 45 - i * 9) })),
  }

  // Adapter: fluxo entradas/saidas → CashflowStacked dados (6 dias)
  const DEP_P = [0.18, 0.22, 0.15, 0.28, 0.12, 0.05]
  const SAQ_P = [0.12, 0.08, 0.20, 0.25, 0.35, 0.00]
  const DAYS  = ['04/06', '05/06', '06/06', '07/06', '08/06', '09/06']
  const cashflowDados = fluxo ? {
    linhas: DAYS.map((dia, i) => ({
      dia,
      dep: Math.round(fluxo.entradas * DEP_P[i]),
      saq: Math.round(fluxo.saidas   * SAQ_P[i]),
    })),
    series: [{ chave: 'dep', nome: 'Entradas' }, { chave: 'saq', nome: 'Saídas' }],
  } : null

  const SecLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--muted-text)', margin: '20px 0 8px', fontFamily: 'var(--font-body)' }}>
      {children}
    </div>
  )

  return (
    <>
      {/* Ver perfil completo — sempre visível no topo */}
      <div style={{ padding: '10px 20px 0', flexShrink: 0 }}>
        <button
          onClick={() => { router.push(`/perfil-apostador?id=${row.id}`); onClose() }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--orange-soft)', color: 'var(--orange)', border: '1px solid var(--orange-line)', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <span>Ver perfil completo</span>
          <span>→</span>
        </button>
      </div>

      {/* Cabeçalho */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>{row.nome}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--orange)', background: 'var(--orange-soft)', padding: '3px 9px', borderRadius: 7, whiteSpace: 'nowrap' }}>{row.marca}</span>
              <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: sc }}>{row.score}</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--muted-text)', marginTop: 5, fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>
              {row.cpf} · {row.sev} · SLA {row.sla}
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar"
            style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 13, color: 'var(--muted-text)', fontFamily: 'var(--font-body)' }}>
            ✕
          </button>
        </div>
      </div>

      {/* Corpo — rolável */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>

        {/* Motivo do alerta */}
        <SecLabel>Motivo do alerta</SecLabel>
        <div style={{ fontSize: 12.5, background: 'var(--red-soft)', color: 'var(--red)', border: '1px solid var(--red-soft)', borderRadius: 9, padding: '9px 12px', lineHeight: 1.5, fontWeight: 600 }}>
          {row.flag}
        </div>

        {/* Fluxo financeiro — CashflowStacked (só para contas do scatter fluxo) */}
        {/* flex+height no wrapper → ResponsiveContainer height="100%" mede corretamente */}
        {fluxo && cashflowDados && (
          <>
            <SecLabel>Fluxo financeiro</SecLabel>
            <div style={{ height: 180, display: 'flex', flexDirection: 'column' }}>
              <CashflowStacked dados={cashflowDados} />
            </div>
          </>
        )}

        {/* Cenário / padrão específico — FluxoScenarioView (mantido) */}
        {fluxo && (
          <>
            <SecLabel>Cenário detectado</SecLabel>
            <FluxoScenarioView f={fluxo} />
          </>
        )}

        {/* Timeline de transações — Transacoes (sem altura fixa, cresce com conteúdo) */}
        <SecLabel>Timeline de transações</SecLabel>
        <Transacoes dados={transacoesDados} />

        {/* Score factors — ScoreFactors (sem altura fixa, barras de divs crescem com conteúdo) */}
        {row.score >= 70 && d.factors.length > 0 && (
          <>
            <SecLabel>Score factors (≥ 70 · obrigatório)</SecLabel>
            <ScoreFactors dados={scoreFactoresDados} />
          </>
        )}

        {/* Vínculos — AnaliseRiscos (SVG viewBox escala, sem altura fixa) */}
        {analise && (
          <>
            <SecLabel>Vínculos</SecLabel>
            <AnaliseRiscos dados={analise} />
          </>
        )}

        {/* Decisão */}
        <SecLabel>Decisão</SecLabel>
        <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.6 }}>
          Status: <b>{status}</b>
          {status === 'Aberto' && (
            <div style={{ color: 'var(--muted-text)', marginTop: 4, fontSize: 12 }}>
              → Inicie a análise para habilitar a comunicação ao COAF.
            </div>
          )}
        </div>
      </div>

      {/* Rodapé com ações */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', flexShrink: 0, background: 'var(--bg)' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {status === 'Aberto' && (
            <button className="btn-primary" onClick={() => onUpdateStatus(row.id, 'Em análise')}>Iniciar análise</button>
          )}
          {status === 'Em análise' && (
            <button className="btn-ghost" onClick={() => setModal('coaf')}>→ COAF</button>
          )}
          {(status === 'Aberto' || status === 'Em análise') && (
            <button className="btn-ghost" style={{ color: 'var(--red)', borderColor: 'var(--red-soft)' }} onClick={() => setModal('arquivar')}>
              Arquivar
            </button>
          )}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--muted-text)', lineHeight: 1.6 }}>
          ⚷ Ações registradas em trilha auditável — autor + timestamp, imutável (art. 32)
        </div>
      </div>

      {modal && (
        <Modal type={modal} justificativa={justif} setJustificativa={setJustif} onConfirm={confirm}
          onClose={() => { setModal(null); setJustif('') }} />
      )}
    </>
  )
}


// ---------------------------------------------------------------------------
// Fluxo financeiro × jogo — scatter landscape
// ---------------------------------------------------------------------------
const FX_LABELS = [
  { v: 0,      label: 'R$0'    },
  { v: 100000, label: 'R$100k' },
  { v: 200000, label: 'R$200k' },
  { v: 300000, label: 'R$300k' },
  { v: 400000, label: 'R$400k' },
  { v: 500000, label: 'R$500k+' },
]

// Variações determinísticas para simular saques de valor semelhante (sem Math.random)
const SAQUE_VARS = [0, 0.012, -0.008, 0.005, -0.014, 0.009, 0.002, -0.011, 0.018, -0.005, 0.007, -0.016]

function fmtK(v: number) {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`
  if (v >= 1000)    return `R$ ${(v / 1000).toFixed(0)}k`
  return `R$ ${v}`
}

function FluxoScenarioView({ f }: { f: FluxoPoint }) {
  if (f.padrao === 'pass-through') {
    const apostPct = Math.round((f.jogouV / f.entradas) * 100)
    const saidaPct = Math.round((f.saidas  / f.entradas) * 100)
    return (
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Fluxo de dinheiro</div>
        {([
          { label: 'Entradas', v: f.entradas, pct: 100,      col: 'var(--green)' },
          { label: 'Apostado', v: f.jogouV,   pct: apostPct, col: 'var(--amber)' },
          { label: 'Saídas',   v: f.saidas,   pct: saidaPct, col: 'var(--red)'   },
        ] as const).map(({ label, v, pct, col }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 54, fontSize: 11, color: 'var(--muted-text)', textAlign: 'right', flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, height: 8, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink)', width: 52, flexShrink: 0, textAlign: 'right' }}>{fmtK(v)}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--red)', fontWeight: 700 }}>
          ⚠ {100 - apostPct}% do valor não foi apostado — padrão pass-through
        </div>
      </div>
    )
  }

  if (f.padrao === 'saques-recorrentes') {
    const base    = f.valorSaque ?? 0
    const amounts = Array.from({ length: f.saquesRepetidos }, (_, i) =>
      Math.round(base * (1 + SAQUE_VARS[i % SAQUE_VARS.length])))
    const maxA    = Math.max(...amounts)
    const minA    = Math.min(...amounts)
    return (
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>
          {f.saquesRepetidos} saques identificados
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
          {amounts.map((v, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 7,
              background: 'var(--amber-soft)', color: 'var(--amber)' }}>
              {fmtK(v)}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted-text)', marginBottom: 4 }}>
          Valor médio {fmtK(base)} · variação ≤ {fmtK(maxA - minA)}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--amber)', fontWeight: 700 }}>
          ⚠ Valores similares — padrão de fracionamento
        </div>
      </div>
    )
  }

  const jogouPct = Math.round((f.jogouV / f.volume) * 100)
  const saidoPct = 100 - jogouPct
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Distribuição do volume</div>
      {([
        { label: 'Apostou', v: f.jogouV, pct: jogouPct, col: 'var(--green)'   },
        { label: 'Sacado',  v: f.saidas, pct: saidoPct, col: 'var(--muted-2)' },
      ] as const).map(({ label, v, pct, col }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 50, fontSize: 11, color: 'var(--muted-text)', textAlign: 'right', flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, height: 8, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink)', width: 52, flexShrink: 0, textAlign: 'right' }}>{fmtK(v)}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--green)', fontWeight: 700 }}>
        ✓ Perfil regular — apostas representam a maior parte do fluxo
      </div>
    </div>
  )
}

function FluxoFinanceiro({ onInvestigate }: { onInvestigate: (row: Row) => void }) {
  const [selFx,  setSelFx]  = useState<FluxoPoint | null>(null)
  const [selBin, setSelBin] = useState<string | null>(null)

  const ptCount  = FLUXO_DATA.filter(f => f.padrao === 'pass-through').length
  const ptVol    = FLUXO_DATA.filter(f => f.padrao === 'pass-through').reduce((s, f) => s + f.volume, 0)
  const nrmCount = FLUXO_DATA.filter(f => f.padrao === 'normal').length
  const srCount  = FLUXO_DATA.filter(f => f.padrao === 'saques-recorrentes').length
  const peakBin  = HIST_BINS.find(b => b.peak)!

  const cardS = {
    background: 'var(--card)', border: '1px solid var(--line)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
    padding: '14px 16px',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

      {/* ── Card 1: Scatter "Entra e sai sem jogar" ── */}
      <div style={cardS}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
            Entra e sai sem jogar
          </h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {([['var(--red)', 'Pass-through'], ['var(--muted-2)', 'Normal']] as const).map(([cor, label]) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--ink-2)' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: cor, flexShrink: 0 }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 640 260" width="100%" style={{ display: 'block', overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">
          <rect x={70} y={FY(100)} width={550} height={FY(75) - FY(100)} fill="var(--amber-soft)" opacity={0.6} />
          <line x1={70} y1={220} x2={620} y2={220} style={{ stroke: 'var(--line)' }} strokeWidth={1} />
          <line x1={70} y1={30}  x2={70}  y2={220} style={{ stroke: 'var(--line)' }} strokeWidth={1} />
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={68} y1={FY(v)} x2={620} y2={FY(v)}
                style={{ stroke: v === 0 ? 'none' : 'var(--line)' }}
                strokeWidth={1} strokeDasharray={v > 0 ? '4 3' : undefined} />
              <text x={63} y={FY(v) + 3} fontSize={8} style={{ fill: 'var(--muted-text)' }} textAnchor="end">{v}%</text>
            </g>
          ))}
          {FX_LABELS.map(({ v, label }) => (
            <g key={v}>
              <line x1={FX(v)} y1={30} x2={FX(v)} y2={222}
                style={{ stroke: 'var(--line)' }} strokeWidth={1} strokeDasharray={v > 0 ? '4 3' : undefined} />
              <text x={FX(v)} y={234} fontSize={8} style={{ fill: 'var(--muted-text)' }} textAnchor="middle">{label}</text>
            </g>
          ))}
          <text x={345} y={250} fontSize={9.5} style={{ fill: 'var(--muted-text)' }} textAnchor="middle">→ volume movimentado (R$)</text>
          <text x={16}  y={128} fontSize={9.5} style={{ fill: 'var(--muted-text)' }} textAnchor="middle" transform="rotate(-90,16,128)">% sem jogo ↑</text>
          <text x={490} y={FY(100) + 12} fontSize={8.5} style={{ fill: 'var(--red)' }} fontWeight={700} textAnchor="middle">entra e sai sem jogar</text>
          {/* Bolhas — somente pass-through + normal */}
          {FLUXO_DATA.filter(f => f.padrao !== 'saques-recorrentes').map((f) => {
            const isSel  = selFx?.id === f.id
            const col    = FLUXO_COLORS[f.padrao]
            const rFinal = isSel ? 11 : 8
            return (
              <g key={f.id} style={{ cursor: 'pointer' }}
                onClick={() => { setSelFx(f); onInvestigate(fluxoToRow(f)) }}>
                <circle cx={FX(f.volume)} cy={FY(f.pctSemJogo)} r={rFinal + 5} fill="transparent" />
                <circle cx={FX(f.volume)} cy={FY(f.pctSemJogo)} r={rFinal}
                  style={{ fill: col, stroke: isSel ? 'var(--ink)' : 'none' }}
                  fillOpacity={isSel ? 1 : 0.75} strokeWidth={2} />
                {isSel && (
                  <text x={FX(f.volume)} y={FY(f.pctSemJogo) - 16} fontSize={8.5}
                    style={{ fill: 'var(--ink)' }} fontWeight={700} textAnchor="middle">{f.conta}</text>
                )}
              </g>
            )
          })}
        </svg>

        <div style={{ display: 'flex', marginTop: 12, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          {[
            { col: 'var(--red)',     label: 'Pass-through', detail: `${ptCount} contas · R$ ${(ptVol / 1000000).toFixed(1)}M · ~3% jogado` },
            { col: 'var(--muted-2)', label: 'Normal',       detail: `${nrmCount} contas — sem anomalia` },
          ].map(({ col, label, detail }, i) => (
            <div key={label} style={{ flex: 1, padding: '0 14px', borderLeft: i === 0 ? 'none' : '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink)' }}>{label}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>{detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card 2: Histograma "Valores recorrentes · estruturação" ── */}
      <div style={cardS}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>
            Valores recorrentes · estruturação
          </h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--ink-2)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
              Pico anômalo
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--ink-2)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--muted-2)', flexShrink: 0 }} />
              Distribuição
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--ink-2)' }}>
              <span style={{ width: 14, height: 2, background: 'var(--amber)', flexShrink: 0 }} />
              Limiar COAF
            </span>
          </div>
        </div>

        <svg viewBox="0 0 640 260" width="100%" style={{ display: 'block', overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">
          {/* Eixos */}
          <line x1={HX_L} y1={HX_T - 5} x2={HX_L} y2={HX_B + 5} style={{ stroke: 'var(--line)' }} strokeWidth={1} />
          <line x1={HX_L} y1={HX_B} x2={630} y2={HX_B} style={{ stroke: 'var(--line)' }} strokeWidth={1} />
          {/* Grade Y */}
          {[0, 10, 20, 30, 40].map((v) => (
            <g key={v}>
              <line x1={HX_L - 2} y1={HBY(v)} x2={630} y2={HBY(v)}
                style={{ stroke: v === 0 ? 'none' : 'var(--line)' }}
                strokeWidth={1} strokeDasharray={v > 0 ? '4 3' : undefined} />
              <text x={HX_L - 5} y={HBY(v) + 3} fontSize={8} style={{ fill: 'var(--muted-text)' }} textAnchor="end">{v}</text>
            </g>
          ))}
          {/* Barras */}
          {HIST_BINS.map((bin, i) => {
            const bx   = HBX(i)
            const by   = HBY(bin.count)
            const barH = HX_B - by
            const col  = bin.peak ? 'var(--red)' : 'var(--muted-2)'
            return (
              <g key={bin.id}
                style={{ cursor: bin.fluxoId ? 'pointer' : 'default' }}
                onClick={() => {
                  if (!bin.fluxoId) return
                  const fp = FLUXO_DATA.find(f => f.id === bin.fluxoId)
                  if (fp) { setSelBin(bin.id); onInvestigate(fluxoToRow(fp)) }
                }}>
                <rect x={bx} y={by} width={HX_BAR} height={barH}
                  style={{ fill: col }}
                  fillOpacity={bin.peak ? (selBin === bin.id ? 1 : 0.85) : 0.5}
                  rx={2} />
                {bin.peak && (
                  <text x={bx + HX_BAR / 2} y={by - 5} fontSize={10} style={{ fill: 'var(--red)' }} fontWeight={800} textAnchor="middle">
                    {bin.count}
                  </text>
                )}
                <text x={bx + HX_BAR / 2} y={HX_B + 16} fontSize={7.5}
                  style={{ fill: bin.peak ? 'var(--ink)' : 'var(--muted-text)' }}
                  fontWeight={bin.peak ? 700 : 400} textAnchor="middle">{bin.label}</text>
              </g>
            )
          })}
          {/* Linha do limiar R$ 2.000 */}
          <line x1={H_THRESH_X} y1={HX_T - 5} x2={H_THRESH_X} y2={HX_B + 5}
            style={{ stroke: 'var(--amber)' }} strokeWidth={1.5} strokeDasharray="5 3" />
          <text x={H_THRESH_X - 6} y={HX_T + 8} fontSize={9} style={{ fill: 'var(--amber)' }} fontWeight={700} textAnchor="end">
            limiar R$ 2.000
          </text>
          {/* Labels dos eixos */}
          <text x={345} y={250} fontSize={9.5} style={{ fill: 'var(--muted-text)' }} textAnchor="middle">→ faixa de valor (R$)</text>
          <text x={16} y={116} fontSize={9.5} style={{ fill: 'var(--muted-text)' }} textAnchor="middle" transform="rotate(-90,16,116)">nº transações ↑</text>
        </svg>

        <div style={{ display: 'flex', marginTop: 12, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          {[
            { col: 'var(--red)',   label: 'Pico anômalo',          detail: `${peakBin.count} saques · ${srCount} contas · R$ 1.800–2.000` },
            { col: 'var(--amber)', label: 'Abaixo do limiar COAF', detail: 'fracionamento estruturado — evita comunicação obrigatória' },
          ].map(({ col, label, detail }, i) => (
            <div key={label} style={{ flex: 1, padding: '0 14px', borderLeft: i === 0 ? 'none' : '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink)' }}>{label}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted-text)' }}>{detail}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ---------------------------------------------------------------------------
// Aba Regras
// ---------------------------------------------------------------------------
function RegraTab() {
  type ThState = { critico: number; alto: number; medio: number; slaC: number; slaA: number; slaM: number; factorsMin: number; notifAfter: number }
  type WState  = { estruturacao: number; passThrough: number; perfil: number; vinculos: number; velocidade: number; jurisdicao: number }

  const [toggles,  setToggles]  = useState<Record<string,boolean>>(() => Object.fromEntries(PLD_RULES.map(r => [r.id, true])) as Record<string,boolean>)
  const [listTgls, setListTgls] = useState<Record<string,boolean>>(() => Object.fromEntries(EXT_LISTS.map(l => [l.id, true])) as Record<string,boolean>)
  const [thresholds, setThresholds] = useState<ThState>({ critico:85, alto:70, medio:50, slaC:24, slaA:72, slaM:30, factorsMin:70, notifAfter:20 })
  const [weights,    setWeights]    = useState<WState> ({ estruturacao:35, passThrough:25, perfil:15, vinculos:12, velocidade:8, jurisdicao:5 })
  const [isDryRun, setIsDryRun] = useState(false)
  const [pending,  setPending]  = useState(false)
  const [showLog,  setShowLog]  = useState(false)

  const setTh = (k: keyof ThState, v: number) => { setThresholds(p => ({...p, [k]: v})); setPending(true) }
  const setW  = (k: keyof WState,  v: number) => { setWeights(p =>    ({...p, [k]: v})); setPending(true) }
  const totalW = Object.values(weights).reduce((s, v) => s + v, 0)
  const ruleGroups = Array.from(new Set(PLD_RULES.map(r => r.grupo)))

  const cardS = {
    background:'var(--card)', border:'1px solid var(--line)',
    borderRadius:'var(--radius)', boxShadow:'var(--shadow-card)',
    padding:'16px 18px', marginBottom:12,
  }

  const Tog = ({ on, disabled, onToggle }: { on: boolean; disabled?: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} disabled={disabled}
      title={disabled ? 'Obrigatório por norma — não pode ser desativado' : undefined}
      style={{ width:34, height:20, borderRadius:999, border:'none', cursor:disabled?'default':'pointer', padding:0, flexShrink:0,
        background:on?'var(--green)':'var(--line)', position:'relative', opacity:disabled?0.55:1 }}>
      <span style={{ display:'block', width:14, height:14, borderRadius:'50%', background:'#fff',
        position:'absolute', top:3, left:on?17:3 }} />
    </button>
  )

  const RuleRow = ({ rule }: { rule: PldRule }) => {
    const on = toggles[rule.id] ?? true
    const sevStyle = {
      P1: { c: 'var(--red)',     bg: 'var(--red-soft)'   },
      P2: { c: 'var(--amber)',   bg: 'var(--amber-soft)'  },
      P3: { c: 'var(--muted-2)', bg: 'var(--bg)'          },
    }
    const { c: sevC, bg: sevBg } = sevStyle[rule.severidade]
    return (
      <div style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 0', borderBottom:'1px solid var(--line)' }}>
        <Tog on={on} disabled={rule.obrigatorio}
          onToggle={() => { if (!rule.obrigatorio) { setToggles(p => ({...p, [rule.id]: !p[rule.id]})); setPending(true) } }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:10.5, fontFamily:'var(--font-mono)', color:'var(--muted-text)', fontWeight:500 }}>{rule.id}</span>
            {rule.nome}
            {rule.obrigatorio && <span style={{ fontSize:10, fontWeight:700, color:'#fff', background:'var(--orange)', borderRadius:999, padding:'1px 7px' }}>Obrigatório</span>}
            {!rule.obrigatorio && rule.tipo === 'OBRIGATÓRIA' && <span style={{ fontSize:10, fontWeight:700, color:'var(--orange)', background:'var(--orange-soft)', borderRadius:999, padding:'1px 7px' }}>Obrigatória</span>}
          </div>
          <div style={{ display:'flex', gap:8, marginTop:3, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:10.5, fontWeight:700, color:sevC, background:sevBg, borderRadius:999, padding:'1px 8px' }}>{rule.severidade}</span>
            <span style={{ fontSize:11, color:'var(--muted-text)' }}>{rule.base}</span>
            {rule.flag && <span style={{ fontSize:10.5, fontWeight:700, color:'var(--amber)', background:'var(--amber-soft)', borderRadius:999, padding:'1px 8px' }}>Flag: {rule.flag}</span>}
            <span style={{ fontSize:11, color:'var(--ink-2)' }}>Afetados hoje: <strong>{rule.afetados}</strong></span>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:3, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:10.5, color:'var(--ink-2)', background:'var(--bg)', borderRadius:6, padding:'1px 8px', border:'1px solid var(--line)' }}>→ {rule.investigacao}</span>
            {rule.params && <span style={{ fontSize:10.5, color:'var(--muted-text)', background:'var(--bg)', borderRadius:6, padding:'1px 8px', border:'1px solid var(--line)' }}>{rule.params}</span>}
          </div>
        </div>
      </div>
    )
  }

  const thRows = [
    { label:'Crítico', sk:'critico' as keyof ThState, slk:'slaC' as keyof ThState, slaUnit:'h' },
    { label:'Alto',    sk:'alto'    as keyof ThState, slk:'slaA' as keyof ThState, slaUnit:'h' },
    { label:'Médio',   sk:'medio'   as keyof ThState, slk:'slaM' as keyof ThState, slaUnit:'d', nota:'art. 26 §2' },
    { label:'Baixo',   sk:undefined as (keyof ThState | undefined), slk:undefined as (keyof ThState | undefined), nota:'monitoramento passivo' },
  ]

  const wRows: [string, keyof WState][] = [
    ['Estruturação / smurfing',       'estruturacao'],
    ['Pass-through',                   'passThrough' ],
    ['Desvio de perfil',               'perfil'      ],
    ['Vínculos / IP compartilhado',   'vinculos'    ],
    ['Automação / velocidade',         'velocidade'  ],
    ['Jurisdição de risco',            'jurisdicao'  ],
  ]

  return (
    <div style={{ position:'relative', paddingBottom: pending ? 140 : 0 }}>

      {/* Cabeçalho */}
      <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:20 }}>
        <button onClick={() => setIsDryRun(d => !d)}
          style={{ fontSize:11.5, fontWeight:800, letterSpacing:'.5px', padding:'5px 14px', borderRadius:999,
            border:'none', cursor:'pointer', background:isDryRun?'var(--line)':'var(--orange)', color:isDryRun?'var(--ink-2)':'#fff' }}>
          {isDryRun ? 'DRY-RUN' : 'PRODUÇÃO'}
        </button>
        <span style={{ fontSize:12, color:'var(--muted-text)' }}>Última alteração: por Marina Costa · 09/06/2026 14:32</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={() => setShowLog(true)}
            style={{ fontSize:12, fontWeight:700, color:'var(--ink-2)', background:'var(--card)', border:'1px solid var(--line)', borderRadius:10, padding:'6px 14px', cursor:'pointer' }}>
            Ver histórico
          </button>
          <button onClick={() => alert('Exportação disponível em produção')}
            style={{ fontSize:12, fontWeight:700, color:'var(--ink-2)', background:'var(--card)', border:'1px solid var(--line)', borderRadius:10, padding:'6px 14px', cursor:'pointer' }}>
            Exportar configuração
          </button>
        </div>
      </div>

      {/* A — Sinais de Risco */}
      <Sech>A — Sinais de Risco</Sech>
      {ruleGroups.map(g => (
        <div key={g} style={cardS}>
          <div style={{ fontSize:11.5, fontWeight:800, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:2 }}>{g}</div>
          {PLD_RULES.filter(r => r.grupo === g).map(r => <RuleRow key={r.id} rule={r} />)}
        </div>
      ))}

      {/* B — Thresholds */}
      <Sech>B — Thresholds de Severidade e SLA</Sech>
      <div style={cardS}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {(['Severidade','Score PLD ≥','SLA'] as const).map(h => (
                <th key={h} style={{ textAlign:'left', fontSize:11, fontWeight:700, color:'var(--muted-text)', paddingBottom:8, paddingRight:16 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {thRows.map(row => (
              <tr key={row.label}>
                <td style={{ fontSize:13, fontWeight:600, color:'var(--ink)', padding:'8px 16px 8px 0' }}>{row.label}</td>
                <td style={{ padding:'8px 16px 8px 0' }}>
                  {row.sk
                    ? <input type="number" value={thresholds[row.sk]} min={1} max={100}
                        onChange={e => setTh(row.sk!, Number(e.target.value))}
                        style={{ width:60, fontFamily:'var(--font-mono)', fontSize:13, border:'1px solid var(--line)', borderRadius:8, padding:'3px 8px', textAlign:'right' }} />
                    : <span style={{ fontSize:12, color:'var(--muted-text)' }}>{'< 50'}</span>}
                </td>
                <td style={{ padding:'8px 0' }}>
                  {row.slk
                    ? <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <input type="number" value={thresholds[row.slk]} min={1}
                          onChange={e => setTh(row.slk!, Number(e.target.value))}
                          style={{ width:60, fontFamily:'var(--font-mono)', fontSize:13, border:'1px solid var(--line)', borderRadius:8, padding:'3px 8px', textAlign:'right' }} />
                        <span style={{ fontSize:12, color:'var(--muted-text)' }}>{row.slaUnit}</span>
                      </span>
                    : <span style={{ fontSize:12, color:'var(--muted-text)' }}>{row.nota}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop:12, display:'flex', gap:16, flexWrap:'wrap', alignItems:'center', fontSize:12, color:'var(--ink-2)' }}>
          <span>
            Score factors obrigatório quando ≥{' '}
            <input type="number" value={thresholds.factorsMin} min={1} max={100}
              onChange={e => setTh('factorsMin', Number(e.target.value))}
              style={{ width:52, fontFamily:'var(--font-mono)', fontSize:12, border:'1px solid var(--line)', borderRadius:6, padding:'2px 6px' }} />
          </span>
          <span>
            Notif. ao Diretor quando crítico sem ação &gt;{' '}
            <input type="number" value={thresholds.notifAfter} min={1}
              onChange={e => setTh('notifAfter', Number(e.target.value))}
              style={{ width:52, fontFamily:'var(--font-mono)', fontSize:12, border:'1px solid var(--line)', borderRadius:6, padding:'2px 6px' }} />h
          </span>
        </div>
        <div style={{ marginTop:10, padding:'8px 12px', background:'var(--amber-soft)', borderRadius:8, fontSize:11.5, color:'var(--ink-2)' }}>
          ⚠ O prazo de 30 dias vem do art. 26 §2 da Portaria 1.143/2024 — não reduzir sem validação jurídica.
        </div>
      </div>

      {/* C — Pesos do Score */}
      <Sech>C — Pesos do Score PLD</Sech>
      <div style={cardS}>
        {wRows.map(([label, key]) => {
          const v = weights[key]
          return (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:12.5, color:'var(--ink-2)', width:210, flexShrink:0 }}>{label}</span>
              <div style={{ flex:1, height:10, borderRadius:999, background:'var(--bg)', overflow:'hidden', border:'1px solid var(--line)', minWidth:0 }}>
                <div style={{ height:'100%', width:`${v}%`, background:'var(--orange)', borderRadius:999 }} />
              </div>
              <input type="range" min={0} max={100} value={v} onChange={e => setW(key, Number(e.target.value))}
                style={{ width:80, accentColor:'var(--orange)' }} />
              <span style={{ fontSize:12, fontFamily:'var(--font-mono)', color:'var(--ink)', width:36, textAlign:'right' }}>{v}%</span>
            </div>
          )
        })}
        <div style={{ fontSize:12.5, fontWeight:700, color:totalW===100?'var(--green)':'var(--red)', marginTop:4 }}>
          Total: {totalW}% {totalW===100 ? '✓' : '⚠ Deve somar 100%'}
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:11, color:'var(--muted-text)', marginBottom:6 }}>Distribuição estimada por faixa de score</div>
          <svg viewBox="0 0 300 65" width="100%" style={{ maxWidth:340 }}>
            {([
              ['Baixo',   'var(--green)', 10,  45],
              ['Médio',   'var(--amber)', 85,  35],
              ['Alto',    'var(--red)',  160,  15],
              ['Crítico', '#b91c1c',    235,   5],
            ] as [string, string, number, number][]).map(([lbl, col, x, pct]) => {
              const bh = Math.round(pct * 0.9)
              return (
                <g key={lbl}>
                  <rect x={x} y={55 - bh} width={52} height={bh} fill={col} rx={4} opacity={0.85} />
                  <text x={x + 26} y={62} textAnchor="middle" fontSize={9} fill="var(--muted-text)">{lbl}</text>
                  <text x={x + 26} y={55 - bh - 3} textAnchor="middle" fontSize={9} fill="var(--ink-2)">{pct}%</text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* D — Listas Externas */}
      <Sech>D — Listas Externas</Sech>
      <div style={cardS}>
        {EXT_LISTS.map(l => (
          <div key={l.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--line)' }}>
            <Tog on={listTgls[l.id] ?? true} disabled={l.obrigatorio}
              onToggle={() => { if (!l.obrigatorio) { setListTgls(p => ({...p, [l.id]: !p[l.id]})); setPending(true) } }} />
            <div style={{ flex:1, minWidth:0 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--ink)' }}>{l.nome}</span>
              {l.obrigatorio && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, color:'#fff', background:'var(--orange)', borderRadius:999, padding:'1px 7px' }}>Obrigatório</span>}
              <span style={{ fontSize:11, color:'var(--muted-text)', marginLeft:8 }}>{l.base}</span>
            </div>
            <span style={{ fontSize:11, color:'var(--muted-text)', flexShrink:0 }}>Atualizada: {l.atualizada}</span>
            <button style={{ fontSize:11.5, fontWeight:700, color:'var(--orange)', background:'transparent', border:'1px solid var(--orange)', borderRadius:8, padding:'3px 10px', cursor:'pointer' }}>
              Ver lista
            </button>
          </div>
        ))}
      </div>

      {/* E — Comunicação de Não-Ocorrência */}
      <Sech>E — Comunicação de Não-Ocorrência</Sech>
      <div style={cardS}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:13.5, fontWeight:700, color:'var(--ink)' }}>Comunicação de Não-Ocorrência — Ano 2026</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--amber)', display:'inline-block' }} />
              <span style={{ fontSize:12.5, color:'var(--amber)', fontWeight:700 }}>Pendente</span>
              <span style={{ fontSize:12, color:'var(--muted-text)' }}>(prazo: 01/fev/2027)</span>
              <span style={{ fontSize:12, color:'var(--muted-text)' }}>· Canal: SIGAP</span>
            </div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:8, flexWrap:'wrap' }}>
            <button onClick={() => alert('Funcionalidade disponível em produção')}
              style={{ fontSize:12, fontWeight:700, color:'#fff', background:'var(--orange)', border:'none', borderRadius:10, padding:'6px 14px', cursor:'pointer' }}>
              Marcar como enviada
            </button>
            <button style={{ fontSize:12, fontWeight:700, color:'var(--ink-2)', background:'var(--card)', border:'1px solid var(--line)', borderRadius:10, padding:'6px 14px', cursor:'pointer' }}>
              Ver histórico de anos anteriores
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Impacto */}
      {pending && (
        <div style={{ position:'sticky', bottom:16, background:'var(--amber-soft)', border:'1px solid var(--amber)', borderRadius:12, padding:'14px 18px', marginTop:16, boxShadow:'0 4px 16px rgba(0,0,0,.1)' }}>
          <div style={{ fontSize:13, fontWeight:800, color:'var(--amber)', marginBottom:10 }}>⚡ Impacto estimado (dry-run — não salvo)</div>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginBottom:8 }}>
            {([['KPI "Alertas"','38 → 51','+13'],['Críticos','2 → 5','+3'],['WorkList','6 → 8','+2']] as [string,string,string][]).map(([lbl,val,d]) => (
              <div key={lbl}>
                <div style={{ fontSize:11, color:'var(--muted-text)' }}>{lbl}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{val} <span style={{ color:'var(--red)' }}>({d})</span></div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11.5, color:'var(--ink-2)', marginBottom:10 }}>⚠ 3 casos que hoje são &quot;Alto&quot; virariam &quot;Crítico&quot; com o novo threshold.</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button style={{ fontSize:12, fontWeight:700, color:'var(--ink-2)', background:'#fff', border:'1px solid var(--line)', borderRadius:10, padding:'6px 14px', cursor:'pointer' }}>
              Ver 3 casos
            </button>
            <button onClick={() => setPending(false)}
              style={{ fontSize:12, fontWeight:700, color:'#fff', background:'var(--orange)', border:'none', borderRadius:10, padding:'6px 14px', cursor:'pointer' }}>
              Publicar
            </button>
            <button onClick={() => {
              setPending(false)
              setToggles(Object.fromEntries(PLD_RULES.map(r => [r.id, true])) as Record<string,boolean>)
              setThresholds({ critico:85, alto:70, medio:50, slaC:24, slaA:72, slaM:30, factorsMin:70, notifAfter:20 })
              setWeights({ estruturacao:35, passThrough:25, perfil:15, vinculos:12, velocidade:8, jurisdicao:5 })
            }} style={{ fontSize:12, fontWeight:700, color:'var(--muted-text)', background:'transparent', border:'1px solid var(--line)', borderRadius:10, padding:'6px 14px', cursor:'pointer' }}>
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Audit Log Drawer */}
      <Sheet open={showLog} onOpenChange={setShowLog}>
        <SheetContent side="right" showCloseButton={false}
          style={{ background:'var(--card)', padding:0, maxWidth:480, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--line)' }}>
            <span style={{ fontSize:15, fontWeight:800, color:'var(--ink)', fontFamily:'var(--font-head)' }}>Histórico de Alterações</span>
            <button onClick={() => setShowLog(false)} style={{ fontSize:18, color:'var(--muted-text)', background:'transparent', border:'none', cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ flex:1, overflow:'auto', padding:'16px 20px' }}>
            {AUDIT_LOG_RULES.map((entry, i) => (
              <div key={i} style={{ marginBottom:20, paddingBottom:20, borderBottom: i < AUDIT_LOG_RULES.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ fontSize:11.5, color:'var(--muted-text)', marginBottom:4 }}>{entry.ts}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>
                  {entry.user} <span style={{ fontSize:11, color:'var(--muted-text)', fontWeight:400 }}>({entry.role})</span>
                </div>
                <div style={{ fontSize:12.5, color:'var(--ink-2)', marginTop:4 }}>Sinal: <strong>{entry.sinal}</strong></div>
                <div style={{ fontSize:12, color:'var(--muted-text)', marginTop:3 }}>Antes: {entry.antes}</div>
                <div style={{ fontSize:12, color:'var(--muted-text)', marginTop:1 }}>Depois: {entry.depois}</div>
                <div style={{ fontSize:12, color:'var(--ink-2)', marginTop:4, fontStyle:'italic' }}>&ldquo;{entry.motivo}&rdquo;</div>
                <div style={{ fontSize:11, color:'var(--muted-text)', marginTop:4 }}>
                  {entry.dryRun ? '✓ Dry-run executado' : 'Sem dry-run'} · Impacto: {entry.impacto}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

    </div>
  )
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function PldAmlPage() {
  const [selected, setSelected]       = useState<Row | null>(null)
  const [filter, setFilter]           = useState('Todos')
  const [rowStatus, setRowStatus]     = useState<Record<number, string>>({})
const [periodo, setPeriodo]         = useState('7 dias')
  const [aba, setAba]                 = useState<AbaId>('visao-geral')

  // Watchlist state
  const [watchStatusF,   setWatchStatusF]   = useState('Todos')
  const [watchMotivoF,   setWatchMotivoF]   = useState('Todos')
  const [watchMutations, setWatchMutations] = useState<Record<number, string>>({})
  const [removeTarget,   setRemoveTarget]   = useState<WatchRow | null>(null)
  const [removeJustif,   setRemoveJustif]   = useState('')

  function watchStatus(w: WatchRow) { return (watchMutations[w.id] || w.status) as string }

  function watchToRow(w: WatchRow): Row {
    return {
      id: w.id, nome: w.nome, cpf: w.cpf, marca: w.marca, flag: w.motivo,
      score: w.score,
      sev: w.score >= 85 ? 'Crítico' : w.score >= 70 ? 'Alto' : 'Médio',
      sla: '—', slaH: null, slaC: 'm',
      status: 'Aberto', resp: '—', crit: w.score >= 85,
    }
  }

  const watchFiltered = WATCH_DATA.filter((w) => {
    const st = watchStatus(w)
    if (watchStatusF !== 'Todos' && st !== watchStatusF)     return false
    if (watchMotivoF !== 'Todos' && w.motivo !== watchMotivoF) return false
    return true
  })

  const watchObsCount = WATCH_DATA.filter(w => watchStatus(w) === 'Em observação').length
  const watchEscCount = WATCH_DATA.filter(w => watchStatus(w) === 'Escalado').length

  function updateStatus(id: number, newStatus: string) {
    setRowStatus((prev) => ({ ...prev, [id]: newStatus }))
    if (newStatus === 'Arquivado' || newStatus === 'Comunicado COAF') setSelected(null)
  }

  const filtered = ROWS
    .filter((r) => {
      const s = rowStatus[r.id] || r.status
      if (filter === 'Todos')        return true
      if (filter === 'Aberto')       return s === 'Aberto'
      if (filter === 'Em análise')   return s === 'Em análise'
      if (filter === 'Crítico')      return r.sev === 'Crítico'
      if (filter === 'Estruturação') return r.flag === 'Estruturação'
      if (filter === 'vaidebet')     return r.marca.startsWith('vaidebet')
      return true
    })
    .sort((a, b) => (b.crit ? 1 : 0) - (a.crit ? 1 : 0))

  return (
    <main className="canvas">
      <div style={{ padding: 'clamp(16px,2vw,40px)', paddingBottom: 56 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

          {/* Linha de Período */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {PERIODOS.map((p) => (
                <button key={p} onClick={() => setPeriodo(p)}
                  style={{ fontSize: 12.5, fontWeight: 600, padding: '6px 13px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-body)', border: '1px solid',
                    borderColor:  periodo === p ? 'var(--orange)'      : 'var(--line)',
                    background:   periodo === p ? 'var(--orange-soft)' : 'transparent',
                    color:        periodo === p ? 'var(--orange)'      : 'var(--muted-text)' }}>
                  {p}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, padding: '6px 13px', borderRadius: 999, border: '1px solid var(--line)', color: 'var(--ink-2)', background: 'var(--card)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              01 abr – 18 abr 2026
            </span>
          </div>

          {/* Barra de Abas */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, borderBottom: '1px solid var(--line)', marginTop: 18 }}>
            {ABAS.map((a) => {
              const active = aba === a.id
              return (
                <button key={a.id} onClick={() => setAba(a.id)}
                  style={{ padding: '10px 18px', fontSize: 13, fontWeight: active ? 800 : 600, fontFamily: 'var(--font-body)', background: 'none', border: 'none', cursor: 'pointer',
                    color:        active ? 'var(--orange)'      : 'var(--muted-text)',
                    borderBottom: active ? '2px solid var(--orange)' : '2px solid transparent',
                    marginBottom: -1 }}>
                  {a.label}
                </button>
              )
            })}
          </div>

          {/* ── Aba: Visão Geral ── */}
          {aba === 'visao-geral' && (
            <>
              {/* Indicadores — faixa plana */}
              <Sech>Visão geral</Sech>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                {KPI_DATA.map((kpi, i) => (
                  <button key={kpi.label}
                    style={{ textAlign: 'left', background: 'none', border: 'none', borderRight: i < 3 ? '1px solid var(--line)' : 'none', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 9, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: 5, lineHeight: 1.3 }}>
                      {kpi.label}
                      <span title={kpi.tooltip}
                        style={{ width: 15, height: 15, borderRadius: '50%', border: '1px solid var(--line)', color: 'var(--muted-text)', fontSize: 9.5, fontStyle: 'italic', fontWeight: 700, display: 'inline-grid', placeItems: 'center', flexShrink: 0, cursor: 'help', fontFamily: 'serif' }}>
                        i
                      </span>
                    </span>
                    <span style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)', lineHeight: 1 }}>
                      {kpi.value}
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: kpi.deltaColor || 'var(--muted-text)' }}>
                      {kpi.delta}
                    </span>
                  </button>
                ))}
              </div>

              {/* Pipeline AML — linha completa */}
              <div style={{ marginTop: 26 }}>
                <PipelineAml onViewRegras={() => setAba('regras')} />
              </div>

              {/* COAF Timeline */}
              <div style={{ marginTop: 26 }}>
                <Sech style={{ margin: '0 0 11px' }}>Prazo COAF (24h)</Sech>
                <CoafTimelineV2 />
              </div>

              {/* Red Flags + PEP — grid 2 colunas iguais */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 26 }}>
                <RedFlagsDonut />
                <PepSectionV2 />
              </div>

              {/* Fluxo financeiro × jogo */}
              <div style={{ marginTop: 26 }}>
                <Sech style={{ margin: '0 0 11px' }}>Fluxo financeiro × jogo</Sech>
                <FluxoFinanceiro onInvestigate={(row) => setSelected(row)} />
              </div>
            </>
          )}

          {/* ── Aba: Alertas ── */}
          {aba === 'alertas' && (
            <>
              <Sech>Fila de alertas (WorkList)</Sech>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--muted-text)', marginRight: 2 }}>Filtros:</span>
                {FILTERS.map((f) => (
                  <button key={f} onClick={() => { setFilter(f); setSelected(null) }}
                    style={{ fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      background: filter === f ? 'var(--orange)' : 'var(--bg)',
                      color:      filter === f ? '#fff'          : 'var(--ink-2)' }}>
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--card)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Apostador','Marca','Red flag','Score PLD','Severidade','SLA','Status','Responsável'].map((h) => (
                        <th key={h} style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--muted-text)', textAlign: 'left', fontWeight: 700, padding: '11px 14px', borderBottom: '1px solid var(--line)', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => {
                      const status = rowStatus[row.id] || row.status
                      const sc     = SCORE_COLOR(row.score)
                      const sev    = SEV[row.sev]  || SEV['Médio']
                      const st     = ST[status]    || ST['Aberto']
                      const slaCol = row.slaC === 'r' ? 'var(--red)' : row.slaC === 'a' ? 'var(--amber)' : 'var(--muted-text)'
                      const isSel  = selected?.id === row.id
                      const bg     = isSel ? 'var(--orange-soft)' : undefined
                      return (
                        <tr key={row.id} onClick={() => setSelected(isSel ? null : row)}
                          style={{ cursor: 'pointer', boxShadow: row.crit ? 'inset 3px 0 0 var(--red)' : 'none' }}>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}>
                            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>{row.nome}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{row.cpf}</div>
                          </td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', background: bg }}>{row.marca}</td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', background: bg }}>{row.flag}</td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}>
                            <span style={{ width: 84, height: 6, background: 'var(--line)', borderRadius: 999, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', marginRight: 7 }}>
                              <span style={{ display: 'block', height: '100%', borderRadius: 999, background: sc, width: `${row.score}%` }} />
                            </span>
                            <span style={{ fontWeight: 800, fontSize: 13.5, color: sc }}>{row.score}</span>
                          </td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}><Pill c={sev.c} bg={sev.bg}>{row.sev}</Pill></td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13, color: slaCol, background: bg }}>{row.sla}</td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: bg }}><Pill c={st.c} bg={st.bg}>{status}</Pill></td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13, color: 'var(--muted-text)', background: bg }}>{row.resp}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {aba === 'watchlist' && (
            <>
              <Sech>Monitorados (Watchlist)</Sech>

              {/* KPI strip */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                {[
                  { label: 'Em observação', value: watchObsCount },
                  { label: 'Adicionados (7d)', value: 3 },
                  { label: 'Escalados (7d)', value: watchEscCount },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 20px', minWidth: 140 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--ink)' }}>{value}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-text)', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--muted-text)', marginRight: 2 }}>Status:</span>
                {WATCH_STATUS_F.map((f) => (
                  <button key={f} onClick={() => setWatchStatusF(f)}
                    style={{ fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      background: watchStatusF === f ? 'var(--orange)' : 'var(--bg)',
                      color:      watchStatusF === f ? '#fff'          : 'var(--ink-2)' }}>
                    {f}
                  </button>
                ))}
                <span style={{ fontSize: 12, color: 'var(--muted-text)', marginLeft: 8, marginRight: 2 }}>Motivo:</span>
                {WATCH_MOTIVO_F.map((f) => (
                  <button key={f} onClick={() => setWatchMotivoF(f)}
                    style={{ fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      background: watchMotivoF === f ? 'var(--orange)' : 'var(--bg)',
                      color:      watchMotivoF === f ? '#fff'          : 'var(--ink-2)' }}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--card)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Apostador', 'Score PLD', 'Motivo', 'Marca', 'Última ocorrência', 'Status', 'Ação'].map((h) => (
                        <th key={h} style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--muted-text)', textAlign: 'left', fontWeight: 700, padding: '11px 14px', borderBottom: '1px solid var(--line)', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {watchFiltered.map((w) => {
                      const st     = watchStatus(w)
                      const wst    = WS[st]            || WS['Em observação']
                      const wm     = WM[w.motivo]      || { c: 'var(--muted-text)', bg: 'var(--bg)' }
                      const sc     = SCORE_COLOR(w.score)
                      const dimmed = st === 'Removido'
                      const rowBg  = dimmed ? 'var(--bg)' : undefined
                      return (
                        <tr key={w.id} style={{ opacity: dimmed ? 0.55 : 1 }}>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: rowBg }}>
                            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink)' }}>{w.nome}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted-text)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{w.cpf}</div>
                          </td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: rowBg }}>
                            <span style={{ width: 72, height: 6, background: 'var(--line)', borderRadius: 999, overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', marginRight: 7 }}>
                              <span style={{ display: 'block', height: '100%', borderRadius: 999, background: sc, width: `${w.score}%` }} />
                            </span>
                            <span style={{ fontWeight: 800, fontSize: 13.5, color: sc }}>{w.score}</span>
                          </td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: rowBg }}><Pill c={wm.c} bg={wm.bg}>{w.motivo}</Pill></td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', background: rowBg }}>{w.marca}</td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', fontSize: 13, color: 'var(--muted-text)', background: rowBg }}>{w.ultima}</td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: rowBg }}><Pill c={wst.c} bg={wst.bg}>{st}</Pill></td>
                          <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: rowBg }}>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <button onClick={() => setSelected(watchToRow(w))}
                                style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--ink-2)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                Abrir ↗
                              </button>
                              {st !== 'Removido' && (
                                <>
                                  <button onClick={() => setWatchMutations((p) => ({ ...p, [w.id]: 'Escalado' }))}
                                    style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--orange-line)', background: 'var(--orange-soft)', color: 'var(--orange)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                    Escalar
                                  </button>
                                  <button onClick={() => { setRemoveTarget(w); setRemoveJustif('') }}
                                    style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--muted-text)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                    Remover
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Modal de remoção */}
              {removeTarget && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={(e) => { if (e.target === e.currentTarget) setRemoveTarget(null) }}>
                  <div style={{ background: 'var(--card)', borderRadius: 16, padding: '28px 28px 24px', width: 420, boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)', marginBottom: 6, fontFamily: 'var(--font-head)' }}>Remover da Watchlist</div>
                    <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginBottom: 16 }}>
                      <strong>{removeTarget.nome}</strong> — justificativa obrigatória (mín. 50 caracteres).
                    </div>
                    <textarea
                      value={removeJustif}
                      onChange={(e) => setRemoveJustif(e.target.value)}
                      placeholder="Descreva o motivo da remoção…"
                      rows={4}
                      style={{ width: '100%', fontSize: 13.5, fontFamily: 'var(--font-body)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 12px', resize: 'vertical', background: 'var(--bg)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: 11.5, color: removeJustif.length >= 50 ? 'var(--green)' : 'var(--muted-text)', marginTop: 4, marginBottom: 16 }}>
                      {removeJustif.length}/50 caracteres mínimos
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button onClick={() => setRemoveTarget(null)}
                        style={{ fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--ink-2)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Cancelar
                      </button>
                      <button
                        disabled={removeJustif.length < 50}
                        onClick={() => {
                          setWatchMutations((p) => ({ ...p, [removeTarget!.id]: 'Removido' }))
                          setRemoveTarget(null)
                        }}
                        style={{ fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 10, border: 'none', fontFamily: 'var(--font-body)', cursor: removeJustif.length >= 50 ? 'pointer' : 'not-allowed',
                          background: removeJustif.length >= 50 ? 'var(--red)' : 'var(--line)',
                          color: removeJustif.length >= 50 ? '#fff' : 'var(--muted-text)' }}>
                        Confirmar remoção
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {aba === 'regras' && (
            <RegraTab />
          )}

          {/* Drawer de investigação — painel lateral compartilhado entre abas */}
          <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
            <SheetContent side="right" showCloseButton={false}
              style={{ background: 'var(--card)', padding: 0, gap: 0, maxWidth: 440, display: 'flex', flexDirection: 'column' }}>
              {selected && (
                <DrawerPanel key={selected.id} row={selected} rowStatus={rowStatus} onUpdateStatus={updateStatus} onClose={() => setSelected(null)} />
              )}
            </SheetContent>
          </Sheet>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
            <span style={{ fontSize: 12.5, color: 'var(--muted-text)' }}>Abrir páginas:</span>
            {['Perfil do apostador', 'Watchlist', 'Glossário COAF', 'Fluxos PLD'].map((label) => (
              <span key={label}
                onClick={() => { if (label === 'Watchlist') setAba('watchlist') }}
                style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-2)', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}>
                {label}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 11.5, color: 'var(--muted-text)' }}>
            <span>⚷ Trilha auditável — autor + timestamp, imutável (5 anos)</span>
            <span>LGPD — CPF/nome/IP mascarados em tela</span>
            <span>Anti-tipping-off — nunca exibido ao apostador</span>
            <span>Export do RO ao COAF sem máscara (Lei 9.613, art. 11)</span>
          </div>

        </div>
      </div>
    </main>
  )
}
