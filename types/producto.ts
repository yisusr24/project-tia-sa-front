
export interface Producto {
    id?: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoriaId: number;
    proveedorId?: number;
    unidadMedidaId: number;
    precioCompra?: number;
    precioVenta: number;
    precioVentaMinimo?: number;
    stockMinimo?: number;
    stockMaximo?: number;
    imagenUrl?: string;
    esPerecedero?: boolean;
    diasVigencia?: number;
    activo?: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    categoriaNombre?: string;
    proveedorNombre?: string;
}

export interface ProductoDTO {
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoriaId: number;
    proveedorId?: number;
    unidadMedidaId: number;
    precioCompra?: number;
    precioVenta: number;
    precioVentaMinimo?: number;
    stockMinimo?: number;
    stockMaximo?: number;
    imagenUrl?: string;
    esPerecedero?: boolean;
    diasVigencia?: number;
}

export interface BusquedaProductoDTO {
    query: string;
    limit?: number;
}
