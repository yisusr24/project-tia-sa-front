import api from './api';

export const reporteService = {
    async descargarVentas(formato: 'pdf' | 'excel', fechaInicio?: string, fechaFin?: string) {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        params.append('formato', formato);

        const response = await api.get(`/reportes/ventas?${params}`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        const fecha = new Date().toISOString().split('T')[0];
        link.download = `ventas_${fecha}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
        link.click();
        window.URL.revokeObjectURL(url);
    },

    async descargarInventario(formato: 'pdf' | 'excel', localId: number) {
        const params = new URLSearchParams();
        params.append('localId', localId.toString());
        params.append('formato', formato);

        const response = await api.get(`/reportes/inventario?${params}`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `inventario_local_${localId}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
        link.click();
        window.URL.revokeObjectURL(url);
    }
};
