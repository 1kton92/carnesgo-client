import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export default function ReposicionesPage() {
  const [barrioId, setBarrioId] = useState('')
  const [tipo, setTipo] = useState('')

  const { data: barrios } = useQuery({
    queryKey: ['barrios'],
    queryFn: () => api.get('/admin/barrios').then(r => r.data)
  })

  const { data: reposiciones, isLoading } = useQuery({
    queryKey: ['reposiciones', barrioId, tipo],
    queryFn: () => api.get('/reposiciones', { params: { ...(barrioId ? { barrioId } : {}), ...(tipo ? { tipo } : {}) } }).then(r => r.data)
  })

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>Reposiciones</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select value={barrioId} onChange={e => setBarrioId(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
          <option value="">Todos los barrios</option>
          {barrios?.map((b: any) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
          <option value="">Todos</option>
          <option value="carga">Cargas</option>
          <option value="retiro">Retiros</option>
        </select>
      </div>

      {isLoading && <p style={{ color: '#888' }}>Cargando...</p>}
      {reposiciones?.map((r: any) => (
        <div key={r.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: r.tipo === 'carga' ? '#E1F5EE' : '#FAECE7', color: r.tipo === 'carga' ? '#085041' : '#712B13' }}>
                {r.tipo}
              </span>
              <span style={{ fontWeight: '600' }}>{r.articulo.producto.nombre}</span>
            </div>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 2px' }}>
              {r.usuario.nombre} {r.usuario.apellido} · {r.puntoVenta.nombre}
            </p>
            {r.motivo && <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>{r.motivo}</p>}
          </div>
          <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>{new Date(r.createdAt).toLocaleDateString('es-AR')}</p>
        </div>
      ))}
    </div>
  )
}