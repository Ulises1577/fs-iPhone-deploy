import React from 'react';
import { Edit3, Trash2, Eye, HardDrive, Cpu } from 'lucide-react';

export default function CelularTable({
  celulares = [],
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

  return (
    <div className="w-full bg-white rounded-2xl border hairline-border shadow-apple-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-11 bg-black/[0.02] border-b hairline-border text-[11px] font-semibold uppercase tracking-[0.04em] text-cupertino-slate">
              <th className="py-2.5 px-4 sm:px-6">Dispositivo</th>
              <th className="py-2.5 px-4">Marca</th>
              <th className="py-2.5 px-4">Memoria / RAM</th>
              <th className="py-2.5 px-4">Color</th>
              <th className="py-2.5 px-4">Stock</th>
              <th className="py-2.5 px-4">Precio</th>
              <th className="py-2.5 px-4 sm:px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] text-sm">
            {celulares.map((celular) => {
              const tieneStock = (celular.stock || 0) > 0;
              const stockCritico = (celular.stock || 0) > 0 && (celular.stock || 0) <= 3;

              return (
                <tr
                  key={celular.id}
                  className="group hover:bg-cupertino-blue/[0.02] transition-colors"
                >
                  {/* Foto y Modelo */}
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => alVerDetalle(celular)}
                        className="w-12 h-12 rounded-lg bg-black/[0.03] p-1 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border hairline-border"
                      >
                        {celular.imagen_url ? (
                          <img
                            src={celular.imagen_url}
                            alt={celular.modelo}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                        ) : (
                          <span className="text-lg">📱</span>
                        )}
                      </div>
                      <div>
                        <div 
                          onClick={() => alVerDetalle(celular)}
                          className="font-semibold text-cupertino-dark hover:text-cupertino-blue cursor-pointer transition-colors"
                        >
                          {celular.modelo}
                        </div>
                        <div className="text-xs text-cupertino-slate line-clamp-1 max-w-xs">
                          {celular.descripcion || 'Sin descripción'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Marca */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-black/[0.04] text-cupertino-dark">
                      {celular.marca}
                    </span>
                  </td>

                  {/* Especificaciones */}
                  <td className="py-3 px-4 text-xs text-cupertino-slate">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-cupertino-blue" />
                        {celular.almacenamiento_gb} GB
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-cupertino-blue" />
                        {celular.ram_gb} GB
                      </span>
                    </div>
                  </td>

                  {/* Color */}
                  <td className="py-3 px-4 text-xs text-cupertino-dark font-medium">
                    {celular.color || '—'}
                  </td>

                  {/* Estado de Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        !tieneStock
                          ? 'bg-red-50 text-red-700'
                          : stockCritico
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          !tieneStock ? 'bg-red-500' : stockCritico ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      {celular.stock} u.
                    </span>
                  </td>

                  {/* Precio */}
                  <td className="py-3 px-4 font-bold text-cupertino-dark">
                    {formatoMoneda(celular.precio)}
                  </td>

                  {/* Acciones Rápidas */}
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => alVerDetalle(celular)}
                        className="p-1.5 rounded-full hover:bg-black/5 text-cupertino-slate hover:text-cupertino-dark transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alEditar(celular)}
                        className="p-1.5 rounded-full hover:bg-black/5 text-cupertino-dark transition-colors"
                        title="Editar celular"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alEliminar(celular)}
                        className="p-1.5 rounded-full bg-cupertino-destructive-soft hover:bg-red-100 text-cupertino-destructive transition-colors"
                        title="Eliminar celular"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
