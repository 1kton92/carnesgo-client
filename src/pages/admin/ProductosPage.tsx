import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export default function ProductosPage() {
  const qc = useQueryClient()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editandoPrecio, setEditandoPrecio] = useState<string | null>(null)
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [form, setForm] = useState({ nombre: '', categoriaId: '', unidad: 'kg', stockMinimo: '0', precio: '' })

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos-admin'],
    queryFn: () => api.get('/productos').then(r => r.data)
  })

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.get('/productos/categorias').then(r => r.data)
  })

  const crear = useMutation({
    mutationFn: () => api.post('/productos', { ...form, precio: Number(form.precio), stockMinimo: Number(form.stockMinimo) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos-admin'] }); setMostrarForm(false) }
  })

  const actualizarPrecio = useMutation({
    mutationFn: (id: string) => api.patch(`/productos/${id}/precio`, { precio: Number(nuevoPrecio) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos-admin'] }); setEditandoPrecio(null); setNuevoPrecio('') }
  })

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' as const, marginBottom: '8px' }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', margin: 0 }}>Productos</h2>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '8px 16px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>+ Producto</button>
      </div>

      {mostrarForm && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Nuevo producto</h3>
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
          <select value={form.categoriaId} onChange={e => setForm(f => ({ ...f, categoriaId: e.target.value }))} style={inputStyle}>
            <option value="">Categoría...</option>
            {categorias?.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select value={form.unidad} onChange={e => setForm(f => ({ ...f, unidad: e.target.value }))} style={inputStyle}>
            <option value="kg">Por kilo</option>
            <option value="unidad">Por unidad</option>
          </select>
          <input placeholder="Stock mínimo" type="number" value={form.stockMinimo} onChange={e => setForm(f => ({ ...f, stockMinimo: e.target.value }))} style={inputStyle} />
          <input placeholder="Precio inicial" type="number" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} style={inputStyle} />
          <button onClick={() => crear.mutate()} style={{ padding: '8px 20px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar</button>
        </div>
      )}

      {isLoading && <p style={{ color: '#888' }}>Cargando...</p>}
      {productos?.map((p: any) => (
        <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: '600', margin: '0 0 4px' }}>{p.nombre}</p>
            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{p.categoria.nombre} · {p.unidad}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {editandoPrecio === p.id ? (
              <>
                <input type="number" value={nuevoPrecio} onChange={e => setNuevoPrecio(e.target.value)} placeholder="Nuevo precio" style={{ width: '120px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
                <button onClick={() => actualizarPrecio.mutate(p.id)} style={{ padding: '6px 12px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>OK</button>
                <button onClick={() => setEditandoPrecio(null)} style={{ padding: '6px 12px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>X</button>
              </>
            ) : (
              <>
                <span style={{ color: '#1D9E75', fontWeight: '600' }}>${Number(p.precio).toLocaleString('es-AR')}</span>
                <button onClick={() => { setEditandoPrecio(p.id); setNuevoPrecio(p.precio) }} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Editar precio</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}