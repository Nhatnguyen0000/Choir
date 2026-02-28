import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOrdoForMonth } from '../services/ordoService';
import type { OrdoEvent, LiturgicalColor, LiturgicalRank } from '../types';

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const YEAR = 2026;

const MONTH_LABELS_VI: Record<Month, string> = {
  1: 'Tháng Một', 2: 'Tháng Hai', 3: 'Tháng Ba', 4: 'Tháng Tư',
  5: 'Tháng Năm', 6: 'Tháng Sáu', 7: 'Tháng Bảy', 8: 'Tháng Tám',
  9: 'Tháng Chín', 10: 'Tháng Mười', 11: 'Tháng Mười Một', 12: 'Tháng Mười Hai',
};

const WEEKDAY_LABELS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const RANK_LABELS_VI: Record<LiturgicalRank, string> = {
  SOLEMNITY: 'Lễ Trọng', FEAST: 'Lễ Kính', SUNDAY: 'Chúa Nhật', OPTIONAL: 'Ngày thường',
};

const COLOR_LABELS_VI: Record<LiturgicalColor, string> = {
  WHITE: 'Trắng', RED: 'Đỏ', GREEN: 'Xanh lá', VIOLET: 'Tím', GOLD: 'Vàng', ROSE: 'Hồng',
};

const VESTMENT_COLORS: Record<LiturgicalColor, string> = {
  WHITE: '#f8fafc', RED: '#f87171', GREEN: '#86efac', VIOLET: '#c4b5fd', GOLD: '#fcd34d', ROSE: '#fb7185',
};

const toDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const pad2 = (n: number) => n.toString().padStart(2, '0');

const buildMonthGrid = (year: number, month: Month): Array<{ date: Date; inMonth: boolean }> => {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ date: Date; inMonth: boolean }> = [];
  for (let i = 0; i < startDay; i++) {
    const d = new Date(year, month - 1, 1 - (startDay - i));
    cells.push({ date: d, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month - 1, day), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]?.date ?? new Date(year, month - 1, daysInMonth);
    const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    cells.push({ date: next, inMonth: false });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1]?.date!;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }
  return cells;
};

