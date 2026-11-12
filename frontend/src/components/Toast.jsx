import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ mensaje, tipo = 'exito', alCerrar }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      alCerrar();
    }, 4000);
    return () => clearTimeout(timer);
  }, [alCerrar]);

  const esExito = tipo === 'exito';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-full shadow-apple-lg border backdrop-blur-xl ${
          esExito
            ? 'bg-white/95 text-cupertino-dark border-black/10'
            : 'bg-red-50/95 text-red-900 border-red-200'
        }`}
      >
        {esExito ? (
          <CheckCircle2 className="w-5 h-5 text-cupertino-blue shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-cupertino-destructive shrink-0" />
        )}
        <span className="text-sm font-medium pr-1">{mensaje}</span>
        <button
          onClick={alCerrar}
          className="p-1 rounded-full hover:bg-black/5 transition-colors text-cupertino-slate hover:text-cupertino-dark"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
