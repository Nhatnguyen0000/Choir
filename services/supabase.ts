
import { createClient } from '@supabase/supabase-js';

// Truy cập biến môi trường từ Vite define hoặc process.env
const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase chưa được cấu hình đúng. Vui lòng kiểm tra SUPABASE_URL và SUPABASE_ANON_KEY trong Vercel/Env.");
}

// Khởi tạo client - Nếu không có key sẽ dùng demo (nhưng khuyến khích user dùng key riêng)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://mformrqcsvbdpbuwiwnm.supabase.co', 
  isSupabaseConfigured ? supabaseAnonKey : 'sb_publishable_hKxPgdWoagk1Ri4i1aFZmw_dWQOYuTq'
);
