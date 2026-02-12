
import React, { useState, useMemo } from 'react';
import { 
  Search, UserPlus, FileDown, 
  X, Edit2, Trash2, ChevronDown, 
  CheckCircle2, Users, Clock, 
  UserCheck, Save, Filter, Download,
  MoreVertical, UserCircle
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

  const handleExport = () => {
    const data = filteredMembers.map((m, idx) => ({
      'STT': idx + 1,
      'Tên Thánh': m.saintName || '',
      'Họ và Tên': m.name,
      'Năm sinh': m.birthYear || '',
      'Giọng/Lớp': m.grade || '',
      'Bổn phận': m.role,
      'Trạng thái': m.status === 'ACTIVE' ? 'Hoạt động' : m.status === 'ON_LEAVE' ? 'Tạm nghỉ' : 'Nghỉ hẳn'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sổ_Bộ_Ca_Viên");
    XLSX.writeFile(wb, `SoBo_CaVien_ThienThan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
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
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.id) {
      deleteMember(confirmDelete.id);
      addToast('Đã xóa ca viên khỏi danh sách');
    }
    setConfirmDelete({ open: false, id: null, name: '' });
  };

  const attendanceStats = useMemo(() => {
    const total = members.length;
    const currentDay = attendanceData.find(d => d.date === selectedDate);
    const presentCount = currentDay?.records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length || 0;
    return { total, presentCount };
  }, [members, attendanceData, selectedDate]);

  return (
    <div className="w-full space-y-4 animate-fade-in pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card card p-6 rounded-2xl">
        <div className="space-y-1.5">
          <h1 className="sacred-title text-2xl font-bold text-slate-900 leading-none italic">Sổ Bộ Hiệp Thông</h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em] mt-1 leading-none italic">Thành viên Ca đoàn Thiên Thần</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none glass-button px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-royalBlue flex items-center justify-center gap-2"
          >
            <Download size={16} /> <span className="hidden sm:inline">Xuất Dữ Liệu</span>
          </button>
          <button 
            onClick={() => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); }}
            className="flex-1 sm:flex-none active-glass px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={16} /> <span className="hidden sm:inline">Ghi Danh Mới</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-8 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc tên thánh..." 
            className="w-full pl-12 pr-6 py-3.5 glass-card rounded-2xl outline-none text-[12px] bg-white/50 border-white focus:border-amberGold transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-4 flex p-1.5 bg-slate-200/40 rounded-2xl backdrop-blur-sm border border-white/50">
          <button 
            onClick={() => setActiveTab('LIST')} 
            className={`flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase transition-all tracking-widest ${activeTab === 'LIST' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Sổ Bộ
          </button>
          <button 
            onClick={() => setActiveTab('ATTENDANCE')} 
            className={`flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase transition-all tracking-widest ${activeTab === 'ATTENDANCE' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Điểm Danh
          </button>
        </div>
      </div>

      {activeTab === 'LIST' ? (
        <div className="glass-card card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
                <tr>
                  <th className="px-8 py-5">Tên Thánh</th>
                  <th className="px-6 py-5">Họ và Tên</th>
                  <th className="px-4 py-5 text-center">Năm sinh</th>
                  <th className="px-6 py-5">Lớp</th>
                  <th className="px-6 py-5">Bổn phận</th>
                  <th className="px-6 py-5 text-center">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-8 py-4">
                      <span className="text-[13px] font-bold text-amber-700 italic">{m.saintName || '---'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-bold text-slate-900">{m.name}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-[13px] text-slate-500 font-medium">{m.birthYear || '---'}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-500 italic font-medium">{m.grade || '---'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100/80 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`w-2 h-2 rounded-full mx-auto shadow-sm ${m.status === 'ACTIVE' ? 'bg-emeraldGreen' : m.status === 'ON_LEAVE' ? 'bg-amberGold' : 'bg-slate-300'}`} title={m.status}></div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }}
                          className="p-2 hover:bg-royalBlue/10 text-slate-300 hover:text-royalBlue rounded-xl transition-all"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => setConfirmDelete({ open: true, id: m.id, name: m.name })}
                          className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-xl transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-24 text-center opacity-30">
                      <Users size={48} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest italic">Chưa ghi nhận ca viên nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Attendance View - Simplified List */
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 border-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amberGold/10 rounded-2xl flex items-center justify-center text-amberGold border border-amberGold/20 shadow-inner">
                <Clock size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Ngày Điểm Danh</p>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={e => setSelectedDate(e.target.value)}
                  className="text-lg font-bold text-slate-900 bg-transparent outline-none cursor-pointer border-b border-slate-200 mt-1 pb-1"
                />
              </div>
            </div>
            <div className="flex gap-10 text-center">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider italic">Hiện diện</p>
                <p className="text-2xl font-bold text-emeraldGreen leading-tight">{attendanceStats.presentCount}</p>
              </div>
              <div className="w-px h-10 bg-slate-200/50"></div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider italic">Vắng mặt</p>
                <p className="text-2xl font-bold text-rose-500 leading-tight">{attendanceStats.total - attendanceStats.presentCount}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] overflow-hidden bg-white/40 border-white shadow-sm">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[8px] font-bold uppercase tracking-widest italic">
                  <tr>
                    <th className="px-10 py-5">Họ và Tên / Tên Thánh</th>
                    <th className="px-6 py-5">Bổn phận</th>
                    <th className="px-10 py-5 text-right">Ghi nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredMembers.map(m => {
                    const record = attendanceData.find(d => d.date === selectedDate)?.records.find(r => r.memberId === m.id);
                    const status = record?.status || 'ABSENT';
                    return (
                      <tr key={m.id} className={`hover:bg-white/60 transition-colors ${status !== 'ABSENT' ? 'bg-slate-50/20' : ''}`}>
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white' : status === 'LATE' ? 'bg-amberGold text-white' : 'bg-white border border-slate-200 text-slate-300'}`}>
                              {m.name[0]}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[13px] font-bold text-slate-900 leading-tight">{m.name}</p>
                              <p className="text-[9px] font-bold text-amber-700 uppercase italic tracking-wider">{m.saintName || '---'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">{m.role}</span>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${status === 'PRESENT' ? 'bg-emeraldGreen text-white' : 'bg-white border border-slate-200 text-slate-300 hover:text-emeraldGreen'}`}
                              title="Hiện diện"
                            >
                              <UserCheck size={20} />
                            </button>
                            <button 
                              onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${status === 'LATE' ? 'bg-amberGold text-white' : 'bg-white border border-slate-200 text-slate-300 hover:text-amberGold'}`}
                              title="Đến trễ"
                            >
                              <Clock size={20} />
                            </button>
                            <button 
                              onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${status === 'ABSENT' ? 'bg-rose-500 text-white' : 'bg-white border border-slate-200 text-slate-300 hover:text-rose-500'}`}
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
          <div className="glass-card w-full max-w-lg rounded-[3rem] p-10 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 border-white">
             <div className="flex justify-between items-start mb-10">
               <div className="space-y-1">
                 <h3 className="sacred-title text-2xl font-bold text-slate-900 leading-none italic">{editingMember ? 'Cập Nhật Sổ Bộ' : 'Ghi Danh Ca Viên'}</h3>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-2 italic">Dâng hiến thời gian phục vụ Thiên Chúa</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 glass-button border-none rounded-2xl text-slate-300 hover:text-slate-900 shadow-sm transition-transform hover:rotate-90"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Tên Thánh</label>
                    <input 
                      type="text" 
                      value={form.saintName} 
                      onChange={e => setForm({...form, saintName: e.target.value})} 
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50" 
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
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50" 
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
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50" 
                      placeholder="VD: 1995" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Giọng / Lớp</label>
                    <input 
                      type="text" 
                      value={form.grade} 
                      onChange={e => setForm({...form, grade: e.target.value})} 
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50" 
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
                        className="w-full px-6 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none appearance-none cursor-pointer border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50"
                      >
                        {['Ca viên', 'Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Nhạc công'].map(r => <option key={r} value={r}>{r}</option>)}
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
                        className="w-full px-6 py-4 glass-card rounded-2xl text-[14px] font-bold outline-none appearance-none cursor-pointer border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50"
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
                    HUỶ THAO TÁC
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-4.5 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
                  >
                    <Save size={18} /> LƯU CA VIÊN
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
    </div>
  );
};

export default MemberManagement;
