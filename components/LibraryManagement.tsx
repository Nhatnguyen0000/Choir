
import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash, UserPen, Music, FileText, Link2, X, AlertCircle } from 'lucide-react';
import { Song } from '../types';

interface LibraryManagementProps {
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
}

const LibraryManagement: React.FC<LibraryManagementProps> = ({ songs, setSongs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [viewingLyrics, setViewingLyrics] = useState<Song | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredSongs = useMemo(() => songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.composer.toLowerCase().includes(searchTerm.toLowerCase())
  ), [songs, searchTerm]);

  const handleSave = () => {
    if (!editingSong || !editingSong.title.trim()) return;
    setSongs(prev => {
      const exists = prev.find(s => s.id === editingSong.id);
      if (exists) return prev.map(s => s.id === editingSong.id ? editingSong : s);
      return [editingSong, ...prev];
    });
    setIsModalOpen(false);
    setEditingSong(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setSongs(prev => prev.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sticky top-0 z-30 flex gap-2 pt-2 bg-slate-50 dark:bg-slate-950 pb-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 dark:text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm bài hát..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black outline-none border border-slate-200 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all" 
          />
        </div>
        <button 
          onClick={() => { setEditingSong({ id: Date.now().toString(), title: '', composer: '', category: 'Nhập lễ' }); setIsModalOpen(true); }} 
          className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl active:scale-90 transition-all"
          title="Thêm bài hát"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-24">
        {filteredSongs.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px] italic">Không tìm thấy bài hát</div>
        ) : (
          filteredSongs.map(song => (
            <div key={song.id} className="bg-white dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase px-4 py-1.5 bg-blue-600 text-white rounded-full">{song.category}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingSong(song); setIsModalOpen(true); }} className="p-2 text-slate-950 dark:text-slate-400 active:scale-90" title="Sửa"><UserPen size={20}/></button>
                  <button onClick={() => setDeleteConfirmId(song.id)} className="p-2 text-rose-500 dark:text-rose-400 active:scale-90" title="Xóa"><Trash size={20}/></button>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-950 dark:text-white leading-tight mb-1">{song.title}</h4>
                <p className="text-sm font-black text-slate-700 dark:text-slate-400 flex items-center gap-2 italic">
                  <Music size={14} className="text-blue-500" /> Ns: {song.composer}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                 <button onClick={() => setViewingLyrics(song)} className="flex items-center justify-center p-4 bg-slate-950 dark:bg-white text-white dark:text-black rounded-2xl active:scale-95 transition-all shadow-lg" title="Lời bài hát"><FileText size={20}/></button>
                 {song.pdfUrl ? (
                   <a href={song.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-200 dark:border-blue-500/20 active:scale-95 transition-all" title="Xem PDF"><Link2 size={20}/></a>
                 ) : (
                   <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-700"><Link2 size={20} /></div>
                 )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CRUD Bottom Sheet */}
      {isModalOpen && editingSong && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-8 pb-12 space-y-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Thánh Nhạc Phụng Vụ</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 dark:bg-white/10 rounded-full text-slate-950 dark:text-white active:scale-90"><X size={20}/></button>
            </div>
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Tên bài hát</label>
                 <input type="text" value={editingSong.title} onChange={e => setEditingSong({...editingSong, title: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nhạc sĩ</label>
                   <input type="text" value={editingSong.composer} onChange={e => setEditingSong({...editingSong, composer: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black border-none outline-none transition-all" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Phân loại</label>
                    <select value={editingSong.category} onChange={e => setEditingSong({...editingSong, category: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black outline-none border-none">
                       <option value="Nhập lễ">Nhập lễ</option>
                       <option value="Đáp ca">Đáp ca</option>
                       <option value="Dâng lễ">Dâng lễ</option>
                       <option value="Hiệp lễ">Hiệp lễ</option>
                       <option value="Kết lễ">Kết lễ</option>
                    </select>
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Lời bài hát</label>
                 <textarea value={editingSong.lyrics} onChange={e => setEditingSong({...editingSong, lyrics: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black h-32 outline-none border-none resize-none focus:ring-2 focus:ring-blue-500" />
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-white/5 text-slate-950 dark:text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Hủy</button>
               <button onClick={handleSave} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Lưu Bài Hát</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Sheet */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/90 backdrop-blur-md p-0 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-10 pb-12 space-y-8 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                  <AlertCircle size={48} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">Gỡ bài hát vĩnh viễn?</h3>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 px-4">Hành động này không thể hoàn tác. Bản nhạc sẽ bị xóa khỏi thư viện chung.</p>
            </div>
            <div className="flex flex-col gap-3">
               <button onClick={confirmDelete} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/30 active:scale-95 transition-all">Xác nhận xóa</button>
               <button onClick={() => setDeleteConfirmId(null)} className="w-full py-5 bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lyrics Viewer */}
      {viewingLyrics && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-lg p-10 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">{viewingLyrics.title}</h3>
              <button onClick={() => setViewingLyrics(null)} className="p-3 bg-slate-100 dark:bg-white/10 rounded-full text-slate-950 dark:text-white active:scale-90"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto font-serif text-xl font-bold leading-relaxed text-slate-950 dark:text-slate-200 text-center whitespace-pre-wrap px-4 py-4 border-y border-slate-100 dark:border-white/5 scrollbar-hide">
              {viewingLyrics.lyrics || "Nội dung đang cập nhật..."}
            </div>
            <button onClick={() => setViewingLyrics(null)} className="mt-8 px-12 py-5 bg-slate-950 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all mx-auto">Hoàn tất</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryManagement;
