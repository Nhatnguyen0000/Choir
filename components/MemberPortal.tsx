
import React, { useState, useMemo } from 'react';
import { Sparkles, MapPin, Check, BookOpen, X, Music, UserCheck, Heart } from 'lucide-react';
import { Member, ScheduleEvent } from '../types';
import { useMemberStore } from '../store';

interface MemberPortalProps {
  currentUser: Member;
  scheduleItems: ScheduleEvent[];
  onSwitchToAdmin: () => void;
}

const MemberPortal: React.FC<MemberPortalProps> = ({ currentUser, scheduleItems, onSwitchToAdmin }) => {
  const { attendanceData, updateAttendance } = useMemberStore();
  const [showToast, setShowToast] = useState(false);

  const myStats = useMemo(() => {
    const myRecords = attendanceData.flatMap(d => d.records).filter(r => r.memberId === currentUser.id);
    const presentCount = myRecords.filter(r => r.status === 'PRESENT').length;
    const totalCount = myRecords.length || 0;
    const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;
    return { present: presentCount, total: totalCount, rate };
  }, [attendanceData, currentUser.id]);

  const handleQuickReport = (eventId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    updateAttendance(eventId, currentUser.id, status);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4">
          <div className="bg-emeraldGreen text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border border-white/20 backdrop-blur-sm">
            <Check size={18} strokeWidth={3} /> 
            <span className="text-[11px] font-bold uppercase tracking-widest">Hiệp thông thành công!</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
           <h1 className="sacred-title text-2xl md:text-3xl font-bold text-slate-900 italic">
              Xin chào, {currentUser.name.split(' ').pop()}! <Sparkles className="text-amberGold inline-block ml-1" size={24} />
           </h1>
           <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest italic leading-none">Cầu chúc anh chị luôn hăng say Phụng sự Chúa</p>
        </div>
        <button onClick={onSwitchToAdmin} className="glass-button px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Chuyển sang Quản trị
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between border-slate-200">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tỉ lệ chuyên cần</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{myStats.rate}%</h3>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amberGold rounded-lg flex items-center justify-center border border-amber-100 shadow-sm">
              <Heart size={20} fill="currentColor" />
            </div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center justify-between border-slate-200">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Buổi đã hiện diện</p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{myStats.present}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-royalBlue rounded-lg flex items-center justify-center border border-blue-100 shadow-sm">
              <UserCheck size={20} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[11px] font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest">
            <div className="w-1 h-3.5 bg-amberGold rounded-full"></div> Lịch Hiệp Thông Của Anh Chị
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduleItems.length === 0 ? (
              <div className="col-span-full py-12 text-center glass-card rounded-xl text-slate-400 font-bold uppercase tracking-widest text-[11px] italic">
                Chưa có lịch hoạt động mới
              </div>
            ) : (
              scheduleItems.slice(0, 4).map((event) => (
                <div key={event.id} className="glass-card p-5 rounded-xl flex flex-col justify-between group border-slate-200 bg-white/50 hover:border-amberGold transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-white rounded-lg flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                        <span className="text-[14px] font-bold text-slate-900 leading-none">{new Date(event.date).getDate()}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(event.date).toLocaleString('vi-VN', { month: 'short' })}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${event.type === 'MASS' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {event.type === 'MASS' ? 'Thánh Lễ' : 'Tập Hát'}
                      </span>
                    </div>
                    <div>
                      <h4 className="sacred-title text-[15px] font-bold text-slate-800 leading-tight mb-1 italic">{event.massName}</h4>
                      <div className="flex items-center gap-2 text-slate-400">
                         <MapPin size={12} className="text-amberGold" /> 
                         <span className="text-[10px] font-medium truncate italic">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleQuickReport(event.id, 'ABSENT')}
                      className="flex-1 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-[9px] font-bold uppercase border border-rose-100"
                    >
                      Báo Vắng
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase flex items-center justify-center gap-1.5">
                      Xem bài <BookOpen size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[11px] font-bold text-slate-900 flex items-center gap-2 uppercase tracking-widest">
            <div className="w-1 h-3.5 bg-emeraldGreen rounded-full"></div> Hồ Sơ Ca Viên
          </h3>
          <div className="glass-card p-6 rounded-xl space-y-6 border-slate-200 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amberGold/5 rounded-full blur-[30px]"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-amberGold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white transition-transform group-hover:rotate-6">
                {currentUser.name[0]}
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900 leading-none">{currentUser.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase italic mt-1">{currentUser.saintName || 'Ca viên hiệp thông'}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-50 relative z-10">
               {[
                 { label: 'Bổn phận', value: currentUser.role, icon: <Music size={14} className="text-amberGold"/> },
                 { label: 'Ngày gia nhập', value: new Date(currentUser.joinDate).toLocaleDateString('vi-VN'), icon: <UserCheck size={14} className="text-emeraldGreen"/> },
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2">
                       {item.icon}
                       <span className="text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                    </div>
                    <span className="text-slate-800 font-bold">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;
