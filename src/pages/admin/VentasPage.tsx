import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export default function VentasPage() {
  const [barrioId, setBarrioId] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  const { data: barrios } = useQuery({
    queryKey: ['barrios'],
    queryFn: () => api.get('/admin/barrios').then(r => r.data)
  })

  const { data, isLoading } = useQuery({
    queryKey: ['ventas-admin', barrioId, desde, hasta],
    queryFn: () => api.get('/admin/ventas', { params: { ...(barrioId ? { barrioId } : {}), ...(desde ? { desde } : {}), ...(hasta ? { hasta } : {}) } }).then(r => r.data)
  })

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>Ventas</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select value={barrioId} onChange={e => setBarrioId(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
          <option value="">Todos los barrios</option>
          {barrios?.map((b: any) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <input type="date" value={desde} onChange={e => setDesde(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
        <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
      </div>

      {data && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '32px' }}>
          <div>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 4px' }}>Total ventas</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1D9E75', margin: 0 }}>{data.cantidad}</p>
          </div>
          <div>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 4px' }}>Recaudación</p>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1D9E75', margin: 0 }}>${Number(data.totalRecaudado).toLocaleString('es-AR')}</p>
          </div>
        </div>
      )}

      {isLoading && <p style={{ color: '#888' }}>Cargando...</p>}
      {data?.ventas.map((v: any) => (
        <div key={v.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <span style={{ fontWeight: '600' }}>{v.usuario ? `${v.usuario.nombre} ${v.usuario.apellido}` : 'Invitado'}</span>
              <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>{v.barrio.nombre}</span>
            </div>
            <span style={{ color: '#1D9E75', fontWeight: '600' }}>${Number(v.total).toLocaleString('es-AR')}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {v.items.map((item: any) => (
              <span key={item.id} style={{ padding: '2px 10px', backgroundColor: '#E1F5EE', color: '#085041', borderRadius: '20px', fontSize: '12px' }}>
                {item.articulo.producto.nombre}
              </span>
            ))}
          </div>
          <p style={{ color: '#aaa', fontSize: '12px', margin: '8px 0 0' }}>
            {new Date(v.createdAt).toLocaleDateString('es-AR')} · {v.metodoPago}
          </p>
        </div>
      ))}
    </div>
  )
}