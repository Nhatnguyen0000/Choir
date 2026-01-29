import React from 'react';
import { AppView } from '../types';
import { 
  Music2, Bell, CircleUser, LayoutDashboard, Users, Calendar, Library, Wallet, Sparkles, LogOut 
} from 'lucide-react';
import { useNotificationStore, useAuthStore } from '../store';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const { unreadCount } = useNotificationStore();
  const { logout } = useAuthStore();

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: AppView.SCHEDULE, label: 'Lịch lễ', icon: <Calendar size={20} /> },
    { id: AppView.LIBRARY, label: 'Thánh nhạc', icon: <Library size={20} /> },
    { id: AppView.MEMBERS, label: 'Ca viên', icon: <Users size={20} /> },
    { id: AppView.FINANCE, label: 'Ngân quỹ', icon: <Wallet size={20} /> },
    { id: AppView.AI_ASSISTANT, label: 'Trợ lý AI', icon: <Sparkles size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      <header className="sticky top-0 z-[100] px-4 py-3 md:px-6">
        <div className="max-w-7xl mx-auto glass-card rounded-2xl px-4 py-2 flex items-center justify-between border-slate-200 shadow-lg bg-white/95">
          <div onClick={() => setCurrentView(AppView.DASHBOARD)} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 bg-amberGold rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:rotate-6">
              <Music2 size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="sacred-title font-bold text-base text-slate-900 leading-none uppercase tracking-tighter">THIÊN THẦN</span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-black text-slate-400 mt-0.5 italic">Giáo xứ Bắc Hòa</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm ${
                  currentView === item.id 
                    ? 'active-pill border-slate-900' 
                    : 'glass-button text-slate-500 hover:text-slate-900 border-slate-100 bg-white/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl glass-button text-slate-500 relative flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm border-slate-100">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amberGold rounded-full border border-white"></span>
              )}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
            <div className="flex items-center gap-2 pl-1 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-all group">
              <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amberGold border border-amber-100 shadow-sm group-hover:bg-amberGold group-hover:text-white transition-all">
                <CircleUser size={18} />
              </div>
              <button onClick={() => logout()} title="Rời khỏi" className="hidden lg:block text-slate-300 hover:text-rose-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in pb-24 md:pb-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-1 py-1 flex items-center justify-around z-[1000] pb-env(safe-area-inset-bottom)">
        {navItems.slice(0, 5).map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all gap-1.5 relative ${
                isActive ? 'text-amberGold' : 'text-slate-300'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-amberGold text-white shadow-lg scale-110 -translate-y-1' : ''}`}>
                {React.cloneElement(item.icon as React.ReactElement, { 
                  size: 20, 
                  strokeWidth: isActive ? 2.5 : 2 
                })}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-opacity ${isActive ? 'opacity-100 font-black' : 'opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
