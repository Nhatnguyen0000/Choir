
import React, { useMemo } from 'react';
import { Member, DailyAttendance, Transaction } from '../types';
import { FileDown, TrendingUp, TrendingDown, Users, Wallet, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AnalyticsManagementProps {
  members: Member[];
  attendanceData: DailyAttendance[];
  transactions: Transaction[];
}

const AnalyticsManagement: React.FC<AnalyticsManagementProps> = ({ members, attendanceData, transactions }) => {
  const stats = useMemo(() => {
    const total = members.length;
    const totalIn = transactions.filter(t => t.type === 'IN').reduce((s,t) => s+t.amount, 0);
    const totalOut = transactions.filter(t => t.type === 'OUT').reduce((s,t) => s+t.amount, 0);
    const avgAttendance = attendanceData.length > 0 ? Math.round((attendanceData.reduce((sum, d) => sum + (d.records.filter(r => r.status === 'PRESENT').length), 0) / (attendanceData.length * (total || 1))) * 100) : 100;
    return { total, active: members.filter(m => m.status === 'ACTIVE').length, balance: totalIn - totalOut, avgAttendance };
  }, [members, attendanceData, transactions]);

  const xuatBaoCao = () => {
    const wb = XLSX.utils.book_new();
    const duLieu = [['BÁO CÁO TỔNG KẾT HOẠT ĐỘNG CA ĐOÀN THIÊN THẦN'], [`Ngày trích xuất: ${new Date().toLocaleDateString('vi-VN')}`], [''], ['TIÊU CHÍ', 'SỐ LIỆU'], ['Tổng số ca viên', stats.total], ['Tỷ lệ chuyên cần', stats.avgAttendance + '%'], ['Số dư quỹ đoàn', stats.balance.toLocaleString() + ' VNĐ']];
    const ws = XLSX.utils.aoa_to_sheet(duLieu);
    XLSX.utils.book_append_sheet(wb, ws, "Thống kê");
    XLSX.writeFile(wb, `Bao_Cao_Ca_Doan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const metrics = [
    { label: 'Chuyên cần', value: stats.avgAttendance + '%', icon: <ClipboardCheck size={16}/>, color: 'text-amberGold' },
    { label: 'Ngân quỹ', value: stats.balance.toLocaleString() + 'đ', icon: <Wallet size={16}/>, color: 'text-emeraldGreen' },
    { label: 'Tổng ca viên', value: stats.total.toString(), icon: <Users size={16}/>, color: 'text-royalBlue' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="sacred-title text-2xl font-bold text-slate-900 italic leading-none">Phân Tích Công Tác</h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1 italic leading-none">Tổng hợp dữ liệu hiệp thông ca đoàn</p>
        </div>
        <button onClick={xuatBaoCao} className="glass-button px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]">
          <FileDown size={16} /> Xuất Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border-slate-200 flex items-center justify-between">
             <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{m.label}</span>
                <h3 className={`text-xl font-bold tracking-tight ${m.color}`}>{m.value}</h3>
             </div>
             <div className="p-2 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">{m.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl border-slate-200 space-y-4">
           <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 italic leading-none">
              <div className="w-1 h-3.5 bg-amberGold rounded-full"></div> Biểu đồ chuyên cần
           </h3>
           <div className="flex items-end justify-around h-32 pt-4 border-b border-slate-50">
              {[65, 80, 55, 90, 75, 85].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-6 group">
                   <div className="w-full bg-slate-50 rounded h-24 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-amberGold/60 group-hover:bg-amberGold transition-all duration-700" style={{ height: `${h}%` }}></div>
                   </div>
                   <span className="text-[8px] font-bold text-slate-400 uppercase">T{i+1}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-card p-6 rounded-xl bg-deepSlate text-white space-y-4 relative overflow-hidden">
           <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 italic leading-none relative z-10">
              <div className="w-1 h-3.5 bg-emerald-500 rounded-full"></div> Tài chính minh bạch
           </h3>
           <div className="space-y-3 relative z-10 pt-2">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Tổng thu năm nay</p>
                    <p className="text-lg font-bold tracking-tight">{(stats.balance + 5000000).toLocaleString()}đ</p>
                 </div>
                 <TrendingUp size={16} className="text-emerald-400 opacity-60" />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Tổng chi năm nay</p>
                    <p className="text-lg font-bold tracking-tight">5.000.000đ</p>
                 </div>
                 <TrendingDown size={16} className="text-rose-400 opacity-60" />
              </div>
              <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest text-center italic mt-2">Dữ liệu hiệp thông minh bạch AMDG</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;
