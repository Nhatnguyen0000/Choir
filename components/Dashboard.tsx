import React from 'react';
import { 
  Users, 
  Music, 
  Calendar, 
  TrendingUp, 
  Quote,
  Church,
  Clock,
  ChevronRight,
  Sparkles,
  ArrowRight
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

  const balance = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0) - 
                  transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);

  const avgAttendance = attendanceData.length > 0 
    ? Math.round((attendanceData.reduce((acc, curr) => acc + curr.records.filter(r => r.status === 'PRESENT').length, 0) / (attendanceData.length * (members.length || 1))) * 100)
    : 0;

  const today = new Date().toISOString().split('T')[0];
  const todayEvent = events.find(e => e.date === today);
  const nextEvents = events.filter(e => e.date >= today).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-16 px-4 pt-6">
      <header className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 text-amberGold mb-2">
          <Church size={32} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <h1 className="sacred-title text-3xl md:text-4xl font-medium text-slate-900 italic">Bình An Cho Anh Chị Em</h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Ca Đoàn Thiên Thần • Bắc Hòa</p>
        </div>
      </header>

      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-14 text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-amberGold/20 rounded-full mt-5"></div>
        <div className="space-y-4">
          <span className="text-[9px] font-black text-amberGold uppercase tracking-[0.3em] bg-amber-50/50 px-4 py-1.5 rounded-full border border-amber-100/30">
            {todayEvent ? 'Phụng Vụ Hôm Nay' : 'Tâm Tình Ngày Sống'}
          </span>
          <h2 className="sacred-title text-3xl md:text-5xl font-bold text-slate-800 italic leading-tight">
            {todayEvent ? todayEvent.massName : 'Tận Hiến Qua Lời Ca'}
          </h2>
          <p className="text-slate-500 text-[14px] font-medium italic max-w-lg mx-auto leading-relaxed">
            {todayEvent 
              ? `Kính mời hiệp thông lúc ${todayEvent.time} tại ${todayEvent.location}.`
              : '"Dù làm việc gì, hãy làm hết lòng như làm cho Chúa." (Cl 3,23)'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
           <button onClick={() => onNavigate(AppView.SCHEDULE)} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95">
              Lịch Phụng Vụ
           </button>
           <button onClick={() => onNavigate(AppView.MEMBERS)} className="px-10 py-3.5 bg-white text-slate-500 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              Danh Bộ Ca Viên
           </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Hiệp Thông', value: `${avgAttendance}%`, icon: <Users size={20}/>, color: 'text-amber-600' },
          { label: 'Ngân Quỹ', value: `${balance.toLocaleString()}đ`, icon: <TrendingUp size={20}/>, color: 'text-emerald-600' },
          { label: 'Thánh Nhạc', value: `${songs.length} Bài`, icon: <Music size={20}/>, color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center space-y-2 group transition-all shadow-sm">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 ${stat.color} flex items-center justify-center border border-slate-50`}>
              {stat.icon}
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;