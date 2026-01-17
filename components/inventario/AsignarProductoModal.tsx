import { useState, useEffect, useRef } from 'react';
import { productoService } from '@/services/productoService';
import { inventarioService } from '@/services/inventarioService';
import { Producto } from '@/types/producto';
import { useToast } from '@/components/common/ToastNotification';
import { FaSave, FaTimes } from 'react-icons/fa';

interface AsignarProductoModalProps {
    show: boolean;
    localId: number | null;
    existingProductIds: number[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AsignarProductoModal({ show, localId, existingProductIds, onClose, onSuccess }: AsignarProductoModalProps) {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<string>('');
    const [stockInicial, setStockInicial] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false);
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        if (show && localId) {
            cargarProductos();
            setStockInicial(0);
            setSelectedProducto('');
            setLoading(false);
            isSubmittingRef.current = false;
        }
    }, [show, localId, existingProductIds]);

    const cargarProductos = async () => {
        try {
            const data = await productoService.getAll();
            const disponibles = data.filter(p => !existingProductIds.includes(p.id!));
            setProductos(disponibles);
        } catch (error) {
            showToast('error', 'Error', 'No se pudieron cargar los productos');
        }
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
                            {productos.length === 0 ? (
                                <div className="alert alert-warning">
                                    No hay productos disponibles para asignar (todos ya están en este local).
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Producto *</label>
                                        <select
                                            className="form-select"
                                            value={selectedProducto}
                                            onChange={(e) => setSelectedProducto(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Seleccionar Producto --</option>
                                            {productos.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.codigo} - {p.nombre}
                                                </option>
                                            ))}
                                        </select>
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
                                </>
                            )}
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary border-0" onClick={onClose} disabled={loading}>
                                <FaTimes className="me-2" /> Cancelar
                            </button>
                            <button type="submit" className="btn btn-success border-0" disabled={loading || productos.length === 0}>
                                {loading ? 'Asignando...' : <><FaSave className="me-2" /> Asignar</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
