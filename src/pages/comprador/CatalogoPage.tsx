import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { useCarritoStore } from '../../store/carrito.store'
import { useAuthStore } from '../../store/auth.store'
import Sidebar from '../../components/ui/Sidebar'

type Categoria = { id: string; nombre: string; orden: number }
type Articulo = { id: string; codigoBarras: string; pesoKg: string | null; fechaVencimiento: string | null }
type ProductoDisponible = {
  productoId: string; nombre: string; unidad: 'kg' | 'unidad'
  categoria: Categoria; precio: string | null
  cantidadDisponible: number; articulos: Articulo[]
}

export default function CatalogoPage() {
  const navigate = useNavigate()
  const usuario = useAuthStore(s => s.usuario)
  const barrioIdStore = useAuthStore(s => s.barrioId)
  const logout = useAuthStore(s => s.logout)
  const { items, agregar, quitar, total, barrioIdInvitado, limpiar } = useCarritoStore()
  const barrioId = barrioIdStore || barrioIdInvitado
  const [categoriaId, setCategoriaId] = useState<string | null>(null)

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.get('/productos/categorias').then(r => r.data)
  })

  const { data: productos, isLoading } = useQuery({
    queryKey: ['catalogo', barrioId, categoriaId],
    queryFn: () => api.get('/productos/articulos/disponibles', {
      params: { barrioId, ...(categoriaId ? { categoriaId } : {}) }
    }).then(r => r.data),
    enabled: !!barrioId
  })

  function toggleArticulo(producto: ProductoDisponible) {
    const enCarrito = items.some(i => i.productoId === producto.productoId)
    if (enCarrito) {
      const item = items.find(i => i.productoId === producto.productoId)
      if (item) quitar(item.articuloId)
    } else {
      const articulo = producto.articulos[0]
      if (!articulo) return
      agregar({
        articuloId: articulo.id,
        productoId: producto.productoId,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        pesoKg: articulo.pesoKg ? Number(articulo.pesoKg) : null,
        unidad: producto.unidad
      })
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar
        subtitulo={usuario?.nombre || 'Invitado'}
        items={[
          { label: 'Tienda', onClick: () => {}, activo: true },
          ...(usuario ? [{ label: 'Historial', onClick: () => navigate('/historial') }] : [])
        ]}
        accionFooter={usuario
          ? { label: 'Cerrar sesión', onClick: () => { logout(); limpiar(); navigate('/login') } }
          : undefined
        }
        accionFooterSecundaria={!usuario
          ? { label: 'Iniciar sesión', onClick: () => navigate('/login') }
          : undefined
        }
      />

      <div style={{ padding: '16px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {categorias && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
            <button
              onClick={() => setCategoriaId(null)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: !categoriaId ? '#1D9E75' : '#e0e0e0', color: !categoriaId ? 'white' : '#333', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '14px' }}
            >
              Todos
            </button>
            {categorias.map((c: Categoria) => (
              <button
                key={c.id}
                onClick={() => setCategoriaId(c.id)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: categoriaId === c.id ? '#1D9E75' : '#e0e0e0', color: categoriaId === c.id ? 'white' : '#333', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '14px' }}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        )}

        {isLoading && <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Cargando productos...</p>}

        {!barrioId && (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
            Seleccioná un barrio para ver los productos disponibles
          </p>
        )}

        {productos?.map((producto: ProductoDisponible) => {
          const enCarrito = items.some(i => i.productoId === producto.productoId)
          return (
            <div key={producto.productoId} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '16px', margin: '0 0 4px', color: '#1a1a1a' }}>{producto.nombre}</p>
                <p style={{ fontSize: '13px', color: '#888', margin: '0 0 4px' }}>{producto.categoria.nombre}</p>
                <p style={{ fontSize: '15px', color: '#1D9E75', fontWeight: '600', margin: 0 }}>
                  ${Number(producto.precio).toLocaleString('es-AR')} / {producto.unidad}
                </p>
                <p style={{ fontSize: '12px', color: '#aaa', margin: '4px 0 0' }}>
                  {producto.cantidadDisponible} disponible{producto.cantidadDisponible !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => toggleArticulo(producto)}
                disabled={producto.cantidadDisponible === 0}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: enCarrito ? '#E24B4A' : '#1D9E75', color: 'white', fontWeight: '600', cursor: producto.cantidadDisponible === 0 ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: producto.cantidadDisponible === 0 ? 0.5 : 1 }}
              >
                {enCarrito ? 'Quitar' : 'Agregar'}
              </button>
            </div>
          )
        })}

        {productos?.length === 0 && barrioId && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>No hay productos disponibles en tu barrio</p>
        )}

        {items.length > 0 && (
          <button
            onClick={() => navigate('/carrito')}
            style={{ width: '100%', padding: '14px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}
          >
            Terminar compra · ${total().toLocaleString('es-AR')}
          </button>
        )}
      </div>
    </div>
  )
}