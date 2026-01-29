
import React, { useState, useMemo } from 'react';
import { Member, DailyAttendance, AttendanceRecord } from '../types';
import { 
  Search, 
  Check, 
  UserCheck2, 
  Clock, 
  UserMinus2, 
  UserRoundCheck, 
  Filter,
  ChevronDown
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

  const metrics = [
    { label: 'Tỉ lệ hiện diện', value: `${stats.rate}%`, fill: 'bg-amberGold' },
    { label: 'Hiện diện', value: stats.presentCount.toString(), fill: 'bg-emeraldGreen' },
    { label: 'Vắng mặt', value: (stats.total - stats.presentCount).toString(), fill: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-32">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-serif italic">Sổ Điểm Danh</h1>
          <p className="text-slate-400 text-[10px] md:text-[12px] font-black uppercase tracking-widest mt-2 italic">Ghi nhận sự hiện diện của ca viên trong các buổi Phụng vụ.</p>
        </div>
        <div className="flex gap-3">
           <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              className="glass-button px-6 py-4 rounded-[1.5rem] text-[13px] font-bold text-slate-600 outline-none shadow-sm" 
            />
           <button 
             onClick={() => { setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3000); }}
             className="active-pill px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-xl hover:scale-105 transition-transform"
           >
             Lưu kết quả <UserRoundCheck size={18} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        {metrics.map((m, idx) => (
          <div key={idx} className="glass-card p-8 rounded-[2.5rem] flex flex-col gap-3 shadow-sm border-white/60">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{m.label}</p>
             <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-800 tracking-tighter">{m.value}</span>
                <div className="w-24 h-2 bg-slate-100/50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                   <div className={`h-full ${m.fill} transition-all duration-700`} style={{ width: m.value.includes('%') ? m.value : '100%' }}></div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between px-2">
        <div className="flex flex-wrap items-center gap-3">
           {['Nhóm ca', 'Trạng thái'].map(f => (
             <button key={f} className="glass-button px-6 py-3.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2.5 border-slate-200 shadow-sm">
               {f} <ChevronDown size={14} />
             </button>
           ))}
        </div>

        <div className="relative glass-card rounded-[1.2rem] px-6 py-3.5 flex items-center gap-4 shadow-none border-slate-200 focus-within:border-amberGold transition-all w-full md:w-[350px]">
           <Search size={18} className="text-slate-400" />
           <input 
             type="text" 
             placeholder="Tìm ca viên..." 
             className="bg-transparent border-none outline-none text-[14px] font-bold w-full"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
          <div className="bg-emerald-600 text-white px-10 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md">
            <Check size={20} strokeWidth={3} /> 
            <span className="text-[11px] font-black uppercase tracking-widest">Đã ghi nhận hiện diện thành công</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {filteredMembers.map((member) => {
          const status = currentAttendance.records.find(r => r.memberId === member.id)?.status || 'ABSENT';
          return (
            <div key={member.id} className={`glass-card p-8 rounded-[2.5rem] space-y-8 group transition-all duration-500 border-white/60 ${
              status === 'PRESENT' ? 'ring-4 ring-emerald-500/10 bg-white/60' : 
              status === 'LATE' ? 'ring-4 ring-amber-500/10 bg-white/60' : 'bg-white/40'
            }`}>
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-all shadow-md ${
                  status === 'PRESENT' ? 'bg-emerald-500 text-white border-emerald-400' : 
                  status === 'LATE' ? 'bg-amber-500 text-white border-amber-400' : 
                  'bg-white border border-slate-100 text-slate-300'
                }`}>
                  {member.name[0]}
                </div>
                <div>
                   <h4 className="text-[16px] font-black text-slate-800 leading-tight group-hover:text-amberGold transition-colors">
                     {member.name}
                   </h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1.5">{member.role}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleUpdate(member.id, 'PRESENT')} 
                  className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[1.5rem] transition-all border shadow-sm ${
                    status === 'PRESENT' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'glass-button text-slate-400 border-slate-100'
                  }`}
                >
                  <UserCheck2 size={22} />
                  <span className="text-[9px] font-black mt-2 uppercase tracking-widest">Có mặt</span>
                </button>
                <button 
                  onClick={() => handleUpdate(member.id, 'LATE')} 
                  className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[1.5rem] transition-all border shadow-sm ${
                    status === 'LATE' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'glass-button text-slate-400 border-slate-100'
                  }`}
                >
                  <Clock size={22} />
                  <span className="text-[9px] font-black mt-2 uppercase tracking-widest">Đến trễ</span>
                </button>
                <button 
                  onClick={() => handleUpdate(member.id, 'ABSENT')} 
                  className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[1.5rem] transition-all border shadow-sm ${
                    status === 'ABSENT' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'glass-button text-slate-400 border-slate-100'
                  }`}
                >
                  <UserMinus2 size={22} />
                  <span className="text-[9px] font-black mt-2 uppercase tracking-widest">Vắng</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceManagement;
