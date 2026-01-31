import React, { Suspense, lazy } from 'react';
import { AppView } from './types';
import Layout from './components/Layout';
import Login from './components/Login';
import { useAuthStore } from './store';

// Lazy load components để tối ưu performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const MemberManagement = lazy(() => import('./components/MemberManagement'));
const ScheduleManagement = lazy(() => import('./components/ScheduleManagement'));
const FinanceManagement = lazy(() => import('./components/FinanceManagement'));
const LibraryManagement = lazy(() => import('./components/LibraryManagement'));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-amberGold border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.DASHBOARD);

  // Authentication check
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: 
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard onNavigate={setCurrentView} />
          </Suspense>
        );
      case AppView.MEMBERS: 
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MemberManagement />
          </Suspense>
        );
      case AppView.SCHEDULE: 
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ScheduleManagement />
          </Suspense>
        );
      case AppView.FINANCE: 
        return (
          <Suspense fallback={<LoadingFallback />}>
            <FinanceManagement />
          </Suspense>
        );
      case AppView.LIBRARY: 
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LibraryManagement />
          </Suspense>
        );
      default: 
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard onNavigate={setCurrentView} />
          </Suspense>
        );
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
