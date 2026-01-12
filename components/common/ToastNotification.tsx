'use client';

import { Toast, ToastContainer } from 'react-bootstrap';
import { useState } from 'react';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

interface ToastNotificationProps {
    toasts: ToastMessage[];
    onClose: (id: string) => void;
}

export default function ToastNotification({ toasts, onClose }: ToastNotificationProps) {
    return (
        <ToastContainer
            position="top-end"
            className="p-3"
            style={{
                zIndex: 9999,
                position: 'fixed',
                top: '70px',
                right: '20px'
            }}
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    onClose={() => onClose(toast.id)}
                    show={true}
                    delay={5000}
                    autohide
                    bg={toast.type === 'error' ? 'danger' : toast.type}
                >
                    <Toast.Header>
                        <strong className="me-auto">{toast.title}</strong>
                    </Toast.Header>
                    <Toast.Body className={toast.type === 'error' ? 'text-white' : ''}>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (
        type: ToastMessage['type'],
        title: string,
        message: string
    ) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, title, message }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const ToastComponent = (
        <ToastNotification toasts={toasts} onClose={removeToast} />
    );

    return { showToast, ToastComponent };
}
