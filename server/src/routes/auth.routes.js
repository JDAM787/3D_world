import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

export const authRouter = Router();

// SEC-07: Apply native rate limiting to all auth endpoints
authRouter.use(authRateLimiter);

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
