# 🎓 DATN TTMS (Thesis / Topic Management System)

Dự án Đồ Án Tốt Nghiệp được thiết kế theo **Kiến trúc 3 lớp (3-Tier Architecture)**, sử dụng **Node.js + TypeScript (Express)** cho **Backend**, **React + TypeScript (Vite)** cho **Frontend** và cơ sở dữ liệu **PostgreSQL trên Supabase**.

---

## 🏛️ Cấu trúc kiến trúc 3 lớp (3-Tier Architecture)

```
                            [ Trình duyệt / FRONTEND (React Vite) ]
                                            │
                                            ▼  (HTTP REST API)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BACKEND                                                                                │
│                                                                                        │
│ 1. Presentation Tier (Tầng hiển thị / Giao tiếp API)                                  │
│    └── Routes (`src/routes/`) -> Controllers (`src/controllers/`)                      │
│        • Nhận HTTP Request, validate dữ liệu đầu vào.                                  │
│        • Gọi xuống Service và trả về HTTP Response (JSON/Status code).                 │
│                                            │                                           │
│ 2. Business Logic Tier (Tầng nghiệp vụ)   ▼                                           │
│    └── Services (`src/services/`)                                                      │
│        • Chứa logic nghiệp vụ cốt lõi, xác thực điều kiện kinh doanh.                  │
│        • Không phụ thuộc trực tiếp vào HTTP hay câu truy vấn DB cụ thể.                │
│                                            │                                           │
│ 3. Data Access Tier (Tầng truy cập dữ liệu)▼                                          │
│    └── Repositories (`src/repositories/`) & Config (`src/config/database.ts`)           │
│        • Chịu trách nhiệm trực tiếp truy vấn Supabase / PostgreSQL.                    │
│        • Sử dụng SQL Pool (`pg`) hoặc `@supabase/supabase-js`.                         │
└────────────────────────────────────┬───────────────────────────────────────────────────┘
                                     │
                                     ▼
                     [ Supabase PostgreSQL Database ]
```

---

## 📁 Cấu trúc thư mục dự án

```
datn-ttms/
├── frontend/                            # GIAO DIỆN NGƯỜI DÙNG (React + TypeScript + Vite)
│   ├── public/                          # Tài nguyên tĩnh
│   ├── src/
│   │   ├── assets/                      # Hình ảnh, icons, fonts
│   │   ├── components/                  # UI Components dùng chung
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── pages/                       # Các trang màn hình
│   │   ├── services/                    # Tầng giao tiếp API với backend (Axios)
│   │   ├── types/                       # TypeScript interfaces / types
│   │   ├── App.tsx                      # Dashboard kiểm tra kết nối & trang chính
│   │   └── main.tsx                     # Entrypoint frontend
│   ├── .env.example                     # Mẫu biến môi trường frontend
│   ├── .env                             # Biến môi trường frontend (đã tạo sẵn)
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                             # MÁY CHỦ XỬ LÝ (Node.js + TypeScript + 3-tier)
│   ├── src/
│   │   ├── config/                      # Cấu hình môi trường & kết nối DB
│   │   │   ├── database.ts              # Khởi tạo Supabase client & PG Pool + hàm test kết nối
│   │   │   └── env.ts                   # Nạp & validate biến môi trường từ .env
│   │   ├── controllers/                 # [Tầng 1] Presentation: Xử lý request/response
│   │   │   └── health.controller.ts
│   │   ├── services/                    # [Tầng 2] Business Logic: Xử lý logic nghiệp vụ
│   │   │   └── health.service.ts
│   │   ├── repositories/                # [Tầng 3] Data Access: Tương tác với PostgreSQL / Supabase
│   │   │   └── health.repository.ts
│   │   ├── middlewares/                 # Middleware: Auth, Error Handling, CORS
│   │   │   └── errorHandler.middleware.ts
│   │   ├── routes/                      # Định tuyến API
│   │   │   ├── health.route.ts
│   │   │   └── index.ts                 # Router tổng hợp
│   │   ├── models/                      # Các entity, schema dữ liệu
│   │   ├── scripts/                     # Scripts hỗ trợ (test kết nối DB)
│   │   │   └── testConnection.ts
│   │   ├── app.ts                       # Khởi tạo Express App & middleware
│   │   └── index.ts                     # Entrypoint backend (lắng nghe port & kiểm tra kết nối DB)
│   ├── .env.example                     # Mẫu cấu hình môi trường backend
│   ├── .env                             # Cấu hình môi trường backend (điền thông tin Supabase vào đây)
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                         # Root scripts điều khiển cả frontend & backend
└── README.md
```

---

## 🔑 Hướng dẫn lấy thông tin kết nối Supabase và điền vào `backend/.env`

Mở file [backend/.env](file:///Users/nguyenkimngan/datn-ttms/backend/.env):

1. **Lấy API Keys:**
   - Truy cập [Supabase Dashboard](https://supabase.com/dashboard) -> Chọn Project của bạn.
   - Vào **Project Settings** (biểu tượng bánh răng) -> **API**.
   - Copy **Project URL** dán vào `SUPABASE_URL`.
   - Copy **anon public** dán vào `SUPABASE_ANON_KEY`.
   - Copy **service_role secret** dán vào `SUPABASE_SERVICE_ROLE_KEY`.

2. **Lấy chuỗi kết nối PostgreSQL (Database Connection String):**
   - Vào **Project Settings** -> **Database**.
   - Tìm mục **Connection string** -> chọn tab **URI**.
   - Copy chuỗi kết nối và thay `[YOUR-PASSWORD]` bằng mật khẩu database bạn đã tạo khi tạo project:
     ```env
     DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Cài đặt dependencies
Tại thư mục gốc dự án:
```bash
npm run install:all
```
*(Lệnh này sẽ tự động chạy `npm install` cho cả `backend` và `frontend`)*

### 2. Kiểm tra kết nối Database Supabase ngay lập tức
Sau khi đã điền thông tin vào `backend/.env`:
```bash
npm run test:db
```
Nếu kết nối thành công, bạn sẽ nhận được thông báo:
```
✅ Kết nối PostgreSQL (Supabase) thành công!
🎉 Kết nối Database hoạt động bình thường!
```

### 3. Chạy Backend (Port 5000)
```bash
npm run backend:dev
```
API Health Check: `http://localhost:5000/api/v1/health`

### 4. Chạy Frontend (Port 5173)
Mở một terminal mới:
```bash
npm run frontend:dev
```
Truy cập giao diện: `http://localhost:5173` để xem trạng thái kết nối trực quan.
