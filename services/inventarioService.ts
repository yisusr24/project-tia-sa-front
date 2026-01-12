import api from './api';
import { InventarioDTO, MovimientoInventarioDTO } from '@/types/inventario';
import { ApiResponse } from '@/types/api';

export const inventarioService = {
    getByLocal: async (localId: number): Promise<InventarioDTO[]> => {
        const response = await api.get<ApiResponse<InventarioDTO[]>>(`/inventario/local/${localId}`);
        return response.data.data!;
    },

    asignarProducto: async (localId: number, productoId: number, stockInicial: number) => {
        const response = await api.post<ApiResponse<string>>('/inventario/asignar', {
            localId,
            productoId,
            stockInicial
        });
        return response.data;
    },

    registrarMovimiento: async (movimiento: MovimientoInventarioDTO) => {
        const response = await api.post<ApiResponse<string>>('/inventario/movimiento', movimiento);
        return response.data;
    }
};
