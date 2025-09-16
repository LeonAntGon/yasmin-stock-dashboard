import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Download, AlertTriangle, Edit3 } from 'lucide-react';
import { ProductRow } from '../types';
import { formatCurrency, formatPercentage } from '../utils/parser';

interface DataTableProps {
  products: ProductRow[];
  currency: string;
}

type SortField = keyof ProductRow;
type SortDirection = 'asc' | 'desc';

export function DataTable({ products, currency }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('ganancia');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [editingCell, setEditingCell] = useState<{row: number, field: 'costo' | 'precioVenta'} | null>(null);

  // Filtrar y ordenar datos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, sortField, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ['Producto', 'Costo', 'Precio Venta', 'Unidades', 'Ingresos', 'Costo Total', 'Ganancia', 'Margen %'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedProducts.map(row => [
        `"${row.producto}"`,
        row.costo,
        row.precioVenta,
        row.cantidadVendida,
        row.ingresos.toFixed(2),
        row.costoTotal.toFixed(2),
        row.ganancia.toFixed(2),
        row.margenProfit.toFixed(1)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lenceria-yas-productos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:text-pink-600 transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
            
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="producto">Producto</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="costo">Costo</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="precioVenta">Precio</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="cantidadComprada">Compradas</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="cantidadVendida">Vendidas</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                <SortButton field="inversionTotal">Inversión</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                <SortButton field="dineroRecuperado">Recuperado</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="ganancia">Ganancia</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                <SortButton field="porcentajeRecuperacion">% Recup.</SortButton>
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                <SortButton field="inventarioRestante">Stock</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product, index) => (
              <tr 
                key={index}
                className={`hover:bg-gray-50 transition-colors ${
                  product.hasError ? 'bg-red-50' : 
                  product.ganancia < 0 ? 'bg-red-25' : 
                  product.ganancia > (products.reduce((sum, p) => sum + p.ganancia, 0) / products.length) ? 'bg-green-25' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.hasError && (
                      <AlertTriangle 
                        className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" 
                        title={product.errorMessage} 
                      />
                    )}
                    <span className="text-xs lg:text-sm font-medium text-gray-900 truncate max-w-32 lg:max-w-none" title={product.producto}>
                      {product.producto}
                    </span>
                  </div>
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                  {formatCurrency(product.costo, currency)}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                  {formatCurrency(product.precioVenta, currency)}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                  {product.cantidadComprada}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                  {product.cantidadVendida}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 hidden lg:table-cell">
                  {formatCurrency(product.inversionTotal, currency)}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 hidden lg:table-cell">
                  {formatCurrency(product.dineroRecuperado, currency)}
                </td>
                <td className={`px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium ${
                  product.ganancia >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(product.ganancia, currency)}
                </td>
                <td className={`px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium hidden sm:table-cell ${
                  product.porcentajeRecuperacion >= 100 ? 'text-green-600' : 
                  product.porcentajeRecuperacion >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {formatPercentage(product.porcentajeRecuperacion)}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 hidden lg:table-cell">
                  <div>
                    <span className="font-medium">{product.inventarioRestante}</span>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(product.valorInventarioRestante, currency)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 lg:px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} de {filteredAndSortedProducts.length} productos
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}