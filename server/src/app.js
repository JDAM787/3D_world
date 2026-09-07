import express from 'express';
import morgan from 'morgan';
import { corsMiddleware } from './middlewares/corsMiddleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';
import { env } from './config/env.js';

const app = express();

// Middlewares globales esenciales
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Montaje del router de la API
app.use('/api', apiRouter);

// Manejo de rutas inexistentes y errores globales
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
