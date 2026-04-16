import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { useCarritoStore } from '../../store/carrito.store'
import { useAuthStore } from '../../store/auth.store'

export default function CarritoPage() {
  const navigate = useNavigate()
  const { items, quitar, limpiar, total } = useCarritoStore()
  const usuario = useAuthStore(s => s.usuario)

  const crearYReservar = useMutation({
    mutationFn: async (metodoPago: string) => {
      const { data: venta } = await api.post('/ventas', {
        articuloIds: items.map(i => i.articuloId),
        metodoPago
      })
      await api.post(`/ventas/${venta.ventaId}/reservar`)
      return venta.ventaId
    },
    onSuccess: (ventaId) => {
      limpiar()
      navigate(`/pago/${ventaId}`)
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Error al procesar la compra')
    }
  })

  if (items.length === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <p style={{ color: '#888', marginBottom: '16px' }}>Tu carrito está vacío</p>
      <button onClick={() => navigate('/catalogo')} style={{ padding: '10px 24px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Volver al catálogo
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: '#1D9E75', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate('/catalogo')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: 0 }}>Carrito de compra</h1>
      </div>

      <div style={{ padding: '16px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {items.map(item => (
          <div key={item.articuloId} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600', margin: '0 0 4px' }}>{item.nombre}</p>
              {item.pesoKg && <p style={{ fontSize: '13px', color: '#888', margin: '0 0 4px' }}>{item.pesoKg} kg</p>}
              <p style={{ color: '#1D9E75', fontWeight: '600', margin: 0 }}>${item.precio.toLocaleString('es-AR')}</p>
            </div>
            <button
              onClick={() => quitar(item.articuloId)}
              style={{ background: 'none', border: '1px solid #E24B4A', color: '#E24B4A', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}
            >
              Quitar
            </button>
          </div>
        ))}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
            <span>Total</span>
            <span style={{ color: '#1D9E75' }}>${total().toLocaleString('es-AR')}</span>
          </div>
        </div>

        {usuario ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => crearYReservar.mutate('mercadopago')}
              disabled={crearYReservar.isPending}
              style={{ width: '100%', padding: '14px', backgroundColor: '#009EE3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Pagar con Mercado Pago
            </button>
            <button
              onClick={() => crearYReservar.mutate('expensas')}
              disabled={crearYReservar.isPending}
              style={{ width: '100%', padding: '14px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cargar en expensas
            </button>
          </div>
        ) : (
          <button
            onClick={() => crearYReservar.mutate('mercadopago')}
            disabled={crearYReservar.isPending}
            style={{ width: '100%', padding: '14px', backgroundColor: '#009EE3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
          >
            Pagar con Mercado Pago
          </button>
        )}

        {crearYReservar.isPending && <p style={{ textAlign: 'center', color: '#888', marginTop: '12px' }}>Procesando...</p>}
      </div>
    </div>
  )
}