'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedRoute(props: P) {
        const router = useRouter();
        const pathname = usePathname();
        const { isAuthenticated, loading } = useAuth();

        useEffect(() => {
            if (!loading && !isAuthenticated && pathname !== '/login') {
                router.push('/login');
            }
        }, [isAuthenticated, loading, pathname, router]);

        if (loading) {
            return (
                <div className="text-center py-5">
                    <div className="spinner-tia mx-auto"></div>
                    <p className="mt-3">Cargando...</p>
                </div>
            );
        }

        if (!isAuthenticated && pathname !== '/login') {
            return null;
        }

        return <Component {...props} />;
    };
}
