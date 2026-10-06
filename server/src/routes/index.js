import { Router } from 'express';
import { authRouter } from './auth.routes.js';

export const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication module routes (/api/auth)
router.use('/auth', authRouter);

export default router;
