import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  abierto,
  alCerrar,
  alConfirmar,
  celular,
  cargando = false
}) {
  if (!abierto || !celular) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo con desenfoque Apple */}
      <div
        onClick={alCerrar}
        className="fixed inset-0 bg-black/40 backdrop-blur-xl transition-opacity"
      />

      {/* Contenedor del Diálogo */}
      <div className="relative w-full max-w-md bg-white rounded-squircle-lg shadow-apple-xl border hairline-border z-10 overflow-hidden p-6 text-center animate-scale-up">
        
        {/* Botón Cerrar */}
        <button
          onClick={alCerrar}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-cupertino-slate hover:text-cupertino-dark transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Ícono Destructivo con Estilo Cupertino */}
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-cupertino-destructive flex items-center justify-center mb-4">
          <Trash2 className="w-7 h-7 text-cupertino-destructive" />
        </div>

        {/* Título y Mensaje */}
        <h3 className="text-lg font-bold tracking-tight text-cupertino-dark">
          ¿Eliminar {celular.marca} {celular.modelo}?
        </h3>
        
        <p className="text-xs text-cupertino-slate mt-2 leading-relaxed">
          Esta acción quitará permanentemente este dispositivo del catálogo y de la base de datos PostgreSQL. Esta operación no se puede deshacer.
        </p>

        {/* Resumen del celular a eliminar */}
        <div className="mt-4 p-3 bg-black/[0.02] rounded-xl border hairline-border text-left flex items-center gap-3">
          {celular.imagen_url && (
            <img
              src={celular.imagen_url}
              alt={celular.modelo}
              className="w-10 h-10 object-contain rounded shrink-0"
            />
          )}
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-cupertino-dark truncate">
              {celular.marca} {celular.modelo}
            </div>
            <div className="text-[11px] text-cupertino-slate">
              {celular.almacenamiento_gb} GB • {celular.ram_gb} GB RAM • {celular.stock} unidades
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={alCerrar}
            disabled={cargando}
            className="w-1/2 px-4 py-2.5 rounded-full text-xs font-semibold text-cupertino-dark bg-black/5 hover:bg-black/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={alConfirmar}
            disabled={cargando}
            className="w-1/2 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-cupertino-destructive hover:bg-red-600 active:scale-95 shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {cargando ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>

      </div>
    </div>
  );
}
