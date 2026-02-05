
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
    const totalPresents = attendanceData.reduce((sum, d) => sum + d.records.filter(r => r.status === 'PRESENT').length, 0);
    return Math.round((totalPresents / (attendanceData.length * (members.length || 1))) * 100);
  }, [attendanceData, members.length]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.date >= today).sort((a,b) => a.date.localeCompare(b.date)).slice(0, 3);
  }, [events]);

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      {/* Lời Chào Hiệp Thông - Glass Transparent */}
      <section className="glass-card rounded-[2.5rem] p-10 md:p-14 border-white/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.08] pointer-events-none rotate-12">
          <Church size={240} />
        </div>
        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex items-center gap-2.5 text-amberGold font-bold uppercase tracking-[0.4em] text-[10px]">
            <Sparkles size={16} className="animate-pulse" /> Niên Lịch Phụng Vụ 2026
          </div>
          <h1 className="sacred-title text-3xl md:text-5xl font-bold italic text-slate-900 leading-tight tracking-tight">Hiệp Thông Phụng Sự</h1>
          <p className="text-slate-600 text-base md:text-lg italic leading-relaxed font-medium opacity-90 max-w-2xl">
            "Hát mừng Chúa một bài ca mới, vì Người đã thực hiện những việc lạ lùng." (Tv 98, 1)
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={() => onNavigate(AppView.SCHEDULE)} className="glass-button bg-amberGold/10 border-amberGold/30 text-amber-800 px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Lịch Phụng Vụ</button>
            <button onClick={() => onNavigate(AppView.MEMBERS)} className="glass-button px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500">Ghi Danh Sổ Bộ</button>
          </div>
        </div>
      </section>

      {/* Thống Kê Hiệp Thông */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Sổ bộ ca viên', value: members.length, color: 'text-royalBlue', bg: 'bg-blue-50/50', icon: <Users size={22} /> },
          { label: 'Độ hiệp thông', value: `${avgAttendance}%`, color: 'text-rose-500', bg: 'bg-rose-50/50', icon: <Heart size={22} /> },
          { label: 'Đoàn quỹ hiện hữu', value: `${(balance/1000).toLocaleString()}K`, color: 'text-emeraldGreen', bg: 'bg-emerald-50/50', icon: <Wallet size={22} /> },
          { label: 'Kho tàng âm ca', value: songs.length, color: 'text-liturgicalViolet', bg: 'bg-purple-50/50', icon: <Library size={22} /> },
        ].map((stat, idx) => (
          <div key={idx} className={`glass-card ${stat.bg} p-7 rounded-[2rem] flex flex-col gap-5 border-white/50 hover:-translate-y-1`}>
            <div className={`w-11 h-11 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center ${stat.color} border border-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5 italic leading-none">{stat.label}</p>
              <h3 className={`text-2xl font-bold tracking-tight ${stat.color} leading-none`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Công Tác Phụng Vụ Gần Nhất */}
        <div className="glass-card p-10 rounded-[2.5rem] space-y-8 border-white/60">
          <div className="flex justify-between items-center border-b border-white/60 pb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900 flex items-center gap-3 italic">
              <Calendar size={18} className="text-amberGold" /> Công Tác Sắp Tới
            </h3>
            <button onClick={() => onNavigate(AppView.SCHEDULE)} className="glass-button px-4 py-2 rounded-xl text-[9px] font-bold text-amberGold hover:bg-amber-50 italic uppercase tracking-widest">Toàn niên lịch</button>
          </div>
          <div className="space-y-5">
            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
              <div key={event.id} onClick={() => onNavigate(AppView.SCHEDULE)} className="glass-card p-5 rounded-2xl hover:bg-white/80 transition-all border-white/50 group cursor-pointer flex items-center gap-5">
                <div className="w-14 h-14 glass-button border-amberGold/20 rounded-2xl flex flex-col items-center justify-center group-hover:bg-amberGold group-hover:text-white transition-all shrink-0">
                   <span className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                   <span className="text-[8px] uppercase font-bold opacity-60 mt-1.5 italic tracking-widest">T.{new Date(event.date).getMonth()+1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="sacred-title text-[16px] font-bold text-slate-900 truncate italic leading-tight group-hover:text-amberGold transition-colors tracking-tight">{event.massName}</h4>
                  <div className="flex flex-wrap gap-4 mt-2 opacity-80">
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest italic"><Clock size={14} className="text-amberGold" /> {event.time}</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest italic"><MapPin size={14} className="text-slate-400" /> {event.location}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-amberGold transition-colors" />
              </div>
            )) : (
              <div className="text-center py-16 space-y-3 opacity-30">
                <Calendar size={48} className="mx-auto text-slate-300" />
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">Chưa có công tác phụng vụ mới</p>
              </div>
            )}
          </div>
        </div>

        {/* Tâm Tình Hiệp Thông */}
        <div className="glass-card bg-amber-50/10 p-12 rounded-[2.5rem] flex flex-col justify-between border-amber-100/30 relative overflow-hidden group">
           <Quote size={48} className="text-amberGold/20 italic mb-10 group-hover:rotate-12 transition-transform duration-500" />
           <div className="space-y-10 relative z-10">
              <p className="text-2xl md:text-3xl font-medium italic text-slate-800 leading-relaxed sacred-title tracking-tight opacity-90">
                "Bình an cho anh em. Như Chúa Cha đã sai Thầy, Thầy cũng sai anh em." (Ga 20, 21)
              </p>
              <div className="pt-10 border-t border-amber-100/40 flex justify-between items-end">
                 <div>
                   <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.5em] italic leading-none block mb-2">AMDG • 2026</span>
                   <p className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest leading-none mt-1">Cộng đoàn Bắc Hòa</p>
                 </div>
                 <Church size={40} className="text-amberGold/20" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
