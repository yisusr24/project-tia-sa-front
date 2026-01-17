'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/ToastNotification';
import { FaBoxOpen, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { showToast, ToastComponent } = useToast();

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isSubmittingRef = useRef(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmittingRef.current || loading) {
            return;
        }

        isSubmittingRef.current = true;
        setLoading(true);

        try {
            const usuario = await authService.login(credentials.username, credentials.password);
            login(usuario);
            showToast('success', '¡Bienvenido!', `Hola ${usuario.nombre}`);
            setTimeout(() => router.push('/'), 1000);
        } catch (error: any) {
            showToast('error', 'Error', error.message || 'Credenciales inválidas');
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    return (
        <>
            {ToastComponent}
            <div
                className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: '#f5f5f5' }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-5">
                            <div className="card card-shadow border-0">
                                <div className="card-body p-5">
                                    <div className="text-center mb-4">
                                        <div className="mb-3 d-flex justify-content-center">
                                            <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                                                <FaBoxOpen size={48} color="#a00404" />
                                            </div>
                                        </div>
                                        <h2 className="fw-bold mb-1" style={{ color: '#a00404' }}>TIA Inventory</h2>
                                        <p className="text-secondary small">Sistema de Gestión de Inventario</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <fieldset disabled={loading}>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold text-secondary small text-uppercase">Usuario</label>
                                                <div className="input-group input-group-lg">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <FaUser className="text-secondary" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control border-start-0 ps-0 bg-light"
                                                        placeholder="Ingresa tu usuario"
                                                        value={credentials.username}
                                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label fw-bold text-secondary small text-uppercase">Contraseña</label>
                                                <div className="input-group input-group-lg">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <FaLock className="text-secondary" />
                                                    </span>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className="form-control border-0 ps-0 bg-light"
                                                        placeholder="••••••••"
                                                        value={credentials.password}
                                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn bg-light border-0"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {showPassword ? (
                                                            <FaEyeSlash className="text-secondary" />
                                                        ) : (
                                                            <FaEye className="text-secondary" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-tia btn-lg w-100 fw-bold shadow-sm"
                                                disabled={loading}
                                                style={{ transition: 'all 0.2s' }}
                                            >
                                                {loading ? (
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        <span>Ingresando...</span>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <FaLock size={14} />
                                                        <span>Iniciar Sesión</span>
                                                    </div>
                                                )}
                                            </button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>

                            <div className="text-center mt-4 text-muted opacity-75">
                                <small>© 2026 TIA Inventory • Sistema Multi-Local</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
