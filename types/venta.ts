export interface DetalleVenta {
    id?: number;
    productoId: number;
    productoNombre?: string;
    productoCodigo?: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    descuento: number;
    total: number;
}

export interface Venta {
    id?: number;
    numeroVenta?: string;
    localId: number;
    localNombre?: string;
    vendedorId: number;
    vendedorNombre?: string;

    clienteNombre: string;
    clienteDocumento: string;

    subtotal: number;
    impuesto: number;
    descuento: number;
    total: number;

    metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
    estado?: string;
    observaciones?: string;

    items: DetalleVenta[];
    createdAt?: string;
}

export interface VentaResumenDTO {
    id: number;
    numeroVenta: string;
    fecha: string;
    cliente: string;
    total: number;
    estado: string;
}
