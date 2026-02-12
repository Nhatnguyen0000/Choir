
import React, { useState, useMemo } from 'react';
/* Added RefreshCw to imports */
import { 
  Plus, ChevronLeft, ChevronRight, X, Trash2, Edit2, MapPin, 
  Clock, ChevronDown, Church, Bookmark, 
  Calendar as CalendarIcon, Sparkles, Layers, Bell, CheckCircle2,
  CalendarCheck, Search, Globe, RefreshCw
} from 'lucide-react';
import { useEventStore, useAppStore, useToastStore } from '../store';
import { getOrdoForMonth } from '../services/ordoService';
import { LiturgicalColor, ScheduleEvent, LiturgicalRank, AppView } from '../types';
import { getAIResponse } from '../services/geminiService';
import ConfirmDialog from './ConfirmDialog';

type ViewType = 'MONTH' | 'LIST';

const ScheduleManagement: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventStore();
  const addToast = useToastStore((s) => s.addToast);
  const [viewType, setViewType] = useState<ViewType>('MONTH');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(new Date(2026, 0, 1).toISOString().split('T')[0]);
  const [isSearchingLiturgy, setIsSearchingLiturgy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; label: string }>({ open: false, id: null, label: '' });
  
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const [form, setForm] = useState<Partial<ScheduleEvent>>({
    massName: '', date: new Date().toISOString().split('T')[0], time: '17:30',
    type: 'MASS', location: 'Nhà thờ Chính', liturgicalColor: 'GREEN'
  });

  const ordoForMonth = useMemo(() => getOrdoForMonth(currentMonth, currentYear), [currentMonth, currentYear]);
  
  const getLiturgicalStyle = (color?: LiturgicalColor, rank?: LiturgicalRank) => {
    const rankLabel = rank === 'SOLEMNITY' ? 'Lễ Trọng' : rank === 'FEAST' ? 'Lễ Kính' : rank === 'SUNDAY' ? 'Chúa Nhật' : 'Lễ Nhớ/Ngày Thường';
    
    switch (color) {
      case 'WHITE': return { bg: 'bg-white', text: 'text-slate-800', dot: 'bg-slate-200', border: 'border-slate-200', label: rankLabel, colorName: 'Trắng' };
      case 'RED': return { bg: 'bg-crimsonRed', text: 'text-white', dot: 'bg-rose-400', border: 'border-rose-700', label: rankLabel, colorName: 'Đỏ' };
      case 'GREEN': return { bg: 'bg-emeraldGreen', text: 'text-white', dot: 'bg-emerald-400', border: 'border-emerald-700', label: rankLabel, colorName: 'Xanh' };
      case 'VIOLET': return { bg: 'bg-liturgicalViolet', text: 'text-white', dot: 'bg-purple-400', border: 'border-purple-700', label: rankLabel, colorName: 'Tím' };
      case 'GOLD': return { bg: 'bg-amberGold', text: 'text-slate-900', dot: 'bg-amber-200', border: 'border-amber-500', label: rankLabel, colorName: 'Vàng' };
      case 'ROSE': return { bg: 'bg-pink-400', text: 'text-white', dot: 'bg-pink-200', border: 'border-pink-500', label: rankLabel, colorName: 'Hồng' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-300', border: 'border-slate-200', label: rankLabel, colorName: 'Xám' };
    }
  };

  const handleNavigate = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleSearchLiturgy = async () => {
    if (!selectedDayDate) return;
    setIsSearchingLiturgy(true);
    const dateObj = new Date(selectedDayDate);
    const prompt = `Thông tin Phụng vụ chi tiết cho ngày ${dateObj.toLocaleDateString('vi-VN')} năm 2026 tại Giáo hội Công giáo Việt Nam là gì? Có lễ đặc biệt nào không?`;
    
    // Ở đây ta sẽ điều hướng sang trang AI Assistant với prompt đã được điền sẵn
    // Để đơn giản, ta chỉ cần gọi AI và hiển thị thông báo hoặc mở tab mới.
    // Trong kiến trúc này, ta sẽ dùng store để chuyển hướng.
    window.location.hash = `#assistant?q=${encodeURIComponent(prompt)}`;
    setIsSearchingLiturgy(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.massName) return;
    if (editingEvent) {
      updateEvent({ ...editingEvent, ...form } as ScheduleEvent);
      addToast('Đã cập nhật lịch lễ');
    } else {
      addEvent({ ...form, id: crypto.randomUUID() } as ScheduleEvent);
      addToast('Đã thêm lịch lễ mới');
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleConfirmDeleteEvent = () => {
    if (confirmDelete.id) {
      deleteEvent(confirmDelete.id);
      addToast('Đã xóa lịch lễ');
    }
    setConfirmDelete({ open: false, id: null, label: '' });
  };

  const calendarCells = useMemo(() => {
    const cells = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const startDay = firstDayOfMonth.getDay(); 
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();

    for (let i = startDay; i > 0; i--) {
      cells.push({ day: prevMonthLastDay - i + 1, isCurrentMonth: false, dateStr: '' });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = String(i).padStart(2, '0');
      const monthStr = String(currentMonth).padStart(2, '0');
      cells.push({ day: i, isCurrentMonth: true, dateStr: `${currentYear}-${monthStr}-${dayStr}` });
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, isCurrentMonth: false, dateStr: '' });
    }
    return cells;
  }, [currentMonth, currentYear]);

  const selectedDayEvents = useMemo(() => events.filter(e => e.date === selectedDayDate), [events, selectedDayDate]);
  const selectedDayOrdo = useMemo(() => ordoForMonth.find(o => o.date === selectedDayDate), [ordoForMonth, selectedDayDate]);

  return (
    <div className="w-full space-y-6 animate-fade-in px-2 pb-12">
      {/* Header Niên Lịch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="sacred-title text-2xl md:text-3xl font-bold text-slate-900 italic tracking-tight">Niên Lịch Phụng Vụ 2026</h1>
          <p className="text-slate-400 text-[12px] font-bold uppercase tracking-[0.3em] mt-1 italic leading-none">Phụng sự Thiên Chúa qua Thánh Nhạc</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex glass-card p-2 rounded-2xl border-slate-200/60 bg-white/50">
             <button onClick={() => setViewType('MONTH')} className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase transition-all ${viewType === 'MONTH' ? 'bg-white shadow-sm text-slate-900 border border-amberGold/20' : 'text-slate-400'}`}>Tháng</button>
             <button onClick={() => setViewType('LIST')} className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase transition-all ${viewType === 'LIST' ? 'bg-white shadow-sm text-slate-900 border border-amberGold/20' : 'text-slate-400'}`}>Danh sách</button>
           </div>
           <button onClick={() => { setEditingEvent(null); setIsModalOpen(true); }} className="glass-button active-glass px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-md">
             <Plus size={18} /> <span className="hidden sm:inline">Lập Lịch Đoàn</span>
           </button>
        </div>
      </div>

      {/* Điều phối thời gian */}
      <div className="flex items-center justify-between glass-card card rounded-2xl p-5">
          <button onClick={() => handleNavigate(-1)} className="p-2 glass-button border-none rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"><ChevronLeft size={20}/></button>
          <div className="sacred-title text-lg md:text-xl font-bold text-slate-900 uppercase tracking-widest italic">Tháng {currentMonth} • 2026</div>
          <button onClick={() => handleNavigate(1)} className="p-2 glass-button border-none rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"><ChevronRight size={20}/></button>
      </div>

      {viewType === 'MONTH' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 glass-card card rounded-2xl overflow-hidden p-6 md:p-8">
            <div className="grid grid-cols-7 gap-1 mb-6">
               {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, i) => (
                 <div key={day} className={`text-center text-[11px] font-bold uppercase tracking-widest ${i === 0 ? 'text-crimsonRed' : 'text-slate-500'}`}>{day}</div>
               ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarCells.map((cell, idx) => {
                const ordo = ordoForMonth.find(o => o.date === cell.dateStr);
                const isSelected = selectedDayDate === cell.dateStr;
                const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
                const style = getLiturgicalStyle(ordo?.liturgicalColor, ordo?.rank);
                const hasEvents = events.some(e => e.date === cell.dateStr);
                const isSunday = idx % 7 === 0;
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => cell.dateStr && setSelectedDayDate(cell.dateStr)}
                    className={`aspect-square md:aspect-video p-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center relative group ${
                      !cell.isCurrentMonth ? 'opacity-10 pointer-events-none' : 
                      isSelected ? 'border-amberGold bg-amber-50/50' : 
                      isToday ? 'border-royalBlue/40 bg-slate-50' : 
                      isSunday ? 'border-rose-100/50 bg-rose-50/10' : 'border-white/50 hover:bg-white/60'
                    }`}
                  >
                     <span className={`text-[14px] font-bold ${isSunday ? 'text-crimsonRed' : 'text-slate-800'} ${isToday ? 'bg-royalBlue text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px]' : ''}`}>{cell.day}</span>
                     
                     <div className="mt-2 flex gap-1">
                       {ordo && ordo.rank !== 'OPTIONAL' && (
                         <div className={`w-1.5 h-1.5 rounded-full ${style.bg} border border-white/50 shadow-sm`} title={ordo.massName}></div>
                       )}
                       {hasEvents && (
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-white/50 shadow-sm" title="Có lịch ca đoàn"></div>
                       )}
                     </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
             <div className="glass-card rounded-[2.5rem] border-white/60 shadow-sm p-8 bg-white/40 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-8 border-b border-white/40 pb-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Bookmark size={18} className="text-amberGold" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 italic">Chi Tiết Ngày Phụng Vụ</h3>
                  </div>
                  {selectedDayDate && (
                    <button 
                      onClick={handleSearchLiturgy}
                      disabled={isSearchingLiturgy}
                      className="p-2 bg-amber-100/50 text-amberGold rounded-xl hover:bg-amber-100 transition-all flex items-center gap-2 text-[8px] font-bold uppercase"
                      title="Tìm kiếm thông tin trực tuyến"
                    >
                      {isSearchingLiturgy ? <RefreshCw className="animate-spin" size={12}/> : <Globe size={12}/>}
                      Tra cứu AI
                    </button>
                  )}
                </div>
                
                {selectedDayDate ? (
                  <div className="space-y-6 animate-fade-in flex-1">
                     <div className="pb-4">
                        <p className="sacred-title text-xl font-bold text-slate-900 italic leading-none">
                          {new Date(selectedDayDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
                        </p>
                     </div>

                     {selectedDayOrdo && (
                       <div className="p-5 rounded-3xl bg-white/60 border border-white/80 space-y-3 relative overflow-hidden group">
                          <div className="flex items-center gap-2 text-amberGold text-[9px] font-bold uppercase tracking-widest italic">
                            <Church size={16} /> Phụng Vụ Giáo Hội
                          </div>
                          <p className="sacred-title text-[16px] font-bold text-slate-800 italic leading-snug tracking-tight">{selectedDayOrdo.massName}</p>
                          <div className="flex items-center gap-3 pt-3 border-t border-slate-100/50">
                             <div className={`w-4 h-4 rounded-md shadow-sm ${getLiturgicalStyle(selectedDayOrdo.liturgicalColor, selectedDayOrdo.rank).bg} border border-white`}></div>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none italic">
                               {getLiturgicalStyle(selectedDayOrdo.liturgicalColor, selectedDayOrdo.rank).label} (Màu {getLiturgicalStyle(selectedDayOrdo.liturgicalColor, selectedDayOrdo.rank).colorName})
                             </span>
                          </div>
                       </div>
                     )}

                     <div className="space-y-4">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                          <Layers size={14} className="text-royalBlue" /> Công Tác Ca Đoàn
                       </p>
                       {selectedDayEvents.length > 0 ? (
                         <div className="space-y-3">
                           {selectedDayEvents.map(e => (
                             <div key={e.id} className="glass-card p-4 rounded-2xl border-white/60 bg-white/80 group transition-all shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                  <h5 className="sacred-title text-[14px] font-bold text-slate-900 italic leading-tight group-hover:text-amberGold transition-colors">{e.massName}</h5>
                                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                     <button onClick={() => { setEditingEvent(e); setForm(e); setIsModalOpen(true); }} className="p-2 glass-button border-none rounded-xl text-slate-300 hover:text-royalBlue bg-white/50"><Edit2 size={14}/></button>
                                     <button onClick={() => setConfirmDelete({ open: true, id: e.id, label: e.massName })} className="p-2 glass-button border-none rounded-xl text-slate-300 hover:text-crimsonRed bg-white/50"><Trash2 size={14}/></button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-amberGold" /> {e.time}</span>
                                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-300" /> {e.location}</span>
                                </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="py-12 text-center border border-dashed border-white/60 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-300 opacity-50">
                            <p className="text-[9px] italic font-bold uppercase tracking-widest">Không có công tác đoàn</p>
                         </div>
                       )}
                     </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-12 space-y-4 text-center opacity-40">
                     <CalendarIcon size={32} />
                     <p className="text-[9px] italic uppercase tracking-widest font-bold leading-relaxed">Chọn một ngày để xem chi tiết Phụng vụ</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl mx-auto">
          {ordoForMonth.map(ordo => {
            const hasChoirEvent = events.some(e => e.date === ordo.date);
            const style = getLiturgicalStyle(ordo.liturgicalColor, ordo.rank);
            const isSunday = new Date(ordo.date).getDay() === 0;
            
            return (
              <div key={ordo.date} className="glass-card p-5 rounded-[2rem] flex flex-col md:flex-row gap-6 border-white/60 bg-white/50 hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedDayDate(ordo.date)}>
                 <div className="flex items-center gap-6 md:w-48 shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-sm ${style.bg} border border-white group-hover:scale-105 transition-transform`}>
                       <span className={`text-xl font-bold ${style.text}`}>{new Date(ordo.date).getDate()}</span>
                       <span className={`text-[7px] font-bold uppercase tracking-widest ${style.text} opacity-60`}>T{new Date(ordo.date).getMonth()+1}</span>
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${isSunday ? 'text-crimsonRed' : 'text-slate-400'}`}>
                        {new Date(ordo.date).toLocaleDateString('vi-VN', { weekday: 'long' })}
                      </p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-1 italic">{ordo.note}</p>
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-center">
                    <h4 className="sacred-title text-[15px] font-bold text-slate-900 italic leading-snug tracking-tight">{ordo.massName}</h4>
                    <div className="mt-2.5 flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${style.bg} border border-white shadow-sm`}></div>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{style.label}</span>
                    </div>
                 </div>
                 
                 {hasChoirEvent && (
                   <div className="flex items-center gap-3 md:border-l md:pl-6 border-white/50">
                      <div className="w-10 h-10 glass-button border-amberGold/20 text-amberGold rounded-xl flex items-center justify-center">
                         <CalendarCheck size={18} />
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Ca Đoàn</p>
                        <p className="text-[12px] font-bold text-slate-900 leading-none">Lịch Hiệp Thông</p>
                      </div>
                   </div>
                 )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Lập Lịch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-md rounded-[3rem] p-12 relative z-10 shadow-2xl animate-in zoom-in-95 bg-white border-white/60">
             <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                 <h3 className="sacred-title text-2xl font-bold text-slate-900 italic leading-none tracking-tight">{editingEvent ? 'Sửa Lịch Công Tác' : 'Lập Lịch Hiệp Thông'}</h3>
                 <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 mt-2 italic">Dâng hiến thời gian phục vụ Thiên Chúa</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2.5 glass-button border-none rounded-xl text-slate-300 hover:text-slate-900 shadow-sm transition-transform hover:rotate-90"><X size={20} /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                      <Bell size={12} className="text-amberGold"/> Nội dung công tác
                    </label>
                    <input type="text" required value={form.massName} onChange={e => setForm({...form, massName: e.target.value})} className="w-full px-5 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner focus:border-amberGold transition-all" placeholder="VD: Thánh lễ Chúa Nhật" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Ngày tháng</label>
                    <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-5 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner focus:border-amberGold transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Giờ lễ</label>
                    <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-5 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner focus:border-amberGold transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Màu Phụng vụ</label>
                    <div className="relative">
                      <select value={form.liturgicalColor} onChange={e => setForm({...form, liturgicalColor: e.target.value as any})} className="w-full px-5 py-3 glass-card rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer border-white shadow-inner focus:border-amberGold transition-all">
                          <option value="GREEN">Xanh (Thường Niên)</option>
                          <option value="WHITE">Trắng (Phục Sinh/GS/Lễ Kính)</option>
                          <option value="VIOLET">Tím (Mùa Vọng/Mùa Chay)</option>
                          <option value="RED">Đỏ (Tử Đạo/Hiện Xuống)</option>
                          <option value="GOLD">Vàng (Lễ Trọng)</option>
                          <option value="ROSE">Hồng (Gaudete/Laetare)</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-all italic">HUỶ THAO TÁC</button>
                  <button type="submit" className="flex-[2] py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <CalendarCheck size={18} /> LƯU LỊCH HIỆP THÔNG
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete.open}
        title="Xóa lịch lễ"
        message={`Bạn có chắc muốn xóa "${confirmDelete.label}" khỏi lịch? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={handleConfirmDeleteEvent}
        onCancel={() => setConfirmDelete({ open: false, id: null, label: '' })}
        danger
      />
    </div>
  );
};

export default ScheduleManagement;
