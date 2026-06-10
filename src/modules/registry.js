import { loadModule } from './loader.jsx'
import perfilRaw from './perfil-apostador/module.md?raw'
import financieroRaw from './financiero/module.md?raw'

const _perfilModule = loadModule(perfilRaw)
const _financieroModule = loadModule(financieroRaw)

export const MODULES = [
  _perfilModule,
  _financieroModule,
  { id: 'pld-aml',      nome: 'PLD/AML',       icone: '🛡️', status: 'ready', slots: [] },
  { id: 'risco-fraude', nome: 'Risco & Fraude', icone: '🚨', status: 'soon',  slots: [] },
]
