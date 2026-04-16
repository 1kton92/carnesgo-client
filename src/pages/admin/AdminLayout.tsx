import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import DashboardPage from './DashboardPage'
import BarriosPage from './BarriosPage'
import ProductosPage from './ProductosPage'
import UsuariosPage from './UsuariosPage'
import VentasPage from './VentasPage'
import StockPage from './StockPage'
import ReposicionesPage from './ReposicionesPage'
import Sidebar from '../../components/ui/Sidebar'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore(s => s.logout)
  const usuario = useAuthStore(s => s.usuario)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar
        subtitulo={usuario?.nombre}
        items={[
          { label: 'Dashboard', onClick: () => navigate('/admin'), activo: location.pathname === '/admin' },
          { label: 'Barrios', onClick: () => navigate('/admin/barrios'), activo: location.pathname.includes('/admin/barrios') },
          { label: 'Productos', onClick: () => navigate('/admin/productos'), activo: location.pathname.includes('/admin/productos') },
          { label: 'Stock', onClick: () => navigate('/admin/stock'), activo: location.pathname.includes('/admin/stock') },
          { label: 'Ventas', onClick: () => navigate('/admin/ventas'), activo: location.pathname.includes('/admin/ventas') },
          { label: 'Reposiciones', onClick: () => navigate('/admin/reposiciones'), activo: location.pathname.includes('/admin/reposiciones') },
          { label: 'Usuarios', onClick: () => navigate('/admin/usuarios'), activo: location.pathname.includes('/admin/usuarios') },
        ]}
        accionFooter={{ label: 'Cerrar sesión', onClick: () => { logout(); navigate('/login') } }}
      />
      <div style={{ padding: '16px' }}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="barrios" element={<BarriosPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="reposiciones" element={<ReposicionesPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
        </Routes>
      </div>
    </div>
  )
}