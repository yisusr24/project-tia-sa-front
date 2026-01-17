'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { productoService } from '@/services/productoService';
import { Producto, ProductoDTO } from '@/types/producto';
import { useToast } from '@/components/common/ToastNotification';
import { FaSave, FaTimes, FaEdit, FaTag, FaBox, FaAlignLeft, FaList, FaRuler, FaDollarSign, FaSortAmountDown, FaSortAmountUp, FaTruck } from 'react-icons/fa';

export default function EditarProductoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [producto, setProducto] = useState<Producto | null>(null);
    const { showToast, ToastComponent } = useToast();

    const isSubmittingRef = useRef(false);

    useEffect(() => {
        if (params.id) {
            cargarProducto(parseInt(params.id));
        }
    }, [params.id]);

    const cargarProducto = async (id: number) => {
        try {
            const data = await productoService.getById(id);
            setProducto(data);
        } catch (error: any) {
            showToast('error', 'Error', 'Producto no encontrado');
            setTimeout(() => router.push('/productos'), 1500);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setProducto(prev => prev ? {
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmittingRef.current || saving || !producto) {
            return;
        }

        isSubmittingRef.current = true;
        setSaving(true);

        const dto: ProductoDTO = {
            codigo: producto.codigo,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoriaId: producto.categoriaId,
            proveedorId: producto.proveedorId,
            unidadMedidaId: producto.unidadMedidaId,
            precioCompra: producto.precioCompra,
            precioVenta: producto.precioVenta,
            precioVentaMinimo: producto.precioVentaMinimo,
            stockMinimo: producto.stockMinimo,
            stockMaximo: producto.stockMaximo,
            imagenUrl: producto.imagenUrl,
            esPerecedero: producto.esPerecedero,
            diasVigencia: producto.diasVigencia,
        };

        try {
            await productoService.update(producto.id!, dto);
            showToast('success', 'Éxito', 'Producto actualizado exitosamente');
            setTimeout(() => router.push('/productos'), 1500);
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || 'Error al actualizar producto');
            isSubmittingRef.current = false;
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando producto...</p>
            </div>
        );
    }

    if (!producto) {
        return <div className="p-4">Producto no encontrado</div>;
    }

    return (
        <>
            {ToastComponent}
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            Editar Producto
                        </h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <fieldset disabled={saving}>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Nombre *</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                className="form-control"
                                                required
                                                value={producto.nombre}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Descripción</label>
                                            <textarea
                                                name="descripcion"
                                                className="form-control"
                                                rows={3}
                                                value={producto.descripcion || ''}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Categoría *</label>
                                                <select
                                                    name="categoriaId"
                                                    className="form-select"
                                                    required
                                                    value={producto.categoriaId}
                                                    onChange={handleChange}
                                                >
                                                    <option value="1">Electrónica</option>
                                                    <option value="2">Alimentos</option>
                                                    <option value="3">Bebidas</option>
                                                    <option value="4">Limpieza</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Precio Venta *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="precioVenta"
                                                    className="form-control"
                                                    required
                                                    value={producto.precioVenta}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Stock Mínimo</label>
                                                <input
                                                    type="number"
                                                    name="stockMinimo"
                                                    className="form-control"
                                                    value={producto.stockMinimo}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Stock Máximo</label>
                                                <input
                                                    type="number"
                                                    name="stockMaximo"
                                                    className="form-control"
                                                    value={producto.stockMaximo || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="d-flex gap-2 mt-4">
                                        <button type="submit" className="btn btn-tia d-flex align-items-center gap-2" disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave /> Guardar Cambios
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary d-flex align-items-center gap-2"
                                            onClick={() => router.back()}
                                            disabled={saving}
                                        >
                                            <FaTimes /> Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Información</h5>
                                <hr />
                                <p className="small mb-2">
                                    <strong>Creado por:</strong> {producto.createdBy || 'Sistema'}
                                </p>
                                <p className="small mb-2">
                                    <strong>Fecha creación:</strong>{' '}
                                    {producto.createdAt ? new Date(producto.createdAt).toLocaleString('es-EC', { hour12: false }) : '-'}
                                </p>
                                <p className="small mb-2">
                                    <strong>Última actualización:</strong>{' '}
                                    {producto.updatedAt ? new Date(producto.updatedAt).toLocaleString('es-EC', { hour12: false }) : '-'}

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
