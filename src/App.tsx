import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import LoginPage from './pages/auth/LoginPage'
import SolicitudPage from './pages/auth/SolicitudPage'
import CatalogoPage from './pages/comprador/CatalogoPage'
import CarritoPage from './pages/comprador/CarritoPage'
import PagoPage from './pages/comprador/PagoPage'
import HistorialPage from './pages/comprador/HistorialPage'
import ReposicionPage from './pages/repositor/ReposicionPage'
import AdminLayout from './pages/admin/AdminLayout'
import ElegirBarrioPage from './pages/comprador/ElegirBarrioPage'

type Rol = 'comprador' | 'repositor' | 'admin'

function RutaProtegida({ children, roles }: { children: React.ReactNode, roles: Rol[] }) {
  const usuario = useAuthStore(s => s.usuario)
  if (!usuario) return <Navigate to="/login" />
  if (!roles.includes(usuario.rol)) return <Navigate to="/login" />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/solicitud" element={<SolicitudPage />} />
      <Route path="/elegir-barrio" element={<ElegirBarrioPage />} />

      <Route path="/catalogo" element={<CatalogoPage />} />
      <Route path="/carrito" element={<CarritoPage />} />

      <Route path="/pago/:ventaId" element={
        <RutaProtegida roles={['comprador']}>
          <PagoPage />
        </RutaProtegida>
      } />

      <Route path="/historial" element={
        <RutaProtegida roles={['comprador']}>
          <HistorialPage />
        </RutaProtegida>
      } />

      <Route path="/reposicion" element={
        <RutaProtegida roles={['repositor', 'admin']}>
          <ReposicionPage />
        </RutaProtegida>
      } />

      <Route path="/admin/*" element={
        <RutaProtegida roles={['admin']}>
          <AdminLayout />
        </RutaProtegida>
      } />         

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}