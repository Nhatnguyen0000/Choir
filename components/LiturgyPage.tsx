import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOrdoForMonth } from '../services/ordoService';
import type { OrdoEvent, LiturgicalColor, LiturgicalRank } from '../types';

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const YEAR = 2026;

const MONTH_LABELS_VI: Record<Month, string> = {
  1: 'Tháng Một',
  2: 'Tháng Hai',
  3: 'Tháng Ba',
  4: 'Tháng Tư',
  5: 'Tháng Năm',
  6: 'Tháng Sáu',
  7: 'Tháng Bảy',
  8: 'Tháng Tám',
  9: 'Tháng Chín',
  10: 'Tháng Mười',
  11: 'Tháng Mười Một',
  12: 'Tháng Mười Hai',
};

const WEEKDAY_LABELS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const RANK_LABELS_VI: Record<LiturgicalRank, string> = {
  SOLEMNITY: 'Lễ Trọng',
  FEAST: 'Lễ Kính',
  SUNDAY: 'Chúa Nhật',
  OPTIONAL: 'Ngày thường',
};

const COLOR_LABELS_VI: Record<LiturgicalColor, string> = {
  WHITE: 'Trắng',
  RED: 'Đỏ',
  GREEN: 'Xanh lá',
  VIOLET: 'Tím',
  GOLD: 'Vàng',
  ROSE: 'Hồng',
};

/** Màu áo lễ (vestment) — dùng cho chấm tròn (viền nhạt để thấy trên nền sáng) */
const VESTMENT_COLORS: Record<LiturgicalColor, string> = {
  WHITE: '#e2e8f0',
  RED: '#dc2626',
  GREEN: '#059669',
  VIOLET: '#7c3aed',
  GOLD: '#f59e0b',
  ROSE: '#ec4899',
};

/** Ngày theo giờ địa phương YYYY-MM-DD — nhất quán với ordoService */
const toDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const pad2 = (n: number) => n.toString().padStart(2, '0');

/** Lưới tháng: luôn 6 tuần (42 ô) để bố cục nhất quán, Chủ Nhật = cột 0 */
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
    ordoForMonth.forEach((e) => {
      map[e.date] = e;
    });
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
    <div className="h-full min-h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/80 pb-20 lg:pb-0">
      {/* Header */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="flex items-baseline gap-2 sm:gap-4 min-w-0">
          <div className="relative">
            <h1 className="sacred-title text-lg sm:text-xl md:text-2xl font-bold text-slate-900 italic">Phụng vụ</h1>
            <span className="absolute left-0 -bottom-1 w-10 sm:w-12 h-1 bg-amber-400/80 rounded-full" aria-hidden />
          </div>
          <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:block truncate">
            Lịch Công giáo {YEAR} — Năm A
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden">
            <button onClick={goPrevMonth} className="p-2 sm:p-2.5 hover:bg-white/80 transition-colors touch-manipulation" aria-label="Tháng trước">
              <ChevronLeft size={18} className="sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <span className="text-xs sm:text-sm font-bold text-slate-900 min-w-[100px] sm:min-w-[130px] text-center px-1 sm:px-2">
              {MONTH_LABELS_VI[selectedMonth]} {YEAR}
            </span>
            <button onClick={goNextMonth} className="p-2 sm:p-2.5 hover:bg-white/80 transition-colors touch-manipulation" aria-label="Tháng sau">
              <ChevronRight size={18} className="sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>
          <button
            onClick={() => setSelectedDateKey(todayKey.startsWith(`${YEAR}-`) ? todayKey : `${YEAR}-01-01`)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-md touch-manipulation"
            title="Về ngày hôm nay"
          >
            <CalendarDays size={16} className="sm:w-[18px] sm:h-[18px]" /> Hôm nay
          </button>
        </div>
      </div>
      <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1.5 px-3 sm:px-4 sm:hidden">
        Lịch Công giáo {YEAR} — Năm A
      </p>

      {/* Nội dung chính */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 sm:gap-5 p-3 sm:p-4 md:p-6 overflow-auto">
        {/* Lịch tháng - card */}
        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-slate-100 border-b border-slate-200/80 shrink-0">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={w} className="bg-slate-50/80 text-center text-xs font-bold uppercase tracking-widest text-slate-500 py-3">
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

              return (
                <button
                  key={key}
                  ref={isSelected ? selectedDayRef : undefined}
                  onClick={() => setSelectedDateKey(key)}
                  className={`rounded-2xl border text-left p-2 sm:p-2.5 transition-all flex flex-col min-h-0 ${
                    inMonth ? 'bg-white' : 'bg-slate-50/70'
                  } ${
                    isSelected
                      ? 'border-slate-800 shadow-lg ring-2 ring-amber-400/50'
                      : isToday
                        ? 'border-amber-400 shadow-md'
                        : 'border-slate-200/80 hover:shadow-md hover:border-slate-300'
                  } ${
                    inMonth && isSolemnity ? 'bg-amber-50/70 border-amber-200/80' : ''
                  } ${
                    inMonth && isFeast ? 'bg-sky-50/60 border-sky-200/60' : ''
                  } ${
                    inMonth && isSunday && !isSolemnity && !isFeast ? 'bg-slate-50/80 border-slate-200/70' : ''
                  }`}
                  title={[key, title, rankLabel, colorLabel].filter(Boolean).join(' • ')}
                >
                  <div className="flex items-center justify-between gap-0.5 shrink-0">
                    <span className={`text-xs sm:text-sm font-black ${inMonth ? 'text-slate-900' : 'text-slate-400'}`}>
                      {date.getDate()}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {vestmentColor && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0 border border-slate-300/70 shadow-sm"
                          style={{ backgroundColor: vestmentColor }}
                          title={`Màu áo lễ: ${colorLabel}`}
                        />
                      )}
                      {isToday && (
                        <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded-full">
                          Hôm nay
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 overflow-hidden flex-1 min-h-0">
                    <p className={`text-[10px] sm:text-xs font-bold leading-tight truncate ${title ? 'text-slate-700' : 'text-slate-400'}`}>
                      {title || (inMonth ? 'Thường' : '')}
                    </p>
                    {rankLabel && (
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">{rankLabel}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          </div>
        </div>

        {/* Chi tiết ngày */}
        <div className="shrink-0 w-full lg:w-[22rem] xl:w-96 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-fit">
          <div className="border-l-4 border-l-amber-400 bg-slate-50/50 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Chi tiết ngày</p>
            <p className="text-sm font-bold text-slate-900">{selectedDateKey}</p>
          </div>
          <div className="p-5">
          {!selectedEvent ? (
            <p className="text-xs text-slate-500">Chọn một ngày trên lịch.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-base font-bold text-slate-900 leading-snug">{selectedEvent.massName}</p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-200/70 px-2.5 py-1 rounded-full">
                  {RANK_LABELS_VI[selectedEvent.rank]}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-200/70 px-2.5 py-1 rounded-full">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-slate-300/70 shadow-sm"
                    style={{ backgroundColor: VESTMENT_COLORS[selectedEvent.liturgicalColor] }}
                  />
                  Màu áo lễ: {COLOR_LABELS_VI[selectedEvent.liturgicalColor]}
                </span>
                {selectedEvent.note && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
                    {selectedEvent.note}
                  </span>
                )}
                {selectedEvent.isObligatory && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
                    Lễ buộc
                  </span>
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
