import api from './api';
import { ApiResponse } from '@/types/api';

export interface ProveedorDTO {
    id: number;
    ruc: string;
    razonSocial: string;
    telefono: string;
    correo: string;
    direccion: string;
    activo: boolean;
}

export const proveedorService = {
    getAll: async (): Promise<ProveedorDTO[]> => {
        const response = await api.get<ApiResponse<ProveedorDTO[]>>('/proveedores');
        return response.data.data || [];
    }
};
