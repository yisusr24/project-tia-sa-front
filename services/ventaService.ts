import api from './api';
import { Venta } from '@/types/venta';

export const ventaService = {
    crear: async (venta: Venta): Promise<Venta> => {
        const response = await api.post('/ventas', venta);
        return response.data.data;
    },

    getById: async (id: number): Promise<Venta> => {
        const response = await api.get(`/ventas/${id}`);
        return response.data.data;
    },

    getAllPaginated: async (page: number, size: number) => {
        const response = await api.get(`/ventas?page=${page}&size=${size}`);
        return response.data.data;
    }
};
