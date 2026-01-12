import api from './api';
import { Local, LocalDTO } from '@/types/local';
import { ApiResponse } from '@/types/api';

export const localService = {
    getAll: async (): Promise<Local[]> => {
        const response = await api.get<ApiResponse<Local[]>>('/locales');
        return response.data.data || [];
    },

    getById: async (id: number): Promise<Local> => {
        const response = await api.get<ApiResponse<Local>>(`/locales/${id}`);
        return response.data.data!;
    },

    create: async (data: LocalDTO): Promise<Local> => {
        const response = await api.post<ApiResponse<Local>>('/locales', data);
        return response.data.data!;
    },


    update: async (id: number, data: LocalDTO): Promise<Local> => {
        const response = await api.put<ApiResponse<Local>>(`/locales/${id}`, data);
        return response.data.data!;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/locales/${id}`);
    },

    getDeleted: async (): Promise<Local[]> => {
        const response = await api.get<ApiResponse<Local[]>>('/locales/eliminados');
        return response.data.data || [];
    },

    restore: async (id: number): Promise<void> => {
        await api.put(`/locales/${id}/restaurar`);
    }
};
