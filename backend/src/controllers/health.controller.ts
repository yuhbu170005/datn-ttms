import { Request, Response, NextFunction } from 'express';
import { healthService, HealthService } from '../services/health.service.js';

export class HealthController {
  constructor(private readonly service: HealthService = healthService) {}

  checkHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getHealthStatus();
      res.status(data.status === 'healthy' ? 200 : 503).json({
        success: data.status === 'healthy',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const healthController = new HealthController();
