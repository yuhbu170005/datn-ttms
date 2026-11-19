import { pool, supabase } from '../config/database.js';

export class HealthRepository {
  /**
   * Truy vấn thông tin hệ thống từ PostgreSQL qua kết nối Pool
   */
  async checkPostgres(): Promise<{ status: string; timestamp?: string; db?: string; error?: string }> {
    try {
      const client = await pool.connect();
      const res = await client.query('SELECT NOW() as now, current_database() as db');
      client.release();
      return {
        status: 'connected',
        timestamp: res.rows[0].now,
        db: res.rows[0].db,
      };
    } catch (error: any) {
      return {
        status: 'disconnected',
        error: error.message,
      };
    }
  }

  /**
   * Truy vấn thông tin Supabase API client
   */
  async checkSupabase(): Promise<{ status: string; message: string }> {
    try {
      const { error } = await supabase.from('_dummy_health_check').select('*').limit(1);
      if (error && !error.message.includes('does not exist')) {
        return { status: 'error', message: error.message };
      }
      return { status: 'connected', message: 'Supabase API is reachable' };
    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  }
}

export const healthRepository = new HealthRepository();
