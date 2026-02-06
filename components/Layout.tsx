
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { 
  Music2, Bell, LayoutDashboard, Users, CalendarDays, Music, Wallet, LogOut, Sparkles, CloudSync, CheckCircle2, CloudOff
} from 'lucide-react';
import { useNotificationStore, useAuthStore, useAppStore } from '../store';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const { user, logout } = useAuthStore();
  const { isCloudMode } = useAppStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setSyncing(true);
      setTimeout(() => setSyncing(false), 2000);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Tổng quan', icon: <LayoutDashboard size={14} /> },
    { id: AppView.SCHEDULE, label: 'Lịch lễ', icon: <CalendarDays size={14} /> },
    { id: AppView.LIBRARY, label: 'Thánh Ca', icon: <Music size={14} /> },
    { id: AppView.MEMBERS, label: 'Ca Viên', icon: <Users size={14} /> },
    { id: AppView.FINANCE, label: 'Ngân quỹ', icon: <Wallet size={14} /> },
    { id: AppView.ASSISTANT, label: 'Trợ lý AI', icon: <Sparkles size={14} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-700 w-full overflow-x-hidden">
      <header className="sticky top-0 z-[100] px-4 md:px-8 py-2.5 bg-white/40 backdrop-blur-xl border-b border-white/60 w-full shadow-sm">
        <div className="w-full flex items-center justify-between h-10">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setCurrentView(AppView.DASHBOARD)}>
            <div className="w-8 h-8 glass-button border-amberGold/30 rounded-lg flex items-center justify-center text-amberGold shadow-sm group-hover:scale-105 transition-transform">
              <Music2 size={16} />
            </div>
            <div className="flex flex-col">
              <h1 className="sacred-title font-bold text-[13px] text-slate-900 leading-none italic uppercase tracking-tight">
                Ca Đoàn <span className="text-amberGold">Thiên Thần</span>
              </h1>
              <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-0.5 leading-none">Bắc Hòa Community</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all text-[8.5px] font-bold uppercase tracking-widest ${
                    isActive ? 'active-glass shadow-sm' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Sync Indicator */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/50 ${isCloudMode ? 'bg-emerald-50/50' : 'bg-slate-100/50'}`}>
              {syncing ? (
                <CloudSync size={14} className="text-amberGold animate-spin" />
              ) : isCloudMode ? (
                <CheckCircle2 size={14} className="text-emeraldGreen" />
              ) : (
                <CloudOff size={14} className="text-slate-400" />
              )}
              <span className="text-[7px] font-bold uppercase tracking-widest text-slate-400">
                {syncing ? 'Đang đồng bộ...' : isCloudMode ? 'Đã hiệp thông Cloud' : 'Chế độ nội bộ'}
              </span>
            </div>

            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 glass-button border-none rounded-lg relative text-slate-400 hover:text-slate-900 shadow-sm">
              <Bell size={16} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amberGold rounded-full border border-white"></span>}
            </button>
            <button onClick={() => setShowProfile(!showProfile)} className="w-8 h-8 glass-button border-amberGold/20 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-900 shadow-sm overflow-hidden">
              {user?.name?.[0]}
            </button>
          </div>
        </div>

        {showNotifications && (
          <div className="absolute top-14 right-4 md:right-8 w-72 glass-card rounded-2xl p-4 shadow-2xl border-white/50 z-[110] animate-in fade-in zoom-in-95">
            <h4 className="text-[9px] font-bold uppercase text-slate-900 mb-3 pb-1.5 border-b border-slate-100 italic tracking-widest">Thông báo hiệp thông</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
              {notifications.map(n => (
                <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-3 rounded-xl border transition-all cursor-pointer ${n.isRead ? 'bg-white/10 border-transparent' : 'bg-amber-50/40 border-amber-100'}`}>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{n.title}</p>
                  <p className="text-[8px] text-slate-500 mt-1 italic leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showProfile && (
          <div className="absolute top-14 right-4 md:right-8 w-48 glass-card rounded-2xl shadow-2xl overflow-hidden border-white/50 z-[110] animate-in fade-in zoom-in-95">
            <div className="p-4 bg-white/30 border-b border-slate-100 text-center">
              <p className="text-[11px] font-bold italic sacred-title text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[8px] uppercase tracking-widest text-slate-400 mt-1.5 leading-none">Ban Điều Hành</p>
            </div>
            {!isCloudMode && (
               <div className="px-4 py-2 bg-amber-50/50 text-[7px] text-amber-700 font-bold uppercase tracking-widest text-center border-b border-amber-100">
                 Dữ liệu đang lưu tại trình duyệt này
               </div>
            )}
            <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 py-3 hover:bg-rose-50 text-rose-500 text-[9px] font-bold uppercase tracking-widest italic transition-colors">
              <LogOut size={14} /> Thoát hệ thống
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 w-full p-4 md:p-6 animate-fade-in pb-24 lg:pb-8 overflow-y-auto">
        <div className="w-full max-w-full mx-auto h-full">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md lg:hidden glass-card border-white/50 p-1.5 flex items-center justify-around z-[1000] rounded-2xl shadow-2xl">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${isActive ? 'active-glass shadow-sm' : 'text-slate-400'}`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
              <span className="text-[7px] mt-1 font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
