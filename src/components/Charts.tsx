import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ProductRow } from '../types';
import { formatCurrency } from '../utils/parser';

interface ChartsProps {
  products: ProductRow[];
  currency: string;
}

export function Charts({ products, currency }: ChartsProps) {
  // Top 8 productos por ganancia (menos para móvil)
  const topProfitProducts = products
    .filter(p => !p.hasError)
    .sort((a, b) => b.ganancia - a.ganancia)
    .slice(0, 8)
    .map(p => ({
      name: p.producto.length > 12 ? p.producto.substring(0, 12) + '...' : p.producto,
      fullName: p.producto,
      ganancia: p.ganancia,
      color: p.ganancia >= 0 ? '#10B981' : '#EF4444'
    }));

  // Análisis de recuperación de inversión
  const recoveryAnalysis = products
    .filter(p => !p.hasError && p.cantidadVendida > 0)
    .sort((a, b) => b.porcentajeRecuperacion - a.porcentajeRecuperacion)
    .slice(0, 6)
    .map(p => ({
      name: p.producto.length > 10 ? p.producto.substring(0, 10) + '...' : p.producto,
      fullName: p.producto,
      value: p.porcentajeRecuperacion,
      color: p.porcentajeRecuperacion >= 100 ? '#10B981' : 
             p.porcentajeRecuperacion >= 50 ? '#F59E0B' : '#EF4444'
    }));

  const COLORS = ['#EC4899', '#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.fullName || label}</p>
          <p className="text-pink-600">
            {payload[0].dataKey === 'ganancia' 
              ? formatCurrency(payload[0].value, currency)
              : payload[0].dataKey === 'value' && data.value > 1
              ? `${payload[0].value.toFixed(1)}% recuperado`
              : `${payload[0].value} unidades`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Gráfico de Ganancia */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Top Productos por Ganancia</h3>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProfitProducts} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ganancia" radius={[4, 4, 0, 0]}>
                {topProfitProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Recuperación de Inversión */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">% Recuperación de Inversión</h3>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recoveryAnalysis} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {recoveryAnalysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}