'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '@/types/auth';

interface AuthContextType {
    usuario: Usuario | null;
    login: (usuario: Usuario) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        setLoading(false);
    }, []);

    const login = (usuario: Usuario) => {
        setUsuario(usuario);
        localStorage.setItem('usuario', JSON.stringify(usuario));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
    };

    const isAuthenticated = usuario !== null;

    return (
        <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook para usar autenticacion
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}
