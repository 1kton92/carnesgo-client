import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useCarritoStore } from '../../store/carrito.store'
import { api } from '../../lib/axios'

export default function ElegirBarrioPage() {
  const navigate = useNavigate()
  const setBarrioIdInvitado = useCarritoStore(s => s.setBarrioIdInvitado)
  const [barrioSeleccionado, setBarrioSeleccionado] = useState('')

  const { data: barrios, isLoading } = useQuery({
    queryKey: ['barrios-publicos'],
    queryFn: () => api.get('/admin/barrios').then(r => r.data)
  })

  function continuar() {
    if (!barrioSeleccionado) return
    setBarrioIdInvitado(barrioSeleccionado)
    navigate('/catalogo')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#f5f5f5' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>
          ← Volver
        </button>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>Bienvenido</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Seleccioná tu barrio para ver los productos disponibles</p>

        {isLoading && <p style={{ color: '#888' }}>Cargando barrios...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {barrios?.map((b: any) => (
            <button
              key={b.id}
              onClick={() => setBarrioSeleccionado(b.id)}
              style={{
                padding: '14px 16px', borderRadius: '8px',
                border: `2px solid ${barrioSeleccionado === b.id ? '#1D9E75' : '#e0e0e0'}`,
                backgroundColor: barrioSeleccionado === b.id ? '#E1F5EE' : 'white',
                color: barrioSeleccionado === b.id ? '#085041' : '#333',
                cursor: 'pointer', textAlign: 'left', fontSize: '15px',
                fontWeight: barrioSeleccionado === b.id ? '600' : '400'
              }}
            >
              {b.nombre}
              <span style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: '400', marginTop: '2px' }}>{b.direccion}</span>
            </button>
          ))}
        </div>

        <button
          onClick={continuar}
          disabled={!barrioSeleccionado}
          style={{
            width: '100%', padding: '12px',
            backgroundColor: barrioSeleccionado ? '#1D9E75' : '#e0e0e0',
            color: barrioSeleccionado ? 'white' : '#aaa',
            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
            cursor: barrioSeleccionado ? 'pointer' : 'not-allowed'
          }}
        >
          Ver productos
        </button>
      </div>
    </div>
  )
}