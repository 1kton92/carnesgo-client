import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { api } from '../../lib/axios'
import { useCarritoStore } from '../../store/carrito.store'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const limpiarCarrito = useCarritoStore(s => s.limpiar)

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const { data } = await api.post('/auth/login', { dni, password })
    limpiarCarrito()
    setAuth(data.usuario, data.accessToken, data.refreshToken, data.usuario.barrioId)
    if (data.usuario.rol === 'admin') navigate('/admin')
    else if (data.usuario.rol === 'repositor') navigate('/reposicion')
    else navigate('/catalogo')
  } catch (err: any) {
    setError(err.response?.data?.error || 'Error al iniciar sesión')
  } finally {
    setLoading(false)
  }
}

  async function handleInvitado() {
    navigate('/elegir-barrio')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '22px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#1a1a1a'
        }}>
          Bienvenidos a
        </h1>
        <h2 style={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: '700',
          color: '#1D9E75',
          marginBottom: '32px'
        }}>
          Tiendas CarnesGO
        </h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>
              Usuario / DNI
            </label>
            <input
              type="text"
              value={dni}
              onChange={e => setDni(e.target.value)}
              placeholder="Ingresá tu DNI"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresá tu contraseña"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{
              color: '#E24B4A',
              fontSize: '14px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1D9E75',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <button
          onClick={handleInvitado}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#1D9E75',
            border: '1px solid #1D9E75',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '12px'
          }}
        >
          Ingresar como invitado
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px'
        }}>
          <button
            onClick={() => navigate('/solicitud')}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Solicitar acceso
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            No recuerdo mi contraseña
          </button>
        </div>
      </div>
    </div>
  )
}