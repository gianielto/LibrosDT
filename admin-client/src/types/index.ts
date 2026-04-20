export interface Empleado {
  id: number;
  nombre: string | null;
  correo: string | null;
  rol: number | null;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Producto {
  id: number;
  nombre: string | null;
  codigo: string | null;
  descripcion: string | null;
  costo: number | null;
  stock: number | null;
  archivo_url: string | null;
  cloudinary_id: string | null;
  id_categoria: number | null;
  fecha_ingreso: string | null;
  eliminado: number | null;
  categoria: Categoria | null;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
}

export interface PedidoProducto {
  id: number;
  cantidad: number;
  precio: number;
  productos: {
    id: number;
    nombre: string | null;
    codigo: string | null;
    archivo_url: string | null;
  };
}

export interface Pedido {
  id: number;
  fecha: string;
  id_cliente: number;
  status: number | null;
  status_label: string;
  total: number;
  cliente: Cliente | null;
  pedidos_productos: PedidoProducto[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardData {
  ventasMes: number;
  pedidosMes: number;
  totalClientes: number;
  productosBajoStock: {
    id: number;
    nombre: string | null;
    codigo: string | null;
    stock: number | null;
  }[];
  pedidosPorStatus: {
    status: number | null;
    label: string;
    cantidad: number;
  }[];
}
