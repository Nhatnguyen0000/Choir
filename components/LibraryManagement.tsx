
import React, { useState, useMemo } from 'react';
import { Search, Plus, Music, X, Edit2, Trash2, Heart, Info, Tag, ChevronRight } from 'lucide-react';
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
  ), [songs, searchTerm]);

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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16 px-4">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
           <div className="space-y-1">
             <h2 className="sacred-title text-3xl font-bold text-slate-900 italic leading-none uppercase">Thư Viện Thánh Nhạc</h2>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic mt-1">Kho tàng âm ca phụng sự Chúa</p>
           </div>
           
           <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
              {['Tất cả', ...liturgicalSeasons.slice(0, 4)].map(s => (
                 <button key={s} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-amberGold hover:text-amberGold whitespace-nowrap transition-all shadow-sm">
                    {s}
                 </button>
              ))}
           </div>
        </div>
        <button onClick={() => { setEditingSong(null); setIsModalOpen(true); }} className="active-pill px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-3 shadow-lg hover:scale-[1.02] transition-all">
          Thêm bài hát mới <Plus size={18} />
        </button>
      </div>

      {/* Refined Search Bar */}
      <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center border border-slate-100 shadow-sm">
         <div className="relative w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm bài hát, tác giả..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-medium outline-none focus:border-amberGold transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Standardized Song Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
             <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amberGold flex items-center justify-center border border-amber-100 shrink-0">
                   <Music size={22} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => { setEditingSong(s); setForm(s); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-amberGold transition-colors"><Edit2 size={16}/></button>
                   <button onClick={() => deleteSong(s.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                </div>
             </div>

             <div className="flex-1 space-y-4">
                <div className="min-w-0">
                   <h4 className="text-[16px] font-black text-slate-800 leading-tight group-hover:text-amberGold transition-colors line-clamp-2">
                      {s.title}
                      {s.isFamiliar && <Heart size={12} fill="#FBBF24" className="text-amberGold inline-block ml-1.5 mb-1" />}
                   </h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 italic truncate">{s.composer}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-200">{s.category}</span>
                   {s.liturgicalSeasons.map(ls => (
                      <span key={ls} className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><Tag size={10}/> {ls}</span>
                   ))}
                </div>
                
                {s.experienceNotes && (
                   <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                      <Info size={14} className="text-slate-300 mt-0.5 shrink-0" />
                      <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed line-clamp-3">{s.experienceNotes}</p>
                   </div>
                )}
             </div>

             <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
                <span>Mã số: {s.id.slice(-4).toUpperCase()}</span>
                <ChevronRight size={16} className="text-slate-200 group-hover:text-amberGold transition-all" />
             </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] italic">Thư viện đang được cập nhật</div>
        )}
      </div>

      {/* Modal logic remains consistent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 bg-white shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
               <h3 className="sacred-title text-2xl font-bold text-slate-900 italic">Thêm Thánh Nhạc</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên bài hát</label>
                    <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="VD: Khát vọng hiệp thông" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tác giả</label>
                    <input type="text" value={form.composer} onChange={e => setForm({...form, composer: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="Linh mục / Nhạc sĩ" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phần lễ</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none">
                       {['Nhập lễ', 'Đáp ca', 'Dâng lễ', 'Hiệp lễ', 'Kết lễ', 'Kính Đức Mẹ'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghi chú kinh nghiệm</label>
                    <textarea value={form.experienceNotes} onChange={e => setForm({...form, experienceNotes: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none h-24" placeholder="Cảm nhận hoặc lưu ý khi tập hát..." />
                </div>
                <button type="submit" className="w-full py-4 active-pill rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg">Xác nhận ghi danh bài hát</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryManagement;
