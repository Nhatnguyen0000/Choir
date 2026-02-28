import React, { useState, useMemo } from 'react';
import { Search, Plus, Music, X, Edit2, Trash2, Heart, ChevronDown } from 'lucide-react';
import { useLibraryStore, useToastStore, useMemberStore } from '../store';
import { Song } from '../types';
import ConfirmDialog from './ConfirmDialog';
import { recommendSongs } from '../services/songRecommender';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

const CATEGORIES = ['Tất cả', 'Nhập lễ', 'Đáp ca', 'Dâng lễ', 'Hiệp lễ', 'Kết lễ', 'Kính Đức Mẹ', 'Kính Các Thánh'];
const SEASONS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'Tất cả mùa' },
  { key: 'ADVENT', label: 'Mùa Vọng' },
  { key: 'CHRISTMAS', label: 'Giáng Sinh' },
  { key: 'LENT', label: 'Mùa Chay' },
  { key: 'EASTER', label: 'Phục Sinh' },
  { key: 'ORDINARY', label: 'Thường Niên' },
];

const LibraryManagement: React.FC = () => {
  const { songs, addSong, updateSong, deleteSong } = useLibraryStore();
  const { members } = useMemberStore();
  const addToast = useToastStore((s) => s.addToast);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [seasonFilter, setSeasonFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; title: string }>({ open: false, id: null, title: '' });

  const [form, setForm] = useState<Partial<Song>>({
    title: '', composer: '', category: 'Nhập lễ', liturgicalSeasons: [], isFamiliar: false, experienceNotes: ''
  });

  const filtered = useMemo(() => {
    let list = songs.filter(s =>
      (s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.composer && s.composer.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === 'Tất cả' || s.category === categoryFilter) &&
      (seasonFilter === 'ALL' || (s.liturgicalSeasons && s.liturgicalSeasons.includes(seasonFilter)))
    );
    return list.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
  }, [songs, searchTerm, categoryFilter, seasonFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    if (editingSong) {
      updateSong({ ...editingSong, ...form } as Song);
      addToast('Đã cập nhật bài hát');
    } else {
      addSong({ ...form as Song, id: crypto.randomUUID(), choirId: 'c-thienthan' });
      addToast('Đã thêm bài hát vào thư viện');
    }
    setIsModalOpen(false); setEditingSong(null);
    setForm({ title: '', composer: '', category: 'Nhập lễ', liturgicalSeasons: [], isFamiliar: false, experienceNotes: '' });
  };

  const handleConfirmDeleteSong = () => {
    if (confirmDelete.id) { deleteSong(confirmDelete.id); addToast('Đã xóa bài hát khỏi thư viện'); }
    setConfirmDelete({ open: false, id: null, title: '' });
  };

  const recommended = useMemo(() => recommendSongs(songs, members, 5), [songs, members]);

  return (
    <div className="w-full space-y-6 lg:space-y-8 animate-fade-in">
      <div className="page-header-2026">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Thư viện thánh ca</h1>
            <p className="page-subtitle">Ban Điều Hành Ca Đoàn Thiên Thần</p>
          </div>
          <div className="page-actions-2026">
            <Button onClick={() => { setEditingSong(null); setIsModalOpen(true); }} className="flex items-center gap-2">
              Thêm bài <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--foreground-muted)]" size={18} />
          <Input placeholder="Tìm bài hát, tác giả..." className="pl-11 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative flex rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-1 min-w-[130px]">
          <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)} className="w-full pl-4 pr-9 py-2.5 rounded-lg text-sm font-medium text-[var(--foreground)] bg-transparent border-0 outline-none cursor-pointer appearance-none">
            {SEASONS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
        </div>
        <div className="relative flex rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-1 min-w-[130px]">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full pl-4 pr-9 py-2.5 rounded-lg text-sm font-medium text-[var(--foreground)] bg-transparent border-0 outline-none cursor-pointer appearance-none">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none" />
        </div>
        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-1">
          <button type="button" onClick={() => setViewMode('cards')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'cards' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--foreground-muted)] hover:bg-[var(--background-elevated)]'}`}>Thẻ</button>
          <button type="button" onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--foreground-muted)] hover:bg-[var(--background-elevated)]'}`}>Bảng</button>
        </div>
      </div>

      {recommended.length > 0 && (
        <Card variant="glass" className="rounded-2xl p-5">
          <p className="section-label mb-3">Gợi ý thánh ca</p>
          <div className="flex flex-wrap gap-2">
            {recommended.map((s) => (
              <span key={s.id} className="px-3 py-1.5 rounded-full bg-[var(--primary-muted)] text-xs font-semibold text-[var(--primary)] border border-[var(--primary)]/20">
                {s.title}
              </span>
            ))}
          </div>
        </Card>
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Card key={s.id} variant="glass" className="rounded-2xl p-5 flex flex-col group transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)]">
                  <Music size={22} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => { setEditingSong(s); setForm(s); setIsModalOpen(true); }} className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all"><Edit2 size={14} /></button>
                  <button type="button" onClick={() => setConfirmDelete({ open: true, id: s.id, title: s.title })} className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
              <h4 className="font-semibold text-[var(--foreground)] leading-tight">
                {s.title}
                {s.isFamiliar && <Heart size={12} fill="currentColor" className="text-[var(--primary)] inline-block ml-1" />}
              </h4>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">{s.composer || 'Khuyết danh'}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="px-3 py-1 bg-[var(--background-muted)] text-[var(--foreground-muted)] rounded-full text-xs font-semibold">{s.category}</span>
                {s.liturgicalSeasons?.map((season) => {
                  const label = SEASONS.find(ss => ss.key === season)?.label || season;
                  return <span key={season} className="px-2 py-1 bg-[var(--primary-muted)] text-[var(--primary)] rounded-full text-[10px] font-semibold">{label}</span>;
                })}
              </div>
              {s.experienceNotes && (
                <p className="text-xs text-[var(--foreground-muted)] mt-2 line-clamp-2">{s.experienceNotes}</p>
              )}
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card variant="glass" className="col-span-full rounded-2xl py-16 text-center">
              <Music size={40} className="mx-auto text-[var(--foreground-muted)] mb-2 opacity-50" />
              <p className="text-sm text-[var(--foreground-muted)]">Chưa có bản nhạc nào.</p>
              <Button className="mt-3" onClick={() => { setEditingSong(null); setIsModalOpen(true); }}>Thêm bài đầu tiên</Button>
            </Card>
          )}
        </div>
      )}

      {viewMode === 'table' && (
        <Card variant="glass" className="rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-[var(--background-muted)] border-b border-[var(--border)]">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Tên bài</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Tác giả</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Phần phụng vụ</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--background-muted)]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Music size={16} className="text-[var(--foreground-muted)] shrink-0" />
                        <span className="text-sm font-semibold text-[var(--foreground)]">{s.title}</span>
                        {s.isFamiliar && <Heart size={12} fill="currentColor" className="text-[var(--primary)] shrink-0" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground-muted)]">{s.composer || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-[var(--background-muted)] text-[var(--foreground-muted)] rounded-full text-xs font-semibold">{s.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${s.isFamiliar ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--background-muted)] text-[var(--foreground-muted)]'}`}>
                        {s.isFamiliar ? 'Quen thuộc' : 'Mới'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => { setEditingSong(s); setForm(s); setIsModalOpen(true); }} className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-muted)]" title="Sửa"><Edit2 size={14} /></button>
                        <button type="button" onClick={() => setConfirmDelete({ open: true, id: s.id, title: s.title })} className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)]" title="Xóa"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Music size={40} className="mx-auto text-[var(--foreground-muted)] mb-2 opacity-50" />
                      <p className="text-sm text-[var(--foreground-muted)]">Chưa có bản nhạc nào.</p>
                      <Button className="mt-3" onClick={() => { setEditingSong(null); setIsModalOpen(true); }}>Thêm bài đầu tiên</Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 min-h-screen overflow-y-auto bg-black/30 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <Card variant="glass" className="w-full max-w-lg rounded-2xl p-6 sm:p-8 my-auto relative z-10 shadow-[var(--shadow-lg)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="sacred-title text-xl font-bold leading-none">{editingSong ? 'Sửa bản nhạc' : 'Thêm bản nhạc'}</h3>
                <p className="section-label mt-1">Lưu giữ kho tàng âm ca cộng đoàn</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-muted)] transition-all" aria-label="Đóng"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="section-label ml-0.5">Tên bài hát</label>
                <Input required value={form.title ?? ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="VD: Khát vọng hiệp thông" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Nhạc sĩ</label>
                  <Input value={form.composer ?? ''} onChange={e => setForm({ ...form, composer: e.target.value })} placeholder="Tên tác giả" />
                </div>
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Phần phụng vụ</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full h-11 px-4 rounded-[var(--radius-md)] text-sm border border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none cursor-pointer">
                    {['Nhập lễ', 'Đáp ca', 'Dâng lễ', 'Hiệp lễ', 'Kết lễ', 'Kính Đức Mẹ', 'Kính Các Thánh'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Hủy</Button>
                <Button type="submit" className="flex-[2] flex items-center justify-center gap-2">
                  <Music size={18} /> Lưu thư viện
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete.open} title="Xóa bài hát"
        message={`Bạn có chắc muốn xóa "${confirmDelete.title}" khỏi thư viện âm ca? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa" onConfirm={handleConfirmDeleteSong}
        onCancel={() => setConfirmDelete({ open: false, id: null, title: '' })} danger
      />
    </div>
  );
};

export default LibraryManagement;
