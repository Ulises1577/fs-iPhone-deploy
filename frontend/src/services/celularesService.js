/**
 * Servicio cliente HTTP utilizando fetch nativo para comunicarse con la API REST de celulares.
 * Soporta configuración por variable de entorno VITE_API_URL o fallback a proxy local /api.
 */

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api/celulares';
  
  // Normalizar para que termine en /api/celulares
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/celulares') 
    ? cleanUrl 
    : cleanUrl.endsWith('/api') 
      ? `${cleanUrl}/celulares` 
      : `${cleanUrl}/api/celulares`;
};

const BASE_URL = getBaseUrl();

/**
 * Función auxiliar para procesar respuestas HTTP y formatear errores en español
 */
async function procesarRespuesta(respuesta) {
  let datos = null;
  const contentType = respuesta.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    try {
      datos = await respuesta.json();
    } catch (_) {
      datos = null;
    }
  }

  if (!respuesta.ok) {
    const mensajeError = datos?.mensaje || 
      (datos?.errores ? datos.errores.join(' ') : `Error HTTP ${respuesta.status}: ${respuesta.statusText}`);
    const error = new Error(mensajeError);
    error.status = respuesta.status;
    error.detalles = datos?.errores || [];
    throw error;
  }

  return datos;
}

/**
 * Obtener todos los celulares con soporte de filtros opcionales
 */
export async function obtenerCelulares(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.search && filtros.search.trim()) {
    params.append('search', filtros.search.trim());
  }
  if (filtros.marca && filtros.marca !== 'Todas') {
    params.append('marca', filtros.marca);
  }
  if (filtros.minPrecio !== undefined && filtros.minPrecio !== '') {
    params.append('minPrecio', filtros.minPrecio);
  }
  if (filtros.maxPrecio !== undefined && filtros.maxPrecio !== '') {
    params.append('maxPrecio', filtros.maxPrecio);
  }
  if (filtros.orden) {
    params.append('orden', filtros.orden);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const respuesta = await fetch(`${BASE_URL}${queryString}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  const resultado = await procesarRespuesta(respuesta);
  return resultado.datos || [];
}

/**
 * Obtener un celular individual por ID
 */
export async function obtenerCelularPorId(id) {
  const respuesta = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  const resultado = await procesarRespuesta(respuesta);
  return resultado.datos;
}

/**
 * Registrar un nuevo celular
 */
export async function crearCelular(celularData) {
  const respuesta = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(celularData)
  });

  const resultado = await procesarRespuesta(respuesta);
  return resultado;
}

/**
 * Actualizar un celular existente por ID
 */
export async function actualizarCelular(id, celularData) {
  const respuesta = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(celularData)
  });

  const resultado = await procesarRespuesta(respuesta);
  return resultado;
}

/**
 * Eliminar un celular del catálogo por ID
 */
export async function eliminarCelular(id) {
  const respuesta = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });

  const resultado = await procesarRespuesta(respuesta);
  return resultado;
}

/**
 * Obtener lista de marcas únicas existentes
 */
export async function obtenerMarcas() {
  try {
    const baseApi = BASE_URL.replace(/\/celulares$/, '');
    const respuesta = await fetch(`${baseApi}/celulares/marcas`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const resultado = await procesarRespuesta(respuesta);
    return resultado.datos || [];
  } catch (err) {
    console.warn('No se pudieron obtener las marcas dinámicas:', err.message);
    return [];
  }
}

/**
 * Obtener métricas y estadísticas del inventario
 */
export async function obtenerEstadisticas() {
  try {
    const baseApi = BASE_URL.replace(/\/celulares$/, '');
    const respuesta = await fetch(`${baseApi}/celulares/estadisticas`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const resultado = await procesarRespuesta(respuesta);
    return resultado.datos || null;
  } catch (err) {
    console.warn('No se pudieron obtener estadísticas:', err.message);
    return null;
  }
}
