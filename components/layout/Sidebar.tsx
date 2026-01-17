'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasModulePermission } from '@/types/auth';
import { FaChartPie, FaBox, FaClipboardList, FaCashRegister, FaStore, FaTags, FaTruck, FaBoxOpen, FaUpload, FaFileAlt } from 'react-icons/fa';

export default function Sidebar() {
    const pathname = usePathname();
    const { usuario } = useAuth();

    const isActive = (path: string) => pathname === path;

    if (!usuario) return null;

    const userRole = usuario.rol;

    return (
        <div
            className="sidebar bg-white border-end"
            style={{
                width: '250px',
                height: 'calc(100vh - 56px)',
                position: 'fixed',
                top: '56px',
                left: 0,
                overflowY: 'auto',
                boxShadow: '2px 0 5px rgba(0,0,0,0.05)'
            }}
        >
            <div className="p-3">
                <h6 className="text-gray-500 text-sm font-semibold mb-3">MENÚ PRINCIPAL</h6>

                <nav className="nav flex-column">
                    {/* Dashboard */}
                    {hasModulePermission(userRole, 'dashboard') && (
                        <Link
                            href="/"
                            className={`nav-link d-flex align-items-center ${isActive('/') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                        >
                            <FaChartPie className="me-2" /> Dashboard
                        </Link>
                    )}

                    <h6 className="text-gray-500 text-sm font-semibold mt-4 mb-2">MÓDULOS</h6>

                    {/* Productos */}
                    {hasModulePermission(userRole, 'productos') && (
                        <>
                            <Link
                                href="/productos"
                                className={`nav-link d-flex align-items-center ${isActive('/productos') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                            >
                                <FaBoxOpen className="me-2" /> Productos
                            </Link>
                            {usuario?.rol === 'SUPERADMIN' && (
                                <Link
                                    href="/productos/importar"
                                    className={`nav-link d-flex align-items-center ${isActive('/productos/importar') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                                >
                                    <FaUpload className="me-2" /> Productos Masivo
                                </Link>
                            )}
                        </>
                    )}

                    {/* Inventario */}
                    {hasModulePermission(userRole, 'inventario') && (
                        <Link
                            href="/inventario"
                            className={`nav-link d-flex align-items-center ${isActive('/inventario') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                        >
                            <FaClipboardList className="me-2" /> Inventario
                        </Link>
                    )}

                    {/* Ventas */}
                    {hasModulePermission(userRole, 'ventas') && (
                        <>
                            <Link
                                href="/ventas"
                                className={`nav-link d-flex align-items-center ${isActive('/ventas') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                            >
                                <FaCashRegister className="me-2" /> Caja (POS)
                            </Link>
                            <Link
                                href="/ventas/historial"
                                className={`nav-link d-flex align-items-center ${isActive('/ventas/historial') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                            >
                                <FaClipboardList className="me-2" /> Historial Ventas
                            </Link>
                        </>
                    )}

                    {/* Reportes */}
                    {usuario?.rol === 'SUPERADMIN' && (
                        <Link
                            href="/reportes"
                            className={`nav-link d-flex align-items-center ${isActive('/reportes') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                        >
                            <FaFileAlt className="me-2" /> Reportes
                        </Link>
                    )}

                    {/* Administración */}
                    {hasModulePermission(userRole, 'locales') && (
                        <>
                            <h6 className="text-gray-500 text-sm font-semibold mt-4 mb-2">ADMINISTRACIÓN</h6>

                            {hasModulePermission(userRole, 'locales') && (
                                <Link
                                    href="/locales"
                                    className={`nav-link d-flex align-items-center ${isActive('/locales') ? 'active bg-red-50 text-red-600' : 'text-gray-700'}`}
                                >
                                    <FaStore className="me-2" /> Locales
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </div>
    );
}
