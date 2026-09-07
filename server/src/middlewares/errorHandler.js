import { env } from '../config/env.js';

/**
 * Middleware centralizado para captura y formateo de errores HTTP
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`[Error] ${req.method} ${req.url}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

/**
 * Middleware para capturar rutas inexistentes (404 Not Found)
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}
