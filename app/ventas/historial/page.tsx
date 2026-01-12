'use client';

import React, { useState, useEffect } from 'react';
import { ventaService } from '@/services/ventaService';
import { Venta } from '@/types/venta';
import { withAuth } from '@/components/auth/withAuth';
import { RefreshCw, ShoppingBag, FileText, XCircle, Eye } from 'lucide-react';

function HistorialVentasPage() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        loadVentas(0);
    }, []);

    const loadVentas = async (pageParam = 0) => {
        setLoading(true);
        try {
            const response: any = await ventaService.getAllPaginated(pageParam, size);

            setVentas(response.data || []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
            setPage(pageParam);

        } catch (error) {
            console.error("Error cargando historial:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            loadVentas(newPage);
        }
    };

    const handleViewDetail = async (id: number) => {
        setDetailLoading(true);
        try {
            const fullVenta = await ventaService.getById(id);
            setSelectedVenta(fullVenta);
        } catch (error) {
            console.error("Error cargando detalle:", error);
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="container-fluid p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        Historial de Ventas
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Consulta todas las transacciones realizadas.
                    </p>
                </div>
                <button
                    onClick={() => loadVentas(page)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    title="Actualizar"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading && ventas.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Cargando historial...</div>
                ) : ventas.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                        <ShoppingBag size={48} className="mb-4 opacity-50" />
                        <p>No se han registrado ventas aún.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Ticket</th>
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4 text-center">Acciones</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {ventas.map((venta) => (
                                        <tr key={venta.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-gray-700">
                                                {venta.numeroVenta || `#${venta.id}`}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {venta.createdAt
                                                    ? new Date(venta.createdAt).toLocaleDateString() + ' ' + new Date(venta.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-800 font-medium">
                                                {venta.clienteNombre || 'Consumidor Final'}
                                                <span className="block text-xs text-gray-400 font-normal">
                                                    {venta.clienteDocumento || '9999999999'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleViewDetail(venta.id!)}
                                                    className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors shadow-sm"
                                                    title="Ver Detalle"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-800">
                                                ${venta.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                                <div className="text-gray-500 text-sm">
                                    Mostrando página <span className="font-medium text-gray-800">{page + 1}</span> de <span className="font-medium text-gray-800">{totalPages}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                        className="px-3 py-1 rounded bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Anterior
                                    </button>
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        let p = i;
                                        if (totalPages > 5) {
                                            if (page > 2) {
                                                p = page - 2 + i;
                                            }
                                            if (p >= totalPages) {
                                                p = totalPages - 5 + i;
                                            }
                                        }
                                        if (p < 0) p = 0;

                                        return (
                                            <button
                                                key={p}
                                                onClick={() => handlePageChange(p)}
                                                className={`px-3 py-1 rounded border text-sm transition-colors ${p === page
                                                    ? 'bg-blue-600 border-blue-600 text-white font-medium shadow-sm'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {p + 1}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page >= totalPages - 1}
                                        className="px-3 py-1 rounded bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedVenta && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Detalle de Venta</h3>
                                <p className="text-sm text-gray-500 font-mono mt-1">{selectedVenta.numeroVenta}</p>
                            </div>
                            <button
                                onClick={() => setSelectedVenta(null)}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                            >
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6 mb-8 text-sm bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <div>
                                    <p className="text-gray-500 mb-1">Fecha de Emisión</p>
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {selectedVenta.createdAt
                                            ? new Date(selectedVenta.createdAt).toLocaleString([], { hour12: false })
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Cliente</p>
                                    <p className="font-semibold text-gray-800 text-lg">{selectedVenta.clienteNombre}</p>
                                    <p className="text-gray-400 font-mono text-xs">{selectedVenta.clienteDocumento}</p>
                                </div>
                            </div>

                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 text-left rounded-l-lg">Producto</th>
                                        <th className="px-4 py-3 text-center">Cant.</th>
                                        <th className="px-4 py-3 text-right">P. Unit</th>
                                        <th className="px-4 py-3 text-right rounded-r-lg">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {selectedVenta.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-4">
                                                <span className="font-medium text-gray-800 block">{item.productoNombre}</span>
                                                <span className="text-xs text-gray-400 font-mono">{item.productoCodigo}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center font-medium bg-gray-50/30 rounded-lg mx-2">{item.cantidad}</td>
                                            <td className="px-4 py-4 text-right text-gray-600">${item.precioUnitario.toFixed(2)}</td>
                                            <td className="px-4 py-4 text-right font-bold text-gray-800">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-100">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-4 text-right text-gray-500 font-medium pt-6">Subtotal</td>
                                        <td className="px-4 py-4 text-right text-gray-800 font-semibold pt-6">${selectedVenta.subtotal?.toFixed(2) || '0.00'}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-4 py-1 text-right text-gray-500 font-medium">IVA (12%)</td>
                                        <td className="px-4 py-1 text-right text-gray-800 font-semibold">${selectedVenta.impuesto?.toFixed(2) || '0.00'}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-4 py-4 text-right text-gray-800 font-bold text-xl">Total</td>
                                        <td className="px-4 py-4 text-right text-2xl font-black text-blue-600">${selectedVenta.total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(HistorialVentasPage);
