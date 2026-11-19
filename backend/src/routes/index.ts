import { Router } from 'express';
import healthRouter from './health.route.js';

const apiRouter = Router();

// Đăng ký các routes
apiRouter.use('/health', healthRouter);

// Thêm các resource routes ở đây:
// apiRouter.use('/users', userRouter);
// apiRouter.use('/auth', authRouter);

export default apiRouter;
