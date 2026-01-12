'use client';

import { useState, useEffect } from 'react';
import { productoService } from '@/services/productoService';
import { Producto } from '@/types/producto';
import Link from 'next/link';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useToast } from '@/components/common/ToastNotification';
import { withAuth } from '@/components/auth/withAuth';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true); 
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'active' | 'deleted'>('active');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState<'delete' | 'restore'>('delete');
    const [selectedId, setSelectedId] = useState<number | null>(null); 

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        setPage(0); 
        cargarProductos(0);
    }, [filterStatus]); 

    const cargarProductos = async (pageParam = page) => {
        try {
            if (productos.length === 0) setLoading(true);

            if (searchQuery.trim()) {
                const data = await productoService.buscar(searchQuery);
                setProductos(data);
                setTotalPages(1); 
                setTotalElements(data.length);
                return;
            }

            if (filterStatus === 'active') {
                const response = await productoService.getAllPaginated(pageParam, size);
                setProductos(response.data);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                const response = await productoService.getDeletedPaginated(pageParam, size);
                setProductos(response.data);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            }
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            cargarProductos(newPage);
        }
    };

    const buscarProductos = async () => {
        if (!searchQuery.trim()) {
            setPage(0);
            cargarProductos(0);
            return;
        }

        try {
            setIsSearching(true); 
            const data = await productoService.buscar(searchQuery);
            setProductos(data);
            setTotalElements(data.length);
            setTotalPages(1); 
        } catch (error: any) {
            showToast('error', 'Error', 'Error en la búsqueda');
        } finally {
            setIsSearching(false);
        }
    };

    const openConfirmModal = (id: number, action: 'delete' | 'restore') => {
        setSelectedId(id);
        setActionType(action);
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedId) return;

        try {
            if (actionType === 'delete') {
                await productoService.delete(selectedId);
                showToast('success', 'Éxito', 'Producto eliminado correctamente');
            } else {
                await productoService.restore(selectedId);
                showToast('success', 'Éxito', 'Producto restaurado correctamente');
            }
            cargarProductos(page);
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || `Error al ${actionType === 'delete' ? 'eliminar' : 'restaurar'} producto`);
        } finally {
            setShowConfirmModal(false);
            setSelectedId(null);
        }
    };

    if (loading && productos.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-gray-600">Cargando productos...</p>
            </div>
        );
    }

    return (
        <>
            {ToastComponent}

            <ConfirmModal
                show={showConfirmModal}
                title={actionType === 'delete' ? "Eliminar Producto" : "Restaurar Producto"}
                message={actionType === 'delete'
                    ? "¿Está seguro que desea eliminar este producto?"
                    : "¿Está seguro que desea restaurar este producto y volverlo Activo?"}
                confirmText={actionType === 'delete' ? "Eliminar" : "Restaurar"}
                cancelText="Cancelar"
                variant={actionType === 'delete' ? "danger" : "success"}
                onConfirm={handleConfirmAction}
                onCancel={() => setShowConfirmModal(false)}
            />

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
                        <p className="text-gray-600">Gestión de productos del inventario</p>
                    </div>
                    <div className="col-auto">
                        <Link href="/productos/nuevo" className="btn btn-tia d-flex align-items-center gap-2">
                            <FaPlus /> Nuevo Producto
                        </Link>
                    </div>
                </div>

                <div className="card card-shadow mb-4">
                    <div className="card-body">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-4">
                                <div className="btn-group w-100" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${filterStatus === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setFilterStatus('active')}
                                    >
                                        Activos
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${filterStatus === 'deleted' ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={() => setFilterStatus('deleted')}
                                    >
                                        Inactivos
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nombre..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && buscarProductos()}
                                    disabled={filterStatus === 'deleted'}
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    onClick={buscarProductos}
                                    className="btn btn-tia w-100 d-flex align-items-center justify-content-center gap-2"
                                    disabled={isSearching || filterStatus === 'deleted'}
                                >
                                    {isSearching ? (
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                    ) : (
                                        <>
                                            <FaSearch /> Buscar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card card-shadow" style={{ minHeight: '300px', position: 'relative' }}>
                    <div className="card-body">
                        {isSearching && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255,255,255,0.6)',
                                zIndex: 10,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        )}

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio Venta</th>
                                        <th>Stock Mín</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center text-gray-500 py-4">
                                                {filterStatus === 'active'
                                                    ? 'No hay productos activos'
                                                    : 'No hay productos inactivos'}
                                            </td>
                                        </tr>
                                    ) : (
                                        productos.map((producto) => (
                                            <tr key={producto.id}>
                                                <td className="font-mono">{producto.codigo}</td>
                                                <td className="font-semibold">{producto.nombre}</td>
                                                <td>{producto.categoriaId}</td>
                                                <td>${producto.precioVenta?.toFixed(2)}</td>
                                                <td>{producto.stockMinimo || '-'}</td>
                                                <td>
                                                    {filterStatus === 'active' ? (
                                                        <>
                                                            <Link
                                                                href={`/productos/${producto.id}`}
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                title="Editar"
                                                            >
                                                                <FaEdit />
                                                            </Link>
                                                            <button
                                                                onClick={() => openConfirmModal(producto.id!, 'delete')}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Eliminar"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => openConfirmModal(producto.id!, 'restore')}
                                                            className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                                            title="Restaurar"
                                                        >
                                                            Restaurar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3">
                                <div className="text-muted small">
                                    Mostrando página {page + 1} de {totalPages} ({totalElements} registros)
                                </div>
                                <nav aria-label="Page navigation">
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 0}
                                            >
                                                Anterior
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            (i === 0 || i === totalPages - 1 || (i >= page - 2 && i <= page + 2)) && (
                                                <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(i)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            )
                                        ))}
                                        {totalPages > 5 && page < totalPages - 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}

                                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page === totalPages - 1}
                                            >
                                                Siguiente
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default withAuth(ProductosPage);
