
import { createClient } from '@supabase/supabase-js';

// Truy cập biến môi trường
const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.group("🔍 Kiểm tra cấu hình Cloud (Supabase)");
  console.warn("Trạng thái: CHƯA KẾT NỐI");
  if (!supabaseUrl) console.error("- Thiếu: SUPABASE_URL");
  if (!supabaseAnonKey) console.error("- Thiếu: SUPABASE_ANON_KEY");
  console.info("Giải pháp: Thêm các biến này vào file .env hoặc cài đặt Environment Variables trên Vercel.");
  console.groupEnd();
}

// Khởi tạo client an toàn
// Nếu chưa cấu hình, app vẫn chạy ở chế độ LOCAL (LocalStorage) thông qua logic trong store.ts
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://mformrqcsvbdpbuwiwnm.supabase.co', 
  isSupabaseConfigured ? supabaseAnonKey : 'sb_publishable_hKxPgdWoagk1Ri4i1aFZmw_dWQOYuTq'
);
