
import React, { useEffect } from 'react';
import { AppView } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import FinanceManagement from './components/FinanceManagement';
import LibraryManagement from './components/LibraryManagement';
import ScheduleManagement from './components/ScheduleManagement';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import { useAuthStore, useAppStore } from './store';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchInitialData, subscribeToChanges, isCloudMode } = useAppStore();
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.DASHBOARD);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("App Khởi tạo: Loading dữ liệu...");
      fetchInitialData();
      
      // Chỉ đăng ký thay đổi nếu ở chế độ Cloud
      const unsubscribe = subscribeToChanges();
      
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onNavigate={setCurrentView} />;
      case AppView.MEMBERS: return <MemberManagement />;
      case AppView.SCHEDULE: return <ScheduleManagement />;
      case AppView.FINANCE: return <FinanceManagement />;
      case AppView.LIBRARY: return <LibraryManagement />;
      case AppView.ASSISTANT: return <AIAssistant />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="animate-fade-in h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
