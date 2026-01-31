
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
  Camera,
  AlertCircle
} from 'lucide-react';
import { Member } from '../types';
import { useMemberStore } from '../store';
import * as XLSX from 'xlsx';

type SubTab = 'LIST' | 'ATTENDANCE';

const MemberManagement: React.FC = () => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  
  const [activeTab, setActiveTab] = useState<SubTab>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

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
    const data = members.map(m => ({
      'Tên Thánh': m.saintName || '',
      'Họ và Tên': m.name,
      'Năm sinh': m.birthYear || '',
      'Lớp': m.grade || '',
      'Bổn phận': m.role,
      'Số điện thoại': m.phone || '',
      'Giới tính': m.gender,
      'Trạng thái': m.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm nghỉ'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sổ bộ ca viên");
    XLSX.writeFile(wb, `Danh_Sach_Ca_Vien_${new Date().toISOString().split('T')[0]}.xlsx`);
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
      `XÁC NHẬN GỠ TÊN CA VIÊN: "${name.toUpperCase()}"?\n\nDữ liệu sẽ bị gỡ khỏi hệ thống sổ bộ ca đoàn.`
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
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12 pt-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="sacred-title text-3xl font-black text-slate-900 italic leading-none">Sổ Bộ Ca Viên</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Danh sách hiệp thông & thông tin anh chị em</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExport}
            className="glass-button px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-sm border-white/60"
          >
            <FileDown size={18} /> Xuất sổ bộ
          </button>
          <button 
            onClick={() => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); }}
            className="active-pill px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-xl hover:scale-105 transition-all"
          >
            <UserPlus size={18} /> Ghi danh mới
          </button>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Sổ bộ đoàn', value: stats.total, icon: <Users size={22}/>, color: 'text-slate-900', bg: 'bg-white/70' },
          { label: 'Đang hoạt động', value: stats.active, icon: <UserCheck size={22}/>, color: 'text-emeraldGreen', bg: 'bg-emerald-50/40' },
          { label: 'Hiệp thông hôm nay', value: stats.todayAttendance, icon: <CheckCircle2 size={22}/>, color: 'text-amberGold', bg: 'bg-amber-50/40' },
        ].map((card, i) => (
          <div key={i} className={`glass-card p-6 rounded-[2.5rem] border-white/60 flex items-center gap-6 shadow-sm ${card.bg}`}>
             <div className={`p-4 rounded-2xl bg-white ${card.color} shadow-inner border border-slate-100`}>{card.icon}</div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{card.label}</p>
                <p className="text-3xl font-black text-slate-900">{card.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Navigation and Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex p-1 bg-slate-200/40 rounded-full w-fit glass-card border-white/60">
          <button 
            onClick={() => setActiveTab('LIST')} 
            className={`px-12 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'LIST' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Danh Sách
          </button>
          <button 
            onClick={() => setActiveTab('ATTENDANCE')} 
            className={`px-12 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ATTENDANCE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Điểm Danh
          </button>
        </div>
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc Tên Thánh..." 
            className="w-full pl-16 pr-8 py-4.5 glass-card rounded-[1.8rem] border-white/60 outline-none shadow-sm focus:ring-4 focus:ring-slate-100 transition-all text-base font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {activeTab === 'LIST' ? (
        <div className="glass-card border-white/60 rounded-[3rem] shadow-sm overflow-hidden bg-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-10 py-7">Ca viên</th>
                  <th className="px-6 py-7 hidden md:table-cell">Năm sinh</th>
                  <th className="px-6 py-7 hidden md:table-cell text-center">Lớp/Nhóm</th>
                  <th className="px-6 py-7 hidden md:table-cell text-center">Bổn phận</th>
                  <th className="px-6 py-7 text-center">Trạng thái</th>
                  <th className="px-10 py-7 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="table-row-hover transition-colors group">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-inner overflow-hidden ring-4 ring-white">
                            {m.avatar ? <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" /> : <UserCircle size={28} />}
                          </div>
                          <div>
                            <div className="text-base font-black text-slate-900 leading-tight">{m.name}</div>
                            <div className="text-[11px] font-bold text-amberGold italic uppercase tracking-widest mt-1">{m.saintName || '---'}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6 hidden md:table-cell text-[14px] font-bold text-slate-600">
                      {m.birthYear || '---'}
                    </td>
                    <td className="px-6 py-6 hidden md:table-cell text-center">
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
                        {m.grade || '---'}
                      </span>
                    </td>
                    <td className="px-6 py-6 hidden md:table-cell text-center">
                      <span className="text-[12px] font-bold text-slate-500">{m.role}</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center">
                        {m.status === 'ACTIVE' ? (
                          <div className="px-4 py-1 bg-emerald-50 text-emeraldGreen text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm">
                            Đang hoạt động
                          </div>
                        ) : (
                          <div className="px-4 py-1 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                            Tạm nghỉ
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleEdit(m)}
                          className="p-3 glass-button rounded-2xl text-slate-400 hover:text-slate-900 border-white/60 shadow-sm transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          className="p-3 glass-button rounded-2xl text-slate-400 hover:text-crimsonRed border-white/60 shadow-sm transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="glass-card p-6 rounded-[2.5rem] border-white/60 shadow-sm w-fit flex items-center gap-6 bg-white/70">
            <div className="p-4 bg-amber-50 text-amberGold rounded-[1.5rem] border border-amber-100 shadow-inner"><Calendar size={24} /></div>
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Ngày hiệp thông</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
                className="text-xl font-black text-slate-900 bg-transparent outline-none cursor-pointer" 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((m) => {
              const record = currentAttendance.find(r => r.memberId === m.id);
              const status = record?.status || 'ABSENT';
              return (
                <div key={m.id} className={`glass-card border-white/60 rounded-[2.5rem] p-6 flex items-center justify-between hover:shadow-xl transition-all group shadow-sm bg-white/70 ${status !== 'ABSENT' ? 'ring-2 ring-slate-900/5' : ''}`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white' : status === 'LATE' ? 'bg-amberGold text-white' : 'bg-slate-50 text-slate-300 shadow-inner'}`}>
                      {m.name[0]}
                    </div>
                    <div>
                      <h4 className="text-[16px] font-black text-slate-900 leading-tight group-hover:text-amberGold transition-colors">{m.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{m.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white shadow-xl scale-110' : 'glass-button text-slate-300 border-white/60'}`}><Check size={20} strokeWidth={3} /></button>
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'LATE' ? 'bg-amberGold text-white shadow-xl scale-110' : 'glass-button text-slate-300 border-white/60'}`}><Clock size={20} strokeWidth={3} /></button>
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'ABSENT' ? 'bg-rose-500 text-white shadow-xl scale-110' : 'glass-button text-slate-300 border-white/60'}`}><X size={20} strokeWidth={3} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-xl rounded-[3rem] p-10 relative z-10 shadow-2xl border-white/40 bg-white animate-in zoom-in-95">
             <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                 <h3 className="sacred-title text-2xl font-black text-slate-900 italic leading-none">{editingMember ? 'Sửa thông tin' : 'Ghi danh ca viên'}</h3>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2 italic">Phụng sự qua sự hiện diện hiệp thông</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 glass-button rounded-2xl text-slate-300 hover:text-slate-900 border-white/60 shadow-sm"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên Thánh</label>
                      <input type="text" value={form.saintName} onChange={e => setForm({...form, saintName: e.target.value})} className="w-full px-5 py-3.5 glass-card rounded-2xl text-base font-bold outline-none border-white shadow-inner bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và Tên</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-5 py-3.5 glass-card rounded-2xl text-base font-bold outline-none border-white shadow-inner bg-slate-50/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bổn phận</label>
                    <div className="relative">
                      <select value={form.role} onChange={e => setForm({...form, role: e.target.value as any})} className="w-full px-5 py-3.5 glass-card rounded-2xl text-base font-bold outline-none appearance-none cursor-pointer bg-slate-50/50">
                        {['Thành viên', 'Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Nhạc công'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái</label>
                    <div className="relative">
                      <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="w-full px-5 py-3.5 glass-card rounded-2xl text-base font-bold outline-none appearance-none cursor-pointer bg-slate-50/50">
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="ON_LEAVE">Tạm nghỉ</option>
                        <option value="RETIRED">Đã nghỉ</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] hover:text-slate-900 transition-all">HUỶ BỎ</button>
                  <button type="submit" className="flex-[2] py-5 active-pill rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                    <Save size={18} /> LƯU THÔNG TIN
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
