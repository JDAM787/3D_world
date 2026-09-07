import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Consultas públicas
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Operaciones de mutación protegidas
router.post('/', authMiddleware, productController.create);
router.put('/:id', authMiddleware, productController.update);
router.delete('/:id', authMiddleware, productController.delete);

export default router;
