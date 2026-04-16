import axios from 'axios'
import { useAuthStore } from '../store/auth.store'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = useAuthStore.getState().refreshToken
      // Solo intentar refresh si hay un refresh token
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken })
          useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return axios(original)
        } catch {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      }
      // Sin refresh token — invitado, no redirigir
    }
    return Promise.reject(error)
  }
)