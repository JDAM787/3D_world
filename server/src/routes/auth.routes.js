import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

export const authRouter = Router();

/**
 * OAuth Provider Initiation
 * GET /api/auth/google
 * GET /api/auth/facebook
 * GET /api/auth/x
 */
authRouter.get('/:provider', authController.redirectToProvider);

/**
 * OAuth Provider Callback
 * GET /api/auth/google/callback
 * GET /api/auth/facebook/callback
 * GET /api/auth/x/callback
 */
authRouter.get('/:provider/callback', authController.handleCallback);

export default authRouter;
