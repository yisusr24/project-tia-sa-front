import { useEffect } from 'react';

interface LoadingOverlayProps {
    show: boolean;
    message?: string;
}

export default function LoadingOverlay({ show, message = 'Procesando...' }: LoadingOverlayProps) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                cursor: 'wait'
            }}
        >
            <div
                className="bg-white rounded shadow-lg p-4 text-center"
                style={{ minWidth: '250px' }}
            >
                <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mb-0 fw-bold">{message}</p>
            </div>
        </div>
    );
}
