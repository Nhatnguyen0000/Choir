
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  X, 
  Edit2, 
  Trash2, 
  Check, 
  Calendar,
  Clock,
  FileDown,
  Users,
  CheckCircle2,
  XCircle,
  ChevronDown,
  UserCheck,
  Save,
  UserCircle,
  Phone,
  GraduationCap,
  Briefcase,
  Filter
} from 'lucide-react';
import { Member } from '../types';
import { useMemberStore } from '../store';
import * as XLSX from 'xlsx';
import Tooltip from './Tooltip';

type SubTab = 'LIST' | 'ATTENDANCE';

const MemberManagement: React.FC = () => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  
  const [activeTab, setActiveTab] = useState<SubTab>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ON_LEAVE' | 'RETIRED'>('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const initialForm: Partial<Member> = {
    name: '', 
    saintName: '', 
    role: 'Ca viên', 
    phone: '', 
    status: 'ACTIVE', 
    gender: 'Nam', 
    grade: '',
    birthYear: '',
    joinDate: new Date().toISOString().split('T')[0]
  };

  const [form, setForm] = useState<Partial<Member>>(initialForm);

  const filteredMembers = useMemo(() => {
    let result = members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (statusFilter !== 'ALL') {
      result = result.filter(m => m.status === statusFilter);
    }
    
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [members, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === 'ACTIVE').length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendanceData.find(d => d.date === today)?.records.filter(r => r.status === 'PRESENT').length || 0;
    
    return { total, active, todayAttendance };
  }, [members, attendanceData]);

  const currentAttendance = useMemo(() => {
    return attendanceData.find(d => d.date === selectedDate)?.records || [];
  }, [selectedDate, attendanceData]);

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    
    const data = members.map((m, index) => ({
      'STT': index + 1,
      'Tên Thánh': m.saintName || '',
      'Họ và Tên': m.name,
      'Năm sinh': m.birthYear || '',
      'Lớp/Nhóm': m.grade || '',
      'Bổn phận': m.role,
      'Số điện thoại': m.phone || '',
      'Giới tính': m.gender,
      'Ngày tham gia': m.joinDate ? new Date(m.joinDate).toLocaleDateString('vi-VN') : '',
      'Trạng thái': m.status === 'ACTIVE' ? 'Đang hoạt động' : m.status === 'ON_LEAVE' ? 'Tạm nghỉ' : 'Đã nghỉ'
    }));

    const headerInfo = [
      ['CA ĐOÀN THIÊN THẦN - GIÁO XỨ BẮC HÒA'],
      ['DANH SÁCH CA VIÊN'],
      [`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')} - ${new Date().toLocaleTimeString('vi-VN')}`],
      [''],
      ['STT', 'Tên Thánh', 'Họ và Tên', 'Năm sinh', 'Lớp/Nhóm', 'Bổn phận', 'Số điện thoại', 'Giới tính', 'Ngày tham gia', 'Trạng thái']
    ];
    
    const wsWithHeader = XLSX.utils.aoa_to_sheet(headerInfo);
    XLSX.utils.sheet_add_json(wsWithHeader, data, { origin: 'A6', skipHeader: true });
    
    const colWidths = [
      { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 10 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }
    ];
    wsWithHeader['!cols'] = colWidths;
    
    wsWithHeader['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }
    ];
    
    XLSX.utils.book_append_sheet(wb, wsWithHeader, "Danh Sách Ca Viên");
    const fileName = `Danh_Sach_Ca_Vien_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    
    if (editingMember) {
      updateMember({ ...editingMember, ...form } as Member);
    } else {
      addMember({ ...form as Member, id: `m-${Date.now()}`, choirId: 'c-thienthan', status: 'ACTIVE' });
    }
    setIsModalOpen(false);
    setEditingMember(null);
    setForm(initialForm);
  };

  const handleDeleteMember = (id: string, name: string) => {
    const isConfirmed = window.confirm(
      `Xác nhận xóa ca viên: "${name}"?\n\nDữ liệu sẽ bị xóa khỏi hệ thống.`
    );
    if (isConfirmed) {
      deleteMember(id);
    }
  };

  const handleEdit = (m: Member) => {
    setEditingMember(m);
    setForm(m);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12 pt-2 relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="sacred-title text-2xl md:text-3xl font-black text-slate-900 italic leading-none">Sổ Bộ Ca Viên</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Quản lý danh sách ca viên</p>
        </div>
        <div className="flex gap-2">
          <Tooltip content="Xuất danh sách ra file Excel" position="bottom">
            <button 
              onClick={handleExport}
              className="glass-button px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border-white/60 hover:border-amberGold transition-all"
            >
              <FileDown size={16} className="md:w-[18px] md:h-[18px]" /> 
              <span className="hidden sm:inline">Xuất Excel</span>
              <span className="sm:hidden">Xuất</span>
            </button>
          </Tooltip>
          <Tooltip content="Thêm ca viên mới" position="bottom">
            <button 
              onClick={() => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); }}
              className="active-pill px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              <UserPlus size={16} className="md:w-[18px] md:h-[18px]" /> 
              <span>Thêm Ca Viên</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: 'Tổng', value: stats.total, color: 'text-slate-900' },
          { label: 'Hoạt động', value: stats.active, color: 'text-emerald-600' },
          { label: 'Hôm nay', value: stats.todayAttendance, color: 'text-amberGold' },
        ].map((card, i) => (
          <div key={i} className="glass-card rounded-xl md:rounded-2xl p-4 md:p-5 text-center">
            <p className={`text-2xl md:text-3xl font-black ${card.color} leading-none mb-1`}>{card.value}</p>
            <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs và Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('LIST')} 
            className={`flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'LIST' 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'glass-card text-slate-400 hover:text-slate-900'
            }`}
          >
            Danh Sách
          </button>
          <button 
            onClick={() => setActiveTab('ATTENDANCE')} 
            className={`flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'ATTENDANCE' 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'glass-card text-slate-400 hover:text-slate-900'
            }`}
          >
            Điểm Danh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc Tên Thánh..." 
              className="w-full pl-12 pr-4 py-3 glass-card rounded-xl md:rounded-2xl outline-none shadow-sm focus:ring-2 focus:ring-amberGold/50 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'LIST' && (
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full sm:w-48 pl-12 pr-4 py-3 glass-card rounded-xl md:rounded-2xl outline-none shadow-sm focus:ring-2 focus:ring-amberGold/50 transition-all text-sm font-medium appearance-none cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="ON_LEAVE">Tạm nghỉ</option>
                <option value="RETIRED">Đã nghỉ</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {activeTab === 'LIST' ? (
        /* Danh Sách Ca Viên - Hiển thị đầy đủ thông tin */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMembers.map((m) => (
            <div key={m.id} className="glass-card rounded-xl md:rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all group">
              {/* Ảnh đại diện và Tên */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 md:w-18 md:h-18 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center font-black text-lg md:text-xl text-slate-400 border-2 border-slate-200 shadow-inner overflow-hidden flex-shrink-0">
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={32} className="md:w-10 md:h-10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-black text-slate-900 leading-tight truncate">{m.name}</h3>
                  {m.saintName && (
                    <p className="text-[10px] md:text-[11px] font-bold text-amberGold italic uppercase tracking-widest mt-1 truncate">
                      {m.saintName}
                    </p>
                  )}
                </div>
              </div>

              {/* Thông tin chi tiết: Năm Sinh, Lớp, Vai trò */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 font-bold">
                    <span className="text-slate-400">Năm sinh:</span> <span className="text-slate-900">{m.birthYear || '---'}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 font-bold">
                    <span className="text-slate-400">Lớp:</span> <span className="text-slate-900">{m.grade || '---'}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 font-bold">
                    <span className="text-slate-400">Vai trò:</span> <span className="text-slate-900">{m.role}</span>
                  </span>
                </div>

                {m.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 font-bold truncate">{m.phone}</span>
                  </div>
                )}
              </div>

              {/* Trạng thái và Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  {m.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                      <CheckCircle2 size={10} />
                      Đang hoạt động
                    </span>
                  ) : m.status === 'ON_LEAVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amberGold text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                      <Clock size={10} />
                      Tạm nghỉ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                      <XCircle size={10} />
                      Đã nghỉ
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <Tooltip content="Sửa thông tin" position="top">
                    <button 
                      onClick={() => handleEdit(m)}
                      className="p-2 glass-button rounded-lg text-slate-400 hover:text-slate-900 border-white/60 transition-all"
                    >
                      <Edit2 size={14} className="md:w-4 md:h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Xóa ca viên" position="top">
                    <button 
                      onClick={() => handleDeleteMember(m.id, m.name)}
                      className="p-2 glass-button rounded-lg text-slate-400 hover:text-crimsonRed border-white/60 transition-all"
                    >
                      <Trash2 size={14} className="md:w-4 md:h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
          
          {filteredMembers.length === 0 && (
            <div className="col-span-full glass-card rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
              <Users size={40} className="md:w-12 md:h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-bold text-sm md:text-base">Không tìm thấy ca viên</p>
              <p className="text-slate-300 text-xs md:text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      ) : (
        /* Điểm Danh - Đơn giản hóa */
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center gap-4">
            <Calendar size={20} className="text-amberGold flex-shrink-0" />
            <div className="flex-1">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ngày hiệp thông</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
                className="text-base md:text-lg font-black text-slate-900 bg-transparent outline-none cursor-pointer w-full" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredMembers.map((m) => {
              const record = currentAttendance.find(r => r.memberId === m.id);
              const status = record?.status || 'ABSENT';
              return (
                <div key={m.id} className={`glass-card rounded-xl md:rounded-2xl p-4 flex items-center justify-between ${status !== 'ABSENT' ? 'ring-2 ring-slate-900/5' : ''}`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-black text-base md:text-lg shadow-lg flex-shrink-0 ${
                      status === 'PRESENT' ? 'bg-slate-900 text-white' : 
                      status === 'LATE' ? 'bg-amberGold text-white' : 
                      'bg-slate-50 text-slate-300 shadow-inner'
                    }`}>
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span>{m.name[0]}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm md:text-base font-black text-slate-900 leading-tight truncate">{m.name}</h4>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{m.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Tooltip content="Có mặt" position="top">
                      <button 
                        onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} 
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all ${
                          status === 'PRESENT' 
                            ? 'bg-slate-900 text-white shadow-xl' 
                            : 'glass-button text-slate-300 border-white/60 hover:bg-slate-50'
                        }`}
                      >
                        <Check size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Muộn" position="top">
                      <button 
                        onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} 
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all ${
                          status === 'LATE' 
                            ? 'bg-amberGold text-white shadow-xl' 
                            : 'glass-button text-slate-300 border-white/60 hover:bg-amber-50'
                        }`}
                      >
                        <Clock size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Vắng" position="top">
                      <button 
                        onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} 
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all ${
                          status === 'ABSENT' 
                            ? 'bg-rose-500 text-white shadow-xl' 
                            : 'glass-button text-slate-300 border-white/60 hover:bg-rose-50'
                        }`}
                      >
                        <X size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="glass-modal-container">
          <div 
            className="glass-modal-backdrop" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div 
            className="glass-modal-card w-full max-w-2xl rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 my-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxHeight: 'calc(100vh - 2rem)',
              marginTop: 'auto',
              marginBottom: 'auto'
            }}
          >
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
               <div>
                 <h3 className="sacred-title text-xl md:text-2xl font-black text-slate-900 italic leading-none">
                   {editingMember ? 'Sửa thông tin ca viên' : 'Thêm ca viên mới'}
                 </h3>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                   {editingMember ? 'Cập nhật thông tin thành viên' : 'Ghi danh vào sổ bộ ca đoàn'}
                 </p>
               </div>
               <button 
                 onClick={() => setIsModalOpen(false)} 
                 className="p-2 glass-button rounded-xl text-slate-300 hover:text-slate-900 border-white/60 transition-all"
               >
                 <X size={20} />
               </button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Tên Thánh
                    </label>
                    <input 
                      type="text" 
                      value={form.saintName} 
                      onChange={e => setForm({...form, saintName: e.target.value})} 
                      placeholder="VD: Phêrô, Maria..."
                      className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all bg-slate-50/50 focus:bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Họ và Tên <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      placeholder="Nhập họ và tên đầy đủ"
                      className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all bg-slate-50/50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Năm sinh
                    </label>
                    <input 
                      type="text" 
                      value={form.birthYear} 
                      onChange={e => setForm({...form, birthYear: e.target.value})} 
                      placeholder="VD: 2005"
                      className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all bg-slate-50/50 focus:bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Lớp/Nhóm
                    </label>
                    <input 
                      type="text" 
                      value={form.grade} 
                      onChange={e => setForm({...form, grade: e.target.value})} 
                      placeholder="VD: 12A1, Nhóm 1..."
                      className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all bg-slate-50/50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Số điện thoại
                    </label>
                    <input 
                      type="tel" 
                      value={form.phone} 
                      onChange={e => setForm({...form, phone: e.target.value})} 
                      placeholder="VD: 0901234567"
                      className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all bg-slate-50/50 focus:bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Giới tính
                    </label>
                    <div className="relative">
                      <select 
                        value={form.gender} 
                        onChange={e => setForm({...form, gender: e.target.value as any})} 
                        className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all appearance-none cursor-pointer bg-slate-50/50 focus:bg-white"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Bổn phận
                    </label>
                    <div className="relative">
                      <select 
                        value={form.role} 
                        onChange={e => setForm({...form, role: e.target.value as any})} 
                        className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all appearance-none cursor-pointer bg-slate-50/50 focus:bg-white"
                      >
                        {['Ca viên', 'Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Nhạc công'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Trạng thái
                    </label>
                    <div className="relative">
                      <select 
                        value={form.status} 
                        onChange={e => setForm({...form, status: e.target.value as any})} 
                        className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border-2 border-slate-200 focus:border-amberGold transition-all appearance-none cursor-pointer bg-slate-50/50 focus:bg-white"
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="ON_LEAVE">Tạm nghỉ</option>
                        <option value="RETIRED">Đã nghỉ</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-3 px-6 rounded-xl text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all border-2 border-slate-200"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 px-6 active-pill rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> 
                    {editingMember ? 'Cập nhật' : 'Lưu thông tin'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