const LiturgyPage: React.FC = () => {
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const defaultSelected = todayKey.startsWith(`${YEAR}-`) ? todayKey : `${YEAR}-01-01`;
  const [selectedDateKey, setSelectedDateKey] = useState<string>(defaultSelected);

  const selectedMonth = useMemo<Month>(() => {
    const m = Number(selectedDateKey.split('-')[1] ?? '1');
    return (Math.min(12, Math.max(1, m)) as Month) || 1;
  }, [selectedDateKey]);

  const ordoForMonth = useMemo(() => getOrdoForMonth(selectedMonth, YEAR), [selectedMonth]);
  const ordoByDate = useMemo(() => {
    const map: Record<string, OrdoEvent> = {};
    ordoForMonth.forEach((e) => { map[e.date] = e; });
    return map;
  }, [ordoForMonth]);

  const monthGrid = useMemo(() => buildMonthGrid(YEAR, selectedMonth), [selectedMonth]);
  const selectedEvent = ordoByDate[selectedDateKey];
  const selectedDayRef = useRef<HTMLButtonElement | null>(null);

  const goPrevMonth = () => {
    const m = selectedMonth === 1 ? 12 : ((selectedMonth - 1) as Month);
    setSelectedDateKey(`${YEAR}-${pad2(m)}-01`);
  };
  const goNextMonth = () => {
    const m = selectedMonth === 12 ? 1 : ((selectedMonth + 1) as Month);
    setSelectedDateKey(`${YEAR}-${pad2(m)}-01`);
  };

  useEffect(() => {
    selectedDayRef.current?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
  }, [selectedDateKey, selectedMonth]);

  return (
    <div className="h-full flex flex-col overflow-hidden animate-fade-in">
      <div className="page-header-2026 shrink-0 mb-4">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Phụng vụ</h1>
            <p className="page-subtitle">Lịch Công giáo {YEAR} — Năm A</p>
          </div>
          <div className="page-actions-2026 flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--background-muted)] overflow-hidden shadow-[var(--shadow-xs)]">
            <button type="button" onClick={goPrevMonth} className="p-2.5 rounded-l-xl hover:bg-[var(--background-elevated)] transition-colors min-h-[44px]" aria-label="Tháng trước">
              <ChevronLeft size={18} className="text-[var(--foreground-muted)]" />
            </button>
            <span className="text-sm font-semibold min-w-[100px] text-center px-3 text-[var(--foreground)]">
              {MONTH_LABELS_VI[selectedMonth]} {YEAR}
            </span>
            <button type="button" onClick={goNextMonth} className="p-2.5 rounded-r-xl hover:bg-[var(--background-elevated)] transition-colors min-h-[44px]" aria-label="Tháng sau">
              <ChevronRight size={18} className="text-[var(--foreground-muted)]" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDateKey(todayKey.startsWith(`${YEAR}-`) ? todayKey : `${YEAR}-01-01`)}
            className="btn-primary flex items-center gap-2"
            title="Về ngày hôm nay"
          >
            <CalendarDays size={16} /> Hôm nay
          </button>
        </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-auto">
        <div className="glass-card flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-[var(--border)] shrink-0">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={w} className="bg-[var(--background-muted)] text-center text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] py-3">
                {i === 0 ? 'CN' : `T${i + 1}`}
              </div>
            ))}
          </div>
          <div className="flex-1 p-2 sm:p-3 md:p-4 min-h-[200px] sm:min-h-[240px]">
            <div className="grid grid-cols-7 grid-rows-6 gap-1.5 sm:gap-2 h-full">
              {monthGrid.map(({ date, inMonth }) => {
                const key = toDateKey(date);
                const isToday = key === todayKey;
                const isSelected = key === selectedDateKey;
                const event = ordoByDate[key];
                const title = event?.massName ?? '';
                const rank = event?.rank;
                const rankLabel = rank ? RANK_LABELS_VI[rank] : '';
                const colorLabel = event?.liturgicalColor ? COLOR_LABELS_VI[event.liturgicalColor] : '';
                const vestmentColor = event?.liturgicalColor ? VESTMENT_COLORS[event.liturgicalColor] : null;
                const isSunday = rank === 'SUNDAY';
                const isSolemnity = rank === 'SOLEMNITY';
                const isFeast = rank === 'FEAST';

                let cellBg = inMonth ? 'bg-[var(--background-elevated)]' : 'bg-[var(--background-muted)]/70';
                if (inMonth && vestmentColor && event?.liturgicalColor !== 'WHITE') {
                  cellBg = '';
                } else if (inMonth && isSolemnity) {
                  cellBg = 'bg-[var(--warning-bg)]/70';
                } else if (inMonth && isFeast) {
                  cellBg = 'bg-[var(--primary-muted)]/60';
                } else if (inMonth && isSunday && !isSolemnity && !isFeast) {
                  cellBg = 'bg-[var(--background-muted)]/80';
                }

                return (
                  <button
                    type="button"
                    key={key}
                    ref={isSelected ? selectedDayRef : undefined}
                    onClick={() => setSelectedDateKey(key)}
                    className={`rounded-xl border text-left p-2 sm:p-2.5 transition-all duration-200 flex flex-col min-h-0 hover:shadow-[var(--shadow-sm)] ${
                      isSelected
                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 bg-[var(--primary-muted)] shadow-[var(--shadow-xs)]'
                        : isToday
                        ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] shadow-[var(--shadow-xs)]'
                        : `border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]/50 ${cellBg}`
                    }`}
                    style={
                      inMonth && vestmentColor && event?.liturgicalColor !== 'WHITE' && !isSelected && !isToday
                        ? { backgroundColor: vestmentColor, opacity: 0.85, borderColor: 'transparent' }
                        : undefined
                    }
                    title={[key, title, rankLabel, colorLabel].filter(Boolean).join(' · ')}
                  >
                    <div className="flex items-center justify-between gap-0.5 shrink-0">
                      <span className={`text-xs sm:text-sm font-bold ${inMonth && !isToday ? 'text-[var(--foreground)]' : isToday ? 'text-[var(--background)]' : 'text-[var(--foreground-muted)]'}`}>
                        {date.getDate()}
                      </span>
                      {isToday && (
                        <span className="text-[10px] sm:text-[9px] font-bold uppercase text-[var(--foreground)] bg-[var(--background)]/90 px-1.5 py-0.5 rounded-full">
                          Nay
                        </span>
                      )}
                    </div>
                    <div className="mt-1 overflow-hidden flex-1 min-h-0">
                      <p className={`text-[10px] sm:text-xs font-semibold leading-tight truncate ${title ? (isToday ? 'text-[var(--background)]/90' : 'text-[var(--foreground)]') : 'text-[var(--foreground-muted)]'}`}>
                        {title || (inMonth ? 'Thường' : '')}
                      </p>
                      {rankLabel && (
                        <p className={`text-[10px] sm:text-[9px] font-semibold uppercase tracking-wider truncate ${isToday ? 'text-[var(--background)]/70' : 'text-[var(--foreground-muted)]'}`}>{rankLabel}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass-card shrink-0 w-full lg:w-[22rem] xl:w-96 rounded-2xl overflow-hidden h-fit">
          <div className="border-l-4 border-l-[var(--foreground)] bg-[var(--background-muted)] px-5 py-4">
            <p className="section-label mb-0.5">Chi tiết ngày</p>
            <p className="text-sm font-bold text-[var(--foreground)]">{selectedDateKey}</p>
          </div>
          <div className="p-6">
            {!selectedEvent ? (
              <p className="text-sm text-[var(--foreground-muted)]">Chọn một ngày trên lịch.</p>
            ) : (
              <div className="space-y-5">
                <p className="text-base font-bold text-[var(--foreground)] leading-snug sacred-title">{selectedEvent.massName}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] bg-[var(--background-muted)] px-3 py-1.5 rounded-full border border-[var(--border)]">
                    {RANK_LABELS_VI[selectedEvent.rank]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] bg-[var(--background-muted)] px-3 py-1.5 rounded-full border border-[var(--border)]">
                    <span className="w-3 h-3 rounded-full border border-[var(--border)]" style={{ backgroundColor: VESTMENT_COLORS[selectedEvent.liturgicalColor] }} />
                    {COLOR_LABELS_VI[selectedEvent.liturgicalColor]}
                  </span>
                  {selectedEvent.note && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] bg-[var(--background-muted)] px-3 py-1.5 rounded-full">
                      {selectedEvent.note}
                    </span>
                  )}
                  {selectedEvent.isObligatory && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--warning)] bg-[var(--warning-bg)] px-3 py-1.5 rounded-full border border-[var(--warning)]/30">
                      Lễ buộc
                    </span>
                  )}
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[var(--error)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="section-label">Bậc lễ</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{RANK_LABELS_VI[selectedEvent.rank]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[var(--warning)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="section-label">Màu áo lễ</p>
                      <p className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                        {COLOR_LABELS_VI[selectedEvent.liturgicalColor]}
                        <span className="w-4 h-4 rounded-md border border-[var(--border)]" style={{ backgroundColor: VESTMENT_COLORS[selectedEvent.liturgicalColor] }} />
                      </p>
                    </div>
                  </div>
                  {selectedEvent.isObligatory && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[var(--primary)] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="section-label">Buộc</p>
                        <p className="text-sm font-semibold text-[var(--warning)]">Lễ buộc — Nghỉ việc xác</p>
                      </div>
                    </div>
                  )}
                  {selectedEvent.note && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[var(--secondary)] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="section-label">Ghi chú</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{selectedEvent.note}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiturgyPage;
