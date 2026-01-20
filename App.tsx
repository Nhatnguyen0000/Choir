
import React, { useState, useCallback, useMemo } from 'react';
import { AppView, Member, DailyAttendance, ScheduleEvent, Transaction, Song } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import MemberManagement from './components/MemberManagement';
import FinanceManagement from './components/FinanceManagement';
import LibraryManagement from './components/LibraryManagement';
import AnalyticsManagement from './components/AnalyticsManagement';
import ScheduleManagement from './components/ScheduleManagement';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // Xóa toàn bộ dữ liệu mẫu
  const [members, setMembers] = useState<Member[]>([]);
  const [attendanceData, setAttendanceData] = useState<DailyAttendance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleEvent[]>([]);

  const handleSuggestSongs = useCallback(() => setCurrentView(AppView.AI_ASSISTANT), []);

  const content = useMemo(() => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard memberCount={members.length} scheduleCount={scheduleItems.length} />;
      case AppView.MEMBERS:
        return <MemberManagement members={members} setMembers={setMembers} attendanceData={attendanceData} setAttendanceData={setAttendanceData} onSuggestSongs={handleSuggestSongs} />;
      case AppView.FINANCE:
        return <FinanceManagement transactions={transactions} setTransactions={setTransactions} />;
      case AppView.LIBRARY:
        return <LibraryManagement songs={songs} setSongs={setSongs} />;
      case AppView.SCHEDULE:
        return <ScheduleManagement scheduleItems={scheduleItems} setScheduleItems={setScheduleItems} songs={songs} />;
      case AppView.ANALYTICS:
        return <AnalyticsManagement members={members} attendanceData={attendanceData} transactions={transactions} />;
      case AppView.AI_ASSISTANT:
        return <AIAssistant />;
      default:
        return <Dashboard memberCount={members.length} scheduleCount={scheduleItems.length} />;
    }
  }, [currentView, members, scheduleItems, attendanceData, transactions, songs, handleSuggestSongs]);

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {content}
    </Layout>
  );
};

export default App;
