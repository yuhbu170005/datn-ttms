import { createApp } from './app.js';
import { env } from './config/env.js';
import { testDbConnection } from './config/database.js';

async function startServer() {
  const app = createApp();

  // Kiểm tra kết nối cơ sở dữ liệu Supabase / PostgreSQL
  await testDbConnection();

  app.listen(env.PORT, () => {
    console.log(`🚀 [Server] đang chạy tại: http://localhost:${env.PORT}`);
    console.log(`📡 [Health Check]: http://localhost:${env.PORT}/api/v1/health`);
    console.log(`🛠️  [Môi trường]: ${env.NODE_ENV}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Lỗi khi khởi động server:', error);
  process.exit(1);
});
