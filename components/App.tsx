
import React from 'react';
import { AppView } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import FinanceManagement from './components/FinanceManagement';
import LibraryManagement from './components/LibraryManagement';
import ScheduleManagement from './components/ScheduleManagement';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import { useAuthStore } from './store';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.DASHBOARD);

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
