import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

// Middlewares esenciales
app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api', router);

// Middleware centralizado de errores
app.use(errorHandler);

export default app;
