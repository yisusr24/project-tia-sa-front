'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { localService } from '@/services/localService';
import { LocalDTO } from '@/types/local';
import { useToast } from '@/components/common/ToastNotification';
import { FaSave, FaTimes } from 'react-icons/fa';

export default function NuevoLocalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { showToast, ToastComponent } = useToast();

    const [formData, setFormData] = useState<LocalDTO>({
        codigo: '',
        nombre: '',
        direccion: '',
        ciudad: '',
        canton: '', // Optional default
        pais: 'Ecuador', // Default handy
        telefono: '',
        correo: '',
        tipo: 'TIENDA',
        activo: true
    });

    // Lock ref to prevent double submission
    const isSubmittingRef = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guard clause
        if (isSubmittingRef.current || loading) {
            return;
        }

        isSubmittingRef.current = true;
        setLoading(true);

        try {
            await localService.create(formData);
            showToast('success', 'Éxito', 'Local creado exitosamente');
            setTimeout(() => router.push('/locales'), 1500);
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || 'Error al crear local');
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
                            Nuevo Local
                        </h1>
                        <p className="text-gray-600">Registrar una nueva tienda o sucursal</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card card-shadow">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <fieldset disabled={loading}>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label fw-bold">Código *</label>
                                                <input
                                                    type="text"
                                                    name="codigo"
                                                    className="form-control"
                                                    required
                                                    value={formData.codigo}
                                                    onChange={handleChange}
                                                    placeholder="LOC001"
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="col-md-8 mb-3">
                                                <label className="form-label fw-bold">Nombre *</label>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    className="form-control"
                                                    required
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    placeholder="Nombre del local (ej. Matriz Centro)"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Dirección *</label>
                                            <textarea
                                                name="direccion"
                                                className="form-control"
                                                rows={2}
                                                required
                                                value={formData.direccion}
                                                onChange={handleChange}
                                                placeholder="Dirección completa"
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label fw-bold">Ciudad *</label>
                                                <input
                                                    type="text"
                                                    name="ciudad"
                                                    className="form-control"
                                                    required
                                                    value={formData.ciudad}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label fw-bold">Cantón</label>
                                                <input
                                                    type="text"
                                                    name="canton"
                                                    className="form-control"
                                                    value={formData.canton}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label fw-bold">País</label>
                                                <input
                                                    type="text"
                                                    name="pais"
                                                    className="form-control"
                                                    value={formData.pais}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Teléfono</label>
                                                <input
                                                    type="text"
                                                    name="telefono"
                                                    className="form-control"
                                                    value={formData.telefono}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold">Correo</label>
                                                <input
                                                    type="email"
                                                    name="correo"
                                                    className="form-control"
                                                    value={formData.correo}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label fw-bold">Tipo</label>
                                                <select
                                                    name="tipo"
                                                    className="form-select"
                                                    value={formData.tipo}
                                                    onChange={handleChange}
                                                >
                                                    <option value="TIENDA">Tienda</option>
                                                    <option value="ALMACEN">Almacén</option>
                                                    <option value="BODEGA">Bodega</option>
                                                    <option value="SUCURSAL">Sucursal</option>
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
                                                    <FaSave /> Guardar Local
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
