
import { createClient } from '@supabase/supabase-js';

// Truy cập an toàn vào biến môi trường
const supabaseUrl = (typeof process !== 'undefined' && process.env?.SUPABASE_URL || '').trim();
const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY || '').trim();

// Flag kiểm tra xem Supabase đã được cấu hình đúng chưa
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder-project')
);

// Khởi tạo client với giá trị dự phòng để tránh crash code
const validUrl = isSupabaseConfigured ? supabaseUrl : 'https://mformrqcsvbdpbuwiwnm.supabase.co';
const validKey = isSupabaseConfigured ? supabaseAnonKey : 'sb_publishable_hKxPgdWoagk1Ri4i1aFZmw_dWQOYuTq';

export const supabase = createClient(validUrl, validKey);
