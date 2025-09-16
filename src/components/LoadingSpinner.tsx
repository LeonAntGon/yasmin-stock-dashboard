import React from 'react';
import { RefreshCw } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className="w-8 h-8 text-pink-500 animate-spin mb-4" />
      <p className="text-gray-600">Cargando datos del Google Sheet...</p>
      <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
    </div>
  );
}