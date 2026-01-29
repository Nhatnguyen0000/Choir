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
  ShieldAlert,
  Star,
  Music
} from 'lucide-react';
import { useEventStore } from '../store';
import { getOrdoForMonth } from '../services/ordoService';
import { LiturgicalColor, ScheduleEvent } from '../types';

type ViewType = 'MONTH' | 'WEEK' | 'DAY';

const ScheduleManagement: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventStore();
  
  const [viewType, setViewType] = useState<ViewType>('MONTH');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  
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
      case 'RED': return 'bg-rose-600 border-rose-500 text-white ring-rose-200';
      case 'GREEN': return 'bg-emerald-600 border-emerald-500 text-white ring-emerald-200';
      case 'VIOLET': return 'bg-liturgicalViolet border-liturgicalViolet text-white ring-purple-200';
      case 'GOLD': return 'bg-amber-400 border-amber-300 text-slate-900 ring-amber-200';
      default: return 'bg-slate-200 border-slate-300';
    }
  };

  const handleNavigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewType === 'MONTH') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewType === 'WEEK') {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setDate(newDate.getDate() + direction);
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

  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setForm(event);
    setIsModalOpen(true);
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-24 lg:pb-16 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="sacred-title text-3xl font-bold text-slate-900 italic leading-none uppercase">Lịch Phụng Vụ & Công Tác</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic mt-1">Giáo Xứ Bắc Hòa • Hiệp Thông Phụng Vụ</p>
          </div>
          
          <div className="flex p-1 bg-slate-200/40 rounded-xl w-fit border border-slate-200/50 backdrop-blur-sm">
            {(['MONTH', 'WEEK', 'DAY'] as ViewType[]).map((v) => (
              <button 
                key={v}
                onClick={() => setViewType(v)}
                className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  viewType === v ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v === 'MONTH' ? <LayoutGrid size={14} /> : v === 'WEEK' ? <List size={14} /> : <CalendarIcon size={14} />}
                {v === 'MONTH' ? 'Tháng' : v === 'WEEK' ? 'Tuần' : 'Ngày'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm p-1">
              <button onClick={() => handleNavigate(-1)} className="p-3 hover:bg-slate-50 text-slate-400 rounded-xl"><ChevronLeft size={18} /></button>
              <div className="px-6 py-2 text-[10px] font-black text-slate-900 uppercase tracking-widest text-center min-w-[160px]">
                 {viewType === 'MONTH' ? `Tháng ${currentMonth} • ${currentYear}` : 
                  viewType === 'WEEK' ? `Tuần ${Math.ceil(currentDate.getDate() / 7)} • Th.${currentMonth}` :
                  currentDate.toLocaleDateString('vi-VN')}
              </div>
              <button onClick={() => handleNavigate(1)} className="p-3 hover:bg-slate-50 text-slate-400 rounded-xl"><ChevronRight size={18} /></button>
           </div>
           <button onClick={() => { setEditingEvent(null); setIsModalOpen(true); }} className="active-pill px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-transform active:scale-95">
             Lập lịch mới <Plus size={18} />
           </button>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] p-6 md:p-8 border border-slate-100 shadow-sm bg-white/70 overflow-hidden">
        {viewType === 'MONTH' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-7 gap-2 mb-4">
               {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, i) => (
                 <div key={day} className={`text-center text-[10px] font-black uppercase tracking-[0.3em] py-3 rounded-2xl ${i === 0 ? 'text-rose-500 bg-rose-50/50' : 'text-slate-400 bg-slate-50/50'}`}>
                    {day}
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {calendarCells.map((cell, idx) => {
                const ordo = ordoForMonth.find(o => o.date === cell.dateStr);
                const dayEvents = events.filter(e => e.date === cell.dateStr);
                const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
                const isSunday = idx % 7 === 0;

                return (
                  <div 
                    key={idx} 
                    onClick={() => { if (cell.dateStr) { setCurrentDate(new Date(cell.dateStr)); setViewType('DAY'); } }}
                    className={`group p-2 md:p-3 rounded-2xl border flex flex-col justify-between h-24 md:h-36 transition-all hover:shadow-md cursor-pointer relative overflow-hidden ${
                      !cell.isCurrentMonth ? 'opacity-20 pointer-events-none' : 
                      isToday ? 'ring-2 ring-amberGold bg-amber-50 shadow-inner border-amber-200' : 'bg-white border-slate-50 hover:border-amberGold shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] md:text-lg font-black ${isSunday ? 'text-rose-500' : 'text-slate-900'} ${isToday ? 'text-amberGold' : ''}`}>
                        {cell.day}
                      </span>
                      {ordo && (
                        <div className={`w-2.5 h-2.5 md:w-4 md:h-4 rounded-full border border-slate-200 shadow-sm ${getColorClass(ordo.liturgicalColor)}`}></div>
                      )}
                    </div>
                    <div className="space-y-1 relative z-10 overflow-hidden">
                      {ordo && (
                        <span className={`block w-full text-[6px] md:text-[9px] font-bold truncate uppercase tracking-tighter italic leading-none ${isSunday ? 'text-rose-600' : 'text-slate-400'}`}>
                          {ordo.massName}
                        </span>
                      )}
                      {dayEvents.length > 0 && <div className="h-1 bg-amberGold rounded-full animate-pulse shadow-sm"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewType === 'WEEK' && (
          <div className="animate-fade-in space-y-4">
             {(() => {
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                return Array.from({ length: 7 }).map((_, i) => {
                  const d = new Date(startOfWeek);
                  d.setDate(startOfWeek.getDate() + i);
                  const dateStr = d.toISOString().split('T')[0];
                  const ordo = getOrdoForMonth(d.getMonth()+1, d.getFullYear()).find(o => o.date === dateStr);
                  const dayEvents = events.filter(e => e.date === dateStr);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  const isSunday = i === 0;

                  return (
                    <div key={dateStr} className={`glass-card p-5 rounded-3xl border border-slate-100 transition-all flex flex-col md:flex-row md:items-center gap-6 ${isToday ? 'ring-2 ring-amberGold bg-amber-50/50' : 'bg-white'}`}>
                       <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg ${isSunday ? 'bg-rose-500' : 'bg-slate-900'}`}>
                          <span className="text-xl md:text-3xl font-black">{d.getDate()}</span>
                          <span className="text-[8px] font-black uppercase opacity-60">Th.{d.getMonth()+1}</span>
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <h3 className={`text-[15px] font-black leading-tight ${isSunday ? 'text-rose-600' : 'text-slate-800'}`}>
                               {ordo?.massName || 'Ngày Thường'}
                             </h3>
                             {ordo?.liturgicalColor && <div className={`w-3 h-3 rounded-full border border-slate-100 ${getColorClass(ordo.liturgicalColor)}`}></div>}
                          </div>
                          <div className="space-y-2">
                             {dayEvents.length > 0 ? dayEvents.map(e => (
                               <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                  <div className="flex items-center gap-3 text-[11px] font-black text-slate-600 uppercase tracking-widest">
                                     <Clock size={14} className="text-amberGold" /> {e.time} • {e.massName}
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleEdit(e)} className="p-2 text-slate-300 hover:text-amberGold transition-colors"><Edit2 size={14}/></button>
                                     <button onClick={() => deleteEvent(e.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                                  </div>
                               </div>
                             )) : <span className="text-[10px] font-bold text-slate-300 uppercase italic">Chưa ghi nhận công tác phụng vụ</span>}
                          </div>
                       </div>
                    </div>
                  );
                });
             })()}
          </div>
        )}

        {viewType === 'DAY' && (
          <div className="animate-fade-in py-6 max-w-4xl mx-auto px-4">
             {(() => {
                const dateStr = currentDate.toISOString().split('T')[0];
                const ordo = getOrdoForMonth(currentDate.getMonth()+1, currentDate.getFullYear()).find(o => o.date === dateStr) || { massName: 'Ngày Thường', liturgicalColor: 'GREEN' };
                const dayEvents = events.filter(e => e.date === dateStr);
                const isSunday = currentDate.getDay() === 0;

                return (
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                       <div className={`w-32 h-32 md:w-44 md:h-44 rounded-[3rem] flex flex-col items-center justify-center text-white shadow-2xl border-4 border-white shrink-0 ${isSunday ? 'bg-rose-500' : 'bg-slate-900'}`}>
                          <span className="text-5xl md:text-7xl font-black">{currentDate.getDate()}</span>
                          <span className="text-[12px] md:text-[14px] font-black uppercase opacity-60">Tháng {currentMonth}</span>
                       </div>
                       <div className="space-y-4">
                          <h2 className="sacred-title text-4xl md:text-6xl font-bold text-slate-900 italic leading-tight">{ordo.massName}</h2>
                          <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-sm ring-2 ring-white w-fit ${getColorClass(ordo.liturgicalColor as any)}`}>
                             Áo Lễ {(ordo.liturgicalColor as string).toUpperCase()}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6 pt-10 border-t border-slate-50">
                       <div className="flex items-center justify-between">
                          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                            <Clock size={24} className="text-amberGold" /> Công Tác Cộng Đoàn
                          </h3>
                       </div>
                       {dayEvents.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dayEvents.map(e => (
                              <div key={e.id} className="glass-card p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-between group bg-white shadow-sm hover:border-amberGold transition-all">
                                 <div className="flex items-start justify-between">
                                    <div className="p-4 bg-amber-50 text-amberGold rounded-2xl">
                                       <Sun size={24} />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleEdit(e)} className="p-2 text-slate-300 hover:text-amberGold transition-colors"><Edit2 size={18}/></button>
                                       <button onClick={() => deleteEvent(e.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
                                    </div>
                                 </div>
                                 <div className="mt-4">
                                    <h4 className="sacred-title text-[18px] font-bold text-slate-800 leading-tight italic">{e.massName}</h4>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 italic flex items-center gap-2"><MapPin size={14} className="text-rose-400"/> {e.time} • {e.location}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                       ) : <div className="py-20 text-center rounded-[2rem] border-dashed border-2 border-slate-100 text-slate-300 text-[12px] font-black uppercase tracking-widest italic">Chưa có công tác hôm nay</div>}
                    </div>
                  </div>
                );
             })()}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditingEvent(null); }}></div>
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 bg-white shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
               <h3 className="sacred-title text-2xl font-bold text-slate-900 italic">{editingEvent ? 'Cập Nhật Lịch' : 'Lập Lịch Mới'}</h3>
               <button onClick={() => { setIsModalOpen(false); setEditingEvent(null); }} className="p-2 text-slate-400"><X size={24} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên công tác</label>
                    <input type="text" required value={form.massName} onChange={e => setForm({...form, massName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày</label>
                    <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giờ</label>
                    <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa điểm</label>
                    <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="VD: Nhà thờ chính" />
                </div>
                <button type="submit" className="w-full py-4 active-pill rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg mt-4">{editingEvent ? 'Lưu Thay Đổi' : 'Xác Nhận Lập Lịch'}</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
