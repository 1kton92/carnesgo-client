import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export default function BarriosPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState({ nombre: '', direccion: '', emailAdmin: '' })
  const [formPV, setFormPV] = useState({ nombre: '', ubicacion: '', barrioId: '' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarFormPV, setMostrarFormPV] = useState(false)
  const [editandoBarrio, setEditandoBarrio] = useState<string | null>(null)
  const [editandoPV, setEditandoPV] = useState<string | null>(null)
  const [formEditBarrio, setFormEditBarrio] = useState({ nombre: '', direccion: '', emailAdmin: '' })
  const [formEditPV, setFormEditPV] = useState({ nombre: '', ubicacion: '' })

  const { data: barrios, isLoading } = useQuery({
    queryKey: ['barrios'],
    queryFn: () => api.get('/admin/barrios').then(r => r.data)
  })

  const crearBarrio = useMutation({
    mutationFn: () => api.post('/admin/barrios', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['barrios'] })
      setMostrarForm(false)
      setForm({ nombre: '', direccion: '', emailAdmin: '' })
    }
  })

  const editarBarrio = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/barrios/${id}`, formEditBarrio),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['barrios'] })
      setEditandoBarrio(null)
    }
  })

  const crearPV = useMutation({
    mutationFn: () => api.post(`/admin/barrios/${formPV.barrioId}/puntos-venta`, formPV),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['barrios'] })
      setMostrarFormPV(false)
      setFormPV({ nombre: '', ubicacion: '', barrioId: '' })
    }
  })

  const editarPV = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/puntos-venta/${id}`, formEditPV),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['barrios'] })
      setEditandoPV(null)
    }
  })

  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box' as const, marginBottom: '8px'
  }

  const inputInlineStyle = {
    padding: '6px 10px', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '13px',
    boxSizing: 'border-box' as const
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', margin: 0 }}>Barrios y puntos de venta</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMostrarFormPV(!mostrarFormPV)} style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #1D9E75', color: '#1D9E75', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            + Punto de venta
          </button>
          <button onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '8px 16px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            + Barrio
          </button>
        </div>
      </div>

      {/* Form nuevo barrio */}
      {mostrarForm && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Nuevo barrio</h3>
          <input placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
          <input placeholder="Dirección" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} style={inputStyle} />
          <input placeholder="Email administración" value={form.emailAdmin} onChange={e => setForm(f => ({ ...f, emailAdmin: e.target.value }))} style={inputStyle} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => crearBarrio.mutate()} style={{ padding: '8px 20px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar</button>
            <button onClick={() => setMostrarForm(false)} style={{ padding: '8px 20px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Form nuevo punto de venta */}
      {mostrarFormPV && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Nuevo punto de venta</h3>
          <select value={formPV.barrioId} onChange={e => setFormPV(f => ({ ...f, barrioId: e.target.value }))} style={inputStyle}>
            <option value="">Seleccioná un barrio...</option>
            {barrios?.map((b: any) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
          <input placeholder="Nombre" value={formPV.nombre} onChange={e => setFormPV(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
          <input placeholder="Ubicación" value={formPV.ubicacion} onChange={e => setFormPV(f => ({ ...f, ubicacion: e.target.value }))} style={inputStyle} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => crearPV.mutate()} style={{ padding: '8px 20px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar</button>
            <button onClick={() => setMostrarFormPV(false)} style={{ padding: '8px 20px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {isLoading && <p style={{ color: '#888' }}>Cargando...</p>}

      {barrios?.map((barrio: any) => (
        <div key={barrio.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

          {/* Barrio — modo edición */}
          {editandoBarrio === barrio.id ? (
            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <input
                  defaultValue={barrio.nombre}
                  onChange={e => setFormEditBarrio(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Nombre"
                  style={{ ...inputInlineStyle, flex: 1, minWidth: '140px' }}
                />
                <input
                  defaultValue={barrio.direccion}
                  onChange={e => setFormEditBarrio(f => ({ ...f, direccion: e.target.value }))}
                  placeholder="Dirección"
                  style={{ ...inputInlineStyle, flex: 1, minWidth: '140px' }}
                />
                <input
                  defaultValue={barrio.emailAdmin}
                  onChange={e => setFormEditBarrio(f => ({ ...f, emailAdmin: e.target.value }))}
                  placeholder="Email admin"
                  style={{ ...inputInlineStyle, flex: 1, minWidth: '180px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button onClick={() => editarBarrio.mutate(barrio.id)} style={{ padding: '6px 16px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Guardar</button>
                <button onClick={() => setEditandoBarrio(null)} style={{ padding: '6px 16px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{barrio.nombre}</h3>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{barrio.direccion} · {barrio.emailAdmin}</p>
              </div>
              <button
                onClick={() => {
                  setEditandoBarrio(barrio.id)
                  setFormEditBarrio({ nombre: barrio.nombre, direccion: barrio.direccion, emailAdmin: barrio.emailAdmin })
                }}
                style={{ padding: '6px 14px', border: '1px solid #ddd', backgroundColor: 'transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                Editar barrio
              </button>
            </div>
          )}

          {/* Puntos de venta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {barrio.puntosVenta?.map((pv: any) => (
              <div key={pv.id}>
                {editandoPV === pv.id ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      defaultValue={pv.nombre}
                      onChange={e => setFormEditPV(f => ({ ...f, nombre: e.target.value }))}
                      placeholder="Nombre"
                      style={{ ...inputInlineStyle, flex: 1, minWidth: '120px' }}
                    />
                    <input
                      defaultValue={pv.ubicacion}
                      onChange={e => setFormEditPV(f => ({ ...f, ubicacion: e.target.value }))}
                      placeholder="Ubicación"
                      style={{ ...inputInlineStyle, flex: 1, minWidth: '120px' }}
                    />
                    <button onClick={() => editarPV.mutate(pv.id)} style={{ padding: '6px 12px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>OK</button>
                    <button onClick={() => setEditandoPV(null)} style={{ padding: '6px 12px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>X</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ padding: '4px 12px', backgroundColor: '#E1F5EE', color: '#085041', borderRadius: '20px', fontSize: '13px' }}>
                      {pv.nombre} — {pv.ubicacion}
                    </span>
                    <button
                      onClick={() => {
                        setEditandoPV(pv.id)
                        setFormEditPV({ nombre: pv.nombre, ubicacion: pv.ubicacion })
                      }}
                      style={{ padding: '3px 10px', border: '1px solid #ddd', backgroundColor: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#555' }}
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}