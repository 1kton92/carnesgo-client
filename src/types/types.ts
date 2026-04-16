export type Rol = 'comprador' | 'repositor' | 'admin'

export type Usuario = {
  id: string
  nombre: string
  apellido: string
  rol: Rol
}

export type Barrio = {
  id: string
  nombre: string
  direccion: string
  emailAdmin: string
  activo: boolean
}

export type PuntoVenta = {
  id: string
  barrioId: string
  nombre: string
  ubicacion: string
  activo: boolean
}

export type Categoria = {
  id: string
  nombre: string
  orden: number
}

export type Producto = {
  id: string
  nombre: string
  unidad: 'kg' | 'unidad'
  activo: boolean
  categoria: Categoria
  precio: string | null
}

export type Articulo = {
  id: string
  codigoBarras: string
  pesoKg: string | null
  fechaVencimiento: string | null
}

export type ProductoDisponible = {
  productoId: string
  nombre: string
  unidad: 'kg' | 'unidad'
  categoria: Categoria
  precio: string | null
  cantidadDisponible: number
  articulos: Articulo[]
}

export type ItemCarrito = {
  articuloId: string
  productoId: string
  nombre: string
  precio: number
  pesoKg: number | null
  unidad: 'kg' | 'unidad'
}

export type Venta = {
  id: string
  total: number
  estado: string
  metodoPago: string
  createdAt: string
}