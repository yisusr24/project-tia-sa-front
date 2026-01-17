'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaBoxOpen, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
    const router = useRouter();
    const { usuario, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="navbar navbar-dark fixed-top" style={{ backgroundColor: '#a00404', height: '56px', zIndex: 1030 }}>
            <div className="container-fluid">
                <Link href="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
                    <FaBoxOpen size={20} /> TIA Inventory
                </Link>

                {usuario && (
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white">
                            <strong>{usuario.nombre} {usuario.apellido}</strong>
                            <span className="badge bg-light text-dark ms-2 small">{usuario.rol}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="btn btn-light btn-sm d-flex align-items-center gap-2"
                        >
                            <FaSignOutAlt /> Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
