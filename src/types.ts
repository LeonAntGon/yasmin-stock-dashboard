export interface RawProductRow {
  Producto: string;
  Costo: string;
  PrecioVenta: string;
  CantidadVendida: string;
  CantidadComprada: string;
}

export interface ProductRow {
  producto: string;
  costo: number;
  precioVenta: number;
  cantidadVendida: number;
  cantidadComprada: number;
  costoTotal: number;
  inversionTotal: number;
  ingresos: number;
  ganancia: number;
  dineroRecuperado: number;
  porcentajeRecuperacion: number;
  inventarioRestante: number;
  valorInventarioRestante: number;
  margenProfit: number;
  hasError?: boolean;
  errorMessage?: string;
}

export interface SummaryStats {
  totalUnidades: number;
  totalCompradas: number;
  ingresosTotales: number;
  costoTotal: number;
  inversionTotal: number;
  gananciaTotal: number;
  dineroRecuperadoTotal: number;
  porcentajeRecuperacionPromedio: number;
  inventarioRestanteTotal: number;
  valorInventarioRestanteTotal: number;
  margenPromedio: number;
  currency: string;
}

export interface SheetData {
  products: ProductRow[];
  summary: SummaryStats;
  errors: string[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}