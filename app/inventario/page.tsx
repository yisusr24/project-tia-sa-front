'use client';

import { useState, useEffect } from 'react';
import { localService } from '@/services/localService';
import { inventarioService } from '@/services/inventarioService';
import { Local } from '@/types/local';
import { InventarioDTO } from '@/types/inventario';
import { useToast } from '@/components/common/ToastNotification';
import { withAuth } from '@/components/auth/withAuth';
import { FaBoxes, FaPlus, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import AsignarProductoModal from '@/components/inventario/AsignarProductoModal';
import MovimientoModal from '@/components/inventario/MovimientoModal';

function InventarioPage() {
    const [locales, setLocales] = useState<Local[]>([]);
    const [selectedLocal, setSelectedLocal] = useState<number | null>(null);
    const [inventario, setInventario] = useState<InventarioDTO[]>([]);
    const [filteredInventario, setFilteredInventario] = useState<InventarioDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [showAsignar, setShowAsignar] = useState(false);
    const [showMovimiento, setShowMovimiento] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventarioDTO | null>(null);

    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        loadLocales();
    }, []);

    useEffect(() => {
        if (selectedLocal) {
            loadInventario(selectedLocal);
        } else {
            setInventario([]);
            setFilteredInventario([]);
        }
    }, [selectedLocal]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredInventario(inventario);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = inventario.filter(i =>
                i.productoNombre.toLowerCase().includes(lowerQuery) ||
                i.productoCodigo.toLowerCase().includes(lowerQuery)
            );
            setFilteredInventario(filtered);
        }
    }, [searchQuery, inventario]);

    const loadLocales = async () => {
        try {
            const data = await localService.getAll();
            setLocales(data);
        } catch (error) {
            showToast('error', 'Error', 'No se pudieron cargar los locales');
        }
    };

    const loadInventario = async (localId: number) => {
        setLoading(true);
        try {
            const data = await inventarioService.getByLocal(localId);
            setInventario(data);
            setFilteredInventario(data);
        } catch (error) {
            showToast('error', 'Error', 'No se pudo cargar el inventario');
        } finally {
            setLoading(false);
        }
    };

    const handleMovimientoClick = (item: InventarioDTO) => {
        setSelectedItem(item);
        setShowMovimiento(true);
    };

    return (
        <>
            {ToastComponent}

            <AsignarProductoModal
                show={showAsignar}
                localId={selectedLocal}
                existingProductIds={inventario.map(i => i.productoId)}
                onClose={() => setShowAsignar(false)}
                onSuccess={() => selectedLocal && loadInventario(selectedLocal)}
            />

            <MovimientoModal
                show={showMovimiento}
                item={selectedItem}
                localId={selectedLocal}
                onClose={() => { setShowMovimiento(false); setSelectedItem(null); }}
                onSuccess={() => selectedLocal && loadInventario(selectedLocal)}
            />

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h1 className="text-3xl font-bold text-gray-800 d-flex align-items-center gap-2">
                            Gestión de Inventario
                        </h1>
                        <p className="text-gray-600">Control de stock por local y movimientos</p>
                    </div>
                </div>

                <div className="card card-shadow mb-4">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Seleccione un Local:</label>
                                <select
                                    className="form-select form-select-lg"
                                    value={selectedLocal || ''}
                                    onChange={(e) => setSelectedLocal(Number(e.target.value) || null)}
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {locales.map(local => (
                                        <option key={local.id} value={local.id}>
                                            {local.codigo} - {local.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedLocal && (
                                <div className="col-md-8 text-end">
                                    <button
                                        className="btn btn-tia btn-lg d-inline-flex align-items-center gap-2"
                                        onClick={() => setShowAsignar(true)}
                                    >
                                        Asignar Producto
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {selectedLocal ? (
                    <div className="card card-shadow">
                        <div className="card-header bg-white py-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <FaSearch className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Buscar producto en este local..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="mt-2 text-muted">Cargando inventario...</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Código</th>
                                                <th>Producto</th>
                                                <th className="text-center">Stock Actual</th>
                                                <th className="text-center">Min / Max</th>
                                                <th className="text-end">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredInventario.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-5 text-gray-500">
                                                        {searchQuery ? 'No se encontraron productos' : 'No hay productos asignados a este local'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredInventario.map(item => (
                                                    <tr key={item.id}>
                                                        <td className="font-mono text-sm">{item.productoCodigo}</td>
                                                        <td className="fw-semibold">{item.productoNombre}</td>
                                                        <td className="text-center">
                                                            <span className={`badge fs-6 ${item.stockActual <= item.stockMinimo
                                                                ? 'bg-danger'
                                                                : 'bg-success'
                                                                }`}>
                                                                {item.stockActual}
                                                            </span>
                                                        </td>
                                                        <td className="text-center text-muted small">
                                                            {item.stockMinimo} / {item.stockMaximo || '-'}
                                                        </td>
                                                        <td className="text-end">
                                                            <button
                                                                className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                                                                onClick={() => handleMovimientoClick(item)}
                                                                title="Registrar entrada/salida"
                                                            >
                                                                <FaExchangeAlt /> Movimiento
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5 text-gray-400">
                        <h3>Seleccione un local para gestionar su inventario</h3>
                    </div>
                )}
            </div>
        </>
    );
}

export default withAuth(InventarioPage);
