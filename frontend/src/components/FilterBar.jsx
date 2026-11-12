import React from 'react';
import { ArrowUpDown, Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({
  marcas = [],
  marcaSeleccionada,
  setMarcaSeleccionada,
  orden,
  setOrden,
  alResetearFiltros,
  totalResultados
}) {
  // Asegura que las marcas sean estrictamente únicas y ordenadas
  const marcasUnicas = Array.from(new Set(marcas.filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const opcionesMarcas = ['Todas', ...marcasUnicas];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      
      {/* Pills de Selección de Marca (Estilo Apple Cupertino) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <span className="text-xs font-semibold text-cupertino-slate uppercase tracking-wider mr-2 hidden sm:inline-block">
          Marca:
        </span>
        {opcionesMarcas.map((marca) => {
          const activa = marcaSeleccionada === marca;
          return (
            <button
              key={marca}
              onClick={() => setMarcaSeleccionada(marca)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                activa
                  ? 'bg-cupertino-dark text-white shadow-apple-sm scale-[1.02]'
                  : 'bg-white hover:bg-black/[0.04] text-cupertino-slate hover:text-cupertino-dark border hairline-border'
              }`}
            >
              {marca}
            </button>
          );
        })}
      </div>

      {/* Ordenamiento y Contador de Resultados */}
      <div className="flex items-center justify-between md:justify-end gap-3">
        <span className="text-xs text-cupertino-slate font-medium">
          {totalResultados} {totalResultados === 1 ? 'dispositivo' : 'dispositivos'}
        </span>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="appearance-none bg-white border hairline-border rounded-full pl-8 pr-8 py-1.5 text-xs font-medium text-cupertino-dark hover:border-black/20 focus:outline-none focus:shadow-glow-blue transition-all cursor-pointer"
            >
              <option value="reciente">Más recientes</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
              <option value="modelo_asc">Nombre A-Z</option>
              <option value="stock_desc">Mayor Stock</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-cupertino-slate absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {(marcaSeleccionada !== 'Todas' || orden !== 'reciente') && (
            <button
              onClick={alResetearFiltros}
              className="p-1.5 rounded-full bg-white hover:bg-black/[0.04] border hairline-border text-cupertino-slate hover:text-cupertino-dark transition-colors"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
