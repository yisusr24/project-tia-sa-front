'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { productoImportService, ImportResult } from '@/services/productoImportService';
import { useToast } from '@/components/common/ToastNotification';
import { withAuth } from '@/components/auth/withAuth';
import { FaUpload, FaFileDownload, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

function ImportarProductosPage() {
    const router = useRouter();
    const { showToast, ToastComponent } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.toLowerCase().endsWith('.csv')) {
                setSelectedFile(file);
                setResult(null);
            } else {
                showToast('error', 'Error', 'Solo se permiten archivos CSV');
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDownloadTemplate = async () => {
        try {
            await productoImportService.downloadTemplate();
            showToast('success', 'Éxito', 'Plantilla descargada');
        } catch (error: any) {
            showToast('error', 'Error', 'No se pudo descargar la plantilla');
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            showToast('error', 'Error', 'Selecciona un archivo');
            return;
        }

        setImporting(true);
        try {
            const importResult = await productoImportService.importProducts(selectedFile);
            setResult(importResult);

            if (importResult.status === 'SUCCESS') {
                showToast('success', '¡Éxito!', `${importResult.successCount} productos importados`);
            } else if (importResult.status === 'PARTIAL_SUCCESS') {
                showToast('warning', 'Importación Parcial', importResult.message);
            } else {
                showToast('error', 'Error de Validación', importResult.message);
            }
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || 'Error al importar');
        } finally {
            setImporting(false);
        }
    };

    const downloadErrors = () => {
        if (!result || !result.errors.length) return;

        const csv = 'Línea,Código,Error\n' +
            result.errors.map(e => `${e.lineNumber},${e.productCode || 'N/A'},"${e.errorMessage}"`).join('\n');

        result.errors.map(e => `${e.lineNumber},${e.productCode || 'N/A'},"${e.errorMessage}"`).join('\n');

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'errores_importacion.csv';
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            {ToastComponent}
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <div className="d-flex align-items-center gap-3">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-1">Productos Masivo</h1>
                                <p className="text-muted">Carga múltiples productos desde un archivo CSV</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {!result && (
                            <>
                                <div className="card card-shadow mb-4">
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-3">Paso 1: Descargar Plantilla</h5>
                                        <p className="text-muted mb-3">
                                            Descarga la plantilla CSV, llénala con tus productos y súbela en el siguiente paso.
                                        </p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleDownloadTemplate}
                                        >
                                            Descargar Plantilla CSV
                                        </button>
                                    </div>
                                </div>

                                <div className="card card-shadow mb-4">
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-3">Paso 2: Subir Archivo</h5>

                                        <div
                                            className={`border-2 border-dashed rounded p-5 text-center ${dragOver ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
                                                }`}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <h6 className="mb-2">Arrastra tu archivo CSV aquí</h6>
                                            <p className="text-muted small mb-0">o haz clic para seleccionar</p>
                                            <p className="text-muted small mt-2">Máximo 10MB - Hasta 10,000 productos</p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".csv"
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                            />
                                        </div>

                                        {selectedFile && (
                                            <div className="alert alert-info mt-3" role="alert">
                                                <strong>Archivo seleccionado:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                            </div>
                                        )}

                                        {selectedFile && !result && (
                                            <button
                                                className="btn btn-tia btn-lg w-100 mt-3"
                                                onClick={handleImport}
                                                disabled={importing}
                                            >
                                                {importing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Importando...
                                                    </>
                                                ) : (
                                                    <>
                                                        Importar Productos
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {result && (
                            <div className="card card-shadow">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3">Resultados de Importación</h5>

                                    <div className="row g-3 mb-4">
                                        <div className="col-md-4">
                                            <div className="bg-light p-3 rounded">
                                                <div className="small text-muted">Total Procesados</div>
                                                <div className="fs-4 fw-bold">{result.totalProcessed}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="bg-success bg-opacity-10 p-3 rounded">
                                                <div className="small text-success">Exitosos</div>
                                                <div className="fs-4 fw-bold text-success">{result.successCount}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="bg-danger bg-opacity-10 p-3 rounded">
                                                <div className="small text-danger">Errores</div>
                                                <div className="fs-4 fw-bold text-danger">{result.errorCount}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {result.status === 'SUCCESS' && (
                                        <div className="alert alert-success d-flex align-items-center">
                                            <FaCheckCircle size={24} className="me-3" />
                                            <div>
                                                <strong>¡Importación exitosa!</strong> Todos los productos fueron importados correctamente.
                                            </div>
                                        </div>
                                    )}

                                    {result.errors && result.errors.length > 0 && (
                                        <>


                                            <div className="table-responsive" style={{ maxHeight: '300px', overflow: 'auto' }}>
                                                <table className="table table-sm">
                                                    <thead className="table-light sticky-top">
                                                        <tr>
                                                            <th>Línea</th>
                                                            <th>Código</th>
                                                            <th>Error</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.errors.map((error, idx) => (
                                                            <tr key={idx}>
                                                                <td>{error.lineNumber}</td>
                                                                <td><code>{error.productCode || 'N/A'}</code></td>
                                                                <td className="text-danger">{error.errorMessage}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>


                                        </>
                                    )}

                                    <div className="mt-4 d-flex gap-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setResult(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                        >
                                            Nueva Importación
                                        </button>

                                        {result.errors && result.errors.length > 0 && (
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={downloadErrors}
                                            >
                                                Descargar Errores (CSV)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </>
    );
}

export default withAuth(ImportarProductosPage);
