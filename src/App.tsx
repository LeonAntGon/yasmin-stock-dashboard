import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { DataTable } from './components/DataTable';
import { Charts } from './components/Charts';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useSheetData } from './hooks/useSheetData';

function App() {
  const { data, loading, error, loadSheetData } = useSheetData();

  // Cargar datos al montar el componente
  useEffect(() => {
    // Pequeño delay para que se vea la UI antes de cargar
    setTimeout(() => loadSheetData(), 100);
  }, [loadSheetData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoadData={loadSheetData} 
        loading={loading}
      />

      <main className="container mx-auto px-4 py-6 lg:py-8">
        {loading && <LoadingSpinner />}
        
        {error && !loading && (
          <ErrorDisplay 
            error={error} 
            onRetry={() => loadSheetData()}
          />
        )}

        {data && !loading && (
          <div className="space-y-6 lg:space-y-8">
            {/* Resumen */}
            <SummaryCards 
              summary={data.summary} 
              errorsCount={data.errors.length}
            />

            {/* Errores si los hay */}
            {data.errors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 lg:p-6">
                <h3 className="font-medium text-amber-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Se encontraron {data.errors.length} errores en los datos:
                </h3>
                <ul className="text-xs lg:text-sm text-amber-700 list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                  {data.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {data.errors.length > 5 && (
                    <li className="text-amber-600 italic font-medium">
                      ...y {data.errors.length - 5} errores más
                    </li>
                  )}
                </ul>
                <div className="mt-3 text-xs text-amber-600">
                  <strong>Tip:</strong> Revisa las filas marcadas con ⚠️ en la tabla para corregir los datos
                </div>
              </div>
            )}

            {/* Gráficos */}
            <Charts products={data.products} currency={data.summary.currency} />

            {/* Tabla */}
            <DataTable products={data.products} currency={data.summary.currency} />
          </div>
        )}

        {!data && !loading && !error && (
          <div className="text-center py-12 lg:py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                ¡Bienvenida a tu Dashboard!
              </h2>
              <p className="text-sm lg:text-base text-gray-600 mb-6">
                Haz clic en "Actualizar Datos" para cargar la información más reciente de tus productos.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6 text-left">
                <h4 className="font-medium text-blue-900 mb-2">Datos conectados desde Google Sheet:</h4>
                <ul className="text-xs lg:text-sm text-blue-800 space-y-1">
                  <li>• <strong>Columna A:</strong> Producto (nombre del producto)</li>
                  <li>• <strong>Columna B:</strong> Costo (precio de compra)</li>
                  <li>• <strong>Columna C:</strong> PrecioVenta (precio de venta)</li>
                  <li>• <strong>Columna D:</strong> CantidadVendida (cantidad vendida)</li>
                  <li>• <strong>Columna E:</strong> CantidadComprada (cantidad comprada)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 lg:py-6 mt-12 lg:mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-xs lg:text-sm">
            © 2025 Lencería Yas - Dashboard de Análisis de Productos
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;