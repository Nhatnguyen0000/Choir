import React, { useState, useMemo } from 'react';
import {
  Search, UserPlus, FileDown,
  X, Edit2, Trash2,
  Users, Clock, UserCheck,
  UserCog, PauseCircle, Save,
  ChevronLeft, ChevronRight, CalendarDays,
} from 'lucide-react';
import { Member, MemberStatus } from '../types';
import { useMemberStore, useToastStore } from '../store';
import ConfirmDialog from './ConfirmDialog';
import { exportMembersToExcel } from '../services/excelExport';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

type SubTab = 'LIST' | 'ATTENDANCE';

const MemberManagement: React.FC = () => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  const addToast = useToastStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<SubTab>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; name: string }>({ open: false, id: null, name: '' });

  const initialForm: Partial<Member> = {
    name: '', saintName: '', role: 'Thành viên', phone: '', status: 'ACTIVE', gender: 'Nam', grade: '', birthYear: '', joinDate: new Date().toISOString().split('T')[0]
  };
  const [form, setForm] = useState<Partial<Member>>(initialForm);

  const getLastName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    return parts[parts.length - 1] || fullName;
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => {
      const nameA = getLastName(a.name);
      const nameB = getLastName(b.name);
      const cmp = nameA.localeCompare(nameB, 'vi');
      if (cmp !== 0) return cmp;
      return a.name.localeCompare(b.name, 'vi');
    });
  }, [members, searchTerm]);

  const normalize = (s: string) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

  const isDuplicateMember = (saintName: string, fullName: string, excludeId?: string) => {
    const nSaint = normalize(saintName);
    const nFull = normalize(fullName);
    return members.some(m => {
      if (excludeId && m.id === excludeId) return false;
      return normalize(m.saintName ?? '') === nSaint && normalize(m.name) === nFull;
    });
  };

  const handleExport = async () => {
    const rows = filteredMembers.map((m, idx) => ({
      stt: idx + 1, saintName: m.saintName || '—', name: m.name, phone: m.phone || '—',
      birthYear: m.birthYear || '—', grade: m.grade || '—', role: m.role,
      status: m.status === 'ACTIVE' ? 'Hoạt động' : m.status === 'ON_LEAVE' ? 'Tạm nghỉ' : 'Nghỉ hẳn',
      joinDate: m.joinDate || '—',
    }));
    const filename = `SoBo_CaVien_ThienThan_${new Date().toISOString().split('T')[0]}.xlsx`;
    try { await exportMembersToExcel(rows, filename); addToast('Đã xuất file Excel thành công'); }
    catch { addToast('Xuất Excel gặp lỗi. Vui lòng thử lại.', 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || isSubmitting) return;
    const saintName = (form.saintName ?? '').trim();
    const fullName = (form.name ?? '').trim();
    if (isDuplicateMember(saintName, fullName, editingMember?.id)) {
      addToast('Đã có ca viên trùng (Tên thánh + Họ + Tên). Vui lòng kiểm tra lại.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingMember) {
        updateMember({ ...editingMember, ...form } as Member);
        addToast('Đã cập nhật ca viên');
      } else {
        addMember({ ...form as Member, id: crypto.randomUUID(), choirId: 'c-thienthan', status: (form.status as Member['status']) || 'ACTIVE' });
        addToast('Đã thêm ca viên mới');
      }
      setIsModalOpen(false); setEditingMember(null); setForm(initialForm);
    } finally { setIsSubmitting(false); }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.id) { deleteMember(confirmDelete.id); addToast('Đã xóa ca viên khỏi danh sách'); }
    setConfirmDelete({ open: false, id: null, name: '' });
  };

  const memberStats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === 'ACTIVE').length;
    const onLeave = members.filter(m => m.status === 'ON_LEAVE').length;
    const retired = members.filter(m => m.status === 'RETIRED').length;
    return { total, active, onLeave, retired };
  }, [members]);

  const attendanceStats = useMemo(() => {
    const total = members.length;
    const currentDay = attendanceData.find(d => d.date === selectedDate);
    const presentCount = currentDay?.records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length || 0;
    return { total, presentCount };
  }, [members, attendanceData, selectedDate]);

  const openAddModal = () => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); };

  const statusBadge = (status: Member['status']) => {
    const map = {
      ACTIVE: { label: 'Hoạt động', c: 'pill pill-success' },
      ON_LEAVE: { label: 'Tạm nghỉ', c: 'pill pill-warning' },
      RETIRED: { label: 'Nghỉ hẳn', c: 'pill pill-muted' },
    };
    const s = map[status] || map.ACTIVE;
    return <span className={s.c}>{s.label}</span>;
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Tiêu đề + Action bar — kiểu Puzzler */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Ca Viên</h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">Sổ Bộ Ban Điều Hành Ca Đoàn Thiên Thần</p>
        <div className="members-action-bar mt-4">
          <span className="text-sm text-[var(--foreground-muted)]">Hiển thị <strong className="text-[var(--foreground)]">{filteredMembers.length}</strong> ca viên</span>
          <div className="flex-1 min-w-0" />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--foreground-muted)]" size={16} />
            <Input
              type="text"
              placeholder="Tìm tên, tên thánh..."
              className="pl-9 h-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2 shrink-0">
            <FileDown size={16} /> Xuất
          </Button>
          <Button onClick={openAddModal} className="flex items-center gap-2 shrink-0">
            <UserPlus size={16} /> Thêm ca viên
          </Button>
        </div>
      </div>

      {/* Tabs — Sổ Bộ / Điểm Danh */}
      <div className="members-page-tabs mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('LIST')}
          className={`members-page-tab ${activeTab === 'LIST' ? 'active' : ''}`}
        >
          Sổ Bộ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`members-page-tab ${activeTab === 'ATTENDANCE' ? 'active' : ''}`}
        >
          Điểm Danh
        </button>
      </div>

      {activeTab === 'LIST' ? (
        <>
          {/* Thống kê 4 ô */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Tổng ca viên', value: memberStats.total, icon: Users, iconBg: 'bg-[var(--background-muted)]', iconColor: 'text-[var(--foreground-muted)]' },
              { label: 'Hoạt động', value: memberStats.active, icon: UserCheck, iconBg: 'bg-[var(--success-bg)]', iconColor: 'text-[var(--success)]' },
              { label: 'Tạm nghỉ', value: memberStats.onLeave, icon: PauseCircle, iconBg: 'bg-[var(--warning-bg)]', iconColor: 'text-[var(--warning)]' },
              { label: 'Nghỉ hẳn', value: memberStats.retired, icon: UserCog, iconBg: 'bg-[var(--background-muted)]', iconColor: 'text-[var(--foreground-muted)]' },
            ].map((s, idx) => (
              <div key={idx} className="members-stat-card">
                <div className={`members-stat-icon ${s.iconBg} ${s.iconColor}`}>
                  <s.icon size={22} />
                </div>
                <div>
                  <p className="members-stat-value">{s.value}</p>
                  <p className="members-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Danh sách: card trên mobile, bảng trên desktop */}
          <div className="space-y-3 md:space-y-0">
            {/* Mobile: card list */}
            <div className="block md:hidden space-y-3">
              {filteredMembers.map((m) => (
                <div key={m.id} className="members-card-row">
                  <div className="members-card-avatar">{m.name.trim()[0] || '?'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--foreground)] truncate">{m.name}</p>
                    <p className="text-sm text-[var(--primary)] font-medium">{m.saintName || '—'}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-[var(--foreground-muted)] bg-[var(--background-muted)] px-2 py-0.5 rounded-lg">{m.role}</span>
                      {statusBadge(m.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }} className="p-2.5 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-muted)] transition-all" title="Sửa">
                      <Edit2 size={18} />
                    </button>
                    <button type="button" onClick={() => setConfirmDelete({ open: true, id: m.id, name: m.name })} className="p-2.5 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all" title="Xóa">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="members-empty-state">
                  <Users size={48} className="mx-auto text-[var(--foreground-muted)] opacity-50 mb-3" />
                  <p className="text-base font-semibold text-[var(--foreground-muted)]">Chưa ghi nhận ca viên nào</p>
                  <Button className="mt-4" onClick={openAddModal}>Thêm ca viên đầu tiên</Button>
                </div>
              )}
            </div>

            {/* Desktop: bảng kiểu Puzzler */}
            <div className="hidden md:block members-data-table-wrap">
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Tên Thánh</th>
                      <th>Họ và Tên</th>
                      <th className="text-center">Năm sinh</th>
                      <th>Lớp</th>
                      <th>Bổn phận</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-right">Tác vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="group">
                        <td><span className="font-semibold text-[var(--primary)]">{m.saintName || '—'}</span></td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--primary-muted)] flex items-center justify-center text-sm font-bold text-[var(--primary)] shrink-0">
                              {m.name.trim()[0] || '?'}
                            </div>
                            <span className="font-medium text-[var(--foreground)]">{m.name}</span>
                          </div>
                        </td>
                        <td className="text-center text-[var(--foreground-muted)]">{m.birthYear || '—'}</td>
                        <td className="text-[var(--foreground-muted)]">{m.grade || '—'}</td>
                        <td><span className="pill pill-muted">{m.role}</span></td>
                        <td className="text-center">{statusBadge(m.status)}</td>
                        <td className="text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }} className="p-2 hover:bg-[var(--primary-muted)] text-[var(--foreground-muted)] hover:text-[var(--primary)] rounded-xl transition-all" title="Sửa">
                              <Edit2 size={16} />
                            </button>
                            <button type="button" onClick={() => setConfirmDelete({ open: true, id: m.id, name: m.name })} className="p-2 hover:bg-[var(--error-bg)] text-[var(--foreground-muted)] hover:text-[var(--error)] rounded-xl transition-all" title="Xóa">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredMembers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-16 text-center">
                          <div className="members-empty-state inline-block">
                            <Users size={40} className="mx-auto text-[var(--foreground-muted)] mb-2 opacity-50" />
                            <p className="text-sm font-semibold text-[var(--foreground-muted)]">Chưa ghi nhận ca viên nào</p>
                            <Button className="mt-3" onClick={openAddModal}>Thêm ca viên đầu tiên</Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Tab Điểm Danh */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="liquid-glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] shrink-0">
                <CalendarDays size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Ngày điểm danh</p>
                <div className="flex items-center gap-1 mt-1">
                  <button type="button" onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-1 rounded-lg hover:bg-[var(--background-muted)] text-[var(--foreground-muted)] transition-colors"><ChevronLeft size={16} /></button>
                  <span className="text-lg font-bold text-[var(--foreground)] tabular-nums min-w-[120px] text-center">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-1 rounded-lg hover:bg-[var(--background-muted)] text-[var(--foreground-muted)] transition-colors"><ChevronRight size={16} /></button>
                </div>
                <button type="button" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="text-xs text-[var(--primary)] font-medium mt-1 hover:underline">Hôm nay</button>
              </div>
            </div>
            <div className="liquid-glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--success-bg)] flex items-center justify-center text-[var(--success)] shrink-0">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Hiện diện</p>
                <p className="text-2xl font-bold text-[var(--success)] tabular-nums mt-0.5">{attendanceStats.presentCount}<span className="text-sm font-medium text-[var(--foreground-muted)]">/{attendanceStats.total}</span></p>
              </div>
            </div>
            <div className="liquid-glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--error-bg)] flex items-center justify-center text-[var(--error)] shrink-0">
                <X size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Vắng mặt</p>
                <p className="text-2xl font-bold text-[var(--error)] tabular-nums mt-0.5">{attendanceStats.total - attendanceStats.presentCount}<span className="text-sm font-medium text-[var(--foreground-muted)]">/{attendanceStats.total}</span></p>
              </div>
            </div>
          </div>

          {/* Danh sách điểm danh: card mobile, table desktop */}
          <div className="space-y-3">
            <div className="block md:hidden space-y-3">
              {filteredMembers.map(m => {
                const record = attendanceData.find(d => d.date === selectedDate)?.records.find(r => r.memberId === m.id);
                const status = record?.status || 'ABSENT';
                const oneLineName = [m.saintName, m.name].filter(Boolean).join(' · ') || m.name;
                return (
                  <div key={m.id} className={`members-card-row ${status !== 'ABSENT' ? 'bg-[var(--background-muted)]/50 border-[var(--secondary)]/30' : ''}`}>
                    <div className={`members-card-avatar ${status === 'PRESENT' ? 'bg-[var(--secondary)] text-white' : status === 'LATE' ? 'bg-[var(--warning)] text-[var(--background)]' : 'bg-[var(--background-muted)] text-[var(--foreground-muted)]'}`}>
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--foreground)] truncate">{oneLineName}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {status === 'PRESENT' ? 'Hiện diện' : status === 'LATE' ? 'Đến trễ' : 'Vắng mặt'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all ${status === 'PRESENT' ? 'bg-[var(--secondary)] text-white shadow-sm' : 'bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--secondary)] hover:border-[var(--secondary)]/50'}`} title="Hiện diện">
                        <UserCheck size={20} />
                      </button>
                      <button type="button" onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all ${status === 'LATE' ? 'bg-[var(--warning)] text-[var(--background)] shadow-sm' : 'bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--warning)] hover:border-[var(--warning)]/50'}`} title="Đến trễ">
                        <Clock size={20} />
                      </button>
                      <button type="button" onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all ${status === 'ABSENT' ? 'bg-[var(--error)] text-white shadow-sm' : 'bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--error)] hover:border-[var(--error)]/50'}`} title="Báo vắng">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block liquid-glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--background-muted)]/80 border-b border-[var(--border)]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Tên Thánh + Họ và Tên</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Ghi nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredMembers.map(m => {
                      const record = attendanceData.find(d => d.date === selectedDate)?.records.find(r => r.memberId === m.id);
                      const status = record?.status || 'ABSENT';
                      const oneLineName = [m.saintName, m.name].filter(Boolean).join(' · ') || m.name;
                      return (
                        <tr key={m.id} className={`hover:bg-[var(--background-muted)]/50 transition-colors ${status !== 'ABSENT' ? 'bg-[var(--background-muted)]/30' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${status === 'PRESENT' ? 'bg-[var(--secondary)] text-white' : status === 'LATE' ? 'bg-[var(--warning)] text-[var(--background)]' : 'bg-[var(--background-muted)] text-[var(--foreground-muted)] border border-[var(--border)]'}`}>
                                {m.name[0]}
                              </div>
                              <span className="text-sm font-semibold text-[var(--foreground)] leading-tight truncate">{oneLineName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all ${status === 'PRESENT' ? 'bg-[var(--secondary)] text-white shadow-sm' : 'bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--secondary)] hover:border-[var(--secondary)]/50'}`} title="Hiện diện">
                                <UserCheck size={20} />
                              </button>
                              <button type="button" onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all ${status === 'LATE' ? 'bg-[var(--warning)] text-[var(--background)] shadow-sm' : 'bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--warning)] hover:border-[var(--warning)]/50'}`} title="Đến trễ">
                                <Clock size={20} />
                              </button>
                              <button type="button" onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl flex items-center justify-center transition-all ${status === 'ABSENT' ? 'bg-[var(--error)] text-white shadow-sm' : 'bg-[var(--background-elevated)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--error)] hover:border-[var(--error)]/50'}`} title="Báo vắng">
                                <X size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm/Sửa ca viên */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/30 backdrop-blur-sm">
          <Card variant="glass" className="w-full max-w-lg rounded-2xl my-8 relative z-[2001] shadow-[var(--shadow-lg)] shrink-0 overflow-hidden">
            <div className="flex justify-between items-start p-6 pb-0">
              <div className="space-y-1">
                <h3 className="sacred-title text-xl font-bold leading-none">{editingMember ? 'Cập nhật ca viên' : 'Thêm ca viên'}</h3>
                <p className="section-label mt-1">Sổ Bộ Ban Điều Hành Ca Đoàn Thiên Thần</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-muted)] transition-all" aria-label="Đóng"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Tên Thánh</label>
                  <Input value={form.saintName ?? ''} onChange={e => setForm({ ...form, saintName: e.target.value })} placeholder="VD: Phêrô" />
                </div>
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Họ và Tên</label>
                  <Input required value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Năm sinh</label>
                  <Input value={form.birthYear ?? ''} onChange={e => setForm({ ...form, birthYear: e.target.value })} placeholder="VD: 1995" />
                </div>
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Giọng / Lớp</label>
                  <Input value={form.grade ?? ''} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="VD: Xưng Tội 1A" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Vai trò</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })} className="w-full h-11 px-4 rounded-[var(--radius-md)] text-sm border border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none cursor-pointer">
                    {['Thành viên', 'Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Nhạc công'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Trạng thái</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as MemberStatus })} className="w-full h-11 px-4 rounded-[var(--radius-md)] text-sm border border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none cursor-pointer">
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="ON_LEAVE">Tạm nghỉ</option>
                    <option value="RETIRED">Nghỉ hẳn</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Hủy</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-[2] flex items-center justify-center gap-2">
                  {isSubmitting ? 'Đang lưu...' : <><Save size={18} /> Lưu ca viên</>}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete.open} title="Xóa ca viên"
        message={`Bạn có chắc muốn xóa ca viên "${confirmDelete.name}" khỏi danh sách? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa" onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null, name: '' })} danger
      />

    </div>
  );
};

export default MemberManagement;
