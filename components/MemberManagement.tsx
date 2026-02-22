
import React, { useState, useMemo } from 'react';
import { 
  Search, UserPlus, FileDown, 
  X, Edit2, Trash2, ChevronDown, 
  Users, Clock, UserCheck, Save,
  UserCog, PauseCircle
} from 'lucide-react';
import { Member, MemberStatus } from '../types';
import { useMemberStore, useToastStore } from '../store';
import ConfirmDialog from './ConfirmDialog';
import * as XLSX from 'xlsx';

type SubTab = 'LIST' | 'ATTENDANCE';

const MemberManagement: React.FC = () => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  const addToast = useToastStore((s) => s.addToast);
  
  const [activeTab, setActiveTab] = useState<SubTab>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; name: string }>({ open: false, id: null, name: '' });

  const initialForm: Partial<Member> = {
    name: '', 
    saintName: '', 
    role: 'Thành viên', 
    phone: '', 
    status: 'ACTIVE', 
    gender: 'Nam', 
    grade: '', 
    birthYear: '', 
    joinDate: new Date().toISOString().split('T')[0]
  };
  const [form, setForm] = useState<Partial<Member>>(initialForm);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [members, searchTerm]);

  /** Tách "Họ và tên" thành họ (từ đầu) và tên (từ cuối) để so trùng. */
  const parseHoTen = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
    const ho = parts[0] ?? '';
    const ten = parts[parts.length - 1] ?? '';
    return { ho, ten };
  };

  /** Chuẩn hóa để so sánh (bỏ dấu, viết thường). */
  const normalize = (s: string) => (s || '').trim().toLowerCase();

  /** Kiểm tra trùng đủ 3 yếu tố: tên thánh + họ + tên. Khác 1 trong 3 thì không trùng. */
  const isDuplicateMember = (saintName: string, fullName: string, excludeId?: string) => {
    const { ho: newHo, ten: newTen } = parseHoTen(fullName);
    const nSaint = normalize(saintName);
    const nHo = normalize(newHo);
    const nTen = normalize(newTen);
    return members.some(m => {
      if (excludeId && m.id === excludeId) return false;
      const { ho, ten } = parseHoTen(m.name);
      return normalize(m.saintName ?? '') === nSaint && normalize(ho) === nHo && normalize(ten) === nTen;
    });
  };

  const handleExport = () => {
    const headers = ['STT', 'Tên Thánh', 'Họ và Tên', 'Điện thoại', 'Năm sinh', 'Giọng/Lớp', 'Bổn phận', 'Trạng thái', 'Ngày gia nhập'];
    const data = filteredMembers.map((m, idx) => [
      idx + 1,
      m.saintName || '—',
      m.name,
      m.phone || '—',
      m.birthYear || '—',
      m.grade || '—',
      m.role,
      m.status === 'ACTIVE' ? 'Hoạt động' : m.status === 'ON_LEAVE' ? 'Tạm nghỉ' : 'Nghỉ hẳn',
      m.joinDate || '—'
    ]);
    const wsData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const colWidths = [
      { wch: 6 },  // STT
      { wch: 16 }, // Tên Thánh
      { wch: 24 }, // Họ và Tên
      { wch: 14 }, // Điện thoại
      { wch: 10 }, // Năm sinh
      { wch: 14 }, // Giọng/Lớp
      { wch: 14 }, // Bổn phận
      { wch: 12 }, // Trạng thái
      { wch: 14 }, // Ngày gia nhập
    ];
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sổ Bộ Ca Viên');
    XLSX.writeFile(wb, `SoBo_CaVien_ThienThan_${new Date().toISOString().split('T')[0]}.xlsx`);
    addToast('Đã xuất file Excel thành công');
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
      setIsModalOpen(false);
      setEditingMember(null);
      setForm(initialForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.id) {
      deleteMember(confirmDelete.id);
      addToast('Đã xóa ca viên khỏi danh sách');
    }
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

  const openAddModal = () => {
    setEditingMember(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full animate-fade-in pb-24 sm:pb-28 bg-gradient-to-b from-slate-50 to-slate-100/60 min-h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="sticky top-0 z-[100] bg-white border-b border-slate-200/80 shadow-sm px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-baseline gap-2 sm:gap-4 min-w-0">
            <div className="relative">
              <h1 className="sacred-title text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-none italic">Ca Viên</h1>
              <span className="absolute left-0 -bottom-1 w-10 sm:w-12 h-1 bg-amber-400/80 rounded-full" aria-hidden />
            </div>
            <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:block">Sổ Bộ Ca đoàn Thiên Thần</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-600 flex items-center justify-center gap-1.5 border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-colors touch-manipulation"
            >
              <FileDown size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Xuất Excel</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex-1 sm:flex-none bg-slate-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:bg-slate-800 transition-colors touch-manipulation"
            >
              <UserPlus size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Thêm Ca Viên</span>
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1.5 sm:hidden">Sổ Bộ Ca đoàn Thiên Thần</p>

        {/* Tabs + Tìm kiếm */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 mt-3 sm:mt-4">
          <div className="lg:col-span-8 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm tên, tên thánh..."
              className="w-full pl-10 sm:pl-11 pr-4 sm:pr-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl outline-none text-sm bg-slate-50 border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex rounded-xl sm:rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              onClick={() => setActiveTab('LIST')}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase transition-all tracking-widest touch-manipulation ${activeTab === 'LIST' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sổ Bộ
            </button>
            <button
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase transition-all tracking-widest touch-manipulation ${activeTab === 'ATTENDANCE' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Điểm Danh
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 sm:pt-5 px-0 space-y-4 sm:space-y-5">
      {activeTab === 'LIST' ? (
        <>
          {/* Thẻ thống kê */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex">
              <div className="w-1.5 bg-slate-400 shrink-0" />
              <div className="flex-1 p-3 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Users size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 truncate">Tổng ca viên</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{memberStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex">
              <div className="w-1.5 bg-emerald-500 shrink-0" />
              <div className="flex-1 p-3 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <UserCheck size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 truncate">Hoạt động</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{memberStats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex">
              <div className="w-1.5 bg-amber-500 shrink-0" />
              <div className="flex-1 p-3 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <PauseCircle size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 truncate">Tạm nghỉ</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{memberStats.onLeave}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex">
              <div className="w-1.5 bg-slate-300 shrink-0" />
              <div className="flex-1 p-3 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <UserCog size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 truncate">Nghỉ hẳn</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{memberStats.retired}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide max-h-[calc(100vh-360px)] overflow-y-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Tên Thánh</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Họ và Tên</th>
                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">Năm sinh</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Lớp</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Bổn phận</th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">Trạng thái</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-amber-700">{m.saintName || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                            {m.name.trim()[0] || '?'}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-slate-600">{m.birthYear || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{m.grade || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                          {m.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                          m.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                          m.status === 'ON_LEAVE' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {m.status === 'ACTIVE' ? 'Hoạt động' : m.status === 'ON_LEAVE' ? 'Tạm nghỉ' : 'Nghỉ hẳn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }}
                            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-royalBlue rounded-lg transition-all"
                            title="Sửa"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ open: true, id: m.id, name: m.name })}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <Users size={40} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Chưa ghi nhận ca viên nào</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Điểm Danh */
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Clock size={26} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày Điểm Danh</p>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="text-base font-bold text-slate-900 bg-transparent outline-none cursor-pointer border-b-2 border-slate-200 mt-1 pb-1 focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-12 text-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hiện diện</p>
                <p className="text-2xl font-bold text-emerald-600 tabular-nums">{attendanceStats.presentCount}</p>
              </div>
              <div className="w-px h-12 bg-slate-200/80" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vắng mặt</p>
                <p className="text-2xl font-bold text-rose-500 tabular-nums">{attendanceStats.total - attendanceStats.presentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50/80 border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Tên Thánh + Họ và Tên</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Ghi nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredMembers.map(m => {
                    const record = attendanceData.find(d => d.date === selectedDate)?.records.find(r => r.memberId === m.id);
                    const status = record?.status || 'ABSENT';
                    const oneLineName = [m.saintName, m.name].filter(Boolean).join(' · ') || m.name;
                    return (
                      <tr key={m.id} className={`hover:bg-slate-50/80 transition-colors ${status !== 'ABSENT' ? 'bg-slate-50/50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${status === 'PRESENT' ? 'bg-slate-900 text-white' : status === 'LATE' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                              {m.name[0]}
                            </div>
                            <span className="text-sm font-bold text-slate-900 leading-tight truncate">{oneLineName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-emerald-600'}`}
                              title="Hiện diện"
                            >
                              <UserCheck size={20} />
                            </button>
                            <button 
                              onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'LATE' ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-amber-500'}`}
                              title="Đến trễ"
                            >
                              <Clock size={20} />
                            </button>
                            <button 
                              onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'ABSENT' ? 'bg-rose-500 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-rose-500'}`}
                              title="Báo vắng"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Modal Thêm/Sửa Ca Viên */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl my-8 relative z-[2001] shadow-2xl border border-slate-200/80 shrink-0 overflow-hidden">
             <div className="h-1.5 w-full bg-amber-400 shrink-0" aria-hidden />
             <div className="flex justify-between items-start p-8 sm:p-10 pb-0">
               <div className="space-y-1">
                 <h3 className="sacred-title text-xl font-bold text-slate-900 leading-none italic">{editingMember ? 'Cập nhật ca viên' : 'Thêm ca viên'}</h3>
                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Sổ Bộ Ca đoàn Thiên Thần</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all" aria-label="Đóng"><X size={22} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-8 px-8 sm:px-10 pb-8 sm:pb-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Tên Thánh</label>
                    <input 
                      type="text" 
                      value={form.saintName} 
                      onChange={e => setForm({...form, saintName: e.target.value})} 
                      className="w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all bg-slate-50/80" 
                      placeholder="VD: Phêrô" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Họ và Tên</label>
                    <input 
                      type="text" 
                      required 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      className="w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all bg-slate-50/80" 
                      placeholder="Nguyễn Văn A" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Năm sinh</label>
                    <input 
                      type="text" 
                      value={form.birthYear} 
                      onChange={e => setForm({...form, birthYear: e.target.value})} 
                      className="w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all bg-slate-50/80" 
                      placeholder="VD: 1995" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Giọng / Lớp</label>
                    <input 
                      type="text" 
                      value={form.grade} 
                      onChange={e => setForm({...form, grade: e.target.value})} 
                      className="w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all bg-slate-50/80" 
                      placeholder="VD: Xưng Tội 1A" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Vai trò</label>
                    <div className="relative">
                      <select 
                        value={form.role} 
                        onChange={e => setForm({...form, role: e.target.value as any})} 
                        className="w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all bg-slate-50/80"
                      >
                        {['Thành viên', 'Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Nhạc công'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Trạng thái</label>
                    <div className="relative">
                      <select 
                        value={form.status} 
                        onChange={e => setForm({...form, status: e.target.value as MemberStatus})} 
                        className="w-full px-5 py-3.5 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all bg-slate-50/80"
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="ON_LEAVE">Tạm nghỉ</option>
                        <option value="RETIRED">Nghỉ hẳn</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4.5 text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] hover:text-slate-900 transition-all italic"
                  >
                    HỦY THAO TÁC
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {isSubmitting ? 'Đang lưu...' : <><Save size={18} /> LƯU CA VIÊN</>}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete.open}
        title="Xóa ca viên"
        message={`Bạn có chắc muốn xóa ca viên "${confirmDelete.name}" khỏi danh sách? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ open: false, id: null, name: '' })}
        danger
      />

      {/* Nút Thêm cố định góc phải */}
      {activeTab === 'LIST' && (
        <button
          onClick={openAddModal}
          className="fixed bottom-24 right-4 md:right-6 z-[90] w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform hover:shadow-xl"
          title="Thêm ca viên"
        >
          <UserPlus size={24} />
        </button>
      )}
    </div>
  );
};

export default MemberManagement;
