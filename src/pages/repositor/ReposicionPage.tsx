import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { BrowserMultiFormatReader } from '@zxing/library'
import { api } from '../../lib/axios'
import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'
import { useCarritoStore } from '../../store/carrito.store'
import Sidebar from '../../components/ui/Sidebar'

type Seccion = 'reposicion' | 'retiro' | 'historial'

export default function ReposicionPage() {
  const navigate = useNavigate()
  const barrioId = useAuthStore(s => s.barrioId)
  const usuario = useAuthStore(s => s.usuario)
  const logout = useAuthStore(s => s.logout)
  const { limpiar } = useCarritoStore()

  const [seccion, setSeccion] = useState<Seccion>('reposicion')
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(barrioId || '')
  const [puntoVentaId, setPuntoVentaId] = useState('')
  const [escaneando, setEscaneando] = useState(false)
  const [codigoBarras, setCodigoBarras] = useState('')
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'ok' | 'error' } | null>(null)
  const [productoId, setProductoId] = useState('')
  const [pesoKg, setPesoKg] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [motivo, setMotivo] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef(new BrowserMultiFormatReader())

  const { data: barrios } = useQuery({
    queryKey: ['barrios'],
    queryFn: () => api.get('/admin/barrios').then(r => r.data)
  })

  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos').then(r => r.data)
  })

  const { data: historial } = useQuery({
    queryKey: ['historial-repositor', barrioSeleccionado, puntoVentaId],
    queryFn: () => api.get('/reposiciones', {
      params: {
        ...(puntoVentaId ? { puntoVentaId } : barrioSeleccionado ? { barrioId: barrioSeleccionado } : {})
      }
    }).then(r => r.data),
    enabled: seccion === 'historial'
  })

  const puntosVenta = barrios?.find((b: any) => b.id === barrioSeleccionado)?.puntosVenta || []

  const mostrarMensaje = (texto: string, tipo: 'ok' | 'error') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 3000)
  }

  const cargar = useMutation({
    mutationFn: () => api.post('/reposiciones/cargar', {
      codigoBarras, productoId, puntoVentaId,
      pesoKg: pesoKg ? Number(pesoKg) : undefined,
      fechaVencimiento: fechaVencimiento || undefined,
      motivo: motivo || undefined
    }),
    onSuccess: () => {
      mostrarMensaje('Artículo cargado correctamente', 'ok')
      setCodigoBarras('')
      setPesoKg('')
      setFechaVencimiento('')
    },
    onError: (err: any) => mostrarMensaje(err.response?.data?.error || 'Error al cargar', 'error')
  })

  const retirar = useMutation({
    mutationFn: () => api.post('/reposiciones/retirar', {
      codigoBarras, puntoVentaId, motivo: motivo || undefined
    }),
    onSuccess: () => {
      mostrarMensaje('Artículo retirado correctamente', 'ok')
      setCodigoBarras('')
      setMotivo('')
    },
    onError: (err: any) => mostrarMensaje(err.response?.data?.error || 'Error al retirar', 'error')
  })

  function validarCarga() {
    if (!puntoVentaId) { mostrarMensaje('Seleccioná un punto de venta', 'error'); return false }
    if (!productoId) { mostrarMensaje('Seleccioná un producto', 'error'); return false }
    if (!codigoBarras) { mostrarMensaje('Ingresá o escaneá el código de barras', 'error'); return false }
    return true
  }

  function validarRetiro() {
    if (!puntoVentaId) { mostrarMensaje('Seleccioná un punto de venta', 'error'); return false }
    if (!codigoBarras) { mostrarMensaje('Ingresá o escaneá el código de barras', 'error'); return false }
    return true
  }

  useEffect(() => {
    if (!escaneando || !videoRef.current) return
    readerRef.current.decodeFromVideoDevice(null, videoRef.current, (result) => {
      if (result) {
        setEscaneando(false)
        readerRef.current.reset()
        setCodigoBarras(result.getText())
      }
    })
    return () => { readerRef.current.reset() }
  }, [escaneando])

  const inputStyle = {
    width: '100%', padding: '8px 10px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' as const
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar
        subtitulo={usuario?.nombre}
        items={[
          { label: 'Reposición', onClick: () => setSeccion('reposicion'), activo: seccion === 'reposicion' },
          { label: 'Retiro', onClick: () => setSeccion('retiro'), activo: seccion === 'retiro' },
          { label: 'Historial', onClick: () => setSeccion('historial'), activo: seccion === 'historial' }
        ]}
        accionFooter={{ label: 'Cerrar sesión', onClick: () => { logout(); limpiar(); navigate('/login') } }}
      />

      <div style={{ padding: '16px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Selectores barrio y punto de venta */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Barrio</label>
            <select
              value={barrioSeleccionado}
              onChange={e => { setBarrioSeleccionado(e.target.value); setPuntoVentaId('') }}
              style={inputStyle}
            >
              <option value="">Elegir barrio...</option>
              {barrios?.map((b: any) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Punto de venta</label>
            <select
              value={puntoVentaId}
              onChange={e => setPuntoVentaId(e.target.value)}
              disabled={!barrioSeleccionado}
              style={{ ...inputStyle, opacity: !barrioSeleccionado ? 0.5 : 1 }}
            >
              <option value="">Elegir punto...</option>
              {puntosVenta.map((pv: any) => <option key={pv.id} value={pv.id}>{pv.nombre}</option>)}
            </select>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: mensaje.tipo === 'ok' ? '#E1F5EE' : '#FCEBEB', color: mensaje.tipo === 'ok' ? '#085041' : '#791F1F', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
            {mensaje.texto}
          </div>
        )}

        {/* Sección Reposición */}
        {seccion === 'reposicion' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a1a1a' }}>Cargar artículo</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Producto</label>
              <select value={productoId} onChange={e => setProductoId(e.target.value)} style={inputStyle}>
                <option value="">Elegir producto...</option>
                {productos?.map((p: any) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Peso (kg)</label>
                <input type="number" value={pesoKg} onChange={e => setPesoKg(e.target.value)} placeholder="1.2" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Vencimiento</label>
                <input type="date" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Código de barras</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={codigoBarras} onChange={e => setCodigoBarras(e.target.value)} placeholder="Escaneá o ingresá manualmente" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => setEscaneando(true)} style={{ padding: '8px 12px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Escanear
                </button>
              </div>
            </div>
            {escaneando && (
              <div style={{ marginBottom: '16px' }}>
                <video ref={videoRef} style={{ width: '100%', borderRadius: '12px', marginBottom: '8px' }} />
                <button onClick={() => { setEscaneando(false); readerRef.current.reset() }} style={{ width: '100%', padding: '10px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancelar escaneo
                </button>
              </div>
            )}
            <button onClick={() => validarCarga() && cargar.mutate()} disabled={cargar.isPending} style={{ width: '100%', padding: '14px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: cargar.isPending ? 0.7 : 1 }}>
              {cargar.isPending ? 'Cargando...' : 'Confirmar carga'}
            </button>
          </div>
        )}

        {/* Sección Retiro */}
        {seccion === 'retiro' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a1a1a' }}>Retirar artículo</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Motivo</label>
              <input type="text" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Vencimiento, rotura..." style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#555' }}>Código de barras</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={codigoBarras} onChange={e => setCodigoBarras(e.target.value)} placeholder="Escaneá o ingresá manualmente" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => setEscaneando(true)} style={{ padding: '8px 12px', backgroundColor: '#E24B4A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Escanear
                </button>
              </div>
            </div>
            {escaneando && (
              <div style={{ marginBottom: '16px' }}>
                <video ref={videoRef} style={{ width: '100%', borderRadius: '12px', marginBottom: '8px' }} />
                <button onClick={() => { setEscaneando(false); readerRef.current.reset() }} style={{ width: '100%', padding: '10px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancelar escaneo
                </button>
              </div>
            )}
            <button onClick={() => validarRetiro() && retirar.mutate()} disabled={retirar.isPending} style={{ width: '100%', padding: '14px', backgroundColor: '#E24B4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: retirar.isPending ? 0.7 : 1 }}>
              {retirar.isPending ? 'Retirando...' : 'Confirmar retiro'}
            </button>
          </div>
        )}

        {/* Sección Historial */}
        {seccion === 'historial' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a1a1a' }}>Historial</h3>
            {historial?.length === 0 && <p style={{ color: '#888' }}>No hay registros todavía</p>}
            {historial?.map((r: any) => (
              <div key={r.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: r.tipo === 'carga' ? '#E1F5EE' : '#FAECE7', color: r.tipo === 'carga' ? '#085041' : '#712B13' }}>
                      {r.tipo}
                    </span>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{r.articulo.producto.nombre}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#aaa' }}>{new Date(r.createdAt).toLocaleDateString('es-AR')}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#888', margin: '0' }}>{r.puntoVenta.nombre}</p>
                {r.motivo && <p style={{ fontSize: '12px', color: '#aaa', margin: '4px 0 0' }}>{r.motivo}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}