import api from './api';
import { Usuario } from '@/types/auth';

interface LoginRequest {
    nombreUsuario: string;
    clave: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data?: Usuario;
}

export const authService = {
    login: async (username: string, password: string): Promise<Usuario> => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', {
                nombreUsuario: username,
                clave: password
            });

            if (response.data.success && response.data.data) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Error al iniciar sesión');
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    hasRole: (usuario: Usuario | null, role: string): boolean => {
        return usuario?.rol === role;
    },

    isAdmin: (usuario: Usuario | null): boolean => {
        return usuario?.rol === 'SUPERADMIN' || usuario?.rol === 'ADMIN';
    }
};
