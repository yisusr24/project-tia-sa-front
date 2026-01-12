import React, { useState, useEffect } from 'react';
import { DetalleVenta } from '@/types/venta';
import { X, DollarSign, CreditCard, Banknote, Coins } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    total: number;
    onClose: () => void;
    onConfirm: (paymentData: { metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA', clienteNombre: string, clienteDocumento: string }) => void;
    loading: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, total, onClose, onConfirm, loading }) => {
    const [metodo, setMetodo] = useState<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'>('EFECTIVO');
    const [efectivo, setEfectivo] = useState<string>('');
    const [clienteNombre, setClienteNombre] = useState('Consumidor Final');
    const [clienteDocumento, setClienteDocumento] = useState('9999999999');
    const [cambio, setCambio] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setEfectivo('');
            setCambio(0);
        }
    }, [isOpen]);

    const handleEfectivoChange = (val: string) => {
        setEfectivo(val);
        const received = parseFloat(val) || 0;
        setCambio(received >= total ? received - total : 0);
    };

    const handleConfirm = () => {
        onConfirm({
            metodoPago: metodo,
            clienteNombre,
            clienteDocumento
        });
    };

    if (!isOpen) return null;

    const isEfectivoInvalid = metodo === 'EFECTIVO' && (parseFloat(efectivo || '0') < total);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Procesar Pago</h2>
                        <p className="opacity-90 text-sm">Total a pagar: <span className="font-bold text-lg">${total.toFixed(2)}</span></p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Método de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setMetodo('EFECTIVO')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${metodo === 'EFECTIVO' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                            >
                                <Banknote size={24} />
                                <span className="text-xs">Efectivo</span>
                            </button>
                            <button
                                onClick={() => setMetodo('TARJETA')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${metodo === 'TARJETA' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                            >
                                <CreditCard size={24} />
                                <span className="text-xs">Tarjeta</span>
                            </button>
                            <button
                                onClick={() => setMetodo('TRANSFERENCIA')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${metodo === 'TRANSFERENCIA' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                            >
                                <DollarSign size={24} />
                                <span className="text-xs">Transf.</span>
                            </button>
                        </div>
                    </div>

                    {/* Datos Cliente */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre Cliente</label>
                            <input
                                type="text"
                                value={clienteNombre}
                                onChange={e => setClienteNombre(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">CI/RUC</label>
                            <input
                                type="text"
                                value={clienteDocumento}
                                onChange={e => setClienteDocumento(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {metodo === 'EFECTIVO' && (
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-emerald-800 mb-1">Efectivo Recibido</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={efectivo}
                                        onChange={e => handleEfectivoChange(e.target.value)}
                                        className="w-full pl-7 pr-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold text-gray-800"
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                                <span className="text-emerald-800 font-medium flex items-center gap-2"><Coins size={16} /> Cambio:</span>
                                <span className="text-xl font-bold text-emerald-700">${cambio.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleConfirm}
                        disabled={loading || isEfectivoInvalid}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Pago'}
                    </button>
                </div>
            </div>
        </div>
    );
};
