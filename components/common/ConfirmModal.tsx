'use client';

import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'warning' | 'success';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    show,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'primary',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-0">{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button variant={variant} onClick={onConfirm}>
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
