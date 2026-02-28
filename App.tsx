import React, { useEffect, lazy, Suspense, useCallback } from 'react';
import { AppView } from './types';
import Layout from './components/Layout';
import Toast from './components/Toast';
import { useAppStore, useFinanceStore, useToastStore } from './store';
import type { CommandType } from './services/aiCommandService';

const Dashboard = lazy(() => import('./components/Dashboard'));
const MemberManagement = lazy(() => import('./components/MemberManagement'));
const FinanceManagement = lazy(() => import('./components/FinanceManagement'));
const LibraryManagement = lazy(() => import('./components/LibraryManagement'));
const LiturgyPage = lazy(() => import('./components/LiturgyPage'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-10 h-10 border-2 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
    </div>
  );
}

const App: React.FC = () => {
  const { fetchInitialData, subscribeToChanges } = useAppStore();
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const addToast = useToastStore((s) => s.addToast);
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.DASHBOARD);

  const handleAICommand = useCallback(
    (cmd: CommandType) => {
      if (cmd.type === 'ADD_FINANCE') {
        addTransaction({
          id: crypto.randomUUID(),
          choirId: 'c-thienthan',
          date: new Date().toISOString().split('T')[0],
          description: cmd.description || (cmd.direction === 'IN' ? 'Thu (AI)' : 'Chi (AI)'),
          amount: cmd.amount,
          type: cmd.direction,
          category: cmd.direction === 'IN' ? 'Đóng góp' : 'Chi khác',
        });
        addToast(cmd.direction === 'IN' ? `Đã ghi thu ${cmd.amount.toLocaleString('vi-VN')}` : `Đã ghi chi ${cmd.amount.toLocaleString('vi-VN')}`);
      }
    },
    [addTransaction, addToast]
  );

  useEffect(() => {
    fetchInitialData();
    const unsubscribe = subscribeToChanges();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchInitialData, subscribeToChanges]);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onNavigate={setCurrentView} />;
      case AppView.MEMBERS: return <MemberManagement />;
      case AppView.FINANCE: return <FinanceManagement />;
      case AppView.LIBRARY: return <LibraryManagement />;
      case AppView.LITURGY: return <LiturgyPage />;
      case AppView.ASSISTANT:
        return (
          <AIAssistant
            onNavigate={setCurrentView}
            onExecuteCommand={handleAICommand}
          />
        );
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <Toast />
      <Layout currentView={currentView} setCurrentView={setCurrentView}>
        <div className="h-full">
          <Suspense fallback={<PageFallback />}>
            {renderContent()}
          </Suspense>
        </div>
      </Layout>
    </>
  );
};

export default App;