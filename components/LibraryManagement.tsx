
import React, { useState, useMemo } from 'react';
import { Search, Plus, Music, X, Edit2, Trash2, Heart, Info, ChevronRight, ChevronDown } from 'lucide-react';
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

  const liturgicalSeasonsList = ['Mùa Vọng', 'Giáng Sinh', 'Mùa Chay', 'Phục Sinh', 'Thường Niên', 'Kính Đức Mẹ', 'Lễ Các Thánh'];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-16 px-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-5 flex-1">
           <div className="space-y-1.5">
             <h2 className="sacred-title text-3xl font-bold text-slate-900 italic tracking-tight uppercase">Thư Viện Âm Ca</h2>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] italic leading-none">Kho tàng thánh nhạc cộng đoàn</p>
           </div>
           
           <div className="flex gap-2.5 w-full overflow-x-auto scrollbar-hide pb-2">
              {['Tất cả', ...liturgicalSeasonsList.slice(0, 5)].map(s => (
                 <button key={s} className="px-5 py-2.5 rounded-2xl glass-button text-[9px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap bg-white/30 border-white/50">
                    {s}
                 </button>
              ))}
           </div>
        </div>
        <button onClick={() => { setEditingSong(null); setIsModalOpen(true); }} className="glass-button active-glass px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
          Ghi bài mới <Plus size={20} />
        </button>
      </div>

      <div className="px-2">
        <div className="relative group max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Tìm bài hát, nhạc sĩ..." 
            className="w-full pl-14 pr-6 py-4.5 glass-card rounded-3xl border-white/60 outline-none shadow-sm text-[14px] font-medium bg-white/20 focus:border-amberGold transition-all tracking-tight"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 pb-10">
        {filtered.map(s => (
          <div key={s.id} className="glass-card p-8 rounded-[2.5rem] border-white/60 hover:shadow-2xl transition-all group flex flex-col h-full bg-white/40 shadow-sm relative overflow-hidden">
             <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-50 text-amberGold flex items-center justify-center">
                   <Music size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <button onClick={() => { setEditingSong(s); setForm(s); setIsModalOpen(true); }} className="p-2.5 glass-button border-none rounded-xl text-slate-300 hover:text-amberGold bg-white/60 shadow-sm"><Edit2 size={16}/></button>
                   <button onClick={() => { if(window.confirm('Anh/chị xác nhận xóa bài hát khỏi thư viện âm ca?')) deleteSong(s.id); }} className="p-2.5 glass-button border-none rounded-xl text-slate-300 hover:text-rose-500 bg-white/60 shadow-sm"><Trash2 size={16}/></button>
                </div>
             </div>

             <div className="flex-1 space-y-4">
                <div className="min-w-0">
                   <h4 className="sacred-title text-[18px] font-bold text-slate-900 leading-tight italic group-hover:text-amberGold transition-colors tracking-tight">
                      {s.title}
                      {s.isFamiliar && <Heart size={12} fill="#FBBF24" className="text-amberGold inline-block ml-2 mb-0.5" />}
                   </h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2.5">
                     <span className="w-4 h-px bg-slate-200 rounded-full"></span> {s.composer || 'Khuyết danh'}
                   </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                   <span className="px-4 py-1.5 bg-slate-900/5 text-slate-700 border border-slate-200/50 rounded-xl text-[9px] font-bold uppercase tracking-widest leading-none shadow-sm">{s.category}</span>
                </div>
                
                {s.experienceNotes && (
                   <div className="p-4 rounded-3xl bg-white/60 border border-white/80 flex items-start gap-3 shadow-inner mt-2">
                      <Info size={14} className="text-amberGold mt-0.5 shrink-0 opacity-60" />
                      <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed line-clamp-2 tracking-tight">{s.experienceNotes}</p>
                   </div>
                )}
             </div>

             <div className="mt-8 pt-5 border-t border-white/40 flex items-center justify-between text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] italic">
                <span>MÃ BẢN NHẠC: {s.id.slice(-4).toUpperCase()}</span>
                <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform text-amberGold/40" />
             </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-32 text-center text-slate-300 text-[11px] font-bold uppercase tracking-[0.4em] italic opacity-40">Chưa ghi nhận bản nhạc nào phù hợp</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-lg rounded-[3.5rem] p-12 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 border-white/60">
             <div className="flex justify-between items-start mb-10">
               <div className="space-y-3">
                 <h3 className="sacred-title text-3xl font-bold text-slate-900 italic leading-none tracking-tight">{editingSong ? 'Sửa Bản Nhạc' : 'Thêm Bản Nhạc'}</h3>
                 <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 mt-2 italic">Lưu giữ kho tàng âm ca cộng đoàn</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3.5 glass-button border-none text-slate-300 hover:text-slate-900 shadow-sm transition-transform hover:rotate-90"><X size={24} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Tên bài hát</label>
                    <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner focus:border-amberGold transition-all" placeholder="VD: Khát vọng hiệp thông" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Nhạc sĩ</label>
                    <input type="text" value={form.composer} onChange={e => setForm({...form, composer: e.target.value})} className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner focus:border-amberGold transition-all placeholder:font-normal" placeholder="Tên tác giả" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Phần Phụng vụ</label>
                    <div className="relative">
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none appearance-none cursor-pointer border-white shadow-inner focus:border-amberGold transition-all">
                        {['Nhập lễ', 'Đáp ca', 'Dâng lễ', 'Hiệp lễ', 'Kết lễ', 'Kính Đức Mẹ', 'Kính Các Thánh'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4.5 text-slate-400 font-bold text-[12px] uppercase tracking-[0.3em] hover:text-slate-900 transition-all italic">HUỶ BỎ</button>
                  <button type="submit" className="flex-[2] py-4.5 bg-slate-900 text-white rounded-[2rem] font-bold text-[12px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <Music size={20} /> LƯU THƯ VIỆN
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
