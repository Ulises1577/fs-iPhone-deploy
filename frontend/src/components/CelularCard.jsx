import React from 'react';
import { Edit3, Trash2, HardDrive, Cpu, Eye } from 'lucide-react';

export default function CelularCard({
  celular,
  alEditar,
  alEliminar,
  alVerDetalle
}) {
  const formatoMoneda = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(val);
  };

  const tieneStock = (celular.stock || 0) > 0;
  const stockCritico = (celular.stock || 0) > 0 && (celular.stock || 0) <= 3;

  return (
    <div className="group relative bg-white rounded-2xl border hairline-border shadow-apple-sm hover:shadow-apple-lg transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      
      {/* Zona Superior con Imagen Flotante de Alta Fidelidad */}
      <div 
        onClick={() => alVerDetalle(celular)}
        className="relative h-64 w-full bg-[#FAFAFC] flex items-center justify-center p-6 cursor-pointer overflow-hidden"
      >
        {/* Badge de Stock flotante */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md ${
              !tieneStock
                ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                : stockCritico
                ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                !tieneStock ? 'bg-red-500' : stockCritico ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            {!tieneStock ? 'Agotado' : stockCritico ? `¡Últimas ${celular.stock}!` : `${celular.stock} disponibles`}
          </span>
        </div>

        {/* Badge de Marca */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/5 text-cupertino-slate">
            {celular.marca}
          </span>
        </div>

        {/* Imagen del Dispositivo */}
        {celular.imagen_url ? (
          <img
            src={celular.imagen_url}
            alt={`${celular.marca} ${celular.modelo}`}
            className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-cupertino-slate/50">
            <span className="text-4xl mb-2">📱</span>
            <span className="text-xs">Sin imagen disponible</span>
          </div>
        )}

        {/* Overlay hover para ver detalles */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="apple-glass-elevated text-cupertino-dark text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-apple-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Vista previa
          </span>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta con Especificaciones */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Título del Modelo */}
          <h3 
            onClick={() => alVerDetalle(celular)}
            className="text-lg font-semibold text-cupertino-dark tracking-tight leading-snug cursor-pointer hover:text-cupertino-blue transition-colors line-clamp-1"
          >
            {celular.modelo}
          </h3>

          {/* Color del Dispositivo */}
          {celular.color && (
            <p className="text-xs text-cupertino-slate mt-0.5 line-clamp-1">
              Color: <span className="text-cupertino-dark font-medium">{celular.color}</span>
            </p>
          )}

          {/* Chips de Especificaciones Técnicas */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/[0.03] text-xs font-medium text-cupertino-slate">
              <HardDrive className="w-3 h-3 text-cupertino-blue" />
              {celular.almacenamiento_gb} GB
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/[0.03] text-xs font-medium text-cupertino-slate">
              <Cpu className="w-3 h-3 text-cupertino-blue" />
              {celular.ram_gb} GB RAM
            </span>
          </div>

          {/* Breve descripción si existe */}
          {celular.descripcion && (
            <p className="text-xs text-cupertino-slate/90 mt-3 line-clamp-2 leading-relaxed">
              {celular.descripcion}
            </p>
          )}
        </div>

        {/* Precio y Botones de Acción CRUD */}
        <div className="mt-5 pt-4 border-t hairline-border flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-cupertino-slate font-semibold block">
              Precio
            </span>
            <span className="text-xl font-bold tracking-tight text-cupertino-dark">
              {formatoMoneda(celular.precio)}
            </span>
          </div>

          {/* Acciones de Edición y Eliminación */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => alEditar(celular)}
              className="p-2 rounded-full text-cupertino-dark hover:bg-black/5 active:scale-95 transition-all"
              title="Editar celular"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => alEliminar(celular)}
              className="p-2 rounded-full text-cupertino-destructive bg-cupertino-destructive-soft hover:bg-red-500/20 active:scale-95 transition-all"
              title="Eliminar celular"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
