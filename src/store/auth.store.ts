import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Rol = 'comprador' | 'repositor' | 'admin'

export type Usuario = {
  id: string
  nombre: string
  apellido: string
  rol: Rol
}

interface AuthState {
  usuario: Usuario | null
  accessToken: string | null
  refreshToken: string | null
  barrioId: string | null
  setAuth: (usuario: Usuario, accessToken: string, refreshToken: string, barrioId: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      accessToken: null,
      refreshToken: null,
      barrioId: null,
      setAuth: (usuario, accessToken, refreshToken, barrioId) =>
        set({ usuario, accessToken, refreshToken, barrioId }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({ usuario: null, accessToken: null, refreshToken: null, barrioId: null })
    }),
    { name: 'carnesgo-auth' }
  )
)