import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rutas protegidas
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
