import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isProd = config.nodeEnv === 'production';

  // SEC-09: Sanitize internal error messages on 500 errors in production
  const message = statusCode >= 500 && isProd
    ? 'Internal Server Error'
    : (err.message || 'Internal Server Error');

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}

export default errorHandler;
