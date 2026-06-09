import { loadModule } from './loader.jsx'
import perfilRaw from './perfil-apostador/module.md?raw'
import financieroRaw from './financiero/module.md?raw'
import pldRaw from './pld-aml/module.md?raw'

const _perfilModule = loadModule(perfilRaw)
const _financieroModule = loadModule(financieroRaw)
const _pldModule = loadModule(pldRaw)

export const MODULES = [
  _perfilModule,
  _financieroModule,
  _pldModule,
  { id: 'risco-fraude', nome: 'Risco & Fraude', icone: '🚨', status: 'soon', slots: [] },
]
