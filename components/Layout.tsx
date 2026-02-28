import { AppView } from '../types';
import {
  LayoutDashboard,
  Users,
  Bell,
  Settings,
  Calendar,
  ChevronDown,
  CalendarDays,
  Coins,
  Library,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { useTheme } from './ThemeProvider';
import { getOrdoForMonth } from '../services/ordoService';
import { getSeasonColors } from '../lib/liturgicalSeason';
import Logo from './Logo';
import React, { useState, useMemo } from 'react';

const HEADER_NAV = [
  { id: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Tổng quan' },
  { id: AppView.LITURGY, icon: CalendarDays, label: 'Phụng vụ' },
  { id: AppView.MEMBERS, icon: Users, label: 'Ca viên' },
  { id: AppView.FINANCE, icon: Coins, label: 'Quỹ' },
  { id: AppView.LIBRARY, icon: Library, label: 'Thư viện' },
  { id: AppView.ASSISTANT, icon: Sparkles, label: 'AI' },
];

const PAGE_TITLES: Record<AppView, string> = {
  [AppView.DASHBOARD]: 'Tổng quan',
  [AppView.LITURGY]: 'Phụng vụ',
  [AppView.MEMBERS]: 'Ca viên',
  [AppView.FINANCE]: 'Ngân quỹ',
  [AppView.LIBRARY]: 'Thư viện',
  [AppView.ASSISTANT]: 'Trợ lý AI',
};

const Layout: React.FC<{
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
}> = ({ currentView, setCurrentView, children }) => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = useMemo(() => {
    const now = new Date();
    const m = now.getMonth() + 1;
    const y = now.getFullYear();
    const ordo = getOrdoForMonth(m as any, y);
    const todayStr = `${y}-${String(m).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return ordo
      .filter((e) => e.date >= todayStr && e.rank !== 'OPTIONAL')
      .slice(0, 5)
      .map((e) => ({ date: e.date, title: e.massName, rank: e.rank }));
  }, []);

  const dateRangeLabel = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const fmt = (x: Date) => `${x.getDate()}/${x.getMonth() + 1}`;
    return `${fmt(first)} - ${fmt(last)}`;
  }, []);

  const seasonColors = useMemo(() => getSeasonColors(new Date()), []);

  return (
    <div
      className="min-h-screen bg-[var(--background)]"
      style={{
        ['--season-primary' as string]: seasonColors.primary,
        ['--season-primary-hover' as string]: seasonColors.primaryHover,
        ['--season-primary-muted' as string]: seasonColors.primaryMuted,
      } as React.CSSProperties}
    >
      {/* Header bo tròn — màu theo mùa phụng vụ */}
      <header className="header-2026 header-rounded sticky top-0 z-50 safe-area-pt">
        <div className="header-inner">
          <div className="header-brand">
            <Logo size="sm" iconOnly={false} accentColor={seasonColors.primary} />
          </div>

          {/* Nav — tích hợp trong header */}
          <nav className="header-nav" role="navigation" aria-label="Điều hướng chính">
            {HEADER_NAV.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentView(item.id)}
                  className={`header-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="header-nav-label">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button type="button" className="header-action-btn hidden sm:flex items-center gap-2" title="Khoảng thời gian">
              <Calendar size={16} />
              <span className="header-date-label">{dateRangeLabel}</span>
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="header-icon-btn"
              aria-label={theme === 'dark' ? 'Sáng' : 'Tối'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              type="button"
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="header-icon-btn relative"
              aria-label="Thông báo"
            >
              <Bell size={20} />
              {notifications.length > 0 && <span className="header-dot" />}
            </button>
            <button
              type="button"
              onClick={() => setShowProfile(!showProfile)}
              className="header-avatar"
              aria-label="Tài khoản"
            >
              {(user?.name || 'Ban Điều Hành').slice(0, 2).toUpperCase()}
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        {showNotifications && (
          <div className="header-dropdown header-dropdown-notif">
            <div className="header-dropdown-head">Lịch phụng vụ sắp tới</div>
            <div className="header-dropdown-body">
              {notifications.map((n, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setCurrentView(AppView.LITURGY); setShowNotifications(false); }}
                  className="header-dropdown-row"
                >
                  <span className={`header-dot-row ${n.rank === 'SOLEMNITY' ? 'bg-[var(--primary)]' : n.rank === 'FEAST' ? 'bg-[var(--secondary)]' : 'bg-[var(--success)]'}`} />
                  <div className="min-w-0 text-left">
                    <p className="header-dropdown-title">{n.title}</p>
                    <p className="header-dropdown-meta">{n.date}</p>
                  </div>
                </button>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-[var(--foreground-muted)] text-center py-8">Không có sự kiện sắp tới</p>
              )}
            </div>
          </div>
        )}
        {showProfile && (
          <div className="header-dropdown header-dropdown-profile">
            <div className="header-dropdown-head">
              <p className="font-semibold text-[var(--foreground)] truncate">{user?.name || 'Ban Điều Hành'}</p>
              <p className="text-xs text-[var(--foreground-muted)]">{user?.role || 'Ban Điều Hành'}</p>
            </div>
            <button type="button" className="header-dropdown-row w-full flex items-center gap-2">
              <Settings size={18} /> Cài đặt
            </button>
          </div>
        )}
      </header>

      <main className="main-2026">
        {children}
      </main>

      {(showProfile || showNotifications) && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
          onClick={() => { setShowProfile(false); setShowNotifications(false); }}
          aria-hidden
        />
      )}
    </div>
  );
};

export default Layout;
