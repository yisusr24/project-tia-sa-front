

export interface Usuario {
    id: number;
    nombreUsuario: string;
    correo: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    rol: string;
    activo: boolean;
}

export interface LoginDTO {
    username: string;
    password: string;
}

export interface LoginResponse {
    usuario: Usuario;
    token?: string;
}


export type UserRole = 'SUPERADMIN' | 'VENDEDOR' | 'ALMACENERO';

export interface ModulePermissions {
    dashboard: boolean;
    productos: boolean;
    inventario: boolean;
    ventas: boolean;
    locales: boolean;
    categorias: boolean;
    proveedores: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, ModulePermissions> = {
    SUPERADMIN: {
        dashboard: true,
        productos: true,
        inventario: true,
        ventas: true,
        locales: true,
        categorias: true,
        proveedores: true
    },
    VENDEDOR: {
        dashboard: true,
        productos: true, 
        inventario: true,
        ventas: true,
        locales: false,
        categorias: false,
        proveedores: false
    },
    ALMACENERO: {
        dashboard: true,
        productos: true,
        inventario: true, 
        ventas: false,
        locales: false,
        categorias: true,
        proveedores: true
    }
};

export function hasModulePermission(rol: string, module: keyof ModulePermissions): boolean {
    const permissions = ROLE_PERMISSIONS[rol as UserRole];
    return permissions ? permissions[module] : false;
}
