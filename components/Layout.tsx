
import React, { useState } from 'react';
import { AppView } from '../types';
import { 
  Music2, Bell, LayoutDashboard, Users, Calendar, Library, Wallet, LogOut
} from 'lucide-react';
import { useNotificationStore, useAuthStore } from '../store';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const { user, logout } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Tổng quan', icon: <LayoutDashboard size={16} /> },
    { id: AppView.SCHEDULE, label: 'Lịch lễ', icon: <Calendar size={16} /> },
    { id: AppView.LIBRARY, label: 'Âm ca', icon: <Library size={16} /> },
    { id: AppView.MEMBERS, label: 'Sổ bộ', icon: <Users size={16} /> },
    { id: AppView.FINANCE, label: 'Đoàn quỹ', icon: <Wallet size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-700 w-full overflow-x-hidden">
      <header className="sticky top-0 z-[100] px-4 md:px-8 py-3 bg-white/40 backdrop-blur-xl border-b border-white/60 w-full">
        <div className="w-full flex items-center justify-between h-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(AppView.DASHBOARD)}>
            <div className="w-9 h-9 glass-button border-amberGold/30 rounded-lg flex items-center justify-center text-amberGold shadow-sm">
              <Music2 size={18} />
            </div>
            <div className="flex flex-col">
              <h1 className="sacred-title font-bold text-sm text-slate-900 leading-none italic uppercase tracking-tight">
                Ca Đoàn <span className="text-amberGold">Thiên Thần</span>
              </h1>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Cộng đoàn Bắc Hòa</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2.5 transition-all text-[9px] font-bold uppercase tracking-widest ${
                    isActive ? 'active-glass shadow-sm' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 glass-button border-none rounded-xl relative text-slate-400 hover:text-slate-900">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-amberGold rounded-full border border-white"></span>}
            </button>
            <button onClick={() => setShowProfile(!showProfile)} className="w-10 h-10 glass-button border-amberGold/20 rounded-xl flex items-center justify-center text-xs font-bold text-slate-900 shadow-sm overflow-hidden">
              {user?.name?.[0]}
            </button>
          </div>
        </div>

        {showNotifications && (
          <div className="absolute top-16 right-4 md:right-8 w-80 glass-card rounded-2xl p-5 shadow-2xl border-white/50 z-[110] animate-in fade-in zoom-in-95">
            <h4 className="text-[10px] font-bold uppercase text-slate-900 mb-4 pb-2 border-b border-slate-100 italic tracking-widest">Thông báo hiệp thông</h4>
            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
              {notifications.map(n => (
                <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-3.5 rounded-xl border transition-all cursor-pointer ${n.isRead ? 'bg-white/20 border-transparent' : 'bg-amber-50/50 border-amber-100'}`}>
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">{n.title}</p>
                  <p className="text-[9px] text-slate-500 mt-1.5 italic leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showProfile && (
          <div className="absolute top-16 right-4 md:right-8 w-56 glass-card rounded-2xl shadow-2xl overflow-hidden border-white/50 z-[110] animate-in fade-in zoom-in-95">
            <div className="p-5 bg-white/30 border-b border-slate-100 text-center">
              <p className="text-[13px] font-bold italic sacred-title text-slate-900">{user?.name}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1.5">Ban Điều Hành</p>
            </div>
            <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2.5 py-4 hover:bg-rose-50 text-rose-500 text-[10px] font-bold uppercase tracking-widest italic transition-colors">
              <LogOut size={16} /> Thoát hệ thống
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 w-full p-4 md:p-8 animate-fade-in pb-28 lg:pb-12 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:max-w-md lg:hidden glass-card border-white/50 p-2 flex items-center justify-around z-[1000] rounded-2xl shadow-2xl">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${isActive ? 'active-glass' : 'text-slate-400'}`}>
              {/* Fix: Added explicit casting to React.ReactElement<any> to resolve size prop typing error in cloneElement */}
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
