
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronLeft,
  Calendar,
  MapPin,
  // Add Music2 to imports to fix the "Cannot find name 'Music2'" error
  Music2
} from 'lucide-react';
import { ScheduleEvent } from '../types';

interface AttendanceSelectorProps {
  event: ScheduleEvent;
  onBack: () => void;
  onReport: (status: 'PRESENT' | 'LATE' | 'ABSENT') => void;
}

const AttendanceSelector: React.FC<AttendanceSelectorProps> = ({ event, onBack, onReport }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async (status: 'PRESENT' | 'LATE' | 'ABSENT') => {
    setIsSubmitting(true);
    // Giả lập xử lý báo cáo
    await new Promise(resolve => setTimeout(resolve, 800));
    onReport(status);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#f8fafc] animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 space-y-10">
        <button 
          onClick={onBack}
          className="self-start p-4 glass-button text-slate-600 rounded-[1.2rem] active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border-white/60 shadow-xl text-center space-y-6 bg-white/60">
            <div className="w-16 h-1 bg-amberGold/30 mx-auto rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black font-serif text-slate-900 leading-tight italic">
              {event.massName}
            </h2>
            <div className="flex flex-col items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2.5">
                <Calendar size={16} className="text-amberGold" /> <span>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-blue-500" /> <span>{event.location}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 px-2">
            <p className="text-base font-black text-slate-800 tracking-tight">Xác nhận sự hiện diện của anh chị</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-relaxed">Sự hiện diện của anh chị là niềm vui chung<br/>cho cộng đoàn trong buổi Phụng vụ.</p>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              disabled={isSubmitting}
              onClick={() => handleReport('PRESENT')}
              className="w-full py-6 bg-emeraldGreen text-white rounded-[1.8rem] flex items-center justify-center gap-5 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle2 size={32} />
              <span className="text-lg font-black uppercase tracking-[0.2em]">Hiện diện</span>
            </button>

            <button 
              disabled={isSubmitting}
              onClick={() => handleReport('LATE')}
              className="w-full py-6 bg-amberGold text-white rounded-[1.8rem] flex items-center justify-center gap-5 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              <Clock size={32} />
              <span className="text-lg font-black uppercase tracking-[0.2em]">Đến trễ</span>
            </button>

            <button 
              disabled={isSubmitting}
              onClick={() => handleReport('ABSENT')}
              className="w-full py-6 bg-crimsonRed text-white rounded-[1.8rem] flex items-center justify-center gap-5 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              <XCircle size={32} />
              <span className="text-lg font-black uppercase tracking-[0.2em]">Báo vắng</span>
            </button>
          </div>
        </div>

        <div className="flex-1"></div>
        <div className="py-6 flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            {/* Music2 component is now correctly imported */}
            <Music2 size={24} className="text-amberGold" />
          </div>
          <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Bắc Hoà 2027 • Hệ Thống Quản Trị</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSelector;
