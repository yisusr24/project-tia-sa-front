export interface Local {
    id: number;
    codigo: string;
    nombre: string;
    direccion: string;
    ciudad?: string;
    canton?: string;
    pais?: string;
    telefono?: string;
    correo?: string;
    tipo?: string;
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface LocalDTO {
    codigo: string;
    nombre: string;
    direccion: string;
    ciudad?: string;
    canton?: string;
    pais?: string;
    telefono?: string;
    correo?: string;
    tipo?: string;
    activo?: boolean;
}
