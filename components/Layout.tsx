
import React, { useState } from 'react';
import { AppView } from '../types';
import { 
  Music2, Bell, CircleUser, LayoutDashboard, Users, Calendar, Library, Wallet, Check, X, ShieldCheck
} from 'lucide-react';
import { useNotificationStore, useAuthStore } from '../store';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const { user } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getViewTitle = (view: AppView) => {
    switch (view) {
      case AppView.DASHBOARD: return 'Tổng quan Phụng vụ';
      case AppView.SCHEDULE: return 'Lịch Công tác';
      case AppView.LIBRARY: return 'Kho Thánh nhạc';
      case AppView.MEMBERS: return 'Sổ bộ Ca viên';
      case AppView.FINANCE: return 'Ngân quỹ Đoàn';
      case AppView.ANALYTICS: return 'Thống kê Hiệp thông';
      case AppView.MEMBER_PORTAL: return 'Cổng Ca viên';
      default: return 'Ca Đoàn Thiên Thần';
    }
  };

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: AppView.SCHEDULE, label: 'Lịch lễ', icon: <Calendar size={20} /> },
    { id: AppView.LIBRARY, label: 'Thánh nhạc', icon: <Library size={20} /> },
    { id: AppView.MEMBERS, label: 'Ca viên', icon: <Users size={20} /> },
    { id: AppView.FINANCE, label: 'Ngân quỹ', icon: <Wallet size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <header className="sticky top-0 z-[100] px-4 py-4 md:px-6">
        <div className="max-w-7xl mx-auto glass-card rounded-[1.5rem] px-5 py-2 flex items-center justify-between border-slate-200/60 shadow-xl bg-white/95 backdrop-blur-md h-[72px]">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-4 min-w-[220px]">
            <div 
              onClick={() => setCurrentView(AppView.DASHBOARD)} 
              className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <Music2 size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h2 className="sacred-title font-bold text-base text-slate-900 leading-none italic flex items-center gap-2">
                {getViewTitle(currentView)}
              </h2>
              <span className="text-[8px] uppercase tracking-[0.3em] font-black text-amberGold mt-1 truncate">
                CA ĐOÀN THIÊN THẦN • BẮC HÒA
              </span>
            </div>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-8 gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group ${
                  currentView === item.id 
                    ? 'bg-slate-900 text-white shadow-lg scale-110' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {/* Fixed: cast to React.ReactElement<any> to allow Lucide specific props like size and strokeWidth */}
                {React.cloneElement(item.icon as React.ReactElement<any>, { 
                  size: 22,
                  strokeWidth: currentView === item.id ? 2.5 : 2
                })}
              </button>
            ))}
          </nav>

          {/* User & Notifications */}
          <div className="flex items-center gap-3 min-w-[220px] justify-end">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-200 text-[9px] font-black uppercase tracking-widest">
               <ShieldCheck size={14} strokeWidth={3} className="text-emerald-500" /> Hệ thống Bảo mật
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-white text-amberGold shadow-sm' : 'text-slate-400 hover:text-amberGold'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-amberGold rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
              
              <button 
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all ${showProfile ? 'border-amberGold bg-white text-amberGold' : 'border-transparent bg-slate-900 text-white'}`}
              >
                {user?.name?.[0] || <CircleUser size={18} />}
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div className="absolute top-full mt-3 right-0 w-80 glass-card rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Thông báo Hiệp thông</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-300 hover:text-slate-900"><X size={16}/></button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-3 rounded-xl border transition-all cursor-pointer ${n.isRead ? 'bg-slate-50 border-slate-100' : 'bg-amber-50/50 border-amber-100 shadow-sm'}`}>
                        <p className="text-[11px] font-black text-slate-800">{n.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Popup */}
              {showProfile && (
                <div className="absolute top-full mt-3 right-0 w-64 glass-card rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-5 bg-slate-900 text-white text-center">
                    <div className="w-16 h-16 bg-amberGold rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3 border-4 border-white/10">
                      {user?.name?.[0]}
                    </div>
                    <h4 className="sacred-title text-lg italic">Ban Điều Hành</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Ca Đoàn Thiên Thần</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 text-slate-600 text-[11px] font-bold">
                       <Check size={16} className="text-emerald-500" /> Hệ thống sẵn sàng
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 animate-fade-in pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-2 py-2 flex items-center justify-around z-[1000] pb-env(safe-area-inset-bottom) rounded-t-[2rem] shadow-xl">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${
                isActive ? 'text-slate-900' : 'text-slate-300'
              }`}
            >
              <div className={`p-2.5 rounded-2xl transition-all ${isActive ? 'bg-slate-900 text-white shadow-lg scale-110 -translate-y-2' : ''}`}>
                {/* Fixed: cast to React.ReactElement<any> to allow Lucide specific props like size and strokeWidth */}
                {React.cloneElement(item.icon as React.ReactElement<any>, { 
                  size: 22, 
                  strokeWidth: isActive ? 2.5 : 2 
                })}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
