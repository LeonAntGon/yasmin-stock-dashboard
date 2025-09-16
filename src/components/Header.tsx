import React from 'react';
import { RefreshCw, Heart, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onLoadData: () => void;
  loading: boolean;
}

export function Header({ onLoadData, loading }: HeaderProps) {
  const handleRefresh = () => {
    onLoadData();
  };

  const handleOpenSheet = () => {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    window.open(sheetUrl, '_blank');
  };
  return (
    <header className="bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-white mr-2" />
            <h1 className="text-3xl font-bold text-white">Lencería Yas</h1>
          </div>
          <p className="text-pink-100 text-sm">Dashboard de Análisis de Productos</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleOpenSheet}
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-pink-500 transition-colors flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Editar Google Sheet
            </button>
            
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-pink-200 focus:ring-offset-2 focus:ring-offset-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar Datos
              </>
            )}
          </button>
          </div>
        </div>
      </div>
    </header>
  );
}