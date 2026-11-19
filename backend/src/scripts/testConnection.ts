import { testDbConnection } from '../config/database.js';

async function main() {
  console.log('--- BẮT ĐẦU KIỂM TRA KẾT NỐI SUPABASE / POSTGRESQL ---');
  const success = await testDbConnection();
  if (success) {
    console.log('🎉 Kết nối Database hoạt động bình thường!');
    process.exit(0);
  } else {
    console.error('⚠️  Không thể kết nối hoặc chưa cấu hình đúng thông tin trong backend/.env');
    process.exit(1);
  }
}

main();
