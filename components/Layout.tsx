
import React, { useState } from 'react';
import { AppView } from '../types';
import { 
  Music2, Bell, LayoutDashboard, Users, Calendar, Library, Wallet, X, LogOut, ChevronDown
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

  const getViewTitle = (view: AppView) => {
    switch (view) {
      case AppView.DASHBOARD: return 'Tổng Quan Phụng Vụ';
      case AppView.SCHEDULE: return 'Lịch Công Tác';
      case AppView.LIBRARY: return 'Thánh Nhạc';
      case AppView.MEMBERS: return 'Sổ Bộ Ca Viên';
      case AppView.FINANCE: return 'Ngân Quỹ Đoàn';
      default: return 'Trang Chủ';
    }
  };

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Tổng quan', icon: <LayoutDashboard size={18} /> },
    { id: AppView.SCHEDULE, label: 'Lịch công tác', icon: <Calendar size={18} /> },
    { id: AppView.LIBRARY, label: 'Thánh nhạc', icon: <Library size={18} /> },
    { id: AppView.MEMBERS, label: 'Ca viên', icon: <Users size={18} /> },
    { id: AppView.FINANCE, label: 'Ngân quỹ', icon: <Wallet size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] font-sans text-slate-900 leading-relaxed overflow-x-hidden">
      {/* Minimalist Glass Header */}
      <header className="sticky top-0 z-[100] px-4 py-3 md:px-8 bg-white/5 backdrop-blur-xl border-b border-slate-200/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[52px]">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentView(AppView.DASHBOARD)}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl transition-all group-hover:bg-amberGold">
              <Music2 size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="sacred-title font-black text-sm md:text-base text-slate-900 leading-none italic uppercase tracking-tighter">
                Ca Đoàn <span className="text-amberGold">Thiên Thần</span>
              </h1>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                Giáo Xứ Bắc Hòa
              </span>
            </div>
          </div>

          {/* Minimalist Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2.5 transition-all duration-300 text-[11px] font-black uppercase tracking-widest ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-slate-100 text-amberGold' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amberGold rounded-full border border-white animate-pulse"></span>
              )}
            </button>

            <button 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all border border-transparent ${showProfile ? 'bg-white border-slate-200 shadow-sm' : 'hover:bg-slate-50'}`}
            >
              <div className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">
                {user?.name?.[0]}
              </div>
              <ChevronDown size={14} className={`text-slate-400 hidden md:block transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdowns */}
            {showNotifications && (
              <div className="absolute top-[64px] right-4 w-72 glass-card rounded-2xl p-4 shadow-2xl border-white/40 z-[110] animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Thông báo Hiệp thông</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-300 hover:text-slate-900"><X size={16}/></button>
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-hide">
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-3 rounded-xl border transition-all cursor-pointer ${n.isRead ? 'bg-slate-50/50 border-slate-100' : 'bg-amber-50/30 border-amber-100 shadow-sm'}`}>
                      <p className="text-[10px] font-black text-slate-800 leading-tight">{n.title}</p>
                      <p className="text-[9px] text-slate-500 mt-1">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showProfile && (
              <div className="absolute top-[64px] right-4 w-52 glass-card rounded-2xl shadow-2xl overflow-hidden border-white/40 z-[110] animate-in fade-in zoom-in-95">
                <div className="p-4 bg-slate-900 text-white text-center">
                  <p className="sacred-title text-sm italic font-bold">Ban Điều Hành</p>
                  <p className="text-[8px] uppercase tracking-widest text-slate-400 mt-1">Hiệp thông Bắc Hòa</p>
                </div>
                <div className="p-2 bg-white">
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                     <LogOut size={14} /> Thoát hệ thống
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-10 animate-fade-in pb-28 md:pb-16">
        {children}
      </main>

      {/* Mobile Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm lg:hidden glass-card border border-white/40 p-1.5 flex items-center justify-around z-[1000] rounded-[2rem] shadow-2xl bg-white/70 backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
                isActive ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
