import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export default function StockPage() {
  const [barrioId, setBarrioId] = useState('')
  const [puntoVentaId, setPuntoVentaId] = useState('')

  const { data: barrios } = useQuery({
    queryKey: ['barrios'],
    queryFn: () => api.get('/admin/barrios').then(r => r.data)
  })

  const puntosVenta = barrios?.find((b: any) => b.id === barrioId)?.puntosVenta || []

  const { data: stock, isLoading } = useQuery({
    queryKey: ['stock', barrioId, puntoVentaId],
    queryFn: () => api.get('/admin/stock', { params: { ...(puntoVentaId ? { puntoVentaId } : barrioId ? { barrioId } : {}) } }).then(r => r.data)
  })

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>Stock por punto de venta</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select value={barrioId} onChange={e => { setBarrioId(e.target.value); setPuntoVentaId('') }} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
          <option value="">Todos los barrios</option>
          {barrios?.map((b: any) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        {barrioId && (
          <select value={puntoVentaId} onChange={e => setPuntoVentaId(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
            <option value="">Todos los puntos</option>
            {puntosVenta.map((pv: any) => <option key={pv.id} value={pv.id}>{pv.nombre}</option>)}
          </select>
        )}
      </div>

      {isLoading && <p style={{ color: '#888' }}>Cargando...</p>}
      {stock?.map((pv: any, i: number) => (
        <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{pv.puntoVenta}</h3>
          <p style={{ color: '#888', fontSize: '13px', margin: '0 0 16px' }}>{pv.barrio}</p>
          {Object.values(pv.productos).map((prod: any) => (
            <div key={prod.nombre} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
              <div>
                <span style={{ fontWeight: '500' }}>{prod.nombre}</span>
                <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>{prod.categoria}</span>
              </div>
              <span style={{ color: prod.cantidad <= 2 ? '#E24B4A' : '#1D9E75', fontWeight: '600' }}>
                {prod.cantidad} disponible{prod.cantidad !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}