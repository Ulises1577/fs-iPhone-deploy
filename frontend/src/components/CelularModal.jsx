import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { MODELOS_PREDEFINIDOS, IMAGENES_SUGERIDAS } from '../data/presetPhones.js';

export default function CelularModal({
  abierto,
  alCerrar,
  alGuardar,
  celularAEditar = null,
  cargando = false
}) {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    precio: '',
    almacenamiento_gb: '',
    ram_gb: '',
    color: '',
    stock: 0,
    descripcion: '',
    imagen_url: ''
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (celularAEditar) {
      setFormData({
        marca: celularAEditar.marca || '',
        modelo: celularAEditar.modelo || '',
        precio: celularAEditar.precio !== undefined ? celularAEditar.precio : '',
        almacenamiento_gb: celularAEditar.almacenamiento_gb || '',
        ram_gb: celularAEditar.ram_gb || '',
        color: celularAEditar.color || '',
        stock: celularAEditar.stock !== undefined ? celularAEditar.stock : 0,
        descripcion: celularAEditar.descripcion || '',
        imagen_url: celularAEditar.imagen_url || ''
      });
    } else {
      setFormData({
        marca: 'Apple',
        modelo: '',
        precio: '',
        almacenamiento_gb: 128,
        ram_gb: 8,
        color: '',
        stock: 5,
        descripcion: '',
        imagen_url: ''
      });
    }
    setErrores({});
  }, [celularAEditar, abierto]);

  if (!abierto) return null;

  const esEdicion = Boolean(celularAEditar);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const aplicarPreset = (preset) => {
    setFormData({
      marca: preset.marca,
      modelo: preset.modelo,
      precio: preset.precio,
      almacenamiento_gb: preset.almacenamiento_gb,
      ram_gb: preset.ram_gb,
      color: preset.color,
      stock: preset.stock,
      descripcion: preset.descripcion,
      imagen_url: preset.imagen_url
    });
    setErrores({});
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.marca.trim()) nuevosErrores.marca = 'La marca es obligatoria.';
    if (!formData.modelo.trim()) nuevosErrores.modelo = 'El modelo es obligatorio.';
    
    const precioNum = Number(formData.precio);
    if (formData.precio === '' || isNaN(precioNum) || precioNum < 0) {
      nuevosErrores.precio = 'Ingresa un precio válido (mayor o igual a 0).';
    }

    const almNum = Number(formData.almacenamiento_gb);
    if (!formData.almacenamiento_gb || !Number.isInteger(almNum) || almNum <= 0) {
      nuevosErrores.almacenamiento_gb = 'Debe ser un número entero mayor a 0 (ej. 128, 256).';
    }

    const ramNum = Number(formData.ram_gb);
    if (!formData.ram_gb || !Number.isInteger(ramNum) || ramNum <= 0) {
      nuevosErrores.ram_gb = 'Debe ser un número entero mayor a 0 (ej. 6, 8, 12, 16).';
    }

    const stockNum = Number(formData.stock);
    if (formData.stock !== '' && (!Number.isInteger(stockNum) || stockNum < 0)) {
      nuevosErrores.stock = 'El stock debe ser un número entero mayor o igual a 0.';
    }

    if (formData.imagen_url.trim()) {
      try {
        new URL(formData.imagen_url.trim());
      } catch (_) {
        nuevosErrores.imagen_url = 'Ingresa una URL válida (ej. https://...).';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) return;

    alGuardar({
      ...formData,
      precio: parseFloat(Number(formData.precio).toFixed(2)),
      almacenamiento_gb: parseInt(formData.almacenamiento_gb, 10),
      ram_gb: parseInt(formData.ram_gb, 10),
      stock: parseInt(formData.stock || 0, 10)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Fondo con desenfoque Apple */}
      <div
        onClick={alCerrar}
        className="fixed inset-0 bg-black/40 backdrop-blur-xl transition-opacity"
      />

      {/* Tarjeta del Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-squircle-lg shadow-apple-xl border hairline-border z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 border-b hairline-border flex items-center justify-between apple-glass-elevated sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-cupertino-dark">
              {esEdicion ? 'Editar Celular' : 'Nuevo Dispositivo'}
            </h2>
            <p className="text-xs text-cupertino-slate">
              {esEdicion
                ? 'Actualiza los datos y especificaciones del dispositivo.'
                : 'Completa la ficha técnica para añadirlo al catálogo.'}
            </p>
          </div>

          <button
            onClick={alCerrar}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-cupertino-slate hover:text-cupertino-dark transition-colors"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="p-6 overflow-y-auto space-y-6">
          
          {/* Barra de Atajos / Presets (Solo al crear) */}
          {!esEdicion && (
            <div className="bg-cupertino-canvas p-3.5 rounded-xl border hairline-border">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cupertino-dark mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cupertino-blue" />
                <span>Rellenar con un modelo de prueba con 1 clic:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {MODELOS_PREDEFINIDOS.map((preset) => (
                  <button
                    key={preset.etiqueta}
                    type="button"
                    onClick={() => aplicarPreset(preset)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-black/5 text-cupertino-dark border hairline-border shadow-sm transition-all"
                  >
                    + {preset.etiqueta}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grilla Principal de Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Marca */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={manejarCambio}
                placeholder="Ej. Apple, Samsung, Google"
                className={`w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border ${
                  errores.marca ? 'border-red-500' : 'border-black/10'
                } focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all`}
              />
              {errores.marca && <p className="text-xs text-red-500 mt-1">{errores.marca}</p>}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={manejarCambio}
                placeholder="Ej. iPhone 16 Pro Max"
                className={`w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border ${
                  errores.modelo ? 'border-red-500' : 'border-black/10'
                } focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all`}
              />
              {errores.modelo && <p className="text-xs text-red-500 mt-1">{errores.modelo}</p>}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Precio (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="precio"
                value={formData.precio}
                onChange={manejarCambio}
                placeholder="Ej. 1299.00"
                className={`w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border ${
                  errores.precio ? 'border-red-500' : 'border-black/10'
                } focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all`}
              />
              {errores.precio && <p className="text-xs text-red-500 mt-1">{errores.precio}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Stock (Unidades) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={manejarCambio}
                placeholder="Ej. 10"
                className={`w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border ${
                  errores.stock ? 'border-red-500' : 'border-black/10'
                } focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all`}
              />
              {errores.stock && <p className="text-xs text-red-500 mt-1">{errores.stock}</p>}
            </div>

            {/* Almacenamiento (GB) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Almacenamiento (GB) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                name="almacenamiento_gb"
                value={formData.almacenamiento_gb}
                onChange={manejarCambio}
                placeholder="Ej. 128, 256, 512, 1024"
                className={`w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border ${
                  errores.almacenamiento_gb ? 'border-red-500' : 'border-black/10'
                } focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all`}
              />
              {errores.almacenamiento_gb && (
                <p className="text-xs text-red-500 mt-1">{errores.almacenamiento_gb}</p>
              )}
            </div>

            {/* RAM (GB) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Memoria RAM (GB) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                name="ram_gb"
                value={formData.ram_gb}
                onChange={manejarCambio}
                placeholder="Ej. 6, 8, 12, 16"
                className={`w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border ${
                  errores.ram_gb ? 'border-red-500' : 'border-black/10'
                } focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all`}
              />
              {errores.ram_gb && <p className="text-xs text-red-500 mt-1">{errores.ram_gb}</p>}
            </div>

            {/* Color */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Colorway / Acabado
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={manejarCambio}
                placeholder="Ej. Titanio Natural, Negro Espacial, Azul Medianoche"
                className="w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border border-black/10 focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all"
              />
            </div>

            {/* URL de Imagen */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                URL de Imagen
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={manejarCambio}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full h-10 px-3.5 text-sm rounded-lg bg-black/[0.03] border ${
                    errores.imagen_url ? 'border-red-500' : 'border-black/10'
                  } focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all`}
                />
              </div>
              {errores.imagen_url && (
                <p className="text-xs text-red-500 mt-1">{errores.imagen_url}</p>
              )}

              {/* Sugerencias de imágenes rápidas */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-cupertino-slate">
                <span className="font-medium">O sugerir foto:</span>
                {IMAGENES_SUGERIDAS.map((img) => (
                  <button
                    key={img.nombre}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imagen_url: img.url }))}
                    className="px-2 py-0.5 rounded bg-black/5 hover:bg-black/10 text-cupertino-dark text-[11px] transition-colors"
                  >
                    {img.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Vista Previa de la Imagen */}
            {formData.imagen_url && (
              <div className="md:col-span-2 flex items-center gap-4 p-3 bg-black/[0.02] rounded-xl border hairline-border">
                <div className="w-20 h-20 bg-white rounded-lg p-1.5 border hairline-border flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={formData.imagen_url}
                    alt="Vista previa"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-cupertino-dark flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cupertino-blue" />
                    <span>Vista previa del dispositivo</span>
                  </div>
                  <p className="text-xs text-cupertino-slate mt-0.5">
                    Esta imagen se mostrará tanto en la tarjeta como en la ficha técnica.
                  </p>
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cupertino-slate mb-1">
                Descripción del Dispositivo
              </label>
              <textarea
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={manejarCambio}
                placeholder="Describe características clave, procesador, cámara, pantalla, etc."
                className="w-full p-3 text-sm rounded-lg bg-black/[0.03] border border-black/10 focus:bg-white focus:border-cupertino-blue focus:shadow-glow-blue focus:outline-none transition-all resize-none"
              />
            </div>

          </div>

          {/* Pie de Acciones del Formulario */}
          <div className="pt-4 border-t hairline-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={alCerrar}
              className="px-5 py-2 rounded-full text-xs font-semibold text-cupertino-dark bg-black/5 hover:bg-black/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2 rounded-full text-xs font-semibold text-white bg-cupertino-dark hover:bg-black active:scale-[0.98] shadow-apple-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {cargando ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{esEdicion ? 'Actualizar Celular' : 'Guardar en Catálogo'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
