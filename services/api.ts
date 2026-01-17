import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8101/api', // URL del backend
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
            const usuario = JSON.parse(usuarioStr);
            config.headers['X-User'] = usuario.nombreUsuario;
        } else {
            config.headers['X-User'] = 'guest';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error API:', error.response?.data || error.message);

        return Promise.reject(error);
    }
);

export default api;
