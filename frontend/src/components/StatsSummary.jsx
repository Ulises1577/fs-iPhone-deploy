import React from 'react';
import { Smartphone, Layers, TrendingUp, PackageCheck } from 'lucide-react';

export default function StatsSummary({ estadisticas, celulares = [] }) {
  // Calcular métricas locales si no vienen del endpoint
  const totalModelos = estadisticas?.total_modelos ?? celulares.length;
  const totalStock = estadisticas?.total_stock ?? celulares.reduce((acc, c) => acc + (c.stock || 0), 0);
  const precioPromedio = estadisticas?.precio_promedio ?? (
    celulares.length > 0
      ? (celulares.reduce((acc, c) => acc + (parseFloat(c.precio) || 0), 0) / celulares.length).toFixed(2)
      : 0
  );

  const formatoMoneda = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border hairline-border shadow-apple-sm hover:shadow-apple-md transition-shadow">
        <div className="flex items-center justify-between text-cupertino-slate mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Modelos</span>
          <Smartphone className="w-4 h-4 text-cupertino-blue" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cupertino-dark">
          {totalModelos}
        </div>
        <div className="text-xs text-cupertino-slate mt-1">Registrados en catálogo</div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border hairline-border shadow-apple-sm hover:shadow-apple-md transition-shadow">
        <div className="flex items-center justify-between text-cupertino-slate mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Stock Total</span>
          <PackageCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cupertino-dark">
          {totalStock}
        </div>
        <div className="text-xs text-cupertino-slate mt-1">Unidades disponibles</div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border hairline-border shadow-apple-sm hover:shadow-apple-md transition-shadow">
        <div className="flex items-center justify-between text-cupertino-slate mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Precio Promedio</span>
          <TrendingUp className="w-4 h-4 text-cupertino-blue" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cupertino-dark">
          {formatoMoneda(precioPromedio)}
        </div>
        <div className="text-xs text-cupertino-slate mt-1">Por dispositivo</div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border hairline-border shadow-apple-sm hover:shadow-apple-md transition-shadow">
        <div className="flex items-center justify-between text-cupertino-slate mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Marcas Activas</span>
          <Layers className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cupertino-dark">
          {new Set(celulares.map((c) => c.marca)).size || 0}
        </div>
        <div className="text-xs text-cupertino-slate mt-1">Fabricantes líderes</div>
      </div>
    </div>
  );
}
