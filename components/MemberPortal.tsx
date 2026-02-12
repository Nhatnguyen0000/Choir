
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
  UserCheck
} from 'lucide-react';
import { Member, ScheduleEvent } from '../types';
import { useMemberStore } from '../store';
import * as XLSX from 'xlsx';

interface MemberPortalProps {
  currentUser: Member;
  scheduleItems: ScheduleEvent[];
  onSwitchToAdmin: () => void;
}

type PortalTab = 'MEMBERS' | 'ATTENDANCE';

const MemberPortal: React.FC<MemberPortalProps> = ({ currentUser }) => {
  const { members, attendanceData, addMember, updateMember, deleteMember, updateAttendance } = useMemberStore();
  
  const [activeTab, setActiveTab] = useState<PortalTab>('MEMBERS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const initialForm: Partial<Member> = {
    name: '', saintName: '', role: 'Thành viên', phone: '', gender: 'Nam', status: 'ACTIVE', joinDate: new Date().toISOString().split('T')[0]
  };
  const [form, setForm] = useState<Partial<Member>>(initialForm);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [members, searchTerm]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    if (editingMember) {
      updateMember({ ...editingMember, ...form } as Member);
    } else {
      addMember({ ...form, id: crypto.randomUUID(), choirId: 'c-thienthan', status: 'ACTIVE' } as Member);
    }
    setIsModalOpen(false);
    setEditingMember(null);
    setForm(initialForm);
  };

  const currentDayRecords = useMemo(() => {
    return attendanceData.find(d => d.date === selectedDate)?.records || [];
  }, [attendanceData, selectedDate]);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 px-2 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="sacred-title text-xl font-bold text-slate-900">Sổ Bộ Ca Viên</h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase">Chào anh/chị {currentUser.name}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEditingMember(null); setForm(initialForm); setIsModalOpen(true); }} className="active-pill px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">
            <UserPlus size={14} /> Thêm ca viên
          </button>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-full w-fit">
        <button onClick={() => setActiveTab('MEMBERS')} className={`px-8 py-2 rounded-full text-[9px] font-bold uppercase transition-all ${activeTab === 'MEMBERS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Danh Sách</button>
        <button onClick={() => setActiveTab('ATTENDANCE')} className={`px-8 py-2 rounded-full text-[9px] font-bold uppercase transition-all ${activeTab === 'ATTENDANCE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>Điểm Danh</button>
      </div>

      {activeTab === 'MEMBERS' ? (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text"
              placeholder="Tìm ca viên..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {filteredMembers.map(m => (
              <div key={m.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs uppercase">{m.name[0]}</div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 leading-tight">{m.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 italic uppercase">{m.saintName || '---'}</p>
                    <p className="text-[9px] text-slate-300 uppercase mt-1">{m.role}</p>
                  </div>
                </div>
                <button onClick={() => { setEditingMember(m); setForm(m); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-royalBlue opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 w-fit">
            <Calendar size={14} className="text-amberGold" />
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="text-sm font-bold bg-transparent outline-none" />
          </div>

          <div className="space-y-2">
            {filteredMembers.map(m => {
              const record = currentDayRecords.find(r => r.memberId === m.id);
              const status = record?.status || 'ABSENT';
              return (
                <div key={m.id} className="bg-white p-3 px-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 leading-none">{m.name}</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">{m.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'PRESENT')} className={`p-2 rounded-lg ${status === 'PRESENT' ? 'bg-emeraldGreen text-white' : 'bg-slate-50 text-slate-300'}`}><UserCheck size={16} /></button>
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'LATE')} className={`p-2 rounded-lg ${status === 'LATE' ? 'bg-amberGold text-white' : 'bg-slate-50 text-slate-300'}`}><Clock size={16} /></button>
                    <button onClick={() => updateAttendance(selectedDate, 'c-thienthan', m.id, 'ABSENT')} className={`p-2 rounded-lg ${status === 'ABSENT' ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-300'}`}><X size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-5">
               <h3 className="text-lg font-bold text-slate-900">{editingMember ? 'Cập nhật Ca viên' : 'Thêm mới'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-900"><X size={20} /></button>
             </div>
             <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Tên Thánh</label>
                      <input type="text" value={form.saintName} onChange={e => setForm({...form, saintName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Họ và Tên</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none" />
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-slate-400 font-bold text-[10px] uppercase">Huỷ</button>
                  <button type="submit" className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase">Lưu</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPortal;
