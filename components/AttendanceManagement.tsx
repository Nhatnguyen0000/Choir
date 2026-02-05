
import React, { useState, useMemo } from 'react';
import { Member, DailyAttendance, AttendanceRecord } from '../types';
import { 
  Search, 
  Clock, 
  Calendar,
  CheckCircle2,
  X,
  History,
  Heart
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
      choirId: 'c-thienthan',
      records: members.map(m => ({ memberId: m.id, status: 'ABSENT' as const }))
    };
  }, [selectedDate, attendanceData, members]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.saintName && m.saintName.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a,b) => a.name.localeCompare(b.name));
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
          choirId: members[0]?.choirId || 'c-thienthan',
          records: members.map(m => ({ memberId: m.id, status: (m.id === memberId ? status : 'ABSENT') as 'PRESENT' | 'ABSENT' | 'LATE' })) 
        }];
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-32 px-2 pt-2 max-w-7xl mx-auto">
       {/* 1. Page Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="sacred-title text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">Ghi Nhận <span className="text-slate-400">Hiệp Thông</span></h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic leading-none mt-2">Ghi nhận hiện diện của anh chị em ca viên</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="glass-card p-2 rounded-2xl flex items-center gap-3 bg-white/60 border-white/60 shadow-sm">
              <Calendar size={18} className="text-amberGold ml-2" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-[13px] font-black text-slate-900 outline-none cursor-pointer pr-3" 
              />
           </div>
           <button 
             onClick={() => { setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3000); }}
             className="active-pill px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all hover:scale-[1.02]"
           >
             Lưu Sổ Sách <CheckCircle2 size={18} />
           </button>
        </div>
      </div>

      {/* 2. Compact Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {[
          { label: 'Độ hiệp thông', value: `${stats.rate}%`, color: 'text-amberGold', icon: <Heart size={16}/> },
          { label: 'Hiện diện', value: stats.presentCount, color: 'text-emeraldGreen', icon: <CheckCircle2 size={16}/> },
          { label: 'Vắng mặt', value: stats.total - stats.presentCount, color: 'text-rose-500', icon: <X size={16}/> },
          { label: 'Tổng sổ bộ', value: stats.total, color: 'text-slate-400', icon: <History size={16}/> },
        ].map((m, idx) => (
          <div key={idx} className="glass-card p-4 rounded-[1.5rem] flex items-center gap-4 border-white/60 shadow-sm">
             <div className={`w-10 h-10 rounded-xl bg-white shadow-inner border border-slate-50 flex items-center justify-center ${m.color}`}>{m.icon}</div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{m.label}</p>
                <span className={`text-xl font-black ${m.color} tracking-tighter`}>{m.value}</span>
             </div>
          </div>
        ))}
      </div>

      {/* 3. Search Hub */}
      <div className="px-2">
        <div className="relative group max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Tìm ca viên trong danh sách..." 
            className="w-full pl-12 pr-6 py-4 glass-card rounded-2xl outline-none text-[14px] font-medium placeholder:text-slate-300 bg-white/50 border-white/60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
          <div className="bg-slate-900 text-white px-12 py-4 rounded-full shadow-3xl flex items-center gap-4 border border-white/20 backdrop-blur-md">
            <Heart size={20} fill="#FBBF24" className="text-amberGold animate-bounce" /> 
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">Hiệp thông ghi sổ thành công</span>
          </div>
        </div>
      )}

      {/* 4. List Mark View */}
      <div className="px-2">
        <div className="glass-card rounded-[2.5rem] border-white/60 shadow-sm overflow-hidden bg-white/60">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[8px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Đoàn Viên</th>
                  <th className="px-4 py-5">Bổn Phận</th>
                  <th className="px-8 py-5 text-right">Ghi Nhận Hiện Diện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredMembers.map((member) => {
                  const status = currentAttendance.records.find(r => r.memberId === member.id)?.status || 'ABSENT';
                  return (
                    <tr key={member.id} className={`hover:bg-white/40 transition-all ${status !== 'ABSENT' ? 'bg-slate-50/20' : ''}`}>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white' : status === 'LATE' ? 'bg-amberGold text-white' : 'bg-white border border-slate-100 text-slate-300'}`}>
                            {member.name[0]}
                          </div>
                          <div>
                            <p className="text-[14px] font-black text-slate-900 leading-tight truncate max-w-[200px]">{member.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">{member.saintName || '---'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{member.role}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleUpdate(member.id, 'PRESENT')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'PRESENT' ? 'bg-slate-900 text-white shadow-lg scale-110' : 'glass-button text-slate-300 border-white/60 hover:text-emeraldGreen'}`} title="Hiện diện"><CheckCircle2 size={18} /></button>
                          <button onClick={() => handleUpdate(member.id, 'LATE')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'LATE' ? 'bg-amberGold text-white shadow-lg scale-110' : 'glass-button text-slate-300 border-white/60 hover:text-amberGold'}`} title="Đến trễ"><Clock size={18} /></button>
                          <button onClick={() => handleUpdate(member.id, 'ABSENT')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'ABSENT' ? 'bg-rose-500 text-white shadow-lg scale-110' : 'glass-button text-slate-300 border-white/60 hover:text-rose-500'}`} title="Báo vắng"><X size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
