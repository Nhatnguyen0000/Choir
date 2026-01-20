
import React from 'react';
import { 
  Users, 
  Heart,
  Church,
  Calendar,
  ShieldCheck,
  Music,
  BookOpen
} from 'lucide-react';

interface DashboardProps {
  memberCount: number;
  scheduleCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ memberCount, scheduleCount }) => {
  const stats = [
    { label: 'Ca viên', value: memberCount.toString(), icon: <Users size={20} />, color: 'bg-blue-600 text-white shadow-blue-900/40' },
    { label: 'Lễ tuần', value: scheduleCount.toString(), icon: <Church size={20} />, color: 'bg-indigo-600 text-white shadow-indigo-900/40' },
    { label: 'C.Cần', value: memberCount > 0 ? '0%' : '--', icon: <Heart size={20} />, color: 'bg-rose-600 text-white shadow-rose-900/40' },
    { label: 'Nhạc tập', value: scheduleCount.toString(), icon: <Music size={20} />, color: 'bg-emerald-600 text-white shadow-emerald-900/40' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.color} rounded-xl shadow-lg`}>{stat.icon}</div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-8 border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black font-serif text-white">Công Việc Hôm Nay</h3>
            <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
              <Calendar size={24} />
            </div>
          </div>
          
          <div className="space-y-4">
            {scheduleCount === 0 ? (
              <div className="py-10 text-center space-y-3">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Chưa có lịch hoạt động được thiết lập</p>
                 <p className="text-xs font-bold text-slate-400">Hãy chuyển sang mục "Lịch PV" để bắt đầu thiết lập chương trình phụng vụ đầu tiên.</p>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-300">Bạn có {scheduleCount} hoạt động sắp tới. Hãy kiểm tra chi tiết trong mục Lịch PV.</p>
            )}
          </div>
        </div>

        <div className="bg-blue-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-white/20">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><ShieldCheck size={20} className="text-white" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Hệ Thống Quản Lý</span>
              </div>
              <h4 className="text-4xl font-black font-serif leading-tight">Số hóa<br/><span className="text-white/70">Quản lý</span> Thánh nhạc</h4>
              <p className="text-xs text-white/60 font-bold leading-relaxed max-w-[200px]">Chào mừng Ban Trị Sự đến với môi trường điều hành ca đoàn hiện đại.</p>
            </div>
            <div className="flex gap-3 mt-10">
              <button className="p-5 bg-white text-blue-600 rounded-2xl shadow-xl active:scale-90 transition-all"><BookOpen size={24} strokeWidth={2.5}/></button>
              <button className="flex-1 p-5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl active:scale-90 transition-all border border-white/5">Hoạt động</button>
            </div>
          </div>
          <Church size={300} strokeWidth={1} className="absolute -bottom-16 -right-16 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;