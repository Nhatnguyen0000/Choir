
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Music, 
  User, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Heart,
  Sparkles,
  BookOpen,
  History,
  Info,
  CalendarDays,
  X // Fix: Added missing X icon import
} from 'lucide-react';
import { Member, ScheduleEvent, DailyAttendance, AppView } from '../types';

interface MemberPortalProps {
  currentUser: Member;
  scheduleItems: ScheduleEvent[];
  attendanceData: DailyAttendance[];
  setAttendanceData: React.Dispatch<React.SetStateAction<DailyAttendance[]>>;
  onSwitchToAdmin: () => void;
}

const MemberPortal: React.FC<MemberPortalProps> = ({ 
  currentUser, 
  scheduleItems, 
  attendanceData,
  setAttendanceData,
  onSwitchToAdmin
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportType, setReportType] = useState<'ABSENT' | 'LATE'>('ABSENT');

  const myStats = useMemo(() => {
    const myRecords = attendanceData.flatMap(d => d.records).filter(r => r.memberId === currentUser.id);
    const present = myRecords.filter(r => r.status === 'PRESENT').length;
    const late = myRecords.filter(r => r.status === 'LATE').length;
    const total = myRecords.length || 1;
    const rate = Math.round(((present + late * 0.7) / total) * 100);
    return { present, late, total, rate };
  }, [attendanceData, currentUser.id]);

  const handleReportAbsence = () => {
    if (!selectedEventId) return;
    const event = scheduleItems.find(s => s.id === selectedEventId);
    if (!event) return;

    setAttendanceData(prev => {
      const existingIdx = prev.findIndex(d => d.date === event.date);
      if (existingIdx >= 0) {
        const newData = [...prev];
        const recordIdx = newData[existingIdx].records.findIndex(r => r.memberId === currentUser.id);
        const newRecord = { 
          memberId: currentUser.id, 
          status: reportType, 
          reason: reportReason,
          reportedAt: new Date().toISOString()
        };
        if (recordIdx >= 0) newData[existingIdx].records[recordIdx] = newRecord;
        else newData[existingIdx].records.push(newRecord);
        return newData;
      } else {
        return [...prev, {
          date: event.date,
          records: [{ 
            memberId: currentUser.id, 
            status: reportType, 
            reason: reportReason,
            reportedAt: new Date().toISOString() 
          }]
        }];
      }
    });
    setIsReportModalOpen(false);
    setReportReason('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32">
      {/* Hero Personal Section */}
      <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-900/40">
              {currentUser.name.split(' ').pop()?.[0]}
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Thành viên Ca Đoàn Bắc Hòa</p>
              <h2 className="text-2xl font-black font-serif">Kính chào {currentUser.saintName} {currentUser.name}! 🙏</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Chỉ số sứ vụ</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-400">{myStats.rate}%</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Chuyên cần</span>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Bổn mạng</p>
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-rose-500 fill-rose-500" />
                  <span className="text-xs font-black uppercase tracking-tight">{currentUser.saintName || 'Hài Đồng'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Upcoming Missions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black font-serif text-slate-900">Lịch Sứ Vụ Sắp Tới</h3>
          <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Xem tất cả</button>
        </div>
        
        <div className="space-y-3">
          {scheduleItems.slice(0, 3).map((event) => {
            const myRecord = attendanceData.find(d => d.date === event.date)?.records.find(r => r.memberId === currentUser.id);
            const isReported = myRecord?.status === 'ABSENT' || myRecord?.status === 'LATE';

            return (
              <div key={event.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">
                        {event.date}
                      </span>
                      {isReported && (
                        <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${myRecord?.status === 'ABSENT' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                          {myRecord?.status === 'ABSENT' ? 'Đã báo vắng' : 'Đã báo muộn'}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{event.massName}</h4>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                    <Calendar size={20} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setIsReportModalOpen(true);
                    }}
                    className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                  >
                    Báo vắng / muộn
                  </button>
                  <button className="flex-1 py-3.5 bg-blue-50 text-blue-700 rounded-2xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all border border-blue-100">
                    Xem bài hát
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Inspiration Section */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={20} className="text-indigo-300 animate-pulse" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Góc Tâm Tình Ca Viên</h4>
          </div>
          <p className="font-serif italic text-lg leading-relaxed mb-6">
            "Hãy hát mừng Chúa một bài ca mới, vì Người đã làm những việc lạ lùng."
          </p>
          <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-white/20 transition-all active:scale-95">
            Tìm hiểu ý nghĩa lời ca
          </button>
        </div>
        <Music size={120} className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
      </div>

      {/* Footer Switch */}
      <div className="text-center pt-8">
         <button 
           onClick={onSwitchToAdmin}
           className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors"
         >
           Chuyển sang Ban Trị Sự (Admin)
         </button>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-900/70 backdrop-blur-sm animate-in fade-in p-0">
          <div className="bg-white rounded-t-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-500 flex flex-col p-8 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-black font-serif text-slate-900">Báo cáo Sứ vụ</h3>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={20}/></button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setReportType('ABSENT')}
                className={`flex-1 p-4 rounded-2xl border transition-all ${reportType === 'ABSENT' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle size={24} />
                  <span className="text-[10px] font-black uppercase">Vắng mặt</span>
                </div>
              </button>
              <button 
                onClick={() => setReportType('LATE')}
                className={`flex-1 p-4 rounded-2xl border transition-all ${reportType === 'LATE' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Clock size={24} />
                  <span className="text-[10px] font-black uppercase">Đi muộn</span>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lý do cụ thể</label>
              <textarea 
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Vd: Đi học xa, Bận việc gia đình..."
                className="w-full p-5 bg-slate-50 rounded-2xl border-none text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
            </div>

            <button 
              onClick={handleReportAbsence}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
            >
              Gửi báo cáo cho Ban Trị Sự
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPortal;
