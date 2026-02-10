import React from 'react';
import { Megaphone, CheckCircle2, BellRing } from 'lucide-react';
import { useNotificationStore } from '../store';

const Updates: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();

  const handleMarkAllAsRead = () => {
    notifications.forEach((n: any) => {
      if (!n.isRead) markAsRead(n.id);
    });
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-[2rem] border-white/80 bg-white/40 shadow-sm">
        <div className="space-y-1">
          <h1 className="sacred-title text-2xl font-bold text-slate-900 leading-none italic">Bản Tin & Cập Nhật</h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-1 leading-none italic">Thông báo từ Ban Điều Hành</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead} 
            className="glass-button active-glass px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Đã đọc tất cả
          </button>
        )}
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {notifications.length > 0 ? notifications.map((n: any) => (
          <div 
            key={n.id} 
            onClick={() => markAsRead(n.id)} 
            className={`glass-card p-6 rounded-[2rem] border-white/60 transition-all cursor-pointer group ${n.isRead ? 'bg-white/40 opacity-70' : 'bg-amber-50/60 shadow-md border-amber-200/50 hover:scale-[1.01]'}`}
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${n.isRead ? 'bg-slate-100 text-slate-400' : 'bg-amberGold text-white'}`}>
                <BellRing size={20} className={n.isRead ? '' : 'animate-pulse'} />
              </div>
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`text-[15px] font-bold leading-tight italic ${n.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h3>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-amberGold shrink-0 mt-1.5 shadow-sm"></span>}
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{n.content}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">{n.time || 'Vừa xong'}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-24 opacity-40">
            <Megaphone size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-[11px] font-bold uppercase tracking-widest italic">Chưa có thông báo mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Updates;