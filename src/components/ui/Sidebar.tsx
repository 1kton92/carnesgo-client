import { useState } from 'react'

interface NavItem {
  label: string
  onClick: () => void
  activo?: boolean
}

interface SidebarProps {
  titulo?: string
  subtitulo?: string
  items: NavItem[]
  accionFooter?: {
    label: string
    onClick: () => void
    variante?: 'danger' | 'primary'
  }
  accionFooterSecundaria?: {
    label: string
    onClick: () => void
  }
}

export default function Sidebar({ titulo = 'CarnesGO', subtitulo, items, accionFooter, accionFooterSecundaria }: SidebarProps) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      {/* Barra superior mobile */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: '#1D9E75', padding: '12px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>{titulo}</h2>
        <button
          onClick={() => setAbierto(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: 'white', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: 'white', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: 'white', borderRadius: '2px' }} />
        </button>
      </div>

      {/* Overlay */}
      {abierto && (
        <div
          onClick={() => setAbierto(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 101,
            backgroundColor: 'rgba(0,0,0,0.4)'
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 102,
        width: '240px', backgroundColor: '#1D9E75',
        padding: '24px 12px',
        display: 'flex', flexDirection: 'column',
        transform: abierto ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: abierto ? '4px 0 16px rgba(0,0,0,0.2)' : 'none'
      }}>
        {/* Header del drawer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: '0 0 4px' }}>{titulo}</h2>
            {subtitulo && <p style={{ color: '#9FE1CB', fontSize: '12px', margin: 0 }}>{subtitulo}</p>}
          </div>
          <button
            onClick={() => setAbierto(false)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', padding: '0', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setAbierto(false) }}
              style={{
                display: 'block', width: '100%', padding: '12px 16px',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: '15px', fontWeight: '500',
                backgroundColor: item.activo ? '#0F6E56' : 'transparent',
                color: item.activo ? 'white' : '#9FE1CB'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {accionFooterSecundaria && (
            <button
              onClick={() => { accionFooterSecundaria.onClick(); setAbierto(false) }}
              style={{ padding: '10px', backgroundColor: 'white', border: 'none', color: '#1D9E75', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              {accionFooterSecundaria.label}
            </button>
          )}
          {accionFooter && (
            <button
              onClick={() => { accionFooter.onClick(); setAbierto(false) }}
              style={{
                padding: '10px', border: '1px solid #9FE1CB',
                backgroundColor: 'transparent', color: '#9FE1CB',
                borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
              }}
            >
              {accionFooter.label}
            </button>
          )}
        </div>
      </div>

      {/* Espaciado para que el contenido no quede debajo de la barra */}
      <div style={{ height: '50px' }} />
    </>
  )
}