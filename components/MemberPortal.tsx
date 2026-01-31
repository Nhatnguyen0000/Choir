
import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  FileDown, 
  Edit2, 
  Trash2, 
  Check, 
  Clock, 
  X, 
  Search,
  Calendar,
  Save,
  Phone,
  UserCheck
} from 'lucide-react';
import { Member, ScheduleEvent, DailyAttendance, AttendanceRecord } from '../types';
import { useMemberStore } from '../store';
import * as XLSX from 'xlsx';

interface MemberPortalProps {
  currentUser: Member;
  scheduleItems: ScheduleEvent[];
  onSwitchToAdmin: () => void;
}

type PortalTab = 'MEMBERS' | 'ATTENDANCE';

const MemberPortal: React.FC<MemberPortalProps> = ({ currentUser }: MemberPortalProps) => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  
  const [activeTab, setActiveTab] = useState<PortalTab>('MEMBERS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const initialForm: Partial<Member> = {
    name: '',
    saintName: '',
    role: 'Ca viên',
    phone: '',
    gender: 'Nam',
    status: 'ACTIVE',
    joinDate: new Date().toISOString().split('T')[0]
  };
  const [form, setForm] = useState<Partial<Member>>(initialForm);

  const filteredMembers = useMemo(() => {
    return members.filter((m: Member) => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a: Member, b: Member) => a.name.localeCompare(b.name));
  }, [members, searchTerm]);

  const handleExportExcel = () => {
    const data = members.map((m: Member) => ({
      'Tên Thánh': m.saintName || '',
      'Họ và Tên': m.name,
      'Số điện thoại': m.phone || '',
      'Bổn phận': m.role,
      'Giới tính': m.gender,
      'Ngày tham gia': m.joinDate,
      'Trạng thái': m.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm nghỉ'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách ca viên");
    XLSX.writeFile(wb, `Danh_Sach_Ca_Vien_${selectedDate}.xlsx`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    if (editingMember) {
      updateMember({ ...editingMember, ...form } as Member);
    } else {
      addMember({ ...form, id: `m-${Date.now()}`, choirId: 'c-thienthan', status: 'ACTIVE' } as Member);
    }
    setIsModalOpen(false);
    setEditingMember(null);
    setForm(initialForm);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Xác nhận xóa ca viên "${name.toUpperCase()}" khỏi sổ bộ? Thao tác không thể hoàn tác.`)) {
      deleteMember(id);
    }
  };

  const currentDayRecords = useMemo(() => {
    return attendanceData.find((d: DailyAttendance) => d.date === selectedDate)?.records || [];
  }, [attendanceData, selectedDate]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in px-2 pt-4">
      <header className="glass-card p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-white/60 shadow-lg bg-white/70">
        <div className="space-y-0.5">
          <h1 className="sacred-title text-2xl md:text-3xl font-bold text-slate-900 italic leading-none">Cổng Ca Viên</h1>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] italic">Chào anh/chị {currentUser.name} • Hiệp thông phụng sự</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); }} className="active-pill px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
            <UserPlus size={16} /> Thêm ca viên
          </button>
          <button onClick={handleExportExcel} className="glass-button px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all border-white/60">
            <FileDown size={16} /> Xuất Excel
          </button>
        </div>
      </header>

      <div className="flex p-1 bg-slate-200/40 rounded-full w-fit glass-card mx-auto md:mx-0 border-white/60">
        <button onClick={() => setActiveTab('MEMBERS')} className={`px-10 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'MEMBERS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Danh Sách</button>
        <button onClick={() => setActiveTab('ATTENDANCE')} className={`px-10 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'ATTENDANCE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Điểm Danh</button>
      </div>

      {activeTab === 'MEMBERS' ? (
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Tìm theo tên..."
              className="w-full pl-12 pr-5 py-3 glass-card rounded-xl border-white/60 outline-none shadow-sm focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="glass-card rounded-[2rem] border-white/60 shadow-md overflow-hidden bg-white/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-slate-400 text-[8px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-5">Ca Viên</th>
                    <th className="px-4 py-5 hidden md:table-cell">Điện thoại</th>
                    <th className="px-4 py-5 hidden md:table-cell">Bổn phận</th>
                    <th className="px-8 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMembers.map((m: Member) => (
                    <tr key={m.id} className="table-row-hover transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-inner">
                            {m.name[0]}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-slate-900 leading-tight">{m.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 italic uppercase tracking-wider">{m.saintName || '---'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-[12px] text-slate-600 font-bold">
                        {m.phone || '---'}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-widest">
                          {m.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }} className="p-2.5 glass-button rounded-lg text-slate-400 hover:text-royalBlue transition-all shadow-sm border-white/60"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(m.id, m.name)} className="p-2.5 glass-button rounded-lg text-slate-400 hover:text-crimsonRed transition-all shadow-sm border-white/60"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card p-5 rounded-[1.8rem] border-white/60 shadow-sm w-fit flex items-center gap-4">
            <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"><Calendar size={18} /></div>
            <div className="flex flex-col">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Ngày Hiệp Thông</label>
              <input type="date" value={selectedDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)} className="text-base font-black text-slate-900 bg-transparent outline-none cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((m: Member) => {
              const record = currentDayRecords.find((r: AttendanceRecord) => r.memberId === m.id);
              const status = record?.status || 'ABSENT';
              return (
                <div key={m.id} className="glass-card border-white/60 rounded-[1.8rem] p-5 flex items-center justify-between hover:shadow-lg transition-all group bg-white/60">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg shadow transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white' : status === 'LATE' ? 'bg-amberGold text-white' : 'bg-slate-50 text-slate-300'}`}>
                      {m.name[0]}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-slate-900 leading-tight">{m.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white shadow scale-105' : 'glass-button text-slate-300 border-white/60'}`}><UserCheck size={18} /></button>
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${status === 'LATE' ? 'bg-amberGold text-white shadow scale-105' : 'glass-button text-slate-300 border-white/60'}`}><Clock size={18} /></button>
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${status === 'ABSENT' ? 'bg-crimsonRed text-white shadow scale-105' : 'glass-button text-slate-300 border-white/60'}`}><X size={18} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl animate-in zoom-in-95 border-white/40 bg-white/95">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="sacred-title text-2xl font-bold text-slate-900 italic leading-none">{editingMember ? 'Cập nhật Ca viên' : 'Ghi danh mới'}</h3>
                 <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Phụng sự qua sự hiện diện Hiệp thông</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2.5 glass-button rounded-xl text-slate-300 hover:text-slate-900 border-white/60 shadow-sm"><X size={20} /></button>
             </div>
             <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên Thánh</label>
                      <input type="text" value={form.saintName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, saintName: e.target.value})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và Tên</label>
                      <input type="text" required value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner bg-slate-50/50" />
                  </div>
                </div>
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] hover:text-slate-900 transition-all">HUỶ BỎ</button>
                  <button type="submit" className="flex-[2] py-4 active-pill rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Save size={16} /> LƯU THÔNG TIN
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPortal;
