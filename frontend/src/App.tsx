import { useState, useEffect } from 'react';
import { healthApi, HealthCheckResponse } from './services/api';

export default function App() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await healthApi.getHealth();
      setHealth(data);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Không thể kết nối đến backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 800, margin: '40px auto', padding: '0 20px', color: '#1f2937' }}>
      <header style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 20, marginBottom: 24 }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#111827' }}>🎓 Đồ Án Tốt Nghiệp - TTMS</h1>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Kiến trúc 3 lớp (Presentation - Business Logic - Data Access) • Node.js + TypeScript • Supabase PostgreSQL
        </p>
      </header>

      <section style={{ backgroundColor: '#f9fafb', borderRadius: 8, padding: 24, border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Trạng thái kết nối Database & Server</h2>
          <button
            onClick={fetchHealth}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {loading ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: 12, borderRadius: 6, marginBottom: 16 }}>
            <strong>Lỗi:</strong> {error}
            <div style={{ fontSize: '13px', marginTop: 4 }}>
              Vui lòng kiểm tra file <code>backend/.env</code> và đảm bảo đã chạy <code>npm run dev</code> ở cả backend và frontend.
            </div>
          </div>
        )}

        {health && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
              <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Trạng thái hệ thống</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: health.data.status === 'healthy' ? '#16a34a' : '#ea580c', marginTop: 4 }}>
                  {health.data.status === 'healthy' ? '🟢 Sẵn sàng (Healthy)' : '🟡 Cần cấu hình DB'}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>PostgreSQL Pool</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: 4 }}>
                  {health.data.database.postgres.status === 'connected' ? (
                    <span style={{ color: '#16a34a' }}>🟢 Kết nối thành công</span>
                  ) : (
                    <span style={{ color: '#dc2626' }}>🔴 Chưa kết nối</span>
                  )}
                </div>
                {health.data.database.postgres.db && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: 4 }}>
                    DB: {health.data.database.postgres.db}
                  </div>
                )}
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Supabase API</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: 4 }}>
                  {health.data.database.supabase.status === 'connected' ? (
                    <span style={{ color: '#16a34a' }}>🟢 Sẵn sàng</span>
                  ) : (
                    <span style={{ color: '#ea580c' }}>🟡 {health.data.database.supabase.status}</span>
                  )}
                </div>
              </div>
            </div>

            <pre style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: 16, borderRadius: 8, overflowX: 'auto', fontSize: '13px', marginTop: 16 }}>
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: '18px', marginBottom: 12 }}>Hướng dẫn cấu hình Database Supabase</h3>
        <ol style={{ paddingLeft: 20, lineHeight: 1.8, color: '#4b5563' }}>
          <li>Mở dự án trên <strong>Supabase Dashboard</strong>.</li>
          <li>Vào <strong>Project Settings → API</strong>: copy <strong>Project URL</strong>, <strong>anon key</strong>, và <strong>service_role key</strong>.</li>
          <li>Vào <strong>Project Settings → Database</strong>: copy <strong>Connection string (URI)</strong> của PostgreSQL.</li>
          <li>Mở file <code>backend/.env</code> và dán các thông tin vào.</li>
          <li>Chạy lệnh <code>npm run test:db</code> trong thư mục <code>backend/</code> để kiểm tra.</li>
        </ol>
      </section>
    </div>
  );
}
