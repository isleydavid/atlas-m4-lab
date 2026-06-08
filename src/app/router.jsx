import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout.jsx'
import ModulePage from './ModulePage.jsx'

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/perfil-apostador" replace />} />
        <Route path="/:moduleId" element={<Layout />}>
          <Route index element={<ModulePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
