'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/common/ToastNotification';
import { localService } from '@/services/localService';
import { inventarioService } from '@/services/inventarioService';
import { ventaService } from '@/services/ventaService';
import { ProductList } from '@/components/ventas/ProductList';
import { Cart } from '@/components/ventas/Cart';
import { PaymentModal } from '@/components/ventas/PaymentModal';
import { InventarioDTO } from '@/types/inventario';
import { DetalleVenta, Venta } from '@/types/venta';
import { Local } from '@/types/local';
import { Store } from 'lucide-react';
import { VALOR_IVA } from '@/config/constants';

export default function SalesPage() {
    const [locales, setLocales] = useState<Local[]>([]);
    const [selectedLocal, setSelectedLocal] = useState<number | null>(null);
    const [products, setProducts] = useState<InventarioDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [cart, setCart] = useState<DetalleVenta[]>([]);

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        loadLocales();
    }, []);

    useEffect(() => {
        if (selectedLocal) {
            setProducts([]);
            setCart([]);
            setCurrentPage(0);
            setTotalPages(0);
        }
    }, [selectedLocal]);

    const loadLocales = async () => {
        try {
            const data = await localService.getAll();
            setLocales(data);
            if (data.length > 0) setSelectedLocal(data[0].id!);
        } catch (error) {
            showToast('error', 'Error', 'Error al cargar locales');
        }
    };

    const searchProducts = async (query: string, page: number = 0) => {
        if (!selectedLocal) return;
        setLoadingProducts(true);
        try {
            const response = await inventarioService.buscarPorLocal(selectedLocal, query, page);
            setProducts(response.data);
            setCurrentPage(response.currentPage);
            setTotalPages(response.totalPages);
        } catch (error) {
            showToast('error', 'Error', 'Error al buscar productos');
        } finally {
            setLoadingProducts(false);
        }
    };



    const addToCart = (product: InventarioDTO) => {
        if (!product.precioVenta) {
            showToast('error', 'Error', 'Producto sin precio de venta configurado');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.productoId === product.productoId);
            if (existing) {
                if (existing.cantidad >= product.stockActual) {
                    showToast('warning', 'Stock Límite', 'No hay más unidades disponibles');
                    return prev;
                }
                return prev.map(item =>
                    item.productoId === product.productoId
                        ? { ...item, cantidad: item.cantidad + 1, total: (item.cantidad + 1) * item.precioUnitario }
                        : item
                );
            } else {
                return [...prev, {
                    productoId: product.productoId,
                    productoNombre: product.productoNombre,
                    productoCodigo: product.productoCodigo,
                    cantidad: 1,
                    precioUnitario: product.precioVenta,
                    subtotal: product.precioVenta,
                    descuento: 0,
                    total: product.precioVenta
                }];
            }
        });
    };

    const updateQuantity = (productId: number, newQty: number) => {
        const product = products.find(p => p.productoId === productId);
        if (!product) return;

        if (newQty > product.stockActual) {
            showToast('warning', 'Stock Insuficiente', `Solo quedan ${product.stockActual} unidades`);
            return;
        }

        if (newQty < 1) return;

        setCart(prev => prev.map(item =>
            item.productoId === productId
                ? { ...item, cantidad: newQty, total: newQty * item.precioUnitario }
                : item
        ));
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.productoId !== productId));
    };


    const handleCheckout = async (paymentData: any) => {
        if (!selectedLocal) return;

        setProcessingPayment(true);
        const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
        const impuesto = subtotal * VALOR_IVA;
        const total = subtotal + impuesto;

        const venta: Venta = {
            localId: selectedLocal,
            vendedorId: 1,
            clienteNombre: paymentData.clienteNombre,
            clienteDocumento: paymentData.clienteDocumento,
            subtotal,
            impuesto,
            descuento: 0,
            total,
            metodoPago: paymentData.metodoPago,
            observaciones: 'Venta desde POS Web',
            items: cart
        };

        try {
            const response = await ventaService.crear(venta);
            showToast('success', 'Venta Exitosa', `Ticket #${response.numeroVenta}`);
            setCart([]);
            setPaymentModalOpen(false);
            setProducts([]);
        } catch (error: any) {
            showToast('error', 'Error al Procesar', error.response?.data?.message || 'Hubo un problema con la venta');
        } finally {
            setProcessingPayment(false);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.total, 0) * (1 + VALOR_IVA);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b h-16 flex items-center px-6 justify-between shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-800">Punto de Venta</h1>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border">
                        <Store size={18} className="text-gray-500" />
                        <select
                            value={selectedLocal || ''}
                            onChange={(e) => setSelectedLocal(Number(e.target.value))}
                            className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 min-w-[200px]"
                        >
                            {locales.map(local => (
                                <option key={local.id} value={local.id}>{local.nombre}</option>
                            ))}
                        </select>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden relative">
                    <ProductList
                        products={products}
                        onAddToCart={addToCart}
                        onSearch={searchProducts}
                        loading={loadingProducts}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </main>
            </div>

            <div className="w-[400px] h-full flex-shrink-0 z-20 shadow-2xl">
                <Cart
                    items={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onClear={() => setCart([])}
                    onCheckout={() => setPaymentModalOpen(true)}
                    loading={processingPayment}
                />
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                total={cartTotal}
                onClose={() => setPaymentModalOpen(false)}
                onConfirm={handleCheckout}
                loading={processingPayment}
            />

            {ToastComponent}
        </div>
    );
}
