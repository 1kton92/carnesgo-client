import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { useAuthStore } from '../../store/auth.store'
import { useCarritoStore } from '../../store/carrito.store'
import Sidebar from '../../components/ui/Sidebar'

export default function HistorialPage() {
  const navigate = useNavigate()
  const usuario = useAuthStore(s => s.usuario)
  const logout = useAuthStore(s => s.logout)
  const { limpiar } = useCarritoStore()

  const { data, isLoading } = useQuery({
    queryKey: ['historial'],
    queryFn: () => api.get('/ventas/historial').then(r => r.data)
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar
        subtitulo={usuario?.nombre}
        items={[
          { label: 'Tienda', onClick: () => navigate('/catalogo') },
          { label: 'Historial', onClick: () => {}, activo: true }
        ]}
        accionFooter={{ label: 'Cerrar sesión', onClick: () => { logout(); limpiar(); navigate('/login') } }}
      />

      <div style={{ padding: '16px 24px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: '#1a1a1a' }}>Mis compras</h2>

        {isLoading && <p style={{ color: '#888' }}>Cargando...</p>}

        {data?.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Todavía no realizaste ninguna compra</p>
        )}

        {data?.map((venta: any) => (
          <div key={venta.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>
                {new Date(venta.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span style={{ fontWeight: '700', color: '#1D9E75' }}>
                ${Number(venta.total).toLocaleString('es-AR')}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {venta.items.map((item: any) => (
                <span key={item.id} style={{ padding: '3px 10px', backgroundColor: '#E1F5EE', color: '#085041', borderRadius: '20px', fontSize: '12px' }}>
                  {item.articulo.producto.nombre}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: '#aaa' }}>
              {venta.metodoPago === 'expensas' ? 'Pagado por expensas' : 'Pagado con Mercado Pago'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}