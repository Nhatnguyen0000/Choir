
import React, { useState, useMemo } from 'react';
import { 
  Search, UserPlus, FileDown, 
  X, Edit2, Trash2, ChevronDown, 
  UserCircle, ShieldCheck, 
  Calendar, CheckCircle2,
  Users, Clock, UserCheck,
  Sparkles, Info, HelpCircle
} from 'lucide-react';
import { Member, MemberStatus } from '../types';
import { useMemberStore } from '../store';
import { getAIResponse } from '../services/geminiService';
import * as XLSX from 'xlsx';

type SubTab = 'LIST' | 'ATTENDANCE';

const MemberManagement: React.FC = () => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  
  const [activeTab, setActiveTab] = useState<SubTab>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // AI Assistant states
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

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
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [members, searchTerm]);

  const stats = useMemo(() => {
    const total = members.length;
    const currentDay = attendanceData.find(d => d.date === selectedDate);
    const presentCount = currentDay?.records.filter(r => r.status === 'PRESENT').length || 0;
    return { total, presentCount };
  }, [members, attendanceData, selectedDate]);

  const handleExport = () => {
    const data = filteredMembers.map((m, idx) => ({
      'STT': idx + 1,
      'Tên Thánh': m.saintName || '',
      'Họ và Tên': m.name,
      'Năm sinh': m.birthYear || '',
      'Lớp': m.grade || '',
      'Bổn phận': m.role,
      'Trạng thái': m.status === 'ACTIVE' ? 'Hoạt động' : m.status === 'ON_LEAVE' ? 'Tạm nghỉ' : 'Nghỉ hẳn'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "So_Bo_Ca_Vien");
    XLSX.writeFile(wb, `So_Bo_Ca_Vien_Thien_Than_2026.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    if (editingMember) {
      updateMember({ ...editingMember, ...form } as Member);
    } else {
      const newId = `CT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      addMember({ ...form as Member, id: newId, choirId: 'c-thienthan', status: 'ACTIVE' });
    }
    setIsModalOpen(false);
    setEditingMember(null);
    setForm(initialForm);
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Xác nhận gỡ ca viên "${name.toUpperCase()}" khỏi sổ bộ cộng đoàn Thiên Thần?`)) {
      deleteMember(id);
    }
  };

  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;
    setIsAILoading(true);
    setAiResponse(null);
    const res = await getAIResponse(`Thông tin phụng vụ: ${aiQuery}`);
    setAiResponse(res.text);
    setIsAILoading(false);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-16 px-2">
      {/* Header Điều Phối */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="sacred-title text-3xl font-bold text-slate-900 italic tracking-tight uppercase">Sổ Bộ Ca Viên</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] italic leading-none">Hiệp thông phục vụ cộng đoàn Thiên Thần</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsAIOpen(!isAIOpen)}
            className="glass-button px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-royalBlue border-royalBlue/20 hover:bg-royalBlue/5 shadow-sm"
          >
            <Sparkles size={16} className="mr-2" /> Trợ lý Thánh Quan
          </button>
          <button 
            onClick={handleExport}
            className="glass-button px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500 border-white/60 shadow-sm"
          >
            <FileDown size={18} /> <span className="hidden sm:inline ml-2">Xuất dữ liệu</span>
          </button>
          <button 
            onClick={() => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); }}
            className="glass-button active-glass px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-sm"
          >
            <UserPlus size={18} /> Ghi danh mới
          </button>
        </div>
      </div>

      {/* AI Assistant Search Bar (Conditional) */}
      {isAIOpen && (
        <div className="glass-card p-6 rounded-[2rem] border-royalBlue/20 bg-royalBlue/5 space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 text-royalBlue">
            <HelpCircle size={18} />
            <p className="text-[11px] font-bold uppercase tracking-widest italic">Tìm hiểu thông tin Thánh Quan hoặc quy định Phụng vụ</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ví dụ: Ngày kính Thánh Cecilia là ngày nào?"
              className="flex-1 px-5 py-3 glass-card rounded-xl text-sm outline-none border-white/40 focus:border-royalBlue transition-all"
            />
            <button 
              onClick={handleAISearch}
              disabled={isAILoading}
              className="px-6 py-3 bg-royalBlue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isAILoading ? "Đang tra cứu..." : "Tra cứu"}
            </button>
          </div>
          {aiResponse && (
            <div className="p-4 bg-white/60 border border-royalBlue/10 rounded-2xl text-sm text-slate-700 leading-relaxed shadow-inner">
              {aiResponse}
            </div>
          )}
        </div>
      )}

      {/* Tìm kiếm & Chuyển Tab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amberGold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc tên thánh..." 
            className="w-full pl-14 pr-6 py-4 glass-card rounded-3xl outline-none text-[13px] border-white/60 bg-white/40 focus:border-amberGold transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-4 flex glass-card p-1.5 rounded-3xl border-white/60 bg-white/10 shadow-inner">
          <button 
            onClick={() => setActiveTab('LIST')} 
            className={`flex-1 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'LIST' ? 'bg-white shadow-sm text-slate-900 border border-amberGold/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Danh Sách
          </button>
          <button 
            onClick={() => setActiveTab('ATTENDANCE')} 
            className={`flex-1 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'ATTENDANCE' ? 'bg-white shadow-sm text-slate-900 border border-amberGold/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Điểm Danh
          </button>
        </div>
      </div>

      {activeTab === 'LIST' ? (
        <div className="w-full space-y-2 overflow-x-auto scrollbar-hide pb-4">
          {/* Header Bảng (Desktop) */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-4 glass-card border-none rounded-3xl text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] italic mb-1 bg-transparent shadow-none">
            <div className="col-span-2">Tên Thánh</div>
            <div className="col-span-3">Họ và Tên</div>
            <div className="col-span-1 text-center">Năm sinh</div>
            <div className="col-span-2 text-center">Lớp</div>
            <div className="col-span-2 text-center">Bổn phận</div>
            <div className="col-span-2 text-right">Tác vụ</div>
          </div>

          {/* Danh sách ca viên dạng Hàng (List) */}
          <div className="space-y-1.5 min-w-[900px] lg:min-w-0">
            {filteredMembers.map(m => (
              <div key={m.id} className="glass-card p-4 lg:px-10 lg:py-3.5 rounded-[2rem] border-white/50 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 group hover:bg-white/90 shadow-sm transition-all border-l-4 border-l-transparent hover:border-l-amberGold">
                {/* Tên Thánh */}
                <div className="lg:col-span-2 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl border border-white bg-slate-50/50 flex items-center justify-center text-slate-300 overflow-hidden shadow-sm shrink-0">
                    {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full object-cover" /> : <UserCircle size={22} />}
                  </div>
                  <p className="text-[13px] font-bold text-amberGold italic uppercase tracking-wider truncate">{m.saintName || '---'}</p>
                </div>

                {/* Họ và Tên */}
                <div className="lg:col-span-3">
                  <p className="text-[15px] font-bold text-slate-900 truncate tracking-tight">{m.name}</p>
                </div>

                {/* Năm sinh */}
                <div className="lg:col-span-1 text-center">
                  <span className="lg:hidden text-[9px] font-bold text-slate-400 uppercase mr-2 italic">Năm sinh:</span>
                  <p className="text-[13px] font-medium text-slate-600 inline lg:block">{m.birthYear || '---'}</p>
                </div>

                {/* Lớp */}
                <div className="lg:col-span-2 text-center">
                  <span className="lg:hidden text-[9px] font-bold text-slate-400 uppercase mr-2 italic">Lớp:</span>
                  <p className="text-[13px] font-medium text-slate-600 italic inline lg:block">{m.grade || '---'}</p>
                </div>

                {/* Bổn phận & Trạng thái */}
                <div className="lg:col-span-2 flex items-center justify-center gap-3">
                  <span className="px-4 py-1.5 bg-slate-50/50 border border-slate-100 text-slate-500 rounded-xl text-[8px] font-bold uppercase tracking-widest leading-none shadow-sm">
                    {m.role}
                  </span>
                  <div className={`w-2 h-2 rounded-full shadow-sm ${m.status === 'ACTIVE' ? 'bg-emeraldGreen animate-pulse' : m.status === 'ON_LEAVE' ? 'bg-amberGold' : 'bg-slate-300'}`}></div>
                </div>

                {/* Nút thao tác */}
                <div className="lg:col-span-2 flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }}
                    className="p-2.5 glass-button border-none rounded-xl text-slate-300 hover:text-royalBlue transition-all shadow-sm bg-white/40"
                    title="Sửa"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => confirmDelete(m.id, m.name)}
                    className="p-2.5 glass-button border-none rounded-xl text-slate-300 hover:text-rose-500 transition-all shadow-sm bg-white/40"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredMembers.length === 0 && (
              <div className="py-24 text-center space-y-4 opacity-40">
                <Users size={56} className="mx-auto text-slate-300" />
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] italic">Không tìm thấy ca viên phù hợp</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Điểm Danh Đơn Giản Hóa */
        <div className="w-full space-y-6 px-2">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 bg-white/40">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-amberGold/5 rounded-[1.5rem] flex items-center justify-center text-amberGold border border-amberGold/10 shadow-inner">
                <Calendar size={28} />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none italic">Ngày Phụng Vụ</p>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={e => setSelectedDate(e.target.value)}
                  className="text-xl font-bold text-slate-900 bg-transparent outline-none cursor-pointer border-b border-slate-100 focus:border-amberGold transition-all pb-1"
                />
              </div>
            </div>
            <div className="flex gap-12">
              <div className="text-center group">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 italic">Hiện diện</p>
                <p className="text-3xl font-black text-emeraldGreen leading-none transition-transform group-hover:scale-110">{stats.presentCount}</p>
              </div>
              <div className="text-center group">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 italic">Tổng sổ bộ</p>
                <p className="text-3xl font-black text-slate-900 leading-none transition-transform group-hover:scale-110">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] border-white/60 shadow-sm overflow-hidden bg-white/60">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[650px]">
                <thead className="bg-slate-50/40 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] border-b border-slate-100 italic">
                  <tr>
                    <th className="px-10 py-6">Đoàn viên hiệp thông</th>
                    <th className="px-10 py-6 text-right">Ghi nhận bổn phận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredMembers.map(m => {
                    const record = attendanceData.find(d => d.date === selectedDate)?.records.find(r => r.memberId === m.id);
                    const status = record?.status || 'ABSENT';
                    return (
                      <tr key={m.id} className={`hover:bg-white/50 transition-colors ${status !== 'ABSENT' ? 'bg-slate-50/20' : ''}`}>
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white' : status === 'LATE' ? 'bg-amberGold text-white' : 'bg-white border border-slate-100 text-slate-200'}`}>
                              {m.name[0]}
                            </div>
                            <div>
                              <p className="text-[15px] font-bold text-slate-900 leading-tight tracking-tight">{m.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest italic">{m.role} • {m.saintName || '---'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} className={`w-11 h-11 rounded-[1.2rem] flex items-center justify-center transition-all ${status === 'PRESENT' ? 'bg-emeraldGreen text-white shadow-xl scale-110' : 'glass-button text-slate-200 border-white hover:text-emeraldGreen'}`} title="Hiện diện"><CheckCircle2 size={24} /></button>
                            <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} className={`w-11 h-11 rounded-[1.2rem] flex items-center justify-center transition-all ${status === 'LATE' ? 'bg-amberGold text-white shadow-xl scale-110' : 'glass-button text-slate-200 border-white hover:text-amberGold'}`} title="Đến trễ"><Clock size={24} /></button>
                            <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} className={`w-11 h-11 rounded-[1.2rem] flex items-center justify-center transition-all ${status === 'ABSENT' ? 'bg-rose-500 text-white shadow-xl scale-110' : 'glass-button text-slate-200 border-white hover:text-rose-500'}`} title="Báo vắng"><X size={24} /></button>
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

      {/* Modal CRUD - Glass Design */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-lg rounded-[3.5rem] p-12 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 border-white/60">
             <div className="flex justify-between items-start mb-10">
               <div className="space-y-3">
                 <h3 className="sacred-title text-3xl font-bold text-slate-900 italic leading-none">{editingMember ? 'Cập Nhật Sổ Bộ' : 'Ghi Danh Mới'}</h3>
                 <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 mt-2 italic">Phụng sự Thiên Chúa trong cộng đoàn</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3.5 glass-button border-none rounded-2xl text-slate-300 hover:text-slate-900 shadow-sm transition-transform hover:rotate-90"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Tên Thánh</label>
                    <input 
                      type="text" 
                      value={form.saintName} 
                      onChange={e => setForm({...form, saintName: e.target.value})} 
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner bg-slate-50/50 focus:border-amberGold transition-all" 
                      placeholder="VD: Phaolô" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Họ và Tên</label>
                    <input 
                      type="text" 
                      required 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner bg-slate-50/50 focus:border-amberGold transition-all" 
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
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner bg-slate-50/50 focus:border-amberGold transition-all" 
                      placeholder="19xx" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Lớp</label>
                    <input 
                      type="text" 
                      value={form.grade} 
                      onChange={e => setForm({...form, grade: e.target.value})} 
                      className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner bg-slate-50/50 focus:border-amberGold transition-all" 
                      placeholder="VD: Soprano 1" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Bổn phận đoàn</label>
                    <div className="relative">
                      <select 
                        value={form.role} 
                        onChange={e => setForm({...form, role: e.target.value as any})} 
                        className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none appearance-none cursor-pointer border-white shadow-inner focus:border-amberGold transition-all"
                      >
                        {['Thành viên', 'Ca trưởng', 'Ca phó', 'Thư ký', 'Thủ quỹ', 'Nhạc công'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Trạng thái hiệp thông</label>
                    <div className="relative">
                      <select 
                        value={form.status} 
                        onChange={e => setForm({...form, status: e.target.value as MemberStatus})} 
                        className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none appearance-none cursor-pointer border-white shadow-inner focus:border-amberGold transition-all"
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="ON_LEAVE">Tạm nghỉ</option>
                        <option value="RETIRED">Nghỉ hẳn</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex gap-5">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-5 text-slate-400 font-bold text-[12px] uppercase tracking-[0.4em] hover:text-slate-900 transition-all italic"
                  >
                    HUỶ THAO TÁC
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-5 bg-slate-900 text-white rounded-[2.5rem] font-bold text-[12px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all"
                  >
                    <ShieldCheck size={24} /> LƯU VÀO SỔ BỘ
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
