import React, { useState, useEffect } from 'react';
import { InventarioDTO } from '@/types/inventario';
import { Search, Package, AlertCircle } from 'lucide-react';

interface ProductListProps {
    products: InventarioDTO[];
    onAddToCart: (product: InventarioDTO) => void;
    loading: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<InventarioDTO[]>([]);

    useEffect(() => {
        const filtered = products.filter(p =>
            p.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.productoCodigo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    return (
        <div className="flex flex-col h-full bg-gray-50/50 p-2">
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Buscar producto por nombre o código..."
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
            ) : filteredProducts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <Package size={48} className="mb-4 opacity-50" />
                    <p className="text-lg">No se encontraron productos</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => product.stockActual > 0 && onAddToCart(product)}
                            className={`
                                relative group bg-white p-5 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between h-full min-h-[150px] overflow-hidden
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
            )}
        </div>
    );
};
