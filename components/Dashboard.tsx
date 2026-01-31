
import React, { useMemo } from 'react';
import { 
  Users, 
  Music, 
  Calendar, 
  TrendingUp, 
  Church,
  ArrowUpRight,
  Heart,
  Quote,
  Sparkles,
  Clock,
  MapPin,
  ChevronRight,
  Bookmark,
  Activity,
  Mic2
} from 'lucide-react';
import { useMemberStore, useEventStore, useFinanceStore, useLibraryStore } from '../store';
import { AppView } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { members, attendanceData } = useMemberStore();
  const { events } = useEventStore();
  const { transactions } = useFinanceStore();
  const { songs } = useLibraryStore();

  const balance = useMemo(() => {
    return transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0) - 
           transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const avgAttendance = useMemo(() => {
    return attendanceData.length > 0 
      ? Math.round((attendanceData.reduce((sum, d) => sum + (d.records.filter(r => r.status === 'PRESENT').length), 0) / (attendanceData.length * (members.length || 1))) * 100)
      : 0;
  }, [attendanceData, members.length]);

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [events, today]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-12">
      
      {/* 1. Header & Quick Status */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-1">
          <p className="text-amberGold text-[11px] font-black uppercase tracking-[0.4em] mb-2">Bắc Hòa • Năm Phụng Vụ 2027</p>
          <h1 className="sacred-title text-4xl md:text-5xl font-black text-slate-900 italic leading-none">Cổng Thông Tin <span className="text-slate-400">Hiệp Thông</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiện diện trung bình</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{avgAttendance}%</span>
              <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${avgAttendance}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 px-4">
        
        {/* Large Hero Card: Today's Focus */}
        <div className="md:col-span-6 lg:col-span-8 glass-card rounded-[3rem] p-8 md:p-12 border-white/40 bg-gradient-to-br from-white to-slate-50/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none -rotate-12 translate-x-12 group-hover:rotate-0 transition-transform duration-1000">
            <Church size={350} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 text-white shadow-xl">
              <Sparkles size={14} className="text-amberGold animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Tâm Tình Hiệp Thông</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="sacred-title text-4xl md:text-5xl font-black text-slate-900 italic leading-tight tracking-tighter">
                Lời Ca Là <br/> <span className="text-amberGold">Đôi Cánh Tâm Hồn</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium italic leading-relaxed max-w-xl">
                "Hát khen Chúa, hỡi muôn dân trên địa cầu! Hãy phục vụ Chúa với niềm hân hoan." (Tv 100,1-2)
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button 
                onClick={() => onNavigate(AppView.SCHEDULE)}
                className="active-pill px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all text-[11px] font-black uppercase tracking-widest"
              >
                Xem Lịch Công Tác <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => onNavigate(AppView.MEMBERS)}
                className="glass-button px-8 py-4 rounded-2xl flex items-center gap-3 border-slate-200 text-slate-500 hover:text-slate-900 text-[11px] font-black uppercase tracking-widest shadow-sm"
              >
                Sổ Bộ Ca Viên
              </button>
            </div>
          </div>
        </div>

        {/* Square Card: Stats Summary */}
        <div className="md:col-span-6 lg:col-span-4 glass-card rounded-[3rem] p-8 flex flex-col justify-between border-white/40 bg-amber-50/20 shadow-xl">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-amber-100">
                <Activity size={24} className="text-amberGold" />
              </div>
              <span className="text-[9px] font-black text-amberGold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-amber-100 shadow-sm">Hoạt động mới</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cộng đoàn hiệp thông</h3>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{members.length} <span className="text-sm font-medium text-slate-400">Anh chị em</span></p>
            </div>
          </div>
          <div className="pt-6 border-t border-amber-100/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Thư viện bài hát</span>
              <span className="text-lg font-black text-slate-900">{songs.length} Âm bản</span>
            </div>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm">
                  {i === 4 ? '+' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Card: Upcoming Events */}
        <div className="md:col-span-6 lg:col-span-5 glass-card rounded-[3rem] p-10 border-white/40 bg-white shadow-xl flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
              <Calendar size={18} className="text-amberGold" /> Việc Phụng Vụ
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
              <div key={event.id} className="group p-5 rounded-[2rem] border border-slate-50 bg-slate-50/50 hover:bg-slate-900 hover:text-white transition-all duration-500 cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center shrink-0 shadow-lg group-hover:bg-amberGold group-hover:text-white transition-colors">
                    <span className="text-xl font-black leading-none">{new Date(event.date).getDate()}</span>
                    <span className="text-[8px] font-black uppercase opacity-60 mt-0.5">T{new Date(event.date).getMonth() + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="sacred-title text-base font-bold truncate italic">{event.massName}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-[9px] font-bold opacity-60 uppercase tracking-widest">
                        <Clock size={10} /> {event.time}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold opacity-60 uppercase tracking-widest">
                        <MapPin size={10} /> {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-center">
                <Bookmark size={32} className="text-slate-100" />
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest italic">Chưa có lịch công tác mới</p>
              </div>
            )}
          </div>

          <button onClick={() => onNavigate(AppView.SCHEDULE)} className="w-full py-4 text-[9px] font-black uppercase tracking-widest border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
            Xem toàn bộ niên lịch
          </button>
        </div>

        {/* Medium Card: Financial Quick Glance */}
        <div className="md:col-span-6 lg:col-span-7 glass-card rounded-[3rem] p-10 border-white/40 bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                  <TrendingUp size={24} className="text-emerald-400" />
                </div>
                <button onClick={() => onNavigate(AppView.FINANCE)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <ArrowUpRight size={18} />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ngân quỹ hiệp thông hiện hữu</p>
                <h3 className="text-5xl font-black tracking-tighter text-emerald-400">{balance.toLocaleString()}đ</h3>
              </div>
            </div>

            <div className="pt-10 grid grid-cols-2 gap-6 border-t border-white/5 mt-8">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Biến động gần nhất</span>
                <p className="text-[13px] font-bold text-white/80 italic">Đóng góp quỹ đoàn tháng 03</p>
              </div>
              <div className="flex flex-col items-end justify-center">
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                   <Mic2 size={12} className="text-emerald-400" />
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Minh Bạch • AMDG</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Spiritual Footer */}
      <footer className="pt-12 flex flex-col items-center gap-6 px-4">
        <div className="glass-card p-10 rounded-[3rem] border-white/40 bg-white/40 shadow-sm max-w-3xl w-full text-center space-y-4">
          <Quote size={40} className="text-amberGold/30 mx-auto italic" />
          <p className="text-slate-600 text-lg md:text-xl font-medium italic leading-relaxed">
            "Trong lời ca, chúng ta tìm thấy tiếng nói chung của sự hiệp nhất. Hãy để mỗi nốt nhạc là một lời kinh dâng hiến."
          </p>
          <div className="w-16 h-1 bg-amberGold/20 mx-auto rounded-full mt-4"></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] pt-2 italic leading-none">Hệ thống Điều hành Ca đoàn • Bắc Hòa 2027</p>
        </div>
        
        <div className="flex items-center gap-4 opacity-30 group hover:opacity-100 transition-opacity duration-1000">
          <div className="w-12 h-px bg-slate-300"></div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.6em]">Vinh Danh Thiên Chúa • AMDG</span>
          <div className="w-12 h-px bg-slate-300"></div>
        </div>
      </footer>

    </div>
  );
};

export default Dashboard;
