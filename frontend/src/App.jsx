import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import StatsSummary from './components/StatsSummary.jsx';
import FilterBar from './components/FilterBar.jsx';
import CelularCard from './components/CelularCard.jsx';
import CelularTable from './components/CelularTable.jsx';
import CelularModal from './components/CelularModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import DetailModal from './components/DetailModal.jsx';
import Toast from './components/Toast.jsx';
import {
  obtenerCelulares,
  crearCelular,
  actualizarCelular,
  eliminarCelular,
  obtenerMarcas,
  obtenerEstadisticas
} from './services/celularesService.js';
import { Smartphone, Plus, RefreshCw, AlertCircle, Database, Server, Globe } from 'lucide-react';

export default function App() {
  // Estados de datos
  const [celulares, setCelulares] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // Estados de filtros y vistas
  const [busqueda, setBusqueda] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas');
  const [orden, setOrden] = useState('reciente');
  const [vista, setVista] = useState('cards'); // 'cards' | 'table'

  // Estados de modales
  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [celularAEditar, setCelularAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [celularAEliminar, setCelularAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [celularDetalle, setCelularDetalle] = useState(null);

  // Notificaciones Toast
  const [toast, setToast] = useState(null); // { mensaje, tipo: 'exito' | 'error' }

  const mostrarToast = (mensaje, tipo = 'exito') => {
    setToast({ mensaje, tipo });
  };

  // Carga de catálogo con filtros
  const cargarCatalogo = useCallback(async () => {
    try {
      setCargando(true);
      setErrorCarga(null);
      const filtros = {
        search: busqueda,
        marca: marcaSeleccionada,
        orden: orden
      };
      const datos = await obtenerCelulares(filtros);
      setCelulares(datos);
    } catch (err) {
      console.error('Error al cargar celulares:', err);
      setErrorCarga(err.message || 'Error al conectar con la base de datos de celulares.');
    } finally {
      setCargando(false);
    }
  }, [busqueda, marcaSeleccionada, orden]);

  // Cargar metadatos globales (marcas y estadísticas)
  const cargarMetadatos = useCallback(async () => {
    try {
      const [marcasData, statsData] = await Promise.all([
        obtenerMarcas(),
        obtenerEstadisticas()
      ]);
      if (marcasData && marcasData.length > 0) {
        setMarcas(marcasData);
      }
      if (statsData) {
        setEstadisticas(statsData);
      }
    } catch (err) {
      console.warn('Metadatos no disponibles:', err);
    }
  }, []);

  // Efecto con debounce para búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      cargarCatalogo();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [cargarCatalogo]);

  useEffect(() => {
    cargarMetadatos();
  }, [cargarMetadatos]);

  // Manejador para Crear / Editar
  const handleAbrirCrear = () => {
    setCelularAEditar(null);
    setModalFormularioAbierto(true);
  };

  const handleAbrirEditar = (celular) => {
    setCelularAEditar(celular);
    setModalFormularioAbierto(true);
  };

  const handleGuardarCelular = async (formData) => {
    try {
      setGuardando(true);
      if (celularAEditar) {
        const respuesta = await actualizarCelular(celularAEditar.id, formData);
        mostrarToast(respuesta.mensaje || 'Dispositivo actualizado con éxito.');
      } else {
        const respuesta = await crearCelular(formData);
        mostrarToast(respuesta.mensaje || 'Dispositivo añadido al catálogo.');
      }
      setModalFormularioAbierto(false);
      setCelularAEditar(null);
      await cargarCatalogo();
      await cargarMetadatos();
    } catch (err) {
      console.error('Error al guardar:', err);
      mostrarToast(err.message || 'No se pudo guardar el celular.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  // Manejador para Eliminar
  const handleAbrirEliminar = (celular) => {
    setCelularAEliminar(celular);
    setModalEliminarAbierto(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!celularAEliminar) return;
    try {
      setEliminando(true);
      const respuesta = await eliminarCelular(celularAEliminar.id);
      mostrarToast(respuesta.mensaje || 'Dispositivo eliminado del catálogo.');
      setModalEliminarAbierto(false);
      setCelularAEliminar(null);
      await cargarCatalogo();
      await cargarMetadatos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      mostrarToast(err.message || 'No se pudo eliminar el celular.', 'error');
    } finally {
      setEliminando(false);
    }
  };

  // Manejador para Inspeccionar Detalle
  const handleVerDetalle = (celular) => {
    setCelularDetalle(celular);
    setModalDetalleAbierto(true);
  };

  const handleResetearFiltros = () => {
    setBusqueda('');
    setMarcaSeleccionada('Todas');
    setOrden('reciente');
  };

  return (
    <div className="min-h-screen bg-cupertino-canvas flex flex-col font-sans selection:bg-cupertino-blue selection:text-white">
      
      {/* Barra de Navegación Superior Apple Frosted Glass */}
      <Header
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        vista={vista}
        setVista={setVista}
        alAbrirCrear={handleAbrirCrear}
        totalResultados={celulares.length}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
        
        {/* Hero Showcase de Marca & Estilo Cupertino */}
        <section className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-semibold uppercase tracking-wider text-cupertino-slate mb-3 border hairline-border">
            <span>Diseño Cupertino Studio</span>
            <span className="text-cupertino-blue">•</span>
            <span>CRUD Full-Stack PostgreSQL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cupertino-dark leading-tight">
            Catálogo & Gestión de Celulares.
          </h2>
          
          <p className="mt-3 text-base sm:text-lg text-cupertino-slate max-w-2xl font-normal leading-relaxed">
            Explora y administra el inventario con precisión arquitectónica. Crea nuevos dispositivos, ajusta especificaciones técnicas o gestiona existencias en tiempo real.
          </p>
        </section>

        {/* Resumen de Métricas */}
        <StatsSummary estadisticas={estadisticas} celulares={celulares} />

        {/* Barra de Filtros y Ordenamiento */}
        <FilterBar
          marcas={marcas}
          marcaSeleccionada={marcaSeleccionada}
          setMarcaSeleccionada={setMarcaSeleccionada}
          orden={orden}
          setOrden={setOrden}
          alResetearFiltros={handleResetearFiltros}
          totalResultados={celulares.length}
        />

        {/* Estado de Error en Carga */}
        {errorCarga && (
          <div className="mb-8 p-5 bg-red-50/90 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-900 text-sm">
              <AlertCircle className="w-5 h-5 text-cupertino-destructive shrink-0" />
              <div>
                <p className="font-semibold">Error al cargar datos:</p>
                <p className="text-xs text-red-700">{errorCarga}</p>
              </div>
            </div>
            <button
              onClick={cargarCatalogo}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-red-900 border border-red-300 hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar
            </button>
          </div>
        )}

        {/* Vista Principal: Skeleton o Grilla/Tabla */}
        {cargando && celulares.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border hairline-border shadow-apple-sm animate-pulse h-96 flex flex-col justify-between"
              >
                <div className="w-full h-44 bg-black/5 rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-black/5 rounded w-3/4" />
                  <div className="h-3 bg-black/5 rounded w-1/2" />
                </div>
                <div className="h-8 bg-black/5 rounded-full mt-4" />
              </div>
            ))}
          </div>
        ) : celulares.length === 0 ? (
          /* Estado Vacío */
          <div className="bg-white rounded-2xl border hairline-border p-12 text-center max-w-md mx-auto shadow-apple-sm">
            <div className="w-16 h-16 rounded-full bg-cupertino-canvas mx-auto flex items-center justify-center text-cupertino-slate mb-4">
              <Smartphone className="w-8 h-8 text-cupertino-slate" />
            </div>
            <h3 className="text-lg font-bold text-cupertino-dark tracking-tight">
              No se encontraron celulares
            </h3>
            <p className="text-xs text-cupertino-slate mt-2 leading-relaxed">
              {busqueda || marcaSeleccionada !== 'Todas'
                ? 'No hay dispositivos que coincidan con los criterios de búsqueda actuales. Intenta restablecer los filtros.'
                : 'El inventario está actualmente vacío. Comienza agregando el primer celular al catálogo.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
              {busqueda || marcaSeleccionada !== 'Todas' ? (
                <button
                  onClick={handleResetearFiltros}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-black/5 hover:bg-black/10 text-cupertino-dark transition-colors"
                >
                  Restablecer Filtros
                </button>
              ) : null}
              <button
                onClick={handleAbrirCrear}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-cupertino-blue hover:bg-cupertino-blue-hover transition-all flex items-center gap-1.5 shadow-apple-sm"
              >
                <Plus className="w-4 h-4" />
                + Agregar Celular
              </button>
            </div>
          </div>
        ) : vista === 'cards' ? (
          /* Cuadrícula de Tarjetas de Catálogo (Showcase Reel) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {celulares.map((celular) => (
              <CelularCard
                key={celular.id}
                celular={celular}
                alEditar={handleAbrirEditar}
                alEliminar={handleAbrirEliminar}
                alVerDetalle={handleVerDetalle}
              />
            ))}
          </div>
        ) : (
          /* Vista de Tabla de Inventario (CRUD Matrix Table) */
          <CelularTable
            celulares={celulares}
            alEditar={handleAbrirEditar}
            alEliminar={handleAbrirEliminar}
            alVerDetalle={handleVerDetalle}
          />
        )}

      </main>

      {/* Pie de Página Minimalista Apple */}
      <footer className="mt-16 border-t hairline-border bg-white py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cupertino-slate">
          <div>
            <span className="font-semibold text-cupertino-dark">Cupertino Cellular Store</span> • Plataforma Full-Stack con CRUD Abierto
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[11px] bg-black/[0.03] px-2.5 py-1 rounded-full">
              <Globe className="w-3 h-3 text-cupertino-blue" />
              Netlify (Frontend)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-black/[0.03] px-2.5 py-1 rounded-full">
              <Server className="w-3 h-3 text-purple-600" />
              Railway (Backend)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-black/[0.03] px-2.5 py-1 rounded-full">
              <Database className="w-3 h-3 text-emerald-600" />
              PostgreSQL
            </span>
          </div>
        </div>
      </footer>

      {/* Modal de Creación / Edición */}
      <CelularModal
        abierto={modalFormularioAbierto}
        alCerrar={() => setModalFormularioAbierto(false)}
        alGuardar={handleGuardarCelular}
        celularAEditar={celularAEditar}
        cargando={guardando}
      />

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmModal
        abierto={modalEliminarAbierto}
        alCerrar={() => setModalEliminarAbierto(false)}
        alConfirmar={handleConfirmarEliminar}
        celular={celularAEliminar}
        cargando={eliminando}
      />

      {/* Modal de Inspección Detallada */}
      <DetailModal
        abierto={modalDetalleAbierto}
        alCerrar={() => setModalDetalleAbierto(false)}
        celular={celularDetalle}
        alEditar={handleAbrirEditar}
        alEliminar={handleAbrirEliminar}
      />

      {/* Notificación Toast */}
      {toast && (
        <Toast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          alCerrar={() => setToast(null)}
        />
      )}

    </div>
  );
}
