import { createClient } from '@supabase/supabase-js';

// Giá trị được Vite inject qua define trong vite.config (đọc từ .env / .env.local)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

// Kiểm tra xem biến môi trường đã được điền đúng chưa
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info("Trạng thái: Offline (LocalStorage). Cấu hình .env để dùng Supabase.");
}

// Khởi tạo client an toàn
// Nếu chưa có cấu hình, dùng URL giả định để tránh crash app, logic store sẽ tự chuyển sang LocalStorage
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co', 
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);
