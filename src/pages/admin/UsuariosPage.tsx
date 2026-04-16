import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export default function UsuariosPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<'usuarios' | 'solicitudes'>('usuarios')
  const [editando, setEditando] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => api.get('/admin/usuarios').then(r => r.data)
  })

  const { data: solicitudes } = useQuery({
    queryKey: ['solicitudes'],
    queryFn: () => api.get('/admin/solicitudes').then(r => r.data)
  })

  const { data: barrios } = useQuery({
    queryKey: ['barrios'],
    queryFn: () => api.get('/admin/barrios').then(r => r.data)
  })

  const actualizar = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/usuarios/${id}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['usuarios'] }); setEditando(null) }
  })

  const resolver = useMutation({
    mutationFn: ({ id, accion, barrioId, rol }: any) => api.patch(`/admin/solicitudes/${id}/resolver`, { accion, barrioId, rol }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['solicitudes'] }) }
  })

  const inputStyle = { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }

  return (
    <div style={{ padding: '32px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>Usuarios</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['usuarios', 'solicitudes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: tab === t ? '#1D9E75' : '#e0e0e0', color: tab === t ? 'white' : '#333', cursor: 'pointer', fontWeight: '500', textTransform: 'capitalize' }}>
            {t} {t === 'solicitudes' && solicitudes?.length ? `(${solicitudes.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'usuarios' && (
        <>
          {isLoading && <p style={{ color: '#888' }}>Cargando...</p>}
          {usuarios?.map((u: any) => (
            <div key={u.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              {editando === u.id ? (
                <div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <input defaultValue={u.nombre} onChange={e => setForm((f: any) => ({ ...f, nombre: e.target.value }))} placeholder="Nombre" style={inputStyle} />
                    <input defaultValue={u.apellido} onChange={e => setForm((f: any) => ({ ...f, apellido: e.target.value }))} placeholder="Apellido" style={inputStyle} />
                    <input defaultValue={u.email} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} placeholder="Email" style={inputStyle} />
                    <input defaultValue={u.telefono} onChange={e => setForm((f: any) => ({ ...f, telefono: e.target.value }))} placeholder="Teléfono" style={inputStyle} />
                    <select defaultValue={u.rol} onChange={e => setForm((f: any) => ({ ...f, rol: e.target.value }))} style={inputStyle}>
                      <option value="comprador">Comprador</option>
                      <option value="repositor">Repositor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <select defaultValue={u.activo ? 'true' : 'false'} onChange={e => setForm((f: any) => ({ ...f, activo: e.target.value === 'true' }))} style={inputStyle}>
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => actualizar.mutate(u.id)} style={{ padding: '6px 16px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Guardar</button>
                    <button onClick={() => setEditando(null)} style={{ padding: '6px 16px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600', margin: '0 0 4px' }}>{u.nombre} {u.apellido}</p>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 2px' }}>{u.email} · DNI {u.dni}</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <span style={{ padding: '2px 8px', backgroundColor: '#EEEDFE', color: '#3C3489', borderRadius: '20px', fontSize: '11px' }}>{u.rol}</span>
                      <span style={{ padding: '2px 8px', backgroundColor: u.activo ? '#E1F5EE' : '#FCEBEB', color: u.activo ? '#085041' : '#791F1F', borderRadius: '20px', fontSize: '11px' }}>{u.activo ? 'activo' : 'inactivo'}</span>
                    </div>
                  </div>
                  <button onClick={() => { setEditando(u.id); setForm({ nombre: u.nombre, apellido: u.apellido, email: u.email, telefono: u.telefono, rol: u.rol, activo: u.activo }) }} style={{ padding: '6px 14px', border: '1px solid #ddd', backgroundColor: 'transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {tab === 'solicitudes' && (
        <>
          {solicitudes?.length === 0 && <p style={{ color: '#888' }}>No hay solicitudes pendientes</p>}
          {solicitudes?.map((s: any) => (
            <div key={s.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ fontWeight: '600', margin: '0 0 4px' }}>{s.nombre} {s.apellido}</p>
              <p style={{ color: '#888', fontSize: '13px', margin: '0 0 12px' }}>DNI {s.dni} · {s.email} · {s.telefono}</p>
              <p style={{ color: '#888', fontSize: '13px', margin: '0 0 12px' }}>{s.direccion}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select id={`barrio-${s.id}`} style={inputStyle}>
                  <option value="">Asignar barrio...</option>
                  {barrios?.map((b: any) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                </select>
                <select id={`rol-${s.id}`} style={inputStyle}>
                  <option value="comprador">Comprador</option>
                  <option value="repositor">Repositor</option>
                </select>
                <button
                  onClick={() => {
                    const barrioId = (document.getElementById(`barrio-${s.id}`) as HTMLSelectElement).value
                    const rol = (document.getElementById(`rol-${s.id}`) as HTMLSelectElement).value
                    resolver.mutate({ id: s.id, accion: 'aprobar', barrioId, rol })
                  }}
                  style={{ padding: '6px 16px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Aprobar
                </button>
                <button
                  onClick={() => resolver.mutate({ id: s.id, accion: 'rechazar' })}
                  style={{ padding: '6px 16px', backgroundColor: '#E24B4A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}