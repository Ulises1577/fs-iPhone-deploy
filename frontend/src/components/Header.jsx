import React from 'react';
import { Search, Plus, LayoutGrid, Table2, Smartphone, X } from 'lucide-react';

export default function Header({
  busqueda,
  setBusqueda,
  vista,
  setVista,
  alAbrirCrear,
  totalResultados
}) {
  return (
    <header className="sticky top-0 z-30 w-full apple-glass-elevated border-b hairline-border transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo y Nombre de la Tienda */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-cupertino-dark text-white flex items-center justify-center shadow-apple-sm">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-cupertino-dark leading-tight">
                  Cupertino Cellular
                </h1>
                <p className="text-xs text-cupertino-slate font-medium">
                  Catálogo & Gestión CRUD
                </p>
              </div>
            </div>

            {/* Botón Móvil para Agregar */}
            <button
              onClick={alAbrirCrear}
              className="md:hidden flex items-center gap-1.5 bg-cupertino-blue text-white px-3.5 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 apple-transition"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>

          {/* Buscador Central con estilo Apple (40px, 8px radius, optical glow ring) */}
          <div className="w-full md:max-w-md relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-cupertino-slate absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por marca, modelo o color..."
                className="w-full h-10 pl-10 pr-9 text-sm rounded-lg bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white border border-black/10 focus:border-cupertino-blue focus:outline-none focus:shadow-glow-blue transition-all placeholder:text-cupertino-slate/70"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 text-cupertino-slate hover:text-cupertino-dark"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Acciones y Controles Segmentados */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Control Segmentado de Vista (Catálogo / Inventario) */}
            <div className="bg-[#E5E5EA] p-1 rounded-full flex items-center">
              <button
                onClick={() => setVista('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vista === 'cards'
                    ? 'bg-white text-cupertino-dark shadow-sm'
                    : 'text-cupertino-slate hover:text-cupertino-dark'
                }`}
                title="Vista de Tarjetas de Catálogo"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Catálogo</span>
              </button>
              <button
                onClick={() => setVista('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  vista === 'table'
                    ? 'bg-white text-cupertino-dark shadow-sm'
                    : 'text-cupertino-slate hover:text-cupertino-dark'
                }`}
                title="Vista de Tabla CRUD"
              >
                <Table2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inventario</span>
              </button>
            </div>

            {/* Botón Principal "+ Agregar Celular" estilo Cupertino */}
            <button
              onClick={alAbrirCrear}
              className="hidden md:flex items-center gap-2 bg-cupertino-blue hover:bg-cupertino-blue-hover active:scale-[0.98] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-apple-sm transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Agregar Celular</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
