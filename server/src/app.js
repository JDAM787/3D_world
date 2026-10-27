import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

// SEC-08: Disable Express signature header
app.disable('x-powered-by');

// SEC-08: Native HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// SEC-06: Restrict CORS to configured client origin
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

app.use(express.json());

// Base API routes
app.use('/api', router);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
