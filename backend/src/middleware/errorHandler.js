/**
 * Middleware para capturar rutas no encontradas (404)
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    exito: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
}

/**
 * Middleware global para el manejo de errores del servidor (500)
 */
export function globalErrorHandler(err, req, res, next) {
  console.error('Error interno del servidor:', err);

  const status = err.statusCode || 500;
  const mensaje = err.message || 'Ocurrió un error inesperado en el servidor.';

  res.status(status).json({
    exito: false,
    mensaje: 'Error en la operación del servidor.',
    detalle: process.env.NODE_ENV === 'production' ? mensaje : err.stack
  });
}
