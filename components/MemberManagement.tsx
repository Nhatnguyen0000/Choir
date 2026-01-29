import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  X, 
  Edit2, 
  Trash2, 
  Filter,
  CheckCircle2,
  Download,
  Users,
  Calendar,
  UserCheck2,
  UserMinus2,
  GraduationCap,
  Cake,
  PhoneCall,
  AlertTriangle,
  Clock,
  XCircle,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Member, MemberStatus } from '../types';
import { useMemberStore } from '../store';
import * as XLSX from 'xlsx';

type SubTab = 'LIST' | 'ATTENDANCE';

const MemberManagement: React.FC = () => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  
  const [activeTab, setActiveTab] = useState<SubTab>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('Tất cả');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const initialForm: Partial<Member> = {
    name: '', 
    saintName: '', 
    role: 'Thành viên', 
    grade: '', 
    birthYear: '',
    phone: '', 
    status: 'ACTIVE', 
    gender: 'Nam', 
    joinDate: new Date().toISOString().split('T')[0]
  };

  const [form, setForm] = useState<Partial<Member>>(initialForm);

  const uniqueGrades = useMemo(() => {
    const grades = members.map(m => m.grade).filter(Boolean) as string[];
    return ['Tất cả', ...Array.from(new Set(grades))];
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (m.saintName?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGrade = gradeFilter === 'Tất cả' || m.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [members, searchTerm, gradeFilter]);

  const currentAttendance = useMemo(() => {
    const saved = attendanceData.find(d => d.date === selectedDate);
    return saved || {
      date: selectedDate,
      records: members.map(m => ({ memberId: m.id, status: 'ABSENT' as const }))
    };
  }, [selectedDate, attendanceData, members]);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  /**
   * Xuất danh sách ca viên ra file Excel
   * Cột: STT, Tên Thánh, Họ và Tên, Số điện thoại, Vai trò, Trạng thái
   */
  const exportToExcel = () => {
    const dataToExport = filtered.map((m, index) => ({
      'STT': index + 1,
      'Tên Thánh': m.saintName || 'N/A',
      'Họ và Tên': m.name,
      'Số điện thoại': m.phone || 'N/A',
      'Vai trò': m.role,
      'Trạng thái': m.status === 'ACTIVE' ? 'Đang hát' : m.status === 'ON_LEAVE' ? 'Tạm vắng' : 'Đã nghỉ'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh bộ Ca viên");
    XLSX.writeFile(wb, `Danh_Bo_Ca_Doan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    
    if (editingMember) {
      updateMember({ ...editingMember, ...form } as Member);
    } else {
      addMember({ ...form as Member, id: `m-${Date.now()}` });
    }
    setIsModalOpen(false);
    setEditingMember(null);
    setForm(initialForm);
  };

  const confirmDelete = (id: string) => {
    setMemberToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete);
      setIsDeleteConfirmOpen(false);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-4">
           <div className="space-y-1">
             <h2 className="sacred-title text-3xl font-bold text-slate-900 italic leading-none uppercase">Cộng Đoàn Ca Viên</h2>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic mt-1">Sổ bộ hiệp thông & bổn phận ca đoàn</p>
           </div>
           
           <div className="flex p-1 bg-slate-200/40 rounded-xl w-fit border border-slate-200/50 backdrop-blur-sm">
              <button 
                onClick={() => setActiveTab('LIST')}
                className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === 'LIST' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Users size={14} /> Danh bộ
              </button>
              <button 
                onClick={() => setActiveTab('ATTENDANCE')}
                className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === 'ATTENDANCE' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <CheckCircle2 size={14} /> Điểm danh
              </button>
           </div>
        </div>

        <div className="flex gap-2">
          {activeTab === 'LIST' ? (
            <>
              <button onClick={exportToExcel} title="Xuất dữ liệu Excel" className="glass-button px-5 py-3.5 rounded-2xl text-slate-400 hover:text-emeraldGreen transition-all shadow-sm flex items-center gap-2">
                 <Download size={20} /> 
                 <span className="hidden md:inline text-[9px] uppercase tracking-widest font-black">Xuất Excel</span>
              </button>
              <button onClick={() => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); }} className="active-pill px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                 <UserPlus size={18} /> Ghi danh ca viên
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-[1.8rem] border border-slate-200 shadow-sm ring-4 ring-slate-50 transition-all hover:ring-amberGold/10">
              <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-xl transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-3 px-4 border-x border-slate-100 relative group">
                <Calendar size={18} className="text-amberGold" />
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={e => setSelectedDate(e.target.value)}
                  className="text-[12px] font-black text-slate-700 outline-none uppercase tracking-widest cursor-pointer bg-transparent" 
                />
              </div>
              <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-xl transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center bg-white/70 shadow-sm border-slate-100">
         <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm ca viên..." 
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-100 rounded-xl text-[13px] font-medium outline-none focus:border-amberGold transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
            {uniqueGrades.map(g => (
               <button 
                key={g} 
                onClick={() => setGradeFilter(g)}
                className={`px-4 py-2 rounded-lg border text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  gradeFilter === g 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-amberGold'
                }`}
               >
                  {g}
               </button>
            ))}
         </div>
      </div>

      {activeTab === 'LIST' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="glass-card p-5 rounded-3xl bg-white/80 shadow-sm hover:shadow-md transition-all group relative border border-slate-100 flex flex-col justify-between">
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-xl text-slate-300 group-hover:bg-amber-50 group-hover:text-amberGold transition-all border border-slate-100 shadow-inner">
                      {m.name[0]}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-slate-800 leading-tight truncate max-w-[150px]">{m.name}</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{m.saintName || 'Hội viên'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }} className="glass-button p-2 rounded-xl text-slate-400 hover:text-amberGold transition-all shadow-sm"><Edit2 size={14}/></button>
                     <button onClick={() => confirmDelete(m.id)} className="glass-button p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"><Trash2 size={14}/></button>
                  </div>
               </div>
               
               <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-bold uppercase tracking-widest border border-slate-100 flex items-center gap-1.5">
                    <GraduationCap size={12} className="text-amberGold" /> {m.grade || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-bold uppercase tracking-widest border border-slate-100 flex items-center gap-1.5">
                    <Cake size={12} className="text-emeraldGreen" /> {m.birthYear || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-bold uppercase tracking-widest border border-slate-100 flex items-center gap-1.5">
                    <PhoneCall size={12} className="text-royalBlue" /> {m.phone || 'N/A'}
                  </span>
               </div>

               <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{m.role}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                    m.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'
                  }`}>
                    {m.status === 'ACTIVE' ? 'Đang hát' : 'Tạm vắng'}
                  </span>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member) => {
            const status = currentAttendance.records.find(r => r.memberId === member.id)?.status || 'ABSENT';
            return (
              <div key={member.id} className={`glass-card p-6 rounded-[2.5rem] border border-slate-100 bg-white/80 shadow-lg flex flex-col gap-6 transition-all group ${
                status === 'PRESENT' ? 'ring-4 ring-emerald-500/10' : 
                status === 'LATE' ? 'ring-4 ring-amber-500/10' : 'opacity-90'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-md ${
                    status === 'PRESENT' ? 'bg-emerald-500 text-white' : 
                    status === 'LATE' ? 'bg-amber-500 text-white' : 
                    'bg-slate-100 text-slate-300'
                  }`}>
                    {member.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-black text-slate-800 leading-tight truncate">{member.name}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{member.saintName || 'Hội viên'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => updateAttendance(selectedDate, member.id, 'PRESENT')} 
                    className={`glass-button flex items-center justify-center py-6 rounded-[1.8rem] transition-all border-2 ${
                      status === 'PRESENT' ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg scale-105' : 'bg-white text-emerald-600 border-emerald-50 hover:bg-emerald-50'
                    }`}
                  >
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => updateAttendance(selectedDate, member.id, 'LATE')} 
                    className={`glass-button flex items-center justify-center py-6 rounded-[1.8rem] transition-all border-2 ${
                      status === 'LATE' ? 'bg-amber-500 text-white border-amber-400 shadow-lg scale-105' : 'bg-white text-amber-500 border-amber-50 hover:bg-amber-50'
                    }`}
                  >
                    <Clock size={40} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => updateAttendance(selectedDate, member.id, 'ABSENT')} 
                    className={`glass-button flex items-center justify-center py-6 rounded-[1.8rem] transition-all border-2 ${
                      status === 'ABSENT' ? 'bg-rose-600 text-white border-rose-400 shadow-lg scale-105' : 'bg-white text-rose-600 border-rose-50 hover:bg-rose-50'
                    }`}
                  >
                    <XCircle size={40} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-6">
               <h3 className="sacred-title text-2xl font-bold text-slate-900 italic">Sổ Bộ Ca Viên</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên Thánh</label>
                      <input type="text" value={form.saintName} onChange={e => setForm({...form, saintName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="VD: Giuse" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và Tên</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="VD: Nguyễn Văn A" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="090..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bổn phận</label>
                    <select value={form.role} onChange={e => setForm({...form, role: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none">
                       {['Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Thành viên', 'Nhạc công'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lớp</label>
                      <input type="text" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="VD: 12A1" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Năm sinh</label>
                      <input type="text" value={form.birthYear} onChange={e => setForm({...form, birthYear: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" placeholder="VD: 2005" />
                   </div>
                </div>

                <button type="submit" className="w-full py-4 active-pill rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg mt-4">{editingMember ? 'Lưu Thay Đổi' : 'Xác Nhận Ghi Danh'}</button>
             </form>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDeleteConfirmOpen(false)}></div>
          <div className="glass-card w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 text-center">
             <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
                <AlertTriangle size={32} />
             </div>
             <h3 className="sacred-title text-2xl font-bold text-slate-900 italic mb-2">Xác Nhận Xóa</h3>
             <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
                Hành động này <span className="text-rose-500 font-bold uppercase underline">không thể hoàn tác</span>. Anh chị chắc chắn muốn xóa ca viên này khỏi danh bộ?
             </p>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="glass-button py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">Hủy Bỏ</button>
                <button onClick={executeDelete} className="bg-rose-500 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Đồng Ý Xóa</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
