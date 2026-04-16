import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ItemCarrito = {
  articuloId: string
  productoId: string
  nombre: string
  precio: number
  pesoKg: number | null
  unidad: 'kg' | 'unidad'
}

interface CarritoState {
  items: ItemCarrito[]
  barrioIdInvitado: string | null
  agregar: (item: ItemCarrito) => void
  quitar: (articuloId: string) => void
  limpiar: () => void
  total: () => number
  setBarrioIdInvitado: (id: string) => void
}

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set, get) => ({
      items: [],
      barrioIdInvitado: null,
      agregar: (item) => set((state) => ({ items: [...state.items, item] })),
      quitar: (articuloId) => set((state) => ({ items: state.items.filter(i => i.articuloId !== articuloId) })),
      limpiar: () => set({ items: [], barrioIdInvitado: null }),
      total: () => get().items.reduce((sum, i) => sum + i.precio, 0),
      setBarrioIdInvitado: (id) => set({ barrioIdInvitado: id })
    }),
    { name: 'carnesgo-carrito' }
  )
)