
import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import { getCurrentLiturgicalColor } from '../services/ordoService';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Sparkles,
  Music2,
  Bell,
  LibraryBig,
  BarChart3,
  X,
  Info
} from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const liturgicalColor = useMemo(() => getCurrentLiturgicalColor(), []);

  const notifications = [
    { id: 1, title: 'Chào mừng Ban Trị Sự', content: 'Cổng thông tin Bắc Hòa đã chuyển sang giao diện tối chuyên nghiệp.', time: 'Vừa xong' },
    { id: 2, title: 'Lưu ý Phụng vụ', content: 'Hãy kiểm tra Ordo 2027 để cập nhật màu sắc phụng vụ chính xác.', time: '10 phút trước' }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-50 transition-colors duration-500">
      {/* Header */}
      <header className="h-16 lg:h-20 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 z-[60]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/40">
            <Music2 size={20} />
          </div>
          <h1 className="text-lg font-black font-serif uppercase tracking-tight text-white">
            CỔNG THÔNG TIN <span className="text-blue-500">BẮC HOÀ</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowNotifications(true)} 
             className="relative p-2.5 bg-white/5 rounded-xl text-white active:scale-90 transition-transform border border-white/10"
           >
             <Bell size={24} />
             <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-950"></div>
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-12 pb-32 scroll-smooth bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto min-h-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-3xl border-t border-white/5 px-2 py-2 safe-bottom flex justify-around items-center z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {[
          { id: AppView.DASHBOARD, label: 'Tổng Quan', icon: <LayoutDashboard size={24} /> },
          { id: AppView.SCHEDULE, label: 'Lịch PV', icon: <CalendarDays size={24} /> },
          { id: AppView.MEMBERS, label: 'Ca Viên', icon: <Users size={24} /> },
          { id: AppView.LIBRARY, label: 'Thanh Nhạc', icon: <LibraryBig size={24} /> },
          { id: AppView.ANALYTICS, label: 'Thống Kê', icon: <BarChart3 size={24} /> },
          { id: AppView.AI_ASSISTANT, label: 'AI', icon: <Sparkles size={24} /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-blue-600 text-white scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)]' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {item.icon}
            <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${currentView === item.id ? 'block' : 'hidden'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Notification Center */}
      {showNotifications && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md p-0 animate-in fade-in">
          <div className="bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-10 pb-12 space-y-6 shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Thông Báo Hoạt Động</h3>
              <button onClick={() => setShowNotifications(false)} className="p-3 bg-white/5 rounded-full text-white active:scale-90 transition-all border border-white/10"><X size={24}/></button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {notifications.map((note) => (
                <div key={note.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex gap-4 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Info size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white leading-tight">{note.title}</h4>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed">{note.content}</p>
                    <span className="text-[9px] font-black text-slate-600 uppercase mt-2 block">{note.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowNotifications(false)} 
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-900/40"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;