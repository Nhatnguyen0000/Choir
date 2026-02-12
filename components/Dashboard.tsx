import React, { useMemo, useState } from 'react';
import { 
  Users, Heart, Wallet, Library, 
  Calendar, Clock, MapPin, ChevronRight, 
  Sparkles, Church, Quote, Cloud,
  Settings, Copy, CheckCircle2, X,
  RefreshCw
} from 'lucide-react';
import { useMemberStore, useEventStore, useFinanceStore, useLibraryStore, useAppStore } from '../store';
import { AppView } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { members, attendanceData, isCloudMode, realtimeStatus } = useMemberStore();
  const { events } = useEventStore();
  const { transactions } = useFinanceStore();
  const { songs } = useLibraryStore();
  
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const balance = useMemo(() => {
    return transactions.reduce((sum, t) => t.type === 'IN' ? sum + t.amount : sum - t.amount, 0);
  }, [transactions]);

  const avgAttendance = useMemo(() => {
    if (attendanceData.length === 0) return 0;
    const totalPresents = attendanceData.reduce((sum, d) => sum + d.records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length, 0);
    return Math.round((totalPresents / (attendanceData.length * (members.length || 1))) * 100);
  }, [attendanceData, members.length]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.date >= today).sort((a,b) => a.date.localeCompare(b.date)).slice(0, 3);
  }, [events]);

  const fullSqlCode = `-- COPY VÀ CHẠY TRONG SUPABASE SQL EDITOR
-- 1. Tạo các bảng dữ liệu
CREATE TABLE IF NOT EXISTS members (id TEXT PRIMARY KEY, choir_id TEXT, saint_name TEXT, name TEXT NOT NULL, phone TEXT, gender TEXT, role TEXT, grade TEXT, birth_year TEXT, avatar TEXT, join_date DATE, status TEXT);
CREATE TABLE IF NOT EXISTS schedule_events (id TEXT PRIMARY KEY, choir_id TEXT, date DATE NOT NULL, time TIME, mass_name TEXT, type TEXT, liturgical_color TEXT, location TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS songs (id TEXT PRIMARY KEY, choir_id TEXT, title TEXT NOT NULL, composer TEXT, category TEXT, liturgical_seasons JSONB, is_familiar BOOLEAN DEFAULT FALSE, experience_notes TEXT);
CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, choir_id TEXT, date DATE NOT NULL, description TEXT, amount NUMERIC, type TEXT, category TEXT);
CREATE TABLE IF NOT EXISTS attendance (id BIGSERIAL PRIMARY KEY, date DATE NOT NULL, choir_id TEXT, member_id TEXT REFERENCES members(id) ON DELETE CASCADE, status TEXT, UNIQUE(date, member_id));

-- 2. Replica Identity Full (QUAN TRỌNG ĐỂ ĐỒNG BỘ)
ALTER TABLE members REPLICA IDENTITY FULL;
ALTER TABLE schedule_events REPLICA IDENTITY FULL;
ALTER TABLE songs REPLICA IDENTITY FULL;
ALTER TABLE transactions REPLICA IDENTITY FULL;
ALTER TABLE attendance REPLICA IDENTITY FULL;

-- 3. Tắt bảo mật RLS để app kết nối trực tiếp
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;

-- 4. Publication cho Realtime (Idempotent script)
DO $$ 
DECLARE
  tables_to_add text[] := ARRAY['members', 'schedule_events', 'songs', 'transactions', 'attendance'];
  t text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  FOR t IN SELECT unnest(tables_to_add) LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', t);
    END IF;
  END LOOP;
END $$;`;

  const copySQL = () => {
    navigator.clipboard.writeText(fullSqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-8">
      {/* Cloud Sync Status Card */}
      {!isCloudMode || realtimeStatus === 'ERROR' ? (
        <div className="card bg-amber-50/90 border-amber-200/80 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
                <Settings size={22} className="animate-spin-slow" />
             </div>
             <div>
                <p className="text-[13px] font-bold text-amber-900 leading-tight italic uppercase tracking-wider">Hệ thống đang chạy Ngoại tuyến (Offline)</p>
                <p className="text-[11px] text-amber-600 mt-1.5 font-medium italic">Dữ liệu hiện chỉ lưu trên máy này. Kết nối Cloud để đồng bộ với các máy khác.</p>
             </div>
          </div>
          <button 
            onClick={() => setShowSetupGuide(true)} 
            className="w-full md:w-auto px-6 py-3 bg-amber-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Cloud size={16} /> Hướng dẫn kết nối Cloud
          </button>
        </div>
      ) : (
        <div className="card bg-emerald-50/90 border-emerald-200/60 p-4 rounded-2xl flex items-center gap-3">
           <div className="w-2.5 h-2.5 bg-emeraldGreen rounded-full animate-pulse"></div>
           <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest italic">Dữ liệu đang được bảo vệ & đồng bộ trực tuyến</span>
        </div>
      )}

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60">
          <div className="card w-full max-w-2xl rounded-2xl p-10 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1.5">
                <h3 className="sacred-title text-2xl font-bold text-slate-900 italic leading-none tracking-tight">Cấu hình Hiệp Thông Cloud</h3>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-2 italic">Kết nối Supabase để đồng bộ dữ liệu toàn đoàn</p>
              </div>
              <button onClick={() => setShowSetupGuide(false)} className="p-3 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"><X size={22}/></button>
            </div>

            <div className="space-y-8">
              <section className="space-y-3">
                <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</div>
                  Bước 1: Thiết lập Biến môi trường
                </h4>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                   <p className="text-[12px] text-slate-500 leading-relaxed italic">
                     Mở file <code className="bg-slate-200 px-2 py-0.5 rounded text-slate-800 font-bold">.env</code> và dán <strong>URL</strong> {"&"} <strong>Key</strong> từ mục Settings trong Supabase.
                   </p>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs">2</div>
                  Bước 2: Khởi tạo Database
                </h4>
                <p className="text-[12px] text-slate-500 italic leading-relaxed">
                  Sao chép mã SQL dưới đây, dán vào <strong>SQL Editor</strong> trên Supabase và nhấn <strong>RUN</strong>:
                </p>
                <div className="relative group">
                  <pre className="p-5 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto border border-white/10 shadow-xl max-h-48 overflow-y-auto">
                    {fullSqlCode}
                  </pre>
                  <button 
                    onClick={copySQL}
                    className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    {copied ? 'Đã sao chép' : 'Sao chép SQL'}
                  </button>
                </div>
              </section>

              <div className="pt-4 flex justify-center">
                 <button 
                   onClick={() => window.location.reload()} 
                   className="px-10 py-4 bg-slate-900 text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-3"
                 >
                   <RefreshCw size={20} /> Tải lại để kết nối
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="glass-card rounded-[1.5rem] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.06] pointer-events-none rotate-12">
          <Church size={220} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-amberGold font-bold uppercase tracking-[0.3em] text-[10px]">
            <Sparkles size={16} className="animate-pulse" /> 
            {isCloudMode && <span className="flex items-center gap-1"><Cloud size={12}/> Cloud Trực Tuyến</span>}
          </div>
          <h1 className="sacred-title text-3xl md:text-5xl font-bold italic text-slate-900 leading-tight">Hiệp Thông Phụng Sự</h1>
          <p className="text-slate-600 text-[15px] md:text-lg italic leading-relaxed font-medium opacity-90 max-w-xl">
            "Hát mừng Chúa một bài ca mới, vì Người đã thực hiện những việc lạ lùng." (Tv 98, 1)
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => onNavigate(AppView.SCHEDULE)} className="glass-button active-glass px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-md">Lịch Phụng Vụ</button>
            <button onClick={() => onNavigate(AppView.MEMBERS)} className="glass-button px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">Sổ Bộ Hiệp Thông</button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ca Viên', value: members.length, color: 'text-royalBlue', bg: 'bg-blue-50/40', icon: <Users size={20} /> },
          { label: 'Độ hiệp thông', value: `${avgAttendance}%`, color: 'text-rose-500', bg: 'bg-rose-50/40', icon: <Heart size={20} /> },
          { label: 'Đoàn quỹ hiện hữu', value: `${(balance/1000).toLocaleString()}K`, color: 'text-emeraldGreen', bg: 'bg-emerald-50/40', icon: <Wallet size={20} /> },
          { label: 'Kho tàng âm ca', value: songs.length, color: 'text-liturgicalViolet', bg: 'bg-purple-50/40', icon: <Library size={20} /> },
        ].map((stat, idx) => (
          <div key={idx} className={`glass-card card ${stat.bg} p-6 rounded-2xl flex flex-col gap-4 border-white/60`}>
            <div className="w-11 h-11 rounded-xl bg-white/90 shadow-sm flex items-center justify-center text-slate-400 border border-white">
              {React.cloneElement(stat.icon as React.ReactElement<any>, { className: stat.color })}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5 italic leading-none">{stat.label}</p>
              <h3 className={`text-xl font-bold tracking-tight ${stat.color} leading-none`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="glass-card card p-8 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2 italic">
              <Calendar size={18} className="text-amberGold" /> Công Tác Sắp Tới
            </h3>
            <button onClick={() => onNavigate(AppView.SCHEDULE)} className="text-[10px] font-bold text-amberGold hover:underline italic uppercase tracking-widest">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
              <div key={event.id} onClick={() => onNavigate(AppView.SCHEDULE)} className="glass-card p-5 rounded-xl hover:bg-white/90 transition-all border-slate-100/80 group cursor-pointer flex items-center gap-4 shadow-sm">
                <div className="w-14 h-14 glass-button border-amberGold/20 rounded-xl flex flex-col items-center justify-center group-hover:bg-amberGold group-hover:text-white transition-all shrink-0">
                   <span className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                   <span className="text-[9px] uppercase font-bold opacity-60 mt-1 italic leading-none">T.{new Date(event.date).getMonth()+1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="sacred-title text-[15px] font-bold text-slate-900 truncate italic leading-tight group-hover:text-amberGold transition-colors">{event.massName}</h4>
                  <div className="flex flex-wrap gap-3 mt-2 opacity-80">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase italic leading-none"><Clock size={14} className="text-amberGold" /> {event.time}</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase italic leading-none"><MapPin size={14} className="text-slate-400" /> {event.location}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-amberGold" />
              </div>
            )) : (
              <div className="text-center py-14 space-y-2 opacity-40">
                <Calendar size={44} className="mx-auto text-slate-300" />
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest italic leading-none">Chưa có công tác mới</p>
              </div>
            )}
          </div>
        </div>

        {/* Spiritual Quote */}
        <div className="glass-card card bg-amber-50/50 p-10 rounded-2xl flex flex-col justify-between border-amber-100/50 overflow-hidden">
           <Quote size={44} className="text-amberGold/20 italic mb-6" />
           <div className="space-y-8 relative z-10">
              <p className="text-xl md:text-2xl font-medium italic text-slate-800 leading-relaxed sacred-title tracking-tight opacity-95">
                "Bình an cho anh em. Như Chúa Cha đã sai Thầy, Thầy cũng sai anh em." (Ga 20, 21)
              </p>
              <div className="pt-8 border-t border-amber-100/50 flex justify-between items-end">
                 <div className="space-y-1.5">
                   <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.4em] italic leading-none block">AMDG • 2026</span>
                   <p className="text-[9px] text-slate-400 font-bold italic uppercase tracking-widest leading-none">Bắc Hòa Community</p>
                 </div>
                 <Church size={36} className="text-amberGold/20" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
