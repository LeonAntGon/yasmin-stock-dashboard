import React from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Target, AlertCircle } from 'lucide-react';
import { SummaryStats } from '../types';
import { formatCurrency, formatPercentage } from '../utils/parser';

interface SummaryCardsProps {
  summary: SummaryStats;
  errorsCount: number;
}

export function SummaryCards({ summary, errorsCount }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Unidades Vendidas',
      value: `${summary.totalUnidades} / ${summary.totalCompradas}`,
      subtitle: `${((summary.totalUnidades / summary.totalCompradas) * 100).toFixed(1)}% vendido`,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
    },
    {
      title: 'Inversión Total',
      value: formatCurrency(summary.inversionTotal, summary.currency),
      subtitle: `${summary.totalCompradas} unidades compradas`,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
    },
    {
      title: 'Dinero Recuperado',
      value: formatCurrency(summary.dineroRecuperadoTotal, summary.currency),
      subtitle: `${formatPercentage(summary.porcentajeRecuperacionPromedio)} de inversión`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
    },
    {
      title: 'Inventario Restante',
      value: `${summary.inventarioRestanteTotal} unidades`,
      subtitle: formatCurrency(summary.valorInventarioRestanteTotal, summary.currency),
      icon: ShoppingBag,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Ganancia Total',
      value: formatCurrency(summary.gananciaTotal, summary.currency),
      subtitle: `Margen: ${formatPercentage(summary.margenPromedio)}`,
      icon: TrendingUp,
      color: summary.gananciaTotal >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      textColor: summary.gananciaTotal >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Cards principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
            <div className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">{card.title}</p>
                  <p className={`text-lg lg:text-2xl font-bold ${card.textColor} mb-1`}>{card.value}</p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 truncate">{card.subtitle}</p>
                  )}
                </div>
                <div className={`p-2 lg:p-3 rounded-full bg-gradient-to-r ${card.color} flex-shrink-0 ml-2`}>
                  <card.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card de errores si los hay */}
      {errorsCount > 0 && (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 mb-1">Errores Encontrados</p>
                <p className="text-2xl font-bold text-red-600">{errorsCount}</p>
                <p className="text-xs text-gray-500 mt-1">Revisa la tabla para corregir</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}