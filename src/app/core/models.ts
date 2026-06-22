// Modelos compartidos del sistema POS

export const API_URL = 'http://localhost:8080/api';

export type Rol = 'ADMIN' | 'CAJERO';

export interface AuthResponse {
  token: string;
  id: number;
  nombre: string;
  username: string;
  rol: Rol;
}

export interface Usuario {
  id?: number;
  nombre: string;
  username: string;
  password?: string;
  rol: Rol;
  activo: boolean;
}

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  codigo: string;
  precio: number;
  stock: number;
  categoria?: Categoria;
  categoriaId?: number;
  activo?: boolean;
}

export interface Cliente {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  edad: number;
  telefono?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  aceptaTerminos: boolean;
  fechaRegistro?: string;
}

export interface DetalleVenta {
  id?: number;
  productoId: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Venta {
  id?: number;
  clienteId?: number;
  clienteNombre?: string;
  usuarioNombre?: string;
  fecha?: string;
  total: number;
  metodoPago: string;
  detalles: DetalleVenta[];
}
