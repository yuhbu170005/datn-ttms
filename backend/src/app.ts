import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

export function createApp(): Application {
  const app: Application = express();

  // Middleware chuẩn
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'TTMS API Server',
      version: '1.0.0',
      status: 'running',
      documentation: '/api/v1/health',
    });
  });

  // API Routes
  app.use('/api/v1', apiRouter);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint không tồn tại: ${req.method} ${req.originalUrl}`,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
