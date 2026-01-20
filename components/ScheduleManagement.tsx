
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash, 
  UserPen, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  X, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List as ListIcon,
  CalendarDays,
  CalendarRange,
  BookOpen,
  Info
} from 'lucide-react';
import { ScheduleEvent, Song, OrdoEvent } from '../types';
import { getOrdoEventForDate } from '../services/ordoService';

interface ScheduleManagementProps {
  scheduleItems: ScheduleEvent[];
  setScheduleItems: React.Dispatch<React.SetStateAction<ScheduleEvent[]>>;
  songs: Song[];
}

type ViewMode = 'MONTH' | 'WEEK' | 'LIST';

const ScheduleManagement: React.FC<ScheduleManagementProps> = ({ scheduleItems, setScheduleItems, songs }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('MONTH');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date(2026, 0, 1).toISOString().split('T')[0]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);

    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, fullDate: null });
    }

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      days.push({ day: i, fullDate: dateStr });
    }
    return days;
  }, [currentDate]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'MONTH') newDate.setMonth(currentDate.getMonth() - 1);
    else if (viewMode === 'WEEK') newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'MONTH') newDate.setMonth(currentDate.getMonth() + 1);
    else if (viewMode === 'WEEK') newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleSave = () => {
    if (!editingEvent || !editingEvent.massName.trim()) return;
    setScheduleItems(prev => {
      const exists = prev.find(e => e.id === editingEvent.id);
      if (exists) return prev.map(e => e.id === editingEvent.id ? editingEvent : e);
      return [editingEvent, ...prev];
    });
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setScheduleItems(prev => prev.filter(e => e.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filteredEvents = useMemo(() => {
    if (viewMode === 'LIST') return scheduleItems.sort((a, b) => a.date.localeCompare(b.date));
    if (viewMode === 'MONTH') {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      return scheduleItems.filter(e => e.date.startsWith(`${year}-${month}`));
    }
    return scheduleItems;
  }, [scheduleItems, viewMode, currentDate]);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return scheduleItems.filter(e => e.date === selectedDate);
  }, [scheduleItems, selectedDate]);

  const ordoForSelectedDate = useMemo(() => {
    return selectedDate ? getOrdoEventForDate(selectedDate) : undefined;
  }, [selectedDate]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      {/* Header & View Switcher */}
      <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black font-serif text-white uppercase tracking-tight">Lịch PV Bắc Hoà</h2>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1">{monthYearLabel}</p>
          </div>
          
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 self-start">
            {[
              { mode: 'MONTH', icon: <CalendarIcon size={16} />, label: 'Tháng' },
              { mode: 'WEEK', icon: <CalendarRange size={16} />, label: 'Tuần' },
              { mode: 'LIST', icon: <ListIcon size={16} />, label: 'Ds' },
            ].map((v) => (
              <button
                key={v.mode}
                onClick={() => setViewMode(v.mode as ViewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  viewMode === v.mode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {v.icon}
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={handlePrev} className="p-3 bg-white/5 rounded-xl text-white hover:bg-white/10 active:scale-90 transition-all border border-white/5">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date(2026, 0, 1))} className="px-5 py-3 bg-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/5">
              T1/2026
            </button>
            <button onClick={handleNext} className="p-3 bg-white/5 rounded-xl text-white hover:bg-white/10 active:scale-90 transition-all border border-white/5">
              <ChevronRight size={20} />
            </button>
          </div>
          <button 
            onClick={() => { setEditingEvent({ id: Date.now().toString(), date: selectedDate || new Date().toISOString().split('T')[0], time: '19:30', massName: '', type: 'MASS', location: 'Nhà thờ' }); setIsModalOpen(true); }}
            className="p-3 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-900/20 active:scale-90 transition-all flex items-center gap-2 px-6"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Thêm lịch</span>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'MONTH' && (
        <div className="space-y-6">
          <div className="bg-slate-900/30 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-white/5 bg-white/5">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d, i) => (
                <div key={d} className={`py-4 text-center text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((dateObj, idx) => {
                const hasEvents = scheduleItems.some(e => e.date === dateObj.fullDate);
                const ordo = dateObj.fullDate ? getOrdoEventForDate(dateObj.fullDate) : null;
                const isSelected = selectedDate === dateObj.fullDate;
                const isToday = dateObj.fullDate === new Date().toISOString().split('T')[0];

                return (
                  <button
                    key={idx}
                    onClick={() => dateObj.fullDate && setSelectedDate(dateObj.fullDate)}
                    disabled={!dateObj.day}
                    className={`h-20 sm:h-24 p-1 border-r border-b border-white/5 flex flex-col items-center justify-start relative transition-all group ${
                      !dateObj.day ? 'bg-slate-950/20' : 'hover:bg-blue-600/10'
                    } ${isSelected ? 'bg-blue-600/30 ring-inset ring-2 ring-blue-500/50' : ''} ${ordo?.isObligatory ? 'bg-blue-900/5' : ''}`}
                  >
                    {dateObj.day && (
                      <>
                        <span className={`text-xs font-black mb-1 ${isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-lg' : isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {dateObj.day}
                        </span>
                        
                        {/* Indicators for Ordo Rank */}
                        <div className="flex flex-wrap justify-center gap-1 mt-auto pb-2">
                          {ordo && (
                            <div className={`w-2 h-2 rounded-full shadow-sm transition-transform group-hover:scale-125 ${
                              ordo.rank === 'SOLEMNITY' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse' : 
                              ordo.rank === 'FEAST' ? 'bg-blue-500' : 
                              ordo.rank === 'SUNDAY' ? 'bg-emerald-500' :
                              'bg-amber-500'
                            }`} title={ordo.massName}></div>
                          )}
                          {hasEvents && (
                            <div className="w-2 h-2 bg-white rounded-full border border-blue-500"></div>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Info for Selected Date */}
          {selectedDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
               {/* Ordo Section */}
               <div className={`p-6 rounded-[2.5rem] border shadow-xl space-y-4 transition-all ${
                  ordoForSelectedDate?.rank === 'SOLEMNITY' ? 'bg-rose-950/20 border-rose-500/20' : 'bg-slate-900/50 border-white/5'
               }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <BookOpen size={18} className={ordoForSelectedDate?.rank === 'SOLEMNITY' ? 'text-rose-400' : 'text-blue-400'} />
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin Phụng vụ</h3>
                    </div>
                    {ordoForSelectedDate?.isObligatory && (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-500/20">Lễ Buộc</span>
                    )}
                  </div>
                  
                  {ordoForSelectedDate ? (
                    <div className="space-y-3">
                       <h4 className="text-lg font-black text-white leading-tight">{ordoForSelectedDate.massName}</h4>
                       <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-3 h-3 rounded-full border border-white/10 ${
                               ordoForSelectedDate.liturgicalColor === 'WHITE' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' :
                               ordoForSelectedDate.liturgicalColor === 'RED' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                               ordoForSelectedDate.liturgicalColor === 'VIOLET' ? 'bg-purple-500' :
                               ordoForSelectedDate.liturgicalColor === 'GREEN' ? 'bg-emerald-500' : 'bg-amber-500'
                             }`}></div>
                             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Màu {ordoForSelectedDate.liturgicalColor === 'WHITE' ? 'Trắng' : ordoForSelectedDate.liturgicalColor === 'RED' ? 'Đỏ' : ordoForSelectedDate.liturgicalColor === 'VIOLET' ? 'Tím' : ordoForSelectedDate.liturgicalColor === 'GREEN' ? 'Xanh' : 'Vàng'}</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            ordoForSelectedDate.rank === 'SOLEMNITY' ? 'text-rose-400' : 'text-slate-500'
                          }`}>Bậc: {
                            ordoForSelectedDate.rank === 'SOLEMNITY' ? 'Lễ Trọng' : 
                            ordoForSelectedDate.rank === 'FEAST' ? 'Lễ Kính' : 
                            ordoForSelectedDate.rank === 'SUNDAY' ? 'Chúa Nhật' : 'Lễ Nhớ'
                          }</span>
                       </div>
                       {ordoForSelectedDate.note && (
                         <div className="flex items-start gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                            <Info size={12} className="text-blue-400 mt-0.5 shrink-0" />
                            <p className="text-xs font-bold text-slate-400 italic leading-relaxed">{ordoForSelectedDate.note}</p>
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                       <p className="text-[10px] font-bold text-slate-600 uppercase italic">Ngày lễ thường trong tuần</p>
                    </div>
                  )}
               </div>

               {/* Activity Section */}
               <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                     <CalendarDays size={18} className="text-emerald-400" />
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hoạt động Ca đoàn</h3>
                  </div>
                  
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                    {eventsForSelectedDate.length === 0 ? (
                      <div className="py-6 text-center border border-dashed border-white/5 rounded-2xl">
                         <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest italic">Nghỉ hoạt động</p>
                      </div>
                    ) : (
                      eventsForSelectedDate.map(item => (
                        <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                           <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-black text-white truncate">{item.massName}</h5>
                              <div className="flex gap-3 mt-1">
                                <span className="text-[8px] font-bold text-slate-500 uppercase flex items-center gap-1"><Clock size={8}/> {item.time}</span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase truncate flex items-center gap-1"><MapPin size={8}/> {item.location}</span>
                              </div>
                           </div>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingEvent(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-white"><UserPen size={14}/></button>
                              <button onClick={() => setDeleteConfirmId(item.id)} className="p-2 text-rose-500/70 hover:text-rose-500"><Trash size={14}/></button>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Week & List Views remain (Omitted for brevity but logic is kept) */}
      {(viewMode === 'WEEK' || viewMode === 'LIST') && (
        <div className="grid grid-cols-1 gap-4 px-1">
          {filteredEvents.length === 0 ? (
            <div className="py-20 text-center text-slate-600 font-black uppercase tracking-widest text-[10px] italic">Chưa có lịch phụng vụ mới</div>
          ) : (
            filteredEvents.map(item => (
              <EventCard key={item.id} item={item} onEdit={setEditingEvent} onDelete={setDeleteConfirmId} onOpenModal={setIsModalOpen} />
            ))
          )}
        </div>
      )}

      {/* CRUD Modals and Dialogs */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in p-0">
          <div className="bg-slate-950 rounded-t-[3rem] w-full max-w-lg shadow-2xl p-8 pb-12 space-y-8 border-t border-white/10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight font-serif">Kế Hoạch Hoạt Động</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Cập nhật thông tin chi tiết</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full text-white active:scale-90 border border-white/5"><X size={20}/></button>
            </div>
            
            <div className="space-y-5">
               <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                  <button onClick={() => setEditingEvent({...editingEvent, type: 'MASS'})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${editingEvent.type === 'MASS' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Hát Lễ</button>
                  <button onClick={() => setEditingEvent({...editingEvent, type: 'PRACTICE'})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${editingEvent.type === 'PRACTICE' ? 'bg-amber-500 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Tập Hát</button>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Tên hoạt động</label>
                  <input type="text" value={editingEvent.massName} onChange={e => setEditingEvent({...editingEvent, massName: e.target.value})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black border border-white/5 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-700" placeholder="Vd: Lễ Hiển Linh, Tập hát Phục Sinh..." />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Ngày</label>
                     <input type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black border border-white/5 outline-none" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Giờ</label>
                     <input type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black border border-white/5 outline-none" />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Địa điểm</label>
                  <input type="text" value={editingEvent.location} onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black border border-white/5 outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
               </div>
            </div>
            
            <div className="flex gap-4">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all border border-white/5">Hủy</button>
               <button onClick={handleSave} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Lưu Kế Hoạch</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[250] flex items-end justify-center bg-black/90 backdrop-blur-md p-0 animate-in fade-in">
          <div className="bg-slate-950 rounded-t-[3rem] w-full max-w-lg p-10 pb-12 space-y-8 shadow-2xl border-t border-rose-500/20 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                  <AlertCircle size={48} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-black text-white leading-tight">Hủy lịch hoạt động?</h3>
               <p className="text-sm font-bold text-slate-500 px-4 leading-relaxed">Thông tin lịch lễ/tập này sẽ bị gỡ vĩnh viễn khỏi hệ thống.</p>
            </div>
            <div className="flex flex-col gap-3">
               <button onClick={confirmDelete} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-900/40 active:scale-95 transition-all">Xác nhận xóa</button>
               <button onClick={() => setDeleteConfirmId(null)} className="w-full py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all border border-white/5">Quay lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface EventCardProps {
  item: ScheduleEvent;
  compact?: boolean;
  onEdit: (e: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onOpenModal: (o: boolean) => void;
}

const EventCard: React.FC<EventCardProps> = ({ item, compact, onEdit, onDelete, onOpenModal }) => {
  return (
    <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group ${
      item.type === 'MASS' 
        ? 'bg-slate-900/50 backdrop-blur-xl border-white/5 shadow-2xl hover:border-blue-500/30' 
        : 'bg-amber-500/5 backdrop-blur-xl border-amber-500/10 shadow-lg hover:border-amber-500/30'
    }`}>
      <div className="flex items-center justify-between mb-4">
        {!compact && (
          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
            item.type === 'MASS' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {item.date}
          </span>
        )}
        <div className={`flex gap-2 ${compact ? 'ml-auto' : ''}`}>
           <button onClick={() => { onEdit(item); onOpenModal(true); }} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white active:scale-90 transition-all border border-white/5" title="Sửa">
              <UserPen size={18}/>
           </button>
           <button onClick={() => onDelete(item.id)} className="p-2.5 bg-rose-500/5 rounded-xl text-rose-500/70 hover:text-rose-500 active:scale-90 transition-all border border-rose-500/10" title="Xóa">
              <Trash size={18}/>
           </button>
        </div>
      </div>
      
      <div className="flex gap-4">
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
           item.type === 'MASS' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
         }`}>
            {item.type === 'MASS' ? <CalendarDays size={24}/> : <CalendarIcon size={24}/>}
         </div>
         <div className="flex-1">
            <h4 className="text-lg font-black text-white leading-tight mb-3 group-hover:text-blue-400 transition-colors">{item.massName}</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                <Clock size={14} className="text-blue-500" /> {item.time}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                <MapPin size={14} className="text-blue-500" /> {item.location}
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
