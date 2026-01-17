'use client';

import { useState, useEffect } from 'react';

import { reporteService } from '../../services/reporteService';
import { useToast } from '@/components/common/ToastNotification';
import api from '../../services/api';

type TipoReporte = 'ventas' | 'inventario';

interface Local {
    id: number;
    nombre: string;
}

export default function ReportesPage() {
    const [tipoReporte, setTipoReporte] = useState<TipoReporte>('ventas');
    const [descargando, setDescargando] = useState(false);
    const { showToast, ToastComponent } = useToast();

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const [localId, setLocalId] = useState<string>('');
    const [locales, setLocales] = useState<Local[]>([]);

    const hoy = new Date();
    const maxDate = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    useEffect(() => {
        if (tipoReporte === 'inventario') {
            cargarLocales();
        }
    }, [tipoReporte]);

    const cargarLocales = async () => {
        try {
            const response = await api.get('/locales');
            const data = response.data.data;

            if (Array.isArray(data)) {
                setLocales(data);
            } else {
                console.error('Locales response is not an array:', data);
                setLocales([]);
            }
        } catch (error) {
            console.error('Error cargando locales:', error);
            showToast('error', 'Error', 'No se pudieron cargar los locales');
            setLocales([]);
        }
    };

    const descargarReporte = async (formato: 'pdf' | 'excel') => {
        if (tipoReporte === 'ventas') {
            await descargarReporteVentas(formato);
        } else {
            await descargarReporteInventario(formato);
        }
    };

    const descargarReporteVentas = async (formato: 'pdf' | 'excel') => {
        if (!fechaInicio || !fechaFin) {
            showToast('warning', 'Campos Requeridos', 'Por favor seleccione ambas fechas.');
            return;
        }

        if (fechaInicio > maxDate || fechaFin > maxDate) {
            showToast('error', 'Fechas Futuras', 'No se pueden consultar fechas futuras.');
            return;
        }

        if (fechaInicio > fechaFin) {
            showToast('error', 'Rango Inválido', 'La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }

        setDescargando(true);
        try {
            await reporteService.descargarVentas(formato, fechaInicio, fechaFin);
            showToast('success', 'Reporte Generado', `El reporte de ventas se descargó correctamente.`);
        } catch (error: any) {
            console.error('Error descargando reporte:', error);
            if (error.response?.status === 404) {
                showToast('warning', 'Sin Datos', 'No hay ventas en el rango de fechas seleccionado.');
            } else {
                showToast('error', 'Error', 'Error al descargar el reporte.');
            }
        } finally {
            setDescargando(false);
        }
    };

    const descargarReporteInventario = async (formato: 'pdf' | 'excel') => {
        if (!localId) {
            showToast('warning', 'Local Requerido', 'Por favor seleccione un local.');
            return;
        }

        setDescargando(true);
        try {
            await reporteService.descargarInventario(formato, parseInt(localId));
            showToast('success', 'Reporte Generado', `El reporte de inventario se descargó correctamente.`);
        } catch (error: any) {
            console.error('Error descargando reporte:', error);
            if (error.response?.status === 404) {
                showToast('warning', 'Sin Datos', 'No hay productos en el inventario seleccionado.');
            } else {
                showToast('error', 'Error', 'Error al descargar el reporte.');
            }
        } finally {
            setDescargando(false);
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
                    <p className="text-gray-600">Genere reportes en PDF o Excel</p>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Generador de Reportes</h5>
                        </div>
                        <div className="card-body">
                            {/* Selector de Tipo de Reporte */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">
                                    Tipo de Reporte <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    value={tipoReporte}
                                    onChange={(e) => setTipoReporte(e.target.value as TipoReporte)}
                                >
                                    <option value="ventas">Reporte de Ventas</option>
                                    <option value="inventario">Reporte de Inventario</option>
                                </select>
                            </div>

                            <hr />

                            {/* Filtros dinámicos según tipo de reporte */}
                            {tipoReporte === 'ventas' ? (
                                <div className="mb-3">
                                    <label className="form-label">
                                        Rango de Fechas <span className="text-danger">*</span>
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={fechaInicio}
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                                max={maxDate}
                                                required
                                            />
                                            <small className="text-muted">Fecha inicio</small>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                                max={maxDate}
                                                required
                                            />
                                            <small className="text-muted">Fecha fin</small>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Local <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={localId}
                                            onChange={(e) => setLocalId(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione un local...</option>
                                            {locales.map(local => (
                                                <option key={local.id} value={local.id}>
                                                    {local.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Botones de descarga */}
                            <div className="d-flex gap-2 mt-4 justify-content-center">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => descargarReporte('pdf')}
                                    disabled={descargando}
                                >
                                    {descargando ? 'Generando...' : 'Descargar PDF'}
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => descargarReporte('excel')}
                                    disabled={descargando}
                                >
                                    {descargando ? 'Generando...' : 'Descargar Excel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {ToastComponent}
        </div>
    );
}
