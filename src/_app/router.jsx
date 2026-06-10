import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout.jsx'
import ModulePage from './ModulePage.jsx'
import PldAmlPage from '../modules/pld-aml/PldAmlPage.jsx'

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/perfil-apostador" replace />} />
        <Route path="/pld-aml" element={<Layout />}>
          <Route index element={<PldAmlPage />} />
        </Route>
        <Route path="/:moduleId" element={<Layout />}>
          <Route index element={<ModulePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
