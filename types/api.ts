

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    timestamp?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
    message: string;
    timestamp: string;
}
export interface PageResponse<T> {
    data: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}
