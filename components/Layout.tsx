import { AppView } from '../types';
import { 
  Music2, LayoutDashboard, Users, CalendarDays, Music, Wallet, LogOut, Sparkles, RefreshCw, CheckCircle2, CloudOff, AlertTriangle
} from 'lucide-react';
import { useAuthStore, useAppStore } from '../store';
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const { user, logout } = useAuthStore();
  const { isCloudMode, realtimeStatus, isLoading } = useAppStore();
  
  const [showProfile, setShowProfile] = useState(false);

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
      <header className="sticky top-0 z-[100] px-4 md:px-8 py-3 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 w-full shadow-sm">
        <div className="w-full flex items-center justify-between h-12">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView(AppView.DASHBOARD)}>
            <div className="w-10 h-10 glass-button border-amberGold/30 rounded-xl flex items-center justify-center text-amberGold shadow-md group-hover:scale-105 transition-transform">
              <Music2 size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="sacred-title font-bold text-[15px] text-slate-900 leading-none italic uppercase tracking-tight">
                Ca Đoàn <span className="text-amberGold">Thiên Thần</span>
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1 leading-none">Bắc Hòa Community</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-[10px] font-bold uppercase tracking-widest ${
                    isActive ? 'active-glass shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full border ${
              realtimeStatus === 'CONNECTED' ? 'bg-emerald-50/80 border-emerald-200/60' : 
              realtimeStatus === 'ERROR' ? 'bg-rose-50/80 border-rose-200/60' : 'bg-slate-100/80 border-slate-200/60'
            }`}>
              {isLoading || realtimeStatus === 'CONNECTING' ? (
                <RefreshCw size={16} className="text-amberGold animate-spin" />
              ) : realtimeStatus === 'CONNECTED' ? (
                <CheckCircle2 size={16} className="text-emeraldGreen" />
              ) : realtimeStatus === 'ERROR' ? (
                <AlertTriangle size={16} className="text-rose-500" />
              ) : (
                <CloudOff size={16} className="text-slate-400" />
              )}
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                {isLoading ? 'Đang tải...' : 
                 realtimeStatus === 'CONNECTED' ? 'Cloud Trực Tuyến' : 
                 realtimeStatus === 'ERROR' ? 'Lỗi Kết Nối' : 'Chế độ Nội bộ'}
              </span>
            </div>

            <button onClick={() => setShowProfile(!showProfile)} className="w-10 h-10 glass-button border-amberGold/20 rounded-xl flex items-center justify-center text-sm font-bold text-slate-900 shadow-md overflow-hidden relative">
              {user?.name?.[0]}
            </button>
          </div>
        </div>

        {showProfile && (
          <div className="absolute top-16 right-4 md:right-8 w-52 card p-0 overflow-hidden z-[110] animate-in fade-in zoom-in-95 shadow-xl">
            <div className="p-5 bg-slate-50/80 border-b border-slate-100 text-center">
              <p className="text-[13px] font-bold italic sacred-title text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-2 leading-none">{user?.role || 'Ban Điều Hành'}</p>
            </div>
            {!isCloudMode && (
               <div className="px-4 py-2.5 bg-amber-50/80 text-[9px] text-amber-700 font-bold uppercase tracking-widest text-center border-b border-amber-100">
                 Offline: Dữ liệu lưu tại máy
               </div>
            )}
            <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 py-3.5 hover:bg-rose-50 text-rose-500 text-[10px] font-bold uppercase tracking-widest italic transition-colors">
              <LogOut size={16} /> Thoát hệ thống
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 w-full p-4 md:p-6 animate-fade-in pb-28 lg:pb-8 overflow-y-auto">
        <div className="w-full max-w-full mx-auto h-full">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-lg lg:hidden glass-card border-white/80 p-2 flex items-center justify-around z-[1000] rounded-2xl shadow-xl">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`relative flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${isActive ? 'active-glass shadow-sm' : 'text-slate-400'}`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
              <span className="text-[9px] mt-1.5 font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;