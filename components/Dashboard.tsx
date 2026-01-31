
import React, { useMemo } from 'react';
import { 
  Users, 
  Music, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  MapPin,
  ChevronRight,
  BookOpen,
  DollarSign,
  BarChart3,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useMemberStore, useEventStore, useFinanceStore, useLibraryStore } from '../store';
import { AppView } from '../types';
import Tooltip from './Tooltip';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { members, attendanceData } = useMemberStore();
  const { events } = useEventStore();
  const { transactions } = useFinanceStore();
  const { songs } = useLibraryStore();

  const balance = useMemo(() => {
    return transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0) - 
           transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const avgAttendance = useMemo(() => {
    return attendanceData.length > 0 
      ? Math.round((attendanceData.reduce((sum, d) => sum + (d.records.filter(r => r.status === 'PRESENT').length), 0) / (attendanceData.length * (members.length || 1))) * 100)
      : 0;
  }, [attendanceData, members.length]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events, today]);

  const activeMembers = useMemo(() => {
    return members.filter(m => m.status === 'ACTIVE').length;
  }, [members]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-emerald-500';
      case 'ABSENT': return 'bg-rose-500';
      case 'LATE': return 'bg-amber-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 relative z-10">
      
      {/* Header Section */}
      <div className="px-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="sacred-title text-3xl md:text-4xl font-black text-slate-900 italic leading-tight">
              Tổng Quan <span className="text-amberGold">Hệ Thống</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
              Giáo Xứ Bắc Hòa • Năm Phụng Vụ 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Hoạt Động</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        
        {/* Members Stat Card */}
        <Tooltip content="Xem danh sách ca viên" position="top">
          <div 
            onClick={() => onNavigate(AppView.MEMBERS)}
            className="glass-card rounded-2xl p-6 cursor-pointer group"
          >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-amberGold transition-colors">
              <Users size={22} className="text-white" />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-amberGold transition-colors" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ca Viên</p>
            <p className="text-3xl font-black text-slate-900">{members.length}</p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${(activeMembers / members.length) * 100 || 0}%` }}
                ></div>
              </div>
              <span className="text-[9px] font-black text-slate-500">{activeMembers} Hoạt Động</span>
            </div>
          </div>
          </div>
        </Tooltip>

        {/* Library Stat Card */}
        <Tooltip content="Xem thư viện thánh nhạc" position="top">
          <div 
            onClick={() => onNavigate(AppView.LIBRARY)}
            className="glass-card rounded-2xl p-6 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amberGold/10 rounded-xl flex items-center justify-center group-hover:bg-amberGold transition-colors">
              <Music size={22} className="text-amberGold group-hover:text-white transition-colors" />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-amberGold transition-colors" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thánh Nhạc</p>
            <p className="text-3xl font-black text-slate-900">{songs.length}</p>
            <div className="flex items-center gap-2 pt-2">
              <BookOpen size={12} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-500">Âm bản trong thư viện</span>
            </div>
          </div>
          </div>
        </Tooltip>

        {/* Attendance Stat Card */}
        <Tooltip content="Tỷ lệ hiện diện trung bình" position="top">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Target size={22} className="text-emerald-500" />
            </div>
            <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Tỷ lệ</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiện Diện</p>
            <p className="text-3xl font-black text-slate-900">{avgAttendance}%</p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${avgAttendance}%` }}
                ></div>
              </div>

            </div>
          </div>
          </div>
        </Tooltip>

        {/* Finance Stat Card */}
        <Tooltip content="Xem chi tiết ngân quỹ" position="top">
          <div 
            onClick={() => onNavigate(AppView.FINANCE)}
            className="glass-card rounded-2xl p-6 text-white cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <DollarSign size={22} className="text-emerald-400" />
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Ngân Quỹ</p>
            <p className="text-3xl font-black text-white">{balance.toLocaleString()}đ</p>
            <div className="flex items-center gap-3 pt-2 text-[9px]">
              <div className="flex items-center gap-1">
                <TrendingUp size={10} className="text-emerald-400" />
                <span className="font-black text-emerald-400">{totalIncome.toLocaleString()}đ</span>
              </div>
              <div className="w-px h-3 bg-white/20"></div>
              <div className="flex items-center gap-1">
                <TrendingUp size={10} className="text-rose-400 rotate-180" />
                <span className="font-black text-rose-400">{totalExpense.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
          </div>
        </Tooltip>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        
        {/* Left Column - Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Events Section */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-amberGold" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Lịch Công Tác Sắp Tới</h2>
              </div>
              <button 
                onClick={() => onNavigate(AppView.SCHEDULE)}
                className="text-[10px] font-black text-amberGold uppercase tracking-widest hover:text-amberGold/80 transition-colors"
              >
                Xem tất cả
              </button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
                <div 
                  key={event.id}
                  className="px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 group-hover:bg-amberGold transition-colors">
                      <span className="text-xl font-black leading-none">{new Date(event.date).getDate()}</span>
                      <span className="text-[8px] font-black uppercase opacity-80 mt-0.5">
                        Th{new Date(event.date).getMonth() + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="sacred-title text-base font-bold text-slate-900 italic mb-2">
                        {event.massName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[10px]">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock size={12} />
                          <span className="font-bold">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin size={12} />
                          <span className="font-bold">{event.location}</span>
                        </div>
                        {event.type === 'PRACTICE' && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md font-black uppercase tracking-widest text-[8px]">
                            Tập luyện
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-amberGold transition-colors shrink-0" />
                  </div>
                </div>
              )) : (
                <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                  <Calendar size={40} className="text-slate-200 mb-3" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Chưa có lịch công tác
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
              <Zap size={18} className="text-amberGold" />
              Thao Tác Nhanh
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Tooltip content="Quản lý lịch phụng vụ và công tác" position="top">
                <button
                  onClick={() => onNavigate(AppView.SCHEDULE)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-amberGold hover:bg-amberGold/5 transition-all text-left group w-full"
                >
                  <Calendar size={20} className="text-slate-400 group-hover:text-amberGold mb-2 transition-colors" />
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Lịch Công Tác</p>
                  <p className="text-[10px] text-slate-500 mt-1">Quản lý lịch phụng vụ</p>
                </button>
              </Tooltip>
              <Tooltip content="Quản lý sổ bộ và thông tin ca viên" position="top">
                <button
                  onClick={() => onNavigate(AppView.MEMBERS)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-amberGold hover:bg-amberGold/5 transition-all text-left group w-full"
                >
                  <Users size={20} className="text-slate-400 group-hover:text-amberGold mb-2 transition-colors" />
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Sổ Bộ Ca Viên</p>
                  <p className="text-[10px] text-slate-500 mt-1">Quản lý thành viên</p>
                </button>
              </Tooltip>
              <Tooltip content="Thư viện bài hát và âm bản" position="top">
                <button
                  onClick={() => onNavigate(AppView.LIBRARY)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-amberGold hover:bg-amberGold/5 transition-all text-left group w-full"
                >
                  <Music size={20} className="text-slate-400 group-hover:text-amberGold mb-2 transition-colors" />
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Thánh Nhạc</p>
                  <p className="text-[10px] text-slate-500 mt-1">Thư viện bài hát</p>
                </button>
              </Tooltip>
              <Tooltip content="Quản lý tài chính và ngân quỹ" position="top">
                <button
                  onClick={() => onNavigate(AppView.FINANCE)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-amberGold hover:bg-amberGold/5 transition-all text-left group w-full"
                >
                  <DollarSign size={20} className="text-slate-400 group-hover:text-amberGold mb-2 transition-colors" />
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Ngân Quỹ</p>
                  <p className="text-[10px] text-slate-500 mt-1">Quản lý tài chính</p>
                </button>
              </Tooltip>
            </div>
          </div>

        </div>

        {/* Right Column - Activity & Summary */}
        <div className="space-y-6">
          
          {/* Recent Transactions */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <BarChart3 size={18} className="text-emerald-500" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Giao Dịch Gần Đây</h2>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{transaction.description}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(transaction.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      transaction.type === 'IN' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {transaction.type === 'IN' ? (
                        <TrendingUp size={12} className="text-emerald-600" />
                      ) : (
                        <TrendingUp size={12} className="text-rose-600 rotate-180" />
                      )}
                      <span className="text-[10px] font-black">
                        {transaction.type === 'IN' ? '+' : '-'}{transaction.amount.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-8 flex flex-col items-center justify-center text-center">
                  <DollarSign size={32} className="text-slate-200 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Chưa có giao dịch
                  </p>
                </div>
              )}
            </div>
            
            {recentTransactions.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                <button 
                  onClick={() => onNavigate(AppView.FINANCE)}
                  className="w-full text-[10px] font-black text-amberGold uppercase tracking-widest hover:text-amberGold/80 transition-colors"
                >
                  Xem chi tiết ngân quỹ →
                </button>
              </div>
            )}
          </div>

          {/* Community Summary */}
          <div 
            className="glass-card rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%)',
              borderColor: 'rgba(251, 191, 36, 0.3)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amberGold rounded-xl flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cộng Đoàn</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Tổng thành viên</span>
                <span className="text-lg font-black text-slate-900">{members.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Đang hoạt động</span>
                <span className="text-lg font-black text-emerald-600">{activeMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Thư viện bài hát</span>
                <span className="text-lg font-black text-amberGold">{songs.length}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-amberGold/20">
              <button
                onClick={() => onNavigate(AppView.MEMBERS)}
                className="w-full py-2.5 bg-slate-900 hover:bg-amberGold text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Quản lý thành viên
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Note */}
      <div className="px-4 pt-4">
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-xs font-medium text-slate-600 italic leading-relaxed">
            "Hát khen Chúa, hỡi muôn dân trên địa cầu! Hãy phục vụ Chúa với niềm hân hoan." 
            <span className="text-slate-400 ml-2">(Tv 100,1-2)</span>
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-slate-300"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Hệ thống Điều hành Ca đoàn • Bắc Hòa 2027
            </span>
            <div className="w-8 h-px bg-slate-300"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
