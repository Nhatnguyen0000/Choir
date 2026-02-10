-- Schema cho ứng dụng Ca Đoàn Thiên Thần
-- Chạy file này trong Supabase Dashboard: SQL Editor > New query > Paste & Run

-- Bảng thành viên
CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  choir_id text NOT NULL,
  saint_name text,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  gender text NOT NULL CHECK (gender IN ('Nam', 'Nữ')),
  role text NOT NULL CHECK (role IN ('Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Thành viên', 'Nhạc công')),
  grade text,
  birth_year text,
  avatar text,
  join_date date NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'RETIRED')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bảng lịch / sự kiện
CREATE TABLE IF NOT EXISTS public.schedule_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  choir_id text NOT NULL,
  date date NOT NULL,
  time text NOT NULL DEFAULT '',
  mass_name text NOT NULL DEFAULT '',
  type text NOT NULL CHECK (type IN ('MASS', 'PRACTICE')),
  liturgical_color text NOT NULL CHECK (liturgical_color IN ('GREEN', 'RED', 'WHITE', 'VIOLET', 'GOLD', 'ROSE')),
  location text NOT NULL DEFAULT '',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bảng bài hát / thư viện
CREATE TABLE IF NOT EXISTS public.songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  choir_id text NOT NULL,
  title text NOT NULL,
  composer text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  liturgical_seasons text[] DEFAULT '{}',
  is_familiar boolean DEFAULT false,
  experience_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bảng giao dịch tài chính
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  choir_id text NOT NULL,
  date date NOT NULL,
  description text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('IN', 'OUT')),
  category text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Bảng điểm danh (unique: 1 bản ghi cho mỗi ngày + thành viên)
CREATE TABLE IF NOT EXISTS public.attendance (
  date date NOT NULL,
  choir_id text NOT NULL,
  member_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (date, member_id)
);

-- Index cho truy vấn nhanh
CREATE INDEX IF NOT EXISTS idx_members_choir ON public.members(choir_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_choir_date ON public.schedule_events(choir_id, date);
CREATE INDEX IF NOT EXISTS idx_songs_choir ON public.songs(choir_id);
CREATE INDEX IF NOT EXISTS idx_transactions_choir_date ON public.transactions(choir_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date_choir ON public.attendance(date, choir_id);

-- Bật Realtime cho các bảng (chạy từng dòng nếu báo lỗi "already in publication")
-- Hoặc bật trong Dashboard: Database > Replication > chọn các bảng
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_events;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.songs;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Row Level Security (RLS): cho phép đọc/ghi với anon key (có thể tinh chỉnh sau khi bật Auth)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Policy: cho phép tất cả thao tác với anon (phù hợp khi chưa dùng Supabase Auth)
CREATE POLICY "Allow all for anon" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON public.schedule_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON public.songs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
