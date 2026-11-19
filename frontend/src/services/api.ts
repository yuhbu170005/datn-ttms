import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface HealthCheckResponse {
  success: boolean;
  data: {
    status: string;
    serverTime: string;
    database: {
      postgres: {
        status: string;
        timestamp?: string;
        db?: string;
        error?: string;
      };
      supabase: {
        status: string;
        message: string;
      };
    };
  };
}

export const healthApi = {
  getHealth: async (): Promise<HealthCheckResponse> => {
    const res = await api.get<HealthCheckResponse>('/health');
    return res.data;
  },
};

export default api;
