
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Trash2, 
  Edit2,
  MapPin, 
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Clock,
  Sun,
  ChevronDown
} from 'lucide-react';
import { useEventStore } from '../store';
import { getOrdoForMonth } from '../services/ordoService';
import { LiturgicalColor, ScheduleEvent } from '../types';

type ViewType = 'MONTH' | 'WEEK' | 'DAY';

const ScheduleManagement: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventStore();
  const [viewType, setViewType] = useState<ViewType>('MONTH');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const [form, setForm] = useState<Partial<ScheduleEvent>>({
    massName: '',
    date: new Date().toISOString().split('T')[0],
    time: '17:30',
    type: 'MASS',
    location: 'Nhà thờ Chính',
    liturgicalColor: 'GREEN'
  });

  const ordoForMonth = useMemo(() => getOrdoForMonth(currentMonth, currentYear), [currentMonth, currentYear]);
  
  const getColorClass = (color?: LiturgicalColor) => {
    switch (color) {
      case 'WHITE': return 'bg-white border-slate-200 text-slate-800 ring-slate-100 shadow-sm';
      case 'RED': return 'bg-crimsonRed border-rose-500 text-white shadow-lg';
      case 'GREEN': return 'bg-emeraldGreen border-emerald-500 text-white shadow-lg';
      case 'VIOLET': return 'bg-liturgicalViolet border-liturgicalViolet text-white shadow-lg';
      case 'GOLD': return 'bg-amberGold border-amber-300 text-slate-900 shadow-lg';
      default: return 'bg-slate-200 border-slate-300';
    }
  };

  const handleNavigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewType === 'MONTH') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + direction * 7);
    }
    setCurrentDate(newDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.massName) return;
    if (editingEvent) {
      updateEvent({ ...editingEvent, ...form } as ScheduleEvent);
    } else {
      addEvent({ ...form, id: `e-${Date.now()}` } as ScheduleEvent);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const calendarCells = useMemo(() => {
    const cells = [];
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const startDay = firstDay.getDay(); 
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
    
    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthLastDay - i, isCurrentMonth: false, dateStr: '' });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth - 1, i);
      cells.push({ day: i, isCurrentMonth: true, dateStr: d.toISOString().split('T')[0] });
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, isCurrentMonth: false, dateStr: '' });
    }
    return cells;
  }, [currentMonth, currentYear]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 px-2 pt-4 relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="sacred-title text-2xl md:text-3xl font-bold text-slate-900 italic uppercase">Niên Lịch Công Tác</h2>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] italic">Lịch trình Phụng vụ & Việc đoàn</p>
          </div>
          <div className="flex p-1 bg-slate-200/40 rounded-full w-fit glass-card">
            {(['MONTH', 'WEEK', 'DAY'] as ViewType[]).map((v) => (
              <button key={v} onClick={() => setViewType(v)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewType === v ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>
                {v === 'MONTH' ? <LayoutGrid size={14} /> : v === 'WEEK' ? <List size={14} /> : <CalendarIcon size={14} />}
                {v === 'MONTH' ? 'Tháng' : v === 'WEEK' ? 'Tuần' : 'Ngày'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center glass-card rounded-xl shadow-sm p-0.5 border-white/60">
              <button onClick={() => handleNavigate(-1)} className="p-2.5 glass-button rounded-lg text-slate-400 hover:text-amberGold"><ChevronLeft size={16} /></button>
              <div className="px-4 py-1 text-[10px] font-black text-slate-900 uppercase tracking-widest text-center min-w-[150px]">
                 {viewType === 'MONTH' ? `Tháng ${currentMonth} • ${currentYear}` : currentDate.toLocaleDateString('vi-VN')}
              </div>
              <button onClick={() => handleNavigate(1)} className="p-2.5 glass-button rounded-lg text-slate-400 hover:text-amberGold"><ChevronRight size={16} /></button>
           </div>
           <button onClick={() => { setEditingEvent(null); setIsModalOpen(true); }} className="active-pill px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
             Lập lịch công tác <Plus size={16} />
           </button>
        </div>
      </header>

      <div className="glass-card rounded-[2.5rem] p-5 md:p-10 overflow-hidden">
        {viewType === 'MONTH' ? (
          <div className="animate-fade-in">
            <div className="grid grid-cols-7 gap-2 mb-4">
               {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, i) => (
                 <div key={day} className={`text-center text-[9px] font-black uppercase tracking-widest py-3 rounded-xl ${i === 0 ? 'text-crimsonRed bg-rose-50/50' : 'text-slate-400 bg-slate-50/50'}`}>
                    {day}
                 </div>
               ))}
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {calendarCells.map((cell, idx) => {
                const ordo = ordoForMonth.find(o => o.date === cell.dateStr);
                const dayEvents = events.filter(e => e.date === cell.dateStr);
                const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
                
                // Lấy tên lễ để hiển thị (ưu tiên ordo, sau đó là dayEvents)
                const displayName = ordo && ordo.massName !== 'Ngày thường' 
                  ? ordo.massName 
                  : dayEvents.length > 0 
                    ? dayEvents[0].massName 
                    : null;
                
                // Rút ngắn tên lễ nếu quá dài
                const getShortName = (name: string) => {
                  // Giữ nguyên tên, CSS sẽ xử lý việc cắt text
                  return name;
                };
                
                return (
                  <div key={idx} onClick={() => { if (cell.dateStr) { setCurrentDate(new Date(cell.dateStr)); setViewType('DAY'); } }} className={`p-2 md:p-3 rounded-[1.8rem] border flex flex-col justify-between h-24 md:h-40 transition-all hover:shadow-xl cursor-pointer relative overflow-hidden ${!cell.isCurrentMonth ? 'opacity-20' : isToday ? 'ring-2 ring-amberGold bg-amber-50/50' : 'bg-white/80 border-slate-100 hover:border-amberGold'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs md:text-base font-black ${idx % 7 === 0 ? 'text-crimsonRed' : 'text-slate-900'}`}>{cell.day}</span>
                      {ordo && <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-white shadow-sm shrink-0 ${getColorClass(ordo.liturgicalColor)}`}></div>}
                    </div>
                    
                    {/* Hiển thị tên lễ phụng vụ */}
                    {displayName && cell.isCurrentMonth && (
                      <div className="flex-1 flex flex-col justify-start overflow-hidden min-h-0 mt-1">
                        <p className={`text-[7px] md:text-[9px] font-bold leading-tight line-clamp-2 ${
                          ordo && ordo.rank === 'SOLEMNITY' 
                            ? 'text-slate-900' 
                            : ordo && ordo.rank === 'SUNDAY'
                            ? 'text-crimsonRed font-black'
                            : ordo && ordo.rank === 'FEAST'
                            ? 'text-slate-700'
                            : 'text-slate-600'
                        }`} title={displayName}>
                          {getShortName(displayName)}
                        </p>
                        {ordo && ordo.isObligatory && (
                          <span className="mt-0.5 text-[6px] md:text-[7px] font-black text-amberGold uppercase tracking-wider">
                            ⭐ Lễ Buộc
                          </span>
                        )}
                        {ordo && ordo.rank === 'SUNDAY' && !ordo.isObligatory && (
                          <span className="mt-0.5 text-[6px] md:text-[7px] font-black text-crimsonRed uppercase tracking-wider">
                            Chúa Nhật
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Hiển thị indicator cho events được tạo thủ công */}
                    {!ordo && dayEvents.length > 0 && (
                      <div className="h-0.5 bg-amberGold rounded-full animate-pulse mt-auto"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center opacity-40 italic">Đang tải lịch trình công tác...</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl bg-white animate-in zoom-in-95">
             <div className="flex justify-between items-start mb-8">
               <h3 className="sacred-title text-2xl font-black text-slate-900 italic leading-none">{editingEvent ? 'Cập Nhật Lịch' : 'Lập Lịch Mới'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2.5 glass-button rounded-xl shadow-sm"><X size={20} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Việc Phụng vụ / Thánh lễ</label>
                    <input type="text" required value={form.massName} onChange={e => setForm({...form, massName: e.target.value})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold bg-slate-50/50" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ngày cử hành</label>
                    <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Giờ bắt đầu</label>
                    <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold bg-slate-50/50" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 active-pill rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg">Xác nhận lịch công tác</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
