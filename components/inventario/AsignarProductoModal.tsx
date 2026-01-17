import { useState, useEffect, useRef } from 'react';
import { productoService } from '@/services/productoService';
import { inventarioService } from '@/services/inventarioService';
import { Producto } from '@/types/producto';
import { useToast } from '@/components/common/ToastNotification';
import { FaSave, FaTimes, FaSearch } from 'react-icons/fa';

interface AsignarProductoModalProps {
    show: boolean;
    localId: number | null;
    existingProductIds: number[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AsignarProductoModal({ show, localId, existingProductIds, onClose, onSuccess }: AsignarProductoModalProps) {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<string>('');
    const [selectedProductObj, setSelectedProductObj] = useState<Producto | null>(null);
    const [stockInicial, setStockInicial] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false);
    const { showToast, ToastComponent } = useToast();


    useEffect(() => {
        if (show) {
            setStockInicial(0);
            setSelectedProducto('');
            setSelectedProductObj(null);
            setSearchTerm('');
            setProductos([]);
            setLoading(false);
            isSubmittingRef.current = false;
        }
    }, [show]);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 3 && !selectedProducto) {
                buscarProductos(searchTerm);
            } else if (searchTerm.length < 3) {
                setProductos([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedProducto]);

    const buscarProductos = async (query: string) => {
        setIsSearching(true);
        try {
            const data = await productoService.buscar(query);
            const disponibles = data.filter(p => !existingProductIds.includes(p.id!));
            setProductos(disponibles);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectProducto = (p: Producto) => {
        setSelectedProducto(p.id!.toString());
        setSelectedProductObj(p);
        setProductos([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProducto || !localId) return;

        if (isSubmittingRef.current || loading) return;

        isSubmittingRef.current = true;
        setLoading(true);

        try {
            await inventarioService.asignarProducto(localId, parseInt(selectedProducto), stockInicial);
            showToast('success', 'Éxito', 'Producto asignado correctamente');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || 'Error al asignar producto');
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            {ToastComponent}
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content shadow-lg">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Asignar Nuevo Producto</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Producto *</label>
                                {!selectedProducto ? (
                                    <div className="position-relative">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <FaSearch className="text-muted" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Buscar por nombre o código (min 3 letras)..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>



                                        {isSearching && (
                                            <div className="position-absolute w-100 bg-white shadow-lg border rounded mt-1 overflow-auto" style={{ maxHeight: '200px', zIndex: 1050 }}>
                                                <div className="p-2 text-center text-muted small">Buscando...</div>
                                            </div>
                                        )}

                                        {!isSearching && searchTerm.length >= 3 && productos.length === 0 && (
                                            <div className="position-absolute w-100 bg-white shadow-lg border rounded mt-1" style={{ zIndex: 1050 }}>
                                                <div className="p-2 text-center text-muted small">No se encontraron productos disponibles</div>
                                            </div>
                                        )}

                                        {!isSearching && productos.length > 0 && (
                                            <ul className="list-group position-absolute w-100 shadow-lg mt-1 overflow-auto" style={{ maxHeight: '250px', zIndex: 1050 }}>
                                                {productos.map(p => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                        onClick={() => handleSelectProducto(p)}
                                                    >
                                                        <div>
                                                            <div className="fw-bold">{p.nombre}</div>
                                                            <div className="small text-muted">{p.codigo}</div>
                                                        </div>
                                                        <span className="badge bg-light text-dark">ID: {p.id}</span>
                                                    </button>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <div className="alert alert-primary d-flex justify-content-between align-items-center p-2 mb-0">
                                        <div>
                                            <div className="fw-bold">{selectedProductObj?.nombre}</div>
                                            <div className="small">{selectedProductObj?.codigo}</div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger bg-white"
                                            onClick={() => { setSelectedProducto(''); setSelectedProductObj(null); setSearchTerm(''); setProductos([]); }}
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Stock Inicial</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    value={stockInicial}
                                    onChange={(e) => setStockInicial(parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary border-0" onClick={onClose} disabled={loading}>
                                <FaTimes className="me-2" /> Cancelar
                            </button>
                            <button type="submit" className="btn btn-success border-0" disabled={loading || !selectedProducto}>
                                {loading ? 'Asignando...' : <><FaSave className="me-2" /> Asignar</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
