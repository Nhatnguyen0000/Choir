
import React, { useMemo } from 'react';
import { Member, DailyAttendance, Transaction } from '../types';
import { FileDown, Users, Heart, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AnalyticsManagementProps {
  members: Member[];
  attendanceData: DailyAttendance[];
  transactions: Transaction[];
}

const AnalyticsManagement: React.FC<AnalyticsManagementProps> = ({ members, attendanceData, transactions }) => {
  const stats = useMemo(() => {
    const activeCount = members.filter(m => m.missionStatus === 'ACTIVE').length;
    const totalBalance = transactions.filter(t => t.type === 'IN').reduce((s,t) => s+t.amount, 0) - transactions.filter(t => t.type === 'OUT').reduce((s,t) => s+t.amount, 0);
    const avgAttendance = attendanceData.length > 0 
      ? Math.round((attendanceData.reduce((sum, d) => sum + (d.records.filter(r => r.status !== 'ABSENT').length), 0) / (attendanceData.length * members.length)) * 100)
      : 0;
    return { activeCount, totalBalance, avgAttendance };
  }, [members, attendanceData, transactions]);

  const exportGeneralReport = () => {
    const data = [
      ['BÁO CÁO TỔNG HỢP CA ĐOÀN BẮC HÒA'],
      ['Thời điểm xuất:', new Date().toLocaleString()],
      [''],
      ['CHỈ SỐ NHÂN SỰ'],
      ['Tổng số ca viên:', members.length],
      ['Đang hoạt động:', stats.activeCount],
      [''],
      ['CHỈ SỐ HOẠT ĐỘNG'],
      ['Tỉ lệ chuyên cần trung bình:', `${stats.avgAttendance}%`],
      [''],
      ['CHỈ SỐ TÀI CHÍNH'],
      ['Số dư quỹ hiện tại:', `${stats.totalBalance.toLocaleString()} đ`],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bao_Cao_Tong_Hop");
    XLSX.writeFile(wb, "Bao_Cao_Tong_Hop_Bac_Hoa.xlsx");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
       <div className="bg-white dark:bg-white/5 p-10 lg:p-14 rounded-[4rem] border border-slate-100 dark:border-white/10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h2 className="text-3xl font-black font-serif dark:text-white">Thống Kê Hoạt Động</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Dữ liệu hoạt động Ca đoàn Bắc Hòa</p>
          </div>
          <button onClick={exportGeneralReport} className="px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-4">
             <FileDown size={20} /> Xuất Báo Cáo Tổng Hợp
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-1">
          <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-50 dark:border-white/10 shadow-sm space-y-4">
             <div className="w-14 h-14 bg-blue-50 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-600">
                <Users size={28} />
             </div>
             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nhân sự hiện tại</h4>
             <div className="text-4xl font-black dark:text-white">{stats.activeCount} <span className="text-xs text-slate-400">/ {members.length}</span></div>
          </div>
          <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-50 dark:border-white/10 shadow-sm space-y-4">
             <div className="w-14 h-14 bg-rose-50 dark:bg-rose-600/20 rounded-2xl flex items-center justify-center text-rose-600">
                <Heart size={28} />
             </div>
             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Chuyên cần</h4>
             <div className="text-4xl font-black dark:text-white">{stats.avgAttendance}% <span className="text-xs text-slate-400">Hiệp thông</span></div>
          </div>
          <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-50 dark:border-white/10 shadow-sm space-y-4">
             <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-600">
                <TrendingUp size={28} />
             </div>
             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Số dư quỹ đoàn</h4>
             <div className="text-2xl font-black dark:text-white">{stats.totalBalance.toLocaleString()} <span className="text-xs text-slate-400">đ</span></div>
          </div>
       </div>
    </div>
  );
};

export default AnalyticsManagement;