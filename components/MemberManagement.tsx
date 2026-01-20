
import React, { useState, useMemo } from 'react';
import { 
  Search, X, UserPen, Trash, UserCheck2, Clock, UserMinus2, History, CheckCircle2, UserPlus, Download, AlertCircle, Ban
} from 'lucide-react';
import { Member, DailyAttendance } from '../types';
import * as XLSX from 'xlsx';

interface MemberManagementProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  attendanceData: DailyAttendance[];
  setAttendanceData: React.Dispatch<React.SetStateAction<DailyAttendance[]>>;
  onSuggestSongs: (member: Member) => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ 
  members, setMembers, attendanceData, setAttendanceData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [historyMember, setHistoryMember] = useState<Member | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const filteredMembers = useMemo(() => members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [members, searchTerm]);

  const handleAttendance = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceData(prev => {
      const existing = prev.find(d => d.date === today);
      if (existing) {
        const records = [...existing.records];
        const idx = records.findIndex(r => r.memberId === id);
        if (idx >= 0) records[idx].status = status;
        else records.push({ memberId: id, status });
        return prev.map(d => d.date === today ? { ...d, records } : d);
      }
      return [...prev, { date: today, records: [{ memberId: id, status }] }];
    });
  };

  const getStatus = (id: string) => attendanceData.find(d => d.date === today)?.records.find(r => r.memberId === id)?.status || 'ABSENT';

  const handleSave = () => {
    if (!editingMember || !editingMember.name.trim()) return;
    setMembers(prev => {
      const exists = prev.find(m => m.id === editingMember.id);
      if (exists) return prev.map(m => m.id === editingMember.id ? editingMember : m);
      return [editingMember, ...prev];
    });
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setMembers(prev => prev.filter(m => m.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const exportExcel = () => {
    const data = members.map(m => ({
      'Thánh danh': m.saintName || '',
      'Họ và tên': m.name,
      'Vai trò': m.role,
      'Số điện thoại': m.phone,
      'Trạng thái': m.missionStatus
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh_Bo");
    XLSX.writeFile(wb, "DanhBoBacHoa.xlsx");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sticky top-0 z-30 flex gap-2 pt-2 bg-slate-950 pb-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Tìm ca viên..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-2xl text-white font-black outline-none border border-white/10 shadow-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600" 
          />
        </div>
        <button 
          onClick={() => { setEditingMember({ id: Date.now().toString(), name: '', phone: '', gender: 'Nam', role: 'Thành viên', joinDate: today, missionStatus: 'ACTIVE' }); setIsModalOpen(true); }} 
          className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl active:scale-90 transition-all"
          title="Thêm ca viên"
        >
          <UserPlus size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-24">
        {filteredMembers.map(m => {
          const status = getStatus(m.id);
          return (
            <div key={m.id} className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner transition-all ${
                    status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 
                    status === 'LATE' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 
                    'bg-white/5 text-slate-500 border border-white/5'
                  }`}>
                    {m.name.split(' ').pop()?.[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{m.saintName || 'Hài Đồng'}</p>
                    <h4 className="text-lg font-black text-white leading-tight">{m.name}</h4>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 text-slate-400 rounded-md uppercase mt-1 inline-block border border-white/5">{m.role}</span>
                  </div>
                </div>
                <button onClick={() => setHistoryMember(m)} className="p-3 bg-white/5 rounded-xl text-slate-400 active:scale-90 transition-transform hover:text-white" title="Lịch sử">
                  <History size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-2xl border border-white/5">
                <div className="flex gap-1">
                  <button onClick={() => handleAttendance(m.id, 'PRESENT')} className={`p-3 rounded-xl active:scale-90 transition-all ${status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`} title="Có mặt"><UserCheck2 size={20} strokeWidth={2.5}/></button>
                  <button onClick={() => handleAttendance(m.id, 'LATE')} className={`p-3 rounded-xl active:scale-90 transition-all ${status === 'LATE' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`} title="Trễ"><Clock size={20} strokeWidth={2.5}/></button>
                  <button onClick={() => handleAttendance(m.id, 'ABSENT')} className={`p-3 rounded-xl active:scale-90 transition-all ${status === 'ABSENT' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`} title="Vắng"><UserMinus2 size={20} strokeWidth={2.5}/></button>
                </div>
                <div className="w-px h-8 bg-white/5 mx-1"></div>
                <div className="flex gap-1">
                   <button onClick={() => { setEditingMember(m); setIsModalOpen(true); }} className="p-3 text-slate-400 hover:text-white active:scale-90" title="Sửa"><UserPen size={20} /></button>
                   <button onClick={() => setDeleteConfirmId(m.id)} className="p-3 text-rose-500/70 hover:text-rose-500 active:scale-90" title="Xóa"><Trash size={20} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={exportExcel}
        className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-all border border-white/20"
        title="Xuất Excel"
      >
        <Download size={24} strokeWidth={2.5} />
      </button>

      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-8 pb-12 space-y-6 shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Cập Nhật Hồ Sơ</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full text-white active:scale-90"><X size={20}/></button>
            </div>
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Tên Thánh</label>
                 <input type="text" value={editingMember.saintName} onChange={e => setEditingMember({...editingMember, saintName: e.target.value})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Họ và tên</label>
                 <input type="text" value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Vai trò</label>
                   <select value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value as any})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black outline-none border-none">
                      <option value="Thành viên" className="bg-slate-900">Thành viên</option>
                      <option value="Ca trưởng" className="bg-slate-900">Ca trưởng</option>
                      <option value="Thư ký" className="bg-slate-900">Thư ký</option>
                      <option value="Thủ quỹ" className="bg-slate-900">Thủ quỹ</option>
                      <option value="Nhạc công" className="bg-slate-900">Nhạc công</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-2">SĐT</label>
                   <input type="text" value={editingMember.phone} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} className="w-full p-4 bg-white/5 rounded-2xl text-white font-black border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                 </div>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Hủy bỏ</button>
               <button onClick={handleSave} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Lưu Hồ Sơ</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/90 backdrop-blur-md p-0 animate-in fade-in">
          <div className="bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-10 pb-12 space-y-8 shadow-2xl border-t border-rose-500/20 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                  <AlertCircle size={48} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-black text-white leading-tight">Xác nhận gỡ ca viên?</h3>
               <p className="text-sm font-bold text-slate-500 px-4">Thông tin ca viên sẽ bị xóa vĩnh viễn khỏi danh bộ. Bạn có chắc chắn không?</p>
            </div>
            <div className="flex flex-col gap-3">
               <button onClick={confirmDelete} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-900/40 active:scale-95 transition-all">Xác nhận xóa</button>
               <button onClick={() => setDeleteConfirmId(null)} className="w-full py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all border border-white/5">Quay lại</button>
            </div>
          </div>
        </div>
      )}

      {historyMember && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-8 h-[80vh] flex flex-col shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Lịch sử Chuyên cần</h3>
                <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-widest">{historyMember.saintName} {historyMember.name}</p>
              </div>
              <button onClick={() => setHistoryMember(null)} className="p-2 bg-white/5 rounded-full text-white"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
               {attendanceData.length === 0 ? (
                 <div className="py-20 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest italic">Chưa có dữ liệu điểm danh</div>
               ) : (
                 attendanceData.sort((a,b) => b.date.localeCompare(a.date)).map(d => {
                   const rec = d.records.find(r => r.memberId === historyMember.id);
                   if (!rec) return null;
                   return (
                     <div key={d.date} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-xs font-black text-slate-200">{d.date}</span>
                        <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full ${rec.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400' : rec.status === 'LATE' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {rec.status === 'PRESENT' ? 'Có mặt' : rec.status === 'LATE' ? 'Đi trễ' : 'Vắng mặt'}
                        </span>
                     </div>
                   );
                 })
               )}
            </div>
            <button onClick={() => setHistoryMember(null)} className="mt-6 w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase shadow-xl">Đóng bảng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;