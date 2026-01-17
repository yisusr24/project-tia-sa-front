import React, { useState, useEffect } from 'react';
import { InventarioDTO } from '@/types/inventario';
import { Search, Package, AlertCircle } from 'lucide-react';

interface ProductListProps {
    products: InventarioDTO[];
    onAddToCart: (product: InventarioDTO) => void;
    onSearch: (query: string, page: number) => void;
    loading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
    products,
    onAddToCart,
    onSearch,
    loading,
    currentPage,
    totalPages,
    onPageChange
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length >= 0) {
                onSearch(searchTerm, 0);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            onPageChange(newPage);
            onSearch(searchTerm, newPage);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 p-2">
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Buscar producto por nombre o código (min 3 letras)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <Package size={48} className="mb-4 opacity-50" />
                    <p className="text-lg">No se encontraron productos</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4 flex-1 content-start">
                        {products.map(product => (
                            <div
                                key={product.id}
                                onClick={() => product.stockActual > 0 && onAddToCart(product)}
                                className={`
                                    relative group bg-white p-5 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between min-h-[140px]
                                    ${product.stockActual === 0 ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'hover:border-blue-400 active:scale-95'}
                                `}
                            >
                                {product.stockActual === 0 && (
                                    <div className="absolute top-2 right-2 text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Agotado
                                    </div>
                                )}

                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-3">
                                        {product.productoNombre}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-mono tracking-wider">{product.productoCodigo}</p>
                                    <p className="text-xs text-gray-400 font-mono tracking-wider mt-1">
                                        {product.stockActual} unid.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>


                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 py-2 border-t mt-auto">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="text-sm text-gray-600">
                                Página {currentPage + 1} de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
