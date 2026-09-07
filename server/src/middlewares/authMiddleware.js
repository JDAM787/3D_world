import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Middleware para proteger rutas mediante validación de Bearer Token JWT
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: Token no proporcionado',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: Token inválido o expirado',
    });
  }
}
