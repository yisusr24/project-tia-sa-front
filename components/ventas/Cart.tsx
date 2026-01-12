import React from 'react';
import { DetalleVenta } from '@/types/venta';
import { Trash, Plus, Minus, CreditCard, Banknote } from 'lucide-react';

interface CartProps {
    items: DetalleVenta[];
    onUpdateQuantity: (productId: number, newQty: number) => void;
    onRemove: (productId: number) => void;
    onClear: () => void;
    onCheckout: () => void;
    loading: boolean;
}

export const Cart: React.FC<CartProps> = ({
    items, onUpdateQuantity, onRemove, onClear, onCheckout, loading
}) => {

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const impuesto = subtotal * 0.12; 
    const total = subtotal + impuesto;

    if (items.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-l bg-white">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CreditCard size={32} />
                </div>
                <p className="text-lg font-medium">Carrito Vacío</p>
                <p className="text-sm">Agrega productos para comenzar una venta</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white border-l shadow-xl">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Banknote size={20} />
                    Venta Actual
                </h2>
                <button
                    onClick={onClear}
                    className="text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded"
                >
                    Vaciar
                </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => (
                    <div key={item.productoId} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg border hover:border-blue-200 transition-colors">
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm truncate">{item.productoNombre}</p>
                            <p className="text-xs text-gray-500">{item.productoCodigo}</p>
                            <div className="text-blue-600 font-bold text-sm mt-1">
                                ${item.precioUnitario.toFixed(2)}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center bg-white border rounded-md shadow-sm">
                                <button
                                    onClick={() => onUpdateQuantity(item.productoId, item.cantidad - 1)}
                                    className="p-1 hover:bg-gray-100 text-gray-600"
                                    disabled={item.cantidad <= 1}
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold">{item.cantidad}</span>
                                <button
                                    onClick={() => onUpdateQuantity(item.productoId, item.cantidad + 1)}
                                    className="p-1 hover:bg-gray-100 text-blue-600"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800 text-sm">
                                    ${item.total.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => onRemove(item.productoId)}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Footer */}
            <div className="p-6 bg-gray-50 border-t space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>IVA (12%)</span>
                    <span>${impuesto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <button
                    onClick={onCheckout}
                    disabled={loading}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Procesando...
                        </span>
                    ) : (
                        <>
                            <CreditCard size={24} />
                            Cobrar ${total.toFixed(2)}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
