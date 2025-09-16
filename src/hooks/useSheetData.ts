import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { RawProductRow, SheetData } from '../types';
import { processSheetData } from '../utils/calculations';

export function useSheetData() {
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSheetData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
      
      if (!sheetId) {
        throw new Error('ID del Google Sheet no configurado. Contacta al administrador.');
      }
      
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('El Google Sheet no es público. Asegúrate de compartirlo con acceso de lectura para cualquiera con el enlace.');
        }
        if (response.status === 404) {
          throw new Error('Google Sheet no encontrado. Verifica que la URL sea correcta.');
        }
        throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      
      if (!csvText.trim()) {
        throw new Error('El Google Sheet está vacío o no contiene datos válidos.');
      }

      // Parse CSV
      const parseResult = Papa.parse<RawProductRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });

      if (parseResult.errors.length > 0) {
        console.warn('CSV parsing warnings:', parseResult.errors);
      }

      if (!parseResult.data || parseResult.data.length === 0) {
        throw new Error('No se encontraron datos válidos en el Google Sheet.');
      }

      // Verificar que tenga las columnas requeridas
      const requiredColumns = ['Producto', 'Costo', 'PrecioVenta', 'CantidadVendida', 'CantidadComprada'];
      const firstRow = parseResult.data[0];
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length > 0) {
        throw new Error(`Faltan columnas requeridas: ${missingColumns.join(', ')}. Verifica que el header tenga: Producto, Costo, PrecioVenta, CantidadVendida, CantidadComprada`);
      }

      // Procesar datos
      const processedData = processSheetData(parseResult.data, csvText);
      
      setData({
        products: processedData.products,
        summary: processedData.summary,
        errors: processedData.errors,
      });


    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);


  return {
    data,
    loading,
    error,
    loadSheetData,
  };
}