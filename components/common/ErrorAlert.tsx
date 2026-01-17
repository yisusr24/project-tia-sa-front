interface ErrorAlertProps {
    message: string;
    onClose?: () => void;
}

export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {message}
            {onClose && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                ></button>
            )}
        </div>
    );
}
