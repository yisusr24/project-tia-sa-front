import { useState, useEffect, useRef } from 'react';
import { inventarioService } from '@/services/inventarioService';
import { InventarioDTO } from '@/types/inventario';
import { useToast } from '@/components/common/ToastNotification';
import { FaExchangeAlt, FaTimes } from 'react-icons/fa';

interface MovimientoModalProps {
    show: boolean;
    item: InventarioDTO | null;
    localId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function MovimientoModal({ show, item, localId, onClose, onSuccess }: MovimientoModalProps) {
    const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
    const [cantidad, setCantidad] = useState<number>(1);
    const [motivo, setMotivo] = useState('');
    const [documento, setDocumento] = useState('');
    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false); 
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        if (show) {
            setTipo('ENTRADA');
            setCantidad(1);
            setMotivo('');
            setDocumento('');
            setLoading(false);
            isSubmittingRef.current = false;
        }
    }, [show]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !localId) return;

        if (isSubmittingRef.current || loading) return;

        if (tipo === 'SALIDA' && cantidad > item.stockActual) {
            showToast('error', 'Stock Insuficiente', `Solo tienes ${item.stockActual} unidades disponibles.`);
            return;
        }

        isSubmittingRef.current = true;
        setLoading(true);

        try {
            await inventarioService.registrarMovimiento({
                localId,
                productoId: item.productoId,
                tipoMovimiento: tipo,
                cantidad,
                motivo,
                numeroDocumento: documento
            });
            showToast('success', 'Éxito', 'Movimiento registrado correctamente');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al registrar movimiento';
            showToast('error', 'Error', msg);
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    if (!show || !item) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            {ToastComponent}
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content shadow-lg">
                    <div className={`modal-header text-white ${tipo === 'ENTRADA' ? 'bg-primary' : 'bg-danger'}`}>
                        <h5 className="modal-title">Registrar Movimiento - {item.productoNombre}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="alert alert-info py-2">
                                <strong>Stock Actual:</strong> {item.stockActual}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Tipo de Movimiento</label>
                                <div className="btn-group w-100" role="group">
                                    <input
                                        type="radio" className="btn-check" name="tipo" id="entrada"
                                        checked={tipo === 'ENTRADA'} onChange={() => setTipo('ENTRADA')}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="entrada">ENTRADA (Compra/Devolución)</label>

                                    <input
                                        type="radio" className="btn-check" name="tipo" id="salida"
                                        checked={tipo === 'SALIDA'} onChange={() => setTipo('SALIDA')}
                                    />
                                    <label className="btn btn-outline-danger" htmlFor="salida">SALIDA (Ajuste/Merma)</label>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Cantidad</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        required
                                        value={cantidad}
                                        onChange={(e) => setCantidad(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Documento Ref.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Fac. 001-..."
                                        value={documento}
                                        onChange={(e) => setDocumento(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Motivo</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    required
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder={tipo === 'ENTRADA' ? "Ej: Compra a proveedor" : "Ej: Producto caducado"}
                                />
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary border-0" onClick={onClose} disabled={loading}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary border-0" disabled={loading}>
                                {loading ? 'Guardando...' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
