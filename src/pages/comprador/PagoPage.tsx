import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../lib/axios'

export default function PagoPage() {
  const { ventaId } = useParams()
  const navigate = useNavigate()
  const [estado, setEstado] = useState<'procesando' | 'exitoso' | 'error'>('procesando')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function pagar() {
      try {
        const { data } = await api.post(`/ventas/${ventaId}/pagar`)
        if (data.mpInitPoint) {
          window.location.href = data.mpInitPoint
        } else {
          setEstado('exitoso')
          setMensaje(data.mensaje)
        }
      } catch (err: any) {
        setEstado('error')
        setMensaje(err.response?.data?.error || 'Error al procesar el pago')
      }
    }
    pagar()
  }, [ventaId])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {estado === 'procesando' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#555' }}>Procesando tu pago...</p>
        </div>
      )}
      {estado === 'exitoso' && (
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
          <h2 style={{ color: '#1D9E75', marginBottom: '12px' }}>¡Compra registrada!</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{mensaje}</p>
          <button onClick={() => navigate('/catalogo')} style={{ padding: '12px 24px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
            Volver al catálogo
          </button>
        </div>
      )}
      {estado === 'error' && (
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✗</div>
          <h2 style={{ color: '#E24B4A', marginBottom: '12px' }}>Error en el pago</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{mensaje}</p>
          <button onClick={() => navigate('/carrito')} style={{ padding: '12px 24px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
            Volver al carrito
          </button>
        </div>
      )}
    </div>
  )
}