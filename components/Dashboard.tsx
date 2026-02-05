import React, { useMemo } from 'react';
import { 
  Users, Heart, Wallet, Library, 
  Calendar, Clock, MapPin, ChevronRight, 
  Sparkles, Church, Quote
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

  return (
    <div className="w-full space-y-6 animate-fade-in pb-8">
      {/* Hero Section */}
      <section className="glass-card rounded-[2.5rem] p-8 md:p-12 border-white/60 relative overflow-hidden bg-white/40 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none rotate-12">
          <Church size={220} />
        </div>
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2 text-amberGold font-bold uppercase tracking-[0.3em] text-[8px]">
            <Sparkles size={14} className="animate-pulse" /> 
          </div>
          <h1 className="sacred-title text-3xl md:text-5xl font-bold italic text-slate-900 leading-tight">Hiệp Thông Phụng Sự</h1>
          <p className="text-slate-600 text-[13px] md:text-base italic leading-relaxed font-medium opacity-80 max-w-xl">
            "Hát mừng Chúa một bài ca mới, vì Người đã thực hiện những việc lạ lùng." (Tv 98, 1)
          </p>
          <div className="flex flex-wrap gap-3 pt-3">
            <button onClick={() => onNavigate(AppView.SCHEDULE)} className="glass-button active-glass px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-sm">Lịch Phụng Vụ</button>
            <button onClick={() => onNavigate(AppView.MEMBERS)} className="glass-button px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">Sổ Bộ Hiệp Thông</button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ca Viên', value: members.length, color: 'text-royalBlue', bg: 'bg-blue-50/30', icon: <Users size={18} /> },
          { label: 'Độ hiệp thông', value: `${avgAttendance}%`, color: 'text-rose-500', bg: 'bg-rose-50/30', icon: <Heart size={18} /> },
          { label: 'Đoàn quỹ hiện hữu', value: `${(balance/1000).toLocaleString()}K`, color: 'text-emeraldGreen', bg: 'bg-emerald-50/30', icon: <Wallet size={18} /> },
          { label: 'Kho tàng âm ca', value: songs.length, color: 'text-liturgicalViolet', bg: 'bg-purple-50/30', icon: <Library size={18} /> },
        ].map((stat, idx) => (
          <div key={idx} className={`glass-card ${stat.bg} p-5 rounded-2xl flex flex-col gap-4 border-white/50 hover:scale-[1.02] transition-transform`}>
            <div className="w-9 h-9 rounded-xl bg-white/90 shadow-sm flex items-center justify-center text-slate-400 border border-white">
              {React.cloneElement(stat.icon as React.ReactElement<any>, { className: stat.color })}
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 italic leading-none">{stat.label}</p>
              <h3 className={`text-xl font-bold tracking-tight ${stat.color} leading-none`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="glass-card p-8 rounded-[2.5rem] space-y-6 bg-white/40 border-white/60 shadow-sm">
          <div className="flex justify-between items-center border-b border-white/40 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2 italic">
              <Calendar size={16} className="text-amberGold" /> Công Tác Sắp Tới
            </h3>
            <button onClick={() => onNavigate(AppView.SCHEDULE)} className="text-[8px] font-bold text-amberGold hover:underline italic uppercase tracking-widest">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
              <div key={event.id} onClick={() => onNavigate(AppView.SCHEDULE)} className="glass-card p-4 rounded-xl hover:bg-white/80 transition-all border-white/50 group cursor-pointer flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 glass-button border-amberGold/20 rounded-xl flex flex-col items-center justify-center group-hover:bg-amberGold group-hover:text-white transition-all shrink-0">
                   <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
                   <span className="text-[7px] uppercase font-bold opacity-60 mt-1 italic leading-none">T.{new Date(event.date).getMonth()+1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="sacred-title text-[14px] font-bold text-slate-900 truncate italic leading-tight group-hover:text-amberGold transition-colors">{event.massName}</h4>
                  <div className="flex flex-wrap gap-3 mt-1.5 opacity-80">
                    <span className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase italic leading-none"><Clock size={12} className="text-amberGold" /> {event.time}</span>
                    <span className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase italic leading-none"><MapPin size={12} className="text-slate-400" /> {event.location}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-amberGold" />
              </div>
            )) : (
              <div className="text-center py-12 space-y-2 opacity-30">
                <Calendar size={40} className="mx-auto text-slate-300" />
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic leading-none">Chưa có công tác mới</p>
              </div>
            )}
          </div>
        </div>

        {/* Spiritual Quote */}
        <div className="glass-card bg-amber-50/10 p-10 rounded-[2.5rem] flex flex-col justify-between border-amber-100/30 overflow-hidden group shadow-sm">
           <Quote size={40} className="text-amberGold/10 italic mb-8" />
           <div className="space-y-8 relative z-10">
              <p className="text-xl md:text-2xl font-medium italic text-slate-800 leading-relaxed sacred-title tracking-tight opacity-95">
                "Bình an cho anh em. Như Chúa Cha đã sai Thầy, Thầy cũng sai anh em." (Ga 20, 21)
              </p>
              <div className="pt-8 border-t border-amber-100/40 flex justify-between items-end">
                 <div className="space-y-1">
                   <span className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.4em] italic leading-none block">AMDG • 2026</span>
                   <p className="text-[8px] text-slate-400 font-bold italic uppercase tracking-widest leading-none">Bắc Hòa Community</p>
                 </div>
                 <Church size={32} className="text-amberGold/10" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;