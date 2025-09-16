import { RawProductRow, ProductRow, SummaryStats } from '../types';
import { parseQuantity, parseNumber, detectCurrency } from './parser';

export function processSheetData(rawData: RawProductRow[], csvString: string): {
  products: ProductRow[];
  summary: SummaryStats;
  errors: string[];
} {
  const products: ProductRow[] = [];
  const errors: string[] = [];
  const currency = detectCurrency(csvString);

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    
    // Ignorar filas vacías
    if (!row.Producto && !row.Costo && !row.PrecioVenta && !row.CantidadComprada) {
      continue;
    }

    if (!row.Producto || !row.Producto.trim()) {
      errors.push(`Fila ${i + 2}: Producto vacío`);
      continue;
    }

    const costo = parseNumber(row.Costo);
    const precioVenta = parseNumber(row.PrecioVenta);
    const cantidadVendida = parseQuantity(row.CantidadVendida);
    const cantidadComprada = parseQuantity(row.CantidadComprada);

    let hasError = false;
    let errorMessage = '';

    if (costo === null) {
      hasError = true;
      errorMessage = 'Costo inválido';
      errors.push(`Fila ${i + 2}: Costo inválido para ${row.Producto}`);
    }

    if (precioVenta === null) {
      hasError = true;
      errorMessage = errorMessage ? errorMessage + ', Precio inválido' : 'Precio inválido';
      errors.push(`Fila ${i + 2}: Precio de venta inválido para ${row.Producto}`);
    }

    if (cantidadComprada <= 0) {
      hasError = true;
      errorMessage = errorMessage ? errorMessage + ', Cantidad comprada inválida' : 'Cantidad comprada inválida';
      errors.push(`Fila ${i + 2}: Cantidad comprada inválida para ${row.Producto}`);
    }

    if (cantidadVendida < 0) {
      hasError = true;
      errorMessage = errorMessage ? errorMessage + ', Cantidad vendida inválida' : 'Cantidad vendida inválida';
      errors.push(`Fila ${i + 2}: Cantidad vendida inválida para ${row.Producto}`);
    }

    if (!row.CantidadVendida || row.CantidadVendida.trim() === '') {
      errors.push(`Fila ${i + 2}: Cantidad vendida vacía para ${row.Producto} (asumiendo 1)`);
    }

    if (!row.CantidadComprada || row.CantidadComprada.trim() === '') {
      hasError = true;
      errorMessage = errorMessage ? errorMessage + ', Cantidad comprada vacía' : 'Cantidad comprada vacía';
      errors.push(`Fila ${i + 2}: Cantidad comprada vacía para ${row.Producto}`);
    }
    // Calcular métricas incluso con errores (usando 0 para valores inválidos)
    const costoVal = costo || 0;
    const precioVal = precioVenta || 0;
    const compradaVal = cantidadComprada || 0;
    
    // Métricas básicas
    const costoTotal = costoVal * cantidadVendida;
    const inversionTotal = costoVal * compradaVal;
    const ingresos = precioVal * cantidadVendida;
    const ganancia = ingresos - costoTotal;
    const margenProfit = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;
    
    // Nuevas métricas de inversión y recuperación
    const dineroRecuperado = ingresos;
    const porcentajeRecuperacion = inversionTotal > 0 ? (dineroRecuperado / inversionTotal) * 100 : 0;
    const inventarioRestante = Math.max(0, compradaVal - cantidadVendida);
    const valorInventarioRestante = inventarioRestante * costoVal;

    products.push({
      producto: row.Producto,
      costo: costoVal,
      precioVenta: precioVal,
      cantidadVendida,
      cantidadComprada: compradaVal,
      costoTotal,
      inversionTotal,
      ingresos,
      ganancia,
      dineroRecuperado,
      porcentajeRecuperacion,
      inventarioRestante,
      valorInventarioRestante,
      margenProfit,
      hasError,
      errorMessage,
    });
  }

  // Calcular resumen
  const validProducts = products.filter(p => !p.hasError);
  const totalUnidades = validProducts.reduce((sum, p) => sum + p.cantidadVendida, 0);
  const totalCompradas = validProducts.reduce((sum, p) => sum + p.cantidadComprada, 0);
  const ingresosTotales = validProducts.reduce((sum, p) => sum + p.ingresos, 0);
  const costoTotal = validProducts.reduce((sum, p) => sum + p.costoTotal, 0);
  const inversionTotal = validProducts.reduce((sum, p) => sum + p.inversionTotal, 0);
  const gananciaTotal = ingresosTotales - costoTotal;
  const dineroRecuperadoTotal = ingresosTotales;
  const porcentajeRecuperacionPromedio = inversionTotal > 0 ? (dineroRecuperadoTotal / inversionTotal) * 100 : 0;
  const inventarioRestanteTotal = validProducts.reduce((sum, p) => sum + p.inventarioRestante, 0);
  const valorInventarioRestanteTotal = validProducts.reduce((sum, p) => sum + p.valorInventarioRestante, 0);
  const margenPromedio = ingresosTotales > 0 ? (gananciaTotal / ingresosTotales) * 100 : 0;

  const summary: SummaryStats = {
    totalUnidades,
    totalCompradas,
    ingresosTotales,
    costoTotal,
    inversionTotal,
    gananciaTotal,
    dineroRecuperadoTotal,
    porcentajeRecuperacionPromedio,
    inventarioRestanteTotal,
    valorInventarioRestanteTotal,
    margenPromedio,
    currency,
  };

  return { products, summary, errors };
}