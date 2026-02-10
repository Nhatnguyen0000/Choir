<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RlqxtBBSrCFHQE3hwnjliQSaZxiKvpf2

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Cấu hình biến môi trường trong [.env](.env) hoặc [.env.local](.env.local):
   - `API_KEY` hoặc `GEMINI_API_KEY`: API key Gemini (lấy tại [Google AI Studio](https://aistudio.google.com/app/apikey))
   - `SUPABASE_URL`: URL dự án Supabase (Project Settings → API)
   - `SUPABASE_ANON_KEY`: Anon key của Supabase (Project Settings → API)
3. Run the app: `npm run dev`

## Kết nối Supabase

Ứng dụng đã tích hợp Supabase để lưu và đồng bộ dữ liệu (thành viên, lịch, bài hát, tài chính, điểm danh). Khi có `SUPABASE_URL` và `SUPABASE_ANON_KEY`, app chạy ở chế độ cloud; nếu không có, dữ liệu lưu trên LocalStorage.

### Các bước kết nối

1. **Tạo dự án Supabase**  
   Đăng ký tại [supabase.com](https://supabase.com) → New project → chọn Organization và Database password.

2. **Lấy URL và Anon key**  
   Vào **Project Settings** → **API**: copy **Project URL** và **anon public** key vào `.env`:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **Tạo bảng trong Supabase**  
   Vào **SQL Editor** → New query → dán toàn bộ nội dung file [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql) → Run.  
   Script tạo các bảng: `members`, `schedule_events`, `songs`, `transactions`, `attendance`, bật Realtime và RLS cơ bản.

4. **Bật Realtime (nếu cần)**  
   Vào **Database** → **Replication** → bật replication cho các bảng trên (để đồng bộ theo thời gian thực giữa nhiều tab/thiết bị).

Sau khi chạy migration và cấu hình env, khởi động lại `npm run dev`; app sẽ dùng Supabase và hiển thị trạng thái đồng bộ (ví dụ "Đang kết nối" / "Đã kết nối") trên giao diện.
