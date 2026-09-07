import cors from 'cors';
import { env } from '../config/env.js';

/**
 * Middleware para la configuración de Cross-Origin Resource Sharing (CORS)
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como Postman o curl) o que coincidan con CLIENT_ORIGIN
    if (!origin || origin === env.CLIENT_ORIGIN || env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Bloqueado por la política de CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
