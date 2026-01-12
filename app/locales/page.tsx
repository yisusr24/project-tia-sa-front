'use client';

import { useState, useEffect } from 'react';
import { localService } from '@/services/localService';
import { Local } from '@/types/local';
import Link from 'next/link';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useToast } from '@/components/common/ToastNotification';
import { withAuth } from '@/components/auth/withAuth';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaStore, FaMapMarkerAlt } from 'react-icons/fa';

function LocalesPage() {
    const [locales, setLocales] = useState<Local[]>([]);
    const [filteredLocales, setFilteredLocales] = useState<Local[]>([]);
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

    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        setPage(0);
        setSearchQuery('');
        setFilteredLocales([]);
        cargarLocales();
    }, [filterStatus]);

    const cargarLocales = async () => {
        try {
            setLoading(true);
            let data: Local[] = [];
            if (filterStatus === 'active') {
                data = await localService.getAll();
            } else {
                data = await localService.getDeleted();
            }
            setLocales(data);
            setFilteredLocales(data);
            setTotalPages(Math.ceil(data.length / size));
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || 'Error al cargar locales');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setFilteredLocales(locales);
            setPage(0);
            return;
        }

        setIsSearching(true);

        const lowerQuery = searchQuery.toLowerCase();
        const filtered = locales.filter(local =>
            local.nombre.toLowerCase().includes(lowerQuery)
        );

        setFilteredLocales(filtered);
        setPage(0);
        setIsSearching(false);
    };

    useEffect(() => {
        setTotalPages(Math.ceil(filteredLocales.length / size));
    }, [filteredLocales, size]);

    const currentData = filteredLocales.slice(page * size, (page + 1) * size);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
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
                await localService.delete(selectedId);
                showToast('success', 'Éxito', 'Local eliminado correctamente');
            } else {
                await localService.restore(selectedId);
                showToast('success', 'Éxito', 'Local restaurado correctamente');
            }
            cargarLocales();
        } catch (error: any) {
            console.error(`Error al ${actionType === 'delete' ? 'eliminar' : 'restaurar'}:`, error);
            showToast('error', 'Error', error.response?.data?.message || `Error al ejecutar acción`);
        } finally {
            setShowConfirmModal(false);
            setSelectedId(null);
        }
    };

    if (loading && locales.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-gray-600">Cargando locales...</p>
            </div>
        );
    }

    return (
        <>
            {ToastComponent}

            <ConfirmModal
                show={showConfirmModal}
                title={actionType === 'delete' ? "Eliminar Local" : "Restaurar Local"}
                message={actionType === 'delete'
                    ? "¿Está seguro que desea eliminar este local?"
                    : "¿Está seguro que desea restaurar este local?"}
                confirmText={actionType === 'delete' ? "Eliminar" : "Restaurar"}
                cancelText="Cancelar"
                variant={actionType === 'delete' ? "danger" : "success"}
                onConfirm={handleConfirmAction}
                onCancel={() => setShowConfirmModal(false)}
            />

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h1 className="text-3xl font-bold text-gray-800 d-flex align-items-center gap-2">
                            Locales
                        </h1>
                        <p className="text-gray-600">Gestión de tiendas, sucursales y bodegas</p>
                    </div>
                    <div className="col-auto">
                        <Link href="/locales/nuevo" className="btn btn-tia d-flex align-items-center gap-2">
                            <FaPlus /> Nuevo Local
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
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    disabled={filterStatus === 'deleted'}
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    onClick={handleSearch}
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

                <div className="card card-shadow">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Ciudad</th>
                                        <th>Tipo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-gray-500 py-4">
                                                {filterStatus === 'active'
                                                    ? 'No hay locales activos'
                                                    : 'No hay locales inactivos'}
                                            </td>
                                        </tr>
                                    ) : (
                                        currentData.map((local) => (
                                            <tr key={local.id}>
                                                <td className="font-mono">{local.codigo}</td>
                                                <td className="font-semibold">{local.nombre}</td>
                                                <td>{local.ciudad}</td>
                                                <td>{local.tipo}</td>
                                                <td>
                                                    {filterStatus === 'active' ? (
                                                        <>
                                                            <Link
                                                                href={`/locales/${local.id}`}
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                title="Editar"
                                                            >
                                                                <FaEdit />
                                                            </Link>
                                                            <button
                                                                onClick={() => openConfirmModal(local.id, 'delete')}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Eliminar"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => openConfirmModal(local.id, 'restore')}
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
                                    Mostrando {page * size + 1} - {Math.min((page + 1) * size, filteredLocales.length)} de {filteredLocales.length}
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
                                            <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(i)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
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

export default withAuth(LocalesPage);
