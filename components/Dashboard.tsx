import React, { useMemo, useState } from 'react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Wallet,
  Library,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  Copy,
  CheckCircle2,
  RefreshCw,
  CalendarDays,
  Music,
  ListTodo,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useMemberStore, useEventStore, useFinanceStore, useLibraryStore, useAuthStore } from '../store';
import { AppView } from '../types';
import { getOrdoForMonth } from '../services/ordoService';

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_LABELS_VI: Record<number, string> = {
  1: 'T1', 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6',
  7: 'T7', 8: 'T8', 9: 'T9', 10: 'T10', 11: 'T11', 12: 'T12',
};

function buildCalendarGrid(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: { day: number; inMonth: boolean }[] = [];
  for (let i = 0; i < startDay; i++) cells.push({ day: 0, inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true });
  while (cells.length % 7 !== 0) cells.push({ day: 0, inMonth: false });
  return cells;
}

const VESTMENT_DOT: Record<string, string> = {
  WHITE: '#f8fafc', RED: '#f87171', GREEN: '#86efac',
  VIOLET: '#c4b5fd', GOLD: '#fcd34d', ROSE: '#fb7185',
};

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const fullSqlCode = `-- COPY VÀ CHẠY TRONG SUPABASE SQL EDITOR
CREATE TABLE IF NOT EXISTS members (id TEXT PRIMARY KEY, choir_id TEXT, saint_name TEXT, name TEXT NOT NULL, phone TEXT, gender TEXT, role TEXT, grade TEXT, birth_year TEXT, avatar TEXT, join_date DATE, status TEXT);
CREATE TABLE IF NOT EXISTS schedule_events (id TEXT PRIMARY KEY, choir_id TEXT, date DATE NOT NULL, time TIME, mass_name TEXT, type TEXT, liturgical_color TEXT, location TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS songs (id TEXT PRIMARY KEY, choir_id TEXT, title TEXT NOT NULL, composer TEXT, category TEXT, liturgical_seasons JSONB, is_familiar BOOLEAN DEFAULT FALSE, experience_notes TEXT);
CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, choir_id TEXT, date DATE NOT NULL, description TEXT, amount NUMERIC, type TEXT, category TEXT);
CREATE TABLE IF NOT EXISTS attendance (id BIGSERIAL PRIMARY KEY, date DATE NOT NULL, choir_id TEXT, member_id TEXT, status TEXT, UNIQUE(date, member_id));
ALTER TABLE members REPLICA IDENTITY FULL;
ALTER TABLE schedule_events REPLICA IDENTITY FULL;
ALTER TABLE songs REPLICA IDENTITY FULL;
ALTER TABLE transactions REPLICA IDENTITY FULL;
ALTER TABLE attendance REPLICA IDENTITY FULL;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;`;

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { members, attendanceData, isCloudMode, realtimeStatus } = useMemberStore();
  const { events } = useEventStore();
  const { transactions } = useFinanceStore();
  const { songs } = useLibraryStore();
  const { user } = useAuthStore();
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  const balance = useMemo(() => {
    return transactions.reduce((sum, t) => (t.type === 'IN' ? sum + t.amount : sum - t.amount), 0);
  }, [transactions]);

  const avgAttendance = useMemo(() => {
    if (attendanceData.length === 0 || !members.length) return 0;
    const totalPresents = attendanceData.reduce(
      (sum, d) => sum + d.records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length,
      0
    );
    return Math.round((totalPresents / (attendanceData.length * members.length)) * 100);
  }, [attendanceData, members.length]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  const calendarGrid = useMemo(
    () => buildCalendarGrid(calendarYear, calendarMonth),
    [calendarYear, calendarMonth]
  );

  const ordoMonth = useMemo(
    () => getOrdoForMonth(calendarMonth as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12, calendarYear),
    [calendarMonth, calendarYear]
  );

  const specialDates = useMemo(() => {
    const map: Record<string, string> = {};
    ordoMonth.forEach((e) => {
      if (e.liturgicalColor) map[e.date] = e.liturgicalColor;
    });
    return map;
  }, [ordoMonth]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const attendanceTrend = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = now.getMonth() === 1
      ? `${now.getFullYear() - 1}-12`
      : `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;
    const thisTotal = attendanceData
      .filter((d) => d.date.startsWith(thisMonth))
      .reduce((s, d) => s + d.records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length, 0);
    const lastTotal = attendanceData
      .filter((d) => d.date.startsWith(lastMonth))
      .reduce((s, d) => s + d.records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length, 0);
    if (lastTotal === 0) return thisTotal > 0 ? 1 : 0;
    return Math.round(((thisTotal - lastTotal) / lastTotal) * 100);
  }, [attendanceData]);

  const copySQL = () => {
    navigator.clipboard.writeText(fullSqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goPrevMonth = () => {
    if (calendarMonth === 1) { setCalendarMonth(12); setCalendarYear((y) => y - 1); }
    else setCalendarMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (calendarMonth === 12) { setCalendarMonth(1); setCalendarYear((y) => y + 1); }
    else setCalendarMonth((m) => m + 1);
  };

  const formatMonthDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const userName = (user?.name === 'Ban Điều Hành' ? 'Ban Điều Hành' : user?.name?.split(' ')[0]) || 'Bạn';

  return (
    <div className="w-full animate-fade-in">
      {/* ─── Hero ─── */}
      <section className="dash-welcome flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5 px-5 sm:px-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">Xin chào {userName}</h2>
          <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
            Tổng quan Ban Điều Hành — ca viên, quỹ, thư viện, lịch phụng vụ.
          </p>
          <Button
            onClick={() => onNavigate(AppView.LITURGY)}
            className="mt-3 bg-[var(--foreground)] hover:opacity-90 text-white border-0 text-sm"
          >
            Xem lịch phụng vụ <ChevronRight size={16} />
          </Button>
        </div>
        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/50 dark:bg-white/10 items-center justify-center shrink-0">
          <Music size={36} className="text-[var(--primary)]" />
        </div>
      </section>

      {/* ─── Offline banner ─── */}
      {(!isCloudMode || realtimeStatus === 'ERROR') && (
        <section className="mt-4">
          <Card variant="glass" className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--primary-muted)]">
                <RefreshCw size={20} className="text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Chạy nội bộ (Offline)</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Dữ liệu lưu tại máy. Kết nối Cloud để đồng bộ.</p>
              </div>
            </div>
            <Button onClick={() => setShowSetupGuide(true)} size="sm">Hướng dẫn Cloud</Button>
          </Card>
        </section>
      )}

      {/* ─── Modal Cloud ─── */}
      {showSetupGuide && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto liquid-glass rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Cấu hình Cloud</h3>
              <button
                onClick={() => setShowSetupGuide(false)}
                className="p-2 rounded-xl hover:bg-[var(--background-muted)] min-h-[44px] min-w-[44px] transition-colors text-[var(--foreground-muted)]"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] mb-3">Sao chép mã SQL vào Supabase SQL Editor rồi chạy.</p>
            <pre className="p-4 rounded-xl text-xs overflow-x-auto max-h-48 overflow-y-auto font-mono bg-[var(--background-muted)] text-[var(--foreground)] border border-[var(--border)]">
              {fullSqlCode}
            </pre>
            <div className="mt-4 flex gap-3 flex-wrap">
              <Button onClick={copySQL} className="flex items-center gap-2">
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()} className="flex items-center gap-2">
                <RefreshCw size={16} /> Tải lại
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 4 chỉ số ─── */}
      <section className="mt-6">
        <h3 className="section-label mb-3">Chỉ số nhanh</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button type="button" onClick={() => onNavigate(AppView.MEMBERS)} className="dash-summary-card teal text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0"><Users size={20} /></div>
              <div className="min-w-0">
                <p className="text-xl font-bold tabular-nums truncate">{members.length}</p>
                <p className="text-xs font-semibold opacity-90">Ca viên</p>
              </div>
            </div>
          </button>
          <button type="button" onClick={() => onNavigate(AppView.MEMBERS)} className="dash-summary-card gray text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--background-elevated)] flex items-center justify-center shrink-0 text-[var(--foreground-muted)]"><Calendar size={20} /></div>
              <div className="min-w-0">
                <p className="text-xl font-bold tabular-nums text-[var(--foreground)]">{avgAttendance}%</p>
                <p className="text-xs font-semibold opacity-90">Điểm danh TB</p>
              </div>
            </div>
            <p className={`text-[10px] mt-1.5 flex items-center gap-0.5 ${attendanceTrend >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
              {attendanceTrend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {attendanceTrend >= 0 ? '+' : ''}{attendanceTrend}% tháng trước
            </p>
          </button>
          <button type="button" onClick={() => onNavigate(AppView.FINANCE)} className="dash-summary-card pink text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0"><Wallet size={20} /></div>
              <div className="min-w-0">
                <p className="text-lg font-bold tabular-nums truncate">
                  {balance >= 0 ? balance.toLocaleString('vi-VN') : `-${Math.abs(balance).toLocaleString('vi-VN')}`}đ
                </p>
                <p className="text-xs font-semibold opacity-90">Số dư quỹ</p>
              </div>
            </div>
          </button>
          <button type="button" onClick={() => onNavigate(AppView.LIBRARY)} className="dash-summary-card amber text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0"><Library size={20} /></div>
              <div className="min-w-0">
                <p className="text-xl font-bold tabular-nums text-[var(--foreground)]">{songs.length}</p>
                <p className="text-xs font-semibold opacity-90">Thánh ca</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* ─── Lịch tháng + Công tác sắp tới ─── */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lịch phụng vụ mini */}
        <div className="dash-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-[var(--foreground-muted)]" />
              <h3 className="dash-card-title text-sm">{MONTH_LABELS_VI[calendarMonth]} {calendarYear}</h3>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={goPrevMonth} className="p-1.5 hover:bg-[var(--background-muted)] rounded-lg transition-colors min-h-[36px] min-w-[36px]" aria-label="Tháng trước">
                <ChevronLeft size={16} className="text-[var(--foreground-muted)]" />
              </button>
              <button onClick={goNextMonth} className="p-1.5 hover:bg-[var(--background-muted)] rounded-lg transition-colors min-h-[36px] min-w-[36px]" aria-label="Tháng sau">
                <ChevronRight size={16} className="text-[var(--foreground-muted)]" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px text-center">
            {WEEKDAY_LABELS.map((w) => (
              <div key={w} className="text-[10px] font-semibold text-[var(--foreground-muted)] py-0.5 uppercase">{w}</div>
            ))}
            {calendarGrid.map((cell, i) => {
              if (!cell.inMonth) return <div key={i} className="aspect-square" />;
              const dateKey = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
              const isToday = dateKey === todayStr;
              const vestmentColor = specialDates[dateKey];
              const dotColor = vestmentColor ? VESTMENT_DOT[vestmentColor] : null;
              const hasColor = !!dotColor && !isToday;
              return (
                <div key={i} className="aspect-square flex items-center justify-center p-0.5">
                  <div
                    className={`w-full h-full rounded-lg flex items-center justify-center text-[10px] font-semibold transition-all ${
                      isToday ? 'bg-[var(--foreground)] text-[var(--background)] shadow-sm' : hasColor ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)] hover:bg-[var(--background-muted)]'
                    }`}
                    style={hasColor ? { backgroundColor: dotColor, opacity: 0.9 } : undefined}
                  >
                    {cell.day}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => onNavigate(AppView.LITURGY)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-muted)] rounded-lg transition-colors"
          >
            <CalendarDays size={14} /> Xem lịch phụng vụ
          </button>
        </div>

        {/* Công tác sắp tới */}
        <div className="dash-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListTodo size={18} className="text-[var(--foreground-muted)]" />
              <h3 className="dash-card-title">Công tác sắp tới</h3>
            </div>
            <button
              onClick={() => onNavigate(AppView.LITURGY)}
              className="text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-0.5"
            >
              Xem tất cả <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-0.5">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[var(--foreground-muted)] py-5 text-center">Chưa có sự kiện. Thêm từ trang Phụng vụ.</p>
            ) : (
              upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => onNavigate(AppView.LITURGY)}
                  className="dash-list-item w-full rounded-xl py-2.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--background-muted)] flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-[var(--foreground-muted)]" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{event.massName}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{formatMonthDay(event.date)} · {event.time || '—'}</p>
                  </div>
                  <ChevronRight size={14} className="text-[var(--foreground-muted)] shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── Điểm danh + Truy cập nhanh ─── */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="dash-card p-4 sm:p-5 flex flex-col items-center">
          <h3 className="dash-card-title text-sm mb-3 w-full text-left">Điểm danh đạt</h3>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-[var(--background-muted)]" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[var(--primary)]" stroke="currentColor" strokeWidth="2.5" strokeDasharray={`${avgAttendance}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-lg font-bold text-[var(--foreground)]">{avgAttendance}%</span>
          </div>
          <p className={`text-xs mt-2 flex items-center gap-1 ${attendanceTrend >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
            {attendanceTrend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {attendanceTrend >= 0 ? '+' : ''}{attendanceTrend}% so tháng trước
          </p>
        </div>

        <div className="dash-card lg:col-span-2 p-4 sm:p-5">
          <h3 className="dash-card-title text-sm mb-4">Truy cập nhanh</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Ca viên', icon: Users, view: AppView.MEMBERS, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary-muted)]' },
              { label: 'Ngân quỹ', icon: Wallet, view: AppView.FINANCE, color: 'text-pink-500', bg: 'bg-pink-500/10' },
              { label: 'Thư viện', icon: Music, view: AppView.LIBRARY, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Trợ lý AI', icon: Sparkles, view: AppView.ASSISTANT, color: 'text-violet-500', bg: 'bg-violet-500/10' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.view)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--background-muted)] transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} />
                </div>
                <span className="text-xs font-semibold text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
