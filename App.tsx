import React, { useEffect, lazy, Suspense } from 'react';
import { AppView } from './types';
import Layout from './components/Layout';
import Login from './components/Login';
import Toast from './components/Toast';
import { useAuthStore, useAppStore } from './store';

const Dashboard = lazy(() => import('./components/Dashboard'));
const MemberManagement = lazy(() => import('./components/MemberManagement'));
const FinanceManagement = lazy(() => import('./components/FinanceManagement'));
const LibraryManagement = lazy(() => import('./components/LibraryManagement'));
const LiturgyPage = lazy(() => import('./components/LiturgyPage'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-8 h-8 border-2 border-amber-400/60 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchInitialData, subscribeToChanges } = useAppStore();
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.DASHBOARD);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
      const unsubscribe = subscribeToChanges();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isAuthenticated, fetchInitialData, subscribeToChanges]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onNavigate={setCurrentView} />;
      case AppView.MEMBERS: return <MemberManagement />;
      case AppView.FINANCE: return <FinanceManagement />;
      case AppView.LIBRARY: return <LibraryManagement />;
      case AppView.LITURGY: return <LiturgyPage />;
      case AppView.ASSISTANT: return <AIAssistant />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <Toast />
      <Layout currentView={currentView} setCurrentView={setCurrentView}>
        <div className="animate-fade-in h-full">
          <Suspense fallback={<PageFallback />}>
            {renderContent()}
          </Suspense>
        </div>
      </Layout>
    </>
  );
};

export default App;