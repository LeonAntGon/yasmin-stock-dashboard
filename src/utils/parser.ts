export function parseQuantity(quantityStr: string): number {
  if (!quantityStr || quantityStr.trim() === '') return 1;
  
  const cleanStr = quantityStr.toString().trim();
  
  // Si contiene +, tomar el número anterior al +
  if (cleanStr.includes('+')) {
    const match = cleanStr.match(/(\d+)\+/);
    return match ? parseInt(match[1], 10) : 1;
  }
  
  // Buscar el primer número en la cadena
  const match = cleanStr.match(/(\d+(?:[.,]\d+)?)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 1;
}

export function parseNumber(value: string): number | null {
  if (!value || value.trim() === '') return null;
  
  const cleanValue = value.toString().trim()
    .replace(/[^\d.,-]/g, '') // Quitar todo excepto números, puntos, comas y guiones
    .replace(/,/g, '.'); // Convertir comas a puntos para decimales
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? null : parsed;
}

export function detectCurrency(data: string): string {
  const currencies = ['USD', 'ARS', '$', 'US$', 'AR$'];
  for (const currency of currencies) {
    if (data.includes(currency)) {
      return currency.includes('AR') ? 'ARS' : currency.includes('US') ? 'USD' : 'ARS';
    }
  }
  return 'ARS'; // Default
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  if (value === 0 || isNaN(value) || !isFinite(value)) return '--';
  return `${value.toFixed(1)}%`;
}