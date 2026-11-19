import { healthRepository, HealthRepository } from '../repositories/health.repository.js';

export class HealthService {
  constructor(private readonly repo: HealthRepository = healthRepository) {}

  async getHealthStatus() {
    const postgres = await this.repo.checkPostgres();
    const supabaseStatus = await this.repo.checkSupabase();

    const isHealthy = postgres.status === 'connected' || supabaseStatus.status === 'connected';

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      serverTime: new Date().toISOString(),
      database: {
        postgres,
        supabase: supabaseStatus,
      },
    };
  }
}

export const healthService = new HealthService();
