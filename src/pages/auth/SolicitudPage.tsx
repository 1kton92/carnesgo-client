import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/axios'

export default function SolicitudPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '',
    telefono: '', direccion: '', email: ''
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/admin/solicitudes', form)
      setEnviado(true)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al enviar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' as const
  }
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }

  if (enviado) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h2 style={{ color: '#1D9E75', marginBottom: '12px' }}>Solicitud enviada</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>La administración revisará tu solicitud y te contactará.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '12px 24px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          Volver al inicio
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#f5f5f5' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>
          ← Volver
        </button>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: '#1a1a1a' }}>Solicitar acceso</h2>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'nombre', label: 'Nombre', placeholder: 'Juan' },
            { name: 'apellido', label: 'Apellido', placeholder: 'Pérez' },
            { name: 'dni', label: 'DNI', placeholder: '20123456' },
            { name: 'telefono', label: 'Teléfono', placeholder: '3411234567' },
            { name: 'direccion', label: 'Dirección', placeholder: 'Casa 42' },
            { name: 'email', label: 'Correo electrónico', placeholder: 'juan@email.com' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{field.label}</label>
              <input
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={inputStyle}
                required
              />
            </div>
          ))}

          {error && <p style={{ color: '#E24B4A', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </div>
    </div>
  )
}