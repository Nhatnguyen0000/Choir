
import React, { useState, useMemo } from 'react';
import { Search, Plus, Music, X, Edit2, Trash2, Heart, Info, Tag, ChevronRight, ChevronDown } from 'lucide-react';
import { useLibraryStore } from '../store';
import { Song } from '../types';

const LibraryManagement: React.FC = () => {
  const { songs, addSong, updateSong, deleteSong } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const [form, setForm] = useState<Partial<Song>>({
    title: '', composer: '', category: 'Nhập lễ', liturgicalSeasons: [], isFamiliar: false, experienceNotes: ''
  });

  const filtered = useMemo(() => songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.composer.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.title.localeCompare(b.title)), [songs, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    if (editingSong) {
      updateSong({ ...editingSong, ...form } as Song);
    } else {
      addSong({ ...form as Song, id: `s-${Date.now()}` });
    }
    setIsModalOpen(false);
    setEditingSong(null);
    setForm({ title: '', composer: '', category: 'Nhập lễ', liturgicalSeasons: [], isFamiliar: false, experienceNotes: '' });
  };

  const liturgicalSeasons = ['Mùa Vọng', 'Giáng Sinh', 'Mùa Chay', 'Phục Sinh', 'Thường Niên', 'Thánh Thể', 'Đức Mẹ'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 px-2 pt-4 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-4">
           <div className="space-y-0.5">
             <h2 className="sacred-title text-2xl md:text-3xl font-bold text-slate-900 italic leading-none uppercase">Thư Viện Âm Ca</h2>
             <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] italic">Kho tàng âm ca phụng sự Phụng vụ cộng đoàn</p>
           </div>
           
           <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-hide pb-1">
              {['Tất cả', ...liturgicalSeasons.slice(0, 4)].map(s => (
                 <button key={s} className="px-5 py-2 rounded-full glass-button text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-amberGold hover:text-amberGold whitespace-nowrap transition-all shadow-sm border-white/60">
                    {s}
                 </button>
              ))}
           </div>
        </div>
        <button onClick={() => { setEditingSong(null); setIsModalOpen(true); }} className="active-pill px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all">
          Ghi danh bài mới <Plus size={16} />
        </button>
      </div>

      {/* Refined Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Tìm tên bài hát, tác giả..." 
          className="w-full pl-14 pr-5 py-4 glass-card rounded-[1.5rem] outline-none focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium placeholder:text-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Song Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => (
          <div key={s.id} className="glass-card p-6 rounded-[2.5rem] group flex flex-col h-full">
             <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amberGold flex items-center justify-center border border-amber-100 shadow-inner">
                   <Music size={22} strokeWidth={2.5} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                   <button onClick={() => { setEditingSong(s); setForm(s); setIsModalOpen(true); }} className="p-2.5 glass-button rounded-lg text-slate-300 hover:text-amberGold shadow-sm transition-all border-white/60"><Edit2 size={16}/></button>
                   <button onClick={() => { if(window.confirm('Xác nhận gỡ bài hát này khỏi thư viện?')) deleteSong(s.id); }} className="p-2.5 glass-button rounded-lg text-slate-300 hover:text-crimsonRed shadow-sm transition-all border-white/60"><Trash2 size={16}/></button>
                </div>
             </div>

             <div className="flex-1 space-y-4">
                <div className="min-w-0">
                   <h4 className="sacred-title text-lg font-bold text-slate-900 leading-tight italic group-hover:text-amberGold transition-colors">
                      {s.title}
                      {s.isFamiliar && <Heart size={12} fill="#FBBF24" className="text-amberGold inline-block ml-1.5 mb-1" />}
                   </h4>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic flex items-center gap-2">
                     <span className="w-3 h-0.5 bg-slate-100 rounded-full"></span> {s.composer || 'Khuyết danh'}
                   </p>
                </div>

                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">{s.category}</span>
                </div>
                
                {s.experienceNotes && (
                   <div className="p-4 rounded-[1.8rem] bg-slate-50 border border-slate-100/50 flex items-start gap-2 shadow-inner">
                      <Info size={14} className="text-slate-300 mt-0.5 shrink-0" />
                      <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed line-clamp-3">{s.experienceNotes}</p>
                   </div>
                )}
             </div>

             <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                <span className="flex items-center gap-1.5">MÃ: <span className="text-slate-400">{s.id.slice(-4).toUpperCase()}</span></span>
                <div className="flex items-center gap-1 text-amberGold opacity-0 group-hover:opacity-100 transition-opacity">
                  XEM THÊM <ChevronRight size={12} />
                </div>
             </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-24 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] italic opacity-40">Thư viện đang được cập nhật</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 bg-white/95 shadow-2xl animate-in zoom-in-95 border-white/40">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="sacred-title text-2xl font-bold text-slate-900 italic leading-none">{editingSong ? 'Cập nhật Âm Ca' : 'Ghi danh Âm Ca'}</h3>
                 <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2 italic">Dâng lời ca khen ngợi Chúa Chí Thánh</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2.5 glass-button rounded-xl text-slate-300 hover:text-slate-900 border-white/60 shadow-sm"><X size={20} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên bài hát</label>
                    <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-5 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner bg-slate-50/50" placeholder="VD: Khát vọng hiệp thông" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Tác giả</label>
                    <input type="text" value={form.composer} onChange={e => setForm({...form, composer: e.target.value})} className="w-full px-5 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner bg-slate-50/50" placeholder="Nhạc sĩ" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Phần hành Phụng vụ</label>
                    <div className="relative">
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-5 py-3 glass-card rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer bg-slate-50/50">
                        {['Nhập lễ', 'Đáp ca', 'Dâng lễ', 'Hiệp lễ', 'Kết lễ', 'Kính Đức Mẹ', 'Kính Thánh'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] hover:text-slate-900 transition-all">HUỶ BỎ</button>
                  <button type="submit" className="flex-[2] py-4 active-pill rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Music size={16} /> LƯU THƯ VIỆN
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryManagement;
