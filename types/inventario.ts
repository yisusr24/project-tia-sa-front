export interface InventarioDTO {
    id: number;
    productoId: number;
    localId: number;
    stockActual: number;
    stockMinimo: number;
    stockMaximo?: number;
    ubicacion?: string;
    lote?: string;
    fechaVencimiento?: string;

    productoNombre: string;
    productoCodigo: string;
    localNombre: string;
    precioVenta: number;
}

export interface MovimientoInventarioDTO {
    localId: number;
    productoId: number;
    tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'VENTA';
    cantidad: number;
    precioUnitario?: number;
    motivo?: string;
    numeroDocumento?: string;
}
