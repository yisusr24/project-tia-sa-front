'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { productoService } from '@/services/productoService';
import { ProductoDTO } from '@/types/producto';
import { useToast } from '@/components/common/ToastNotification';
import { FaSave, FaTimes, FaBox, FaTag, FaAlignLeft, FaList, FaRuler, FaDollarSign, FaSortAmountDown, FaSortAmountUp, FaTruck } from 'react-icons/fa';

export default function NuevoProductoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { showToast, ToastComponent } = useToast();

    const [formData, setFormData] = useState<ProductoDTO>({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoriaId: 1,
        unidadMedidaId: 1,
        precioVenta: 0,
        stockMinimo: 10,
    });

    const isSubmittingRef = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        if (isSubmittingRef.current || loading) {
            console.log('Submit bloqueado - petición en proceso');
            return;
        }

        isSubmittingRef.current = true;
        setLoading(true);

        try {
            await productoService.create(formData);
            showToast('success', 'Éxito', 'Producto creado exitosamente');
            setTimeout(() => router.push('/productos'), 1500);
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || 'Error al crear producto');
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    return (
        <>
            {ToastComponent}
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Nuevo Producto
                        </h1>
                        <p className="text-gray-600">Registrar un nuevo producto en el inventario</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card card-shadow">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <fieldset disabled={loading}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Código *</label>
                                            <input
                                                type="text"
                                                name="codigo"
                                                className="form-control"
                                                required
                                                value={formData.codigo}
                                                onChange={handleChange}
                                                placeholder="PROD001"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Nombre *</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                className="form-control"
                                                required
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                placeholder="Laptop HP Pavilion"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Descripción</label>
                                            <textarea
                                                name="descripcion"
                                                className="form-control"
                                                rows={3}
                                                value={formData.descripcion}
                                                onChange={handleChange}
                                                placeholder="Descripción detallada del producto"
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Categoría *</label>
                                                <select
                                                    name="categoriaId"
                                                    className="form-select"
                                                    required
                                                    value={formData.categoriaId}
                                                    onChange={handleChange}
                                                >
                                                    <option value="1">Electrónica</option>
                                                    <option value="2">Alimentos</option>
                                                    <option value="3">Ropa</option>
                                                    <option value="4">Hogar</option>
                                                    <option value="5">Computación</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Unidad Medida *</label>
                                                <select
                                                    name="unidadMedidaId"
                                                    className="form-select"
                                                    required
                                                    value={formData.unidadMedidaId}
                                                    onChange={handleChange}
                                                >
                                                    <option value="1">Unidad</option>
                                                    <option value="2">Kilogramo</option>
                                                    <option value="3">Litro</option>
                                                    <option value="4">Caja</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Precio Compra</label>
                                                <input
                                                    type="number"
                                                    name="precioCompra"
                                                    className="form-control"
                                                    step="0.01"
                                                    value={formData.precioCompra || ''}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Precio Venta *</label>
                                                <input
                                                    type="number"
                                                    name="precioVenta"
                                                    className="form-control"
                                                    step="0.01"
                                                    required
                                                    value={formData.precioVenta}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label fw-bold">Stock Mínimo</label>
                                                <input
                                                    type="number"
                                                    name="stockMinimo"
                                                    className="form-control"
                                                    value={formData.stockMinimo || ''}
                                                    onChange={handleChange}
                                                    placeholder="10"
                                                />
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="form-label fw-bold">Stock Máximo</label>
                                                <input
                                                    type="number"
                                                    name="stockMaximo"
                                                    className="form-control"
                                                    value={formData.stockMaximo || ''}
                                                    onChange={handleChange}
                                                    placeholder="100"
                                                />
                                            </div>

                                            <div className="col-md-4 mb-3">
                                                <label className="form-label fw-bold">Proveedor</label>
                                                <select
                                                    name="proveedorId"
                                                    className="form-select"
                                                    value={formData.proveedorId || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Sin proveedor</option>
                                                    <option value="1">Proveedor 1</option>
                                                    <option value="2">Proveedor 2</option>
                                                </select>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="d-flex gap-2 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-tia d-flex align-items-center gap-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave /> Guardar Producto
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary d-flex align-items-center gap-2"
                                            onClick={() => router.back()}
                                            disabled={loading}
                                        >
                                            <FaTimes /> Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
