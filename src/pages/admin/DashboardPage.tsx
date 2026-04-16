import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data)
  })

  if (isLoading) return <div style={{ padding: '32px', color: '#888' }}>Cargando...</div>

  const cards = [
    { label: 'Barrios', valor: data?.resumen.barrios },
    { label: 'Puntos de venta', valor: data?.resumen.puntosVenta },
    { label: 'Productos', valor: data?.resumen.productos },
    { label: 'Ventas totales', valor: data?.resumen.ventasTotales },
    { label: 'Recaudación total', valor: `$${Number(data?.resumen.recaudacionTotal).toLocaleString('es-AR')}` },
    { label: 'Ventas hoy', valor: data?.resumen.ventasHoy },
    { label: 'Recaudación hoy', valor: `$${Number(data?.resumen.recaudacionHoy).toLocaleString('es-AR')}` },
  ]

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: '#1a1a1a' }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {cards.map(card => (
          <div key={card.label} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '13px', color: '#888', margin: '0 0 8px' }}>{card.label}</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1D9E75', margin: 0 }}>{card.valor}</p>
          </div>
        ))}
      </div>
    </div>
  )
}