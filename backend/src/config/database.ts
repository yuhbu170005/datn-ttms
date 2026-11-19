import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { env } from './env.js';

/**
 * 1. SUPABASE CLIENT
 * Dùng cho các tác vụ: Auth, Storage, Realtime hoặc truy vấn PostgREST API
 */
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * 2. POSTGRESQL CONNECTION POOL (pg)
 * Dùng cho việc thực thi raw query SQL trực tiếp hoặc kết nối Connection Pooling của Supabase
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl:
    env.NODE_ENV === 'production' || env.DATABASE_URL.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Hàm kiểm tra kết nối Database khi khởi động server
 */
export async function testDbConnection(): Promise<boolean> {
  console.log('🔄 Đang kiểm tra kết nối Database & Supabase...');

  // 1. Kiểm tra cấu hình env
  if (!env.SUPABASE_URL || env.SUPABASE_URL.includes('your-project-id')) {
    console.warn('⚠️  Cảnh báo: SUPABASE_URL chưa được cấu hình chính xác trong file .env');
  }

  // 2. Kiểm tra kết nối PostgreSQL qua pg Pool
  if (env.DATABASE_URL && !env.DATABASE_URL.includes('your_password')) {
    try {
      const client = await pool.connect();
      const res = await client.query('SELECT NOW() as current_time, current_database() as db_name');
      client.release();
      console.log(`✅ Kết nối PostgreSQL (Supabase) thành công! DB: ${res.rows[0].db_name} | Giờ DB: ${res.rows[0].current_time}`);
      return true;
    } catch (err: any) {
      console.error('❌ Lỗi kết nối PostgreSQL qua DATABASE_URL:', err.message);
    }
  } else {
    console.warn('⚠️  DATABASE_URL chưa được điền thông tin thực tế trong file .env');
  }

  // 3. Kiểm tra Supabase REST client
  if (env.SUPABASE_URL && !env.SUPABASE_URL.includes('your-project-id')) {
    try {
      const { error } = await supabase.from('_dummy_health_check').select('*').limit(1);
      // Supabase trả về lỗi nếu bảng không tồn tại, nhưng có nghĩa là kết nối API đã thành công
      if (!error || error.code === 'PGRST204' || error.code === 'PGRST116' || error.message.includes('relation "_dummy_health_check" does not exist')) {
        console.log('✅ Kết nối Supabase API thành công!');
        return true;
      }
      console.log('ℹ️  Supabase API đã phản hồi:', error.message);
      return true;
    } catch (err: any) {
      console.error('❌ Lỗi kết nối Supabase API:', err.message);
    }
  }

  return false;
}
