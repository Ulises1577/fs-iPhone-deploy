import React from 'react';
import { X, HardDrive, Cpu, Calendar, Box, Edit3, Trash2, Tag, ShieldCheck } from 'lucide-react';

export default function DetailModal({
  abierto,
  alCerrar,
  celular,
  alEditar,
  alEliminar
}) {
  if (!abierto || !celular) return null;

  const formatoMoneda = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(val);
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '—';
    try {
      return new Date(fechaStr).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (_) {
      return fechaStr;
    }
  };

  const tieneStock = (celular.stock || 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Fondo con desenfoque Apple */}
      <div
        onClick={alCerrar}
        className="fixed inset-0 bg-black/40 backdrop-blur-xl transition-opacity"
      />

      {/* Tarjeta del Modal de Detalle */}
      <div className="relative w-full max-w-2xl bg-white rounded-squircle-lg shadow-apple-xl border hairline-border z-10 overflow-hidden my-8 animate-scale-up">
        
        {/* Botón de Cierre */}
        <button
          onClick={alCerrar}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-cupertino-slate hover:text-cupertino-dark transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Zona Superior: Fotografía del Dispositivo */}
        <div className="relative h-72 sm:h-80 w-full bg-[#FAFAFC] flex items-center justify-center p-8 border-b hairline-border">
          {celular.imagen_url ? (
            <img
              src={celular.imagen_url}
              alt={celular.modelo}
              className="max-h-full max-w-full object-contain filter drop-shadow-xl"
            />
          ) : (
            <span className="text-6xl">📱</span>
          )}

          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-black/5 text-cupertino-dark">
              {celular.marca}
            </span>
          </div>

          <div className="absolute bottom-4 right-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                tieneStock
                  ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-700 border border-red-500/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  tieneStock ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              {tieneStock ? `${celular.stock} unidades en stock` : 'Sin stock disponible'}
            </span>
          </div>
        </div>

        {/* Zona Inferior: Especificaciones y Ficha Técnica */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-cupertino-dark">
                {celular.modelo}
              </h2>
              {celular.color && (
                <p className="text-sm text-cupertino-slate mt-1">
                  Colorway oficial:{' '}
                  <span className="text-cupertino-dark font-medium">{celular.color}</span>
                </p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase tracking-wider text-cupertino-slate font-semibold block">
                Precio Sugerido
              </span>
              <span className="text-3xl font-bold tracking-tight text-cupertino-dark">
                {formatoMoneda(celular.precio)}
              </span>
            </div>
          </div>

          {/* Grilla de Especificaciones Técnicas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-black/[0.02] rounded-xl border hairline-border">
              <div className="flex items-center gap-1.5 text-xs text-cupertino-slate mb-1">
                <HardDrive className="w-3.5 h-3.5 text-cupertino-blue" />
                <span>Almacenamiento</span>
              </div>
              <div className="text-base font-semibold text-cupertino-dark">
                {celular.almacenamiento_gb} GB
              </div>
            </div>

            <div className="p-3.5 bg-black/[0.02] rounded-xl border hairline-border">
              <div className="flex items-center gap-1.5 text-xs text-cupertino-slate mb-1">
                <Cpu className="w-3.5 h-3.5 text-cupertino-blue" />
                <span>Memoria RAM</span>
              </div>
              <div className="text-base font-semibold text-cupertino-dark">
                {celular.ram_gb} GB
              </div>
            </div>

            <div className="p-3.5 bg-black/[0.02] rounded-xl border hairline-border col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-cupertino-slate mb-1">
                <Box className="w-3.5 h-3.5 text-cupertino-blue" />
                <span>Inventario</span>
              </div>
              <div className="text-base font-semibold text-cupertino-dark">
                {celular.stock} unidades
              </div>
            </div>
          </div>

          {/* Descripción */}
          {celular.descripcion && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-2">
                Descripción
              </h4>
              <p className="text-sm text-cupertino-dark/90 leading-relaxed bg-[#FAFAFC] p-4 rounded-xl border hairline-border">
                {celular.descripcion}
              </p>
            </div>
          )}

          {/* Fechas de Creación y Actualización */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-cupertino-slate pt-2 border-t hairline-border">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Agregado: {formatearFecha(celular.creado_en)}
            </span>
            {celular.actualizado_en && (
              <span>• Actualizado: {formatearFecha(celular.actualizado_en)}</span>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                alCerrar();
                alEliminar(celular);
              }}
              className="px-4 py-2 rounded-full text-xs font-semibold text-cupertino-destructive bg-cupertino-destructive-soft hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>
            <button
              onClick={() => {
                alCerrar();
                alEditar(celular);
              }}
              className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-cupertino-dark hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Dispositivo</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
