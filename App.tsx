
import React, { useEffect } from 'react';
import { AppView, Member } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import FinanceManagement from './components/FinanceManagement';
import LibraryManagement from './components/LibraryManagement';
import ScheduleManagement from './components/ScheduleManagement';
import MemberPortal from './components/MemberPortal';
import AnalyticsManagement from './components/AnalyticsManagement';
import { useAuthStore, useMemberStore, useEventStore, useFinanceStore, useLibraryStore } from './store';

const App: React.FC = () => {
  const { setMembers, setAttendanceData, members, attendanceData } = useMemberStore();
  const { setEvents } = useEventStore();
  const { transactions } = useFinanceStore();
  const { setTransactions } = useFinanceStore();
  const { setSongs } = useLibraryStore();
  const { user, login } = useAuthStore();

  const [currentView, setCurrentView] = React.useState<AppView>(AppView.DASHBOARD);

  useEffect(() => {
    // Khởi tạo tài khoản quản trị mặc định (Dữ liệu sạch)
    const adminUser: Member = {
      id: 'm-admin',
      saintName: 'Phêrô',
      name: 'Giuse Nguyễn Văn A',
      phone: '0901234567',
      gender: 'Nam',
      role: 'Ca trưởng',
      joinDate: new Date().toISOString().split('T')[0],
      // Fix: missionStatus is not a property of Member, using status instead
      status: 'ACTIVE'
    };
    login(adminUser);

    // Xóa sạch dữ liệu mẫu cũ để đồng bộ từ đầu
    setMembers([adminUser]);
    setSongs([]);
    setEvents([]);
    setTransactions([]);
    setAttendanceData([]);
  }, [setMembers, setEvents, setTransactions, setSongs, setAttendanceData, login]);

  const renderContent = () => {
    if (currentView === AppView.MEMBER_PORTAL && user) {
      return (
        <MemberPortal 
          currentUser={user} 
          scheduleItems={[]} // Sẽ lấy từ store thông qua component
          onSwitchToAdmin={() => setCurrentView(AppView.DASHBOARD)} 
        />
      );
    }

    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onNavigate={setCurrentView} />;
      case AppView.MEMBERS: return <MemberManagement />;
      case AppView.SCHEDULE: return <ScheduleManagement />;
      case AppView.FINANCE: return <FinanceManagement />;
      case AppView.LIBRARY: return <LibraryManagement />;
      case AppView.ANALYTICS: return <AnalyticsManagement members={members} attendanceData={attendanceData} transactions={transactions} />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="animate-in fade-in duration-500">
        <div className="mb-6 flex justify-end gap-3 px-2">
          <button 
            onClick={() => setCurrentView(AppView.ANALYTICS)}
            className={`text-[10px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-xl ${currentView === AppView.ANALYTICS ? 'bg-amberGold text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Phân tích chuyên sâu
          </button>
          <button 
            onClick={() => setCurrentView(currentView === AppView.MEMBER_PORTAL ? AppView.DASHBOARD : AppView.MEMBER_PORTAL)}
            className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            {currentView === AppView.MEMBER_PORTAL ? 'Về Quản trị' : 'Cổng Ca Viên'}
          </button>
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
