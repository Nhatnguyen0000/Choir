
import React, { useState, useMemo } from 'react';
import { Member, DailyAttendance, AttendanceRecord } from '../types';
import { 
  Search, 
  Check, 
  UserCheck2, 
  Clock, 
  UserMinus2, 
  UserRoundCheck, 
  CalendarDays,
  History,
  ChevronRight
} from 'lucide-react';

interface AttendanceManagementProps {
  members: Member[];
  attendanceData: DailyAttendance[];
  setAttendanceData: React.Dispatch<React.SetStateAction<DailyAttendance[]>>;
}

const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ members, attendanceData, setAttendanceData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const currentAttendance = useMemo(() => {
    const saved = attendanceData.find(d => d.date === selectedDate);
    return saved || {
      date: selectedDate,
      records: members.map(m => ({ memberId: m.id, status: 'ABSENT' as const }))
    };
  }, [selectedDate, attendanceData, members]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [members, searchTerm]);

  const stats = useMemo(() => {
    const total = members.length;
    const presentCount = currentAttendance.records.filter(r => r.status !== 'ABSENT').length;
    return { total, presentCount, rate: total > 0 ? Math.round((presentCount / total) * 100) : 0 };
  }, [members, currentAttendance]);

  const handleUpdate = (memberId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceData(prev => {
      const existingIdx = prev.findIndex(d => d.date === selectedDate);
      if (existingIdx >= 0) {
        const newData = [...prev];
        const records = [...newData[existingIdx].records];
        const recordIdx = records.findIndex(r => r.memberId === memberId);
        if (recordIdx >= 0) records[recordIdx] = { ...records[recordIdx], status };
        else records.push({ memberId, status });
        newData[existingIdx] = { ...newData[existingIdx], records };
        return newData;
      } else {
        return [...prev, { 
          date: selectedDate, 
          records: members.map(m => ({ memberId: m.id, status: m.id === memberId ? status : 'ABSENT' })) 
        }];
      }
    });
  };

  const handleSave = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-48 px-1">
      {/* Header Sticky */}
      <div className="sticky top-16 lg:top-20 z-40 bg-white/80 dark:bg-[#0a0f1e]/80 backdrop-blur-xl -mx-4 px-4 py-4 space-y-4 border-b border-slate-100 dark:border-white/5 transition-all duration-500">
        <div className="bg-slate-900 dark:bg-[#1e1b4b] text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-white/5">
           <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Hiện diện</span>
                <span className="text-xl font-black leading-none">{stats.presentCount} / {stats.total}</span>
              </div>
              <div className="w-px h-8 bg-white/10 mt-1"></div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Tỉ lệ</span>
                <span className="text-xl font-black leading-none">{stats.rate}%</span>
              </div>
           </div>
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <CalendarDays size={20} className="text-blue-400" />
           </div>
        </div>

        <div className="flex gap-2 h-14">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm ca viên..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-full pl-14 pr-4 bg-slate-50 dark:bg-white/5 rounded-[2rem] text-sm font-bold outline-none border border-slate-100 dark:border-white/10 dark:text-white" 
            />
          </div>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)}
            className="w-36 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2rem] text-[10px] font-black text-center outline-none dark:text-white" 
          />
        </div>
      </div>

      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
            <Check size={18} strokeWidth={3} /> 
            <span className="text-[10px] font-black uppercase tracking-widest">Đã lưu kết quả sứ vụ</span>
          </div>
        </div>
      )}

      {/* List optimized for touch */}
      <div className="space-y-4 pt-2">
        {filteredMembers.map((member) => {
          const status = currentAttendance.records.find(r => r.memberId === member.id)?.status || 'ABSENT';
          return (
            <div key={member.id} className={`bg-white dark:bg-[#1e1b4b]/20 p-5 rounded-[2.5rem] border transition-all duration-500 shadow-sm flex flex-col gap-5 ${
              status === 'PRESENT' ? 'border-emerald-500/40 ring-4 ring-emerald-500/5' : 
              status === 'LATE' ? 'border-amber-500/40 ring-4 ring-amber-500/5' : 
              'border-slate-50 dark:border-white/5'
            }`}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${
                  status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-lg' : 
                  status === 'LATE' ? 'bg-amber-500 text-white shadow-lg' : 
                  'bg-slate-100 dark:bg-white/5 text-slate-300'
                }`}>
                  {member.name.split(' ').pop()?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-base font-black dark:text-white leading-tight break-words">
                     {member.saintName ? `${member.saintName} ` : ''}{member.name}
                   </h4>
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mt-1">{member.role}</span>
                </div>
              </div>

              {/* Action Buttons - Large touch targets */}
              <div className="flex items-center bg-slate-50 dark:bg-black/30 p-2 rounded-[2rem] gap-2 border border-slate-200/50 dark:border-white/10">
                <button onClick={() => handleUpdate(member.id, 'PRESENT')} className={`flex flex-col items-center justify-center flex-1 h-20 rounded-2xl transition-all active:scale-95 ${status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-xl' : 'text-slate-400 dark:text-slate-600 hover:bg-white/5'}`}>
                  <UserCheck2 size={22} />
                  <span className="text-[7px] font-black mt-1.5 uppercase">CÓ MẶT</span>
                </button>
                <button onClick={() => handleUpdate(member.id, 'LATE')} className={`flex flex-col items-center justify-center flex-1 h-20 rounded-2xl transition-all active:scale-95 ${status === 'LATE' ? 'bg-amber-500 text-white shadow-xl' : 'text-slate-400 dark:text-slate-600 hover:bg-white/5'}`}>
                  <Clock size={22} />
                  <span className="text-[7px] font-black mt-1.5 uppercase">TRỄ</span>
                </button>
                <button onClick={() => handleUpdate(member.id, 'ABSENT')} className={`flex flex-col items-center justify-center flex-1 h-20 rounded-2xl transition-all active:scale-95 ${status === 'ABSENT' ? 'bg-rose-500 text-white shadow-xl' : 'text-slate-400 dark:text-slate-600 hover:bg-white/5'}`}>
                  <UserMinus2 size={22} />
                  <span className="text-[7px] font-black mt-1.5 uppercase">VẮNG</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-0 right-0 px-6 z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button 
            onClick={handleSave}
            className="w-full py-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10"
          >
            <UserRoundCheck size={22} /> Lưu Sứ Vụ Ngày {new Date(selectedDate).getDate()}/{new Date(selectedDate).getMonth()+1}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
