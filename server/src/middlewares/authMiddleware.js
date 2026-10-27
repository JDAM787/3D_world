import { verifyAuthToken } from '../services/auth.service.js';

/**
 * Express middleware to authenticate incoming requests via HMAC signed session token (SEC-01).
 * Expects header: Authorization: Bearer <signed_token>
 */
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Authentication required: Missing or malformed Bearer token');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAuthToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
}

export default requireAuth;
