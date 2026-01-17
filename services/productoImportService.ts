import axios from 'axios';
import api from './api';

export interface ImportResult {
    status: string;
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    errors: ImportError[];
    duration: string;
    message: string;
}

export interface ImportError {
    lineNumber: number;
    productCode: string;
    errorMessage: string;
}

export const productoImportService = {
    async importProducts(file: File): Promise<ImportResult> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<{ success: boolean; data: ImportResult }>('/productos/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 120000 
        });

        return response.data.data;
    },

    async downloadTemplate(): Promise<void> {
        const response = await api.get('/productos/import/template', {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'productos_template.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
