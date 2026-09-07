import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';

const router = Router();

// Endpoint de verificación de salud
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Montaje de rutas modulares por dominio
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

export default router;
