import api from './api';
import { Producto, ProductoDTO, BusquedaProductoDTO } from '@/types/producto';
import { ApiResponse, PageResponse } from '@/types/api';

export const productoService = {
    getAll: async (): Promise<Producto[]> => {
        const response = await api.get<ApiResponse<Producto[]>>('/productos');
        return response.data.data || [];
    },

    getById: async (id: number): Promise<Producto> => {
        const response = await api.get<ApiResponse<Producto>>(`/productos/${id}`);
        return response.data.data!;
    },

    buscar: async (query: string): Promise<Producto[]> => {
        const payload: BusquedaProductoDTO = { query };
        const response = await api.post<ApiResponse<Producto[]>>('/productos/buscar', payload);
        return response.data.data || [];
    },

    buscarPaginado: async (query: string, page: number, size: number): Promise<PageResponse<Producto>> => {
        const payload: BusquedaProductoDTO = { query };
        const response = await api.post<ApiResponse<PageResponse<Producto>>>(`/productos/buscar?page=${page}&size=${size}`, payload);
        return response.data.data!;
    },

    create: async (data: ProductoDTO): Promise<Producto> => {
        const response = await api.post<ApiResponse<Producto>>('/productos', data);
        return response.data.data!;
    },

    update: async (id: number, data: ProductoDTO): Promise<Producto> => {
        const response = await api.put<ApiResponse<Producto>>(`/productos/${id}`, data);
        return response.data.data!;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/productos/${id}`);
    },

    getDeleted: async (): Promise<Producto[]> => {
        const response = await api.get<ApiResponse<Producto[]>>('/productos/eliminados');
        return response.data.data || [];
    },

    restore: async (id: number): Promise<void> => {
        await api.put(`/productos/${id}/restaurar`);
    },

    getAllPaginated: async (page: number, size: number): Promise<PageResponse<Producto>> => {
        const response = await api.get<ApiResponse<PageResponse<Producto>>>(`/productos?page=${page}&size=${size}`);
        return response.data.data!;
    },

    getDeletedPaginated: async (page: number, size: number): Promise<PageResponse<Producto>> => {
        const response = await api.get<ApiResponse<PageResponse<Producto>>>(`/productos/eliminados?page=${page}&size=${size}`);
        return response.data.data!;
    },
};
