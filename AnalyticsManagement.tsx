
import React, { useMemo } from 'react';
import { Member, DailyAttendance, Transaction } from '../types';
import { FileDown, TrendingUp, TrendingDown, Users, Wallet, ClipboardCheck, BarChart3, PieChart } from 'lucide-react';
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
    return { total, balance: totalIn - totalOut, avgAttendance, totalIn, totalOut };
  }, [members, attendanceData, transactions]);

  const xuatBaoCao = () => {
    const wb = XLSX.utils.book_new();
    const duLieu = [
      ['TỔNG KẾT HIỆP THÔNG PHỤNG VỤ - CA ĐOÀN THIÊN THẦN'],
      [`Ngày trích xuất: ${new Date().toLocaleDateString('vi-VN')}`],
      [''],
      ['HẠNG MỤC', 'SỐ LIỆU'],
      ['Tổng số ca viên', stats.total],
      ['Độ chuyên cần bình quân', stats.avgAttendance + '%'],
      ['Tổng ngân thu', stats.totalIn.toLocaleString() + 'đ'],
      ['Tổng ngân chi', stats.totalOut.toLocaleString() + 'đ'],
      ['Số dư hiện hữu', stats.balance.toLocaleString() + 'đ']
    ];
    const ws = XLSX.utils.aoa_to_sheet(duLieu);
    XLSX.utils.book_append_sheet(wb, ws, "Tổng kết hiệp thông");
    XLSX.writeFile(wb, `Tong_Ket_Hiep_Thong_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 px-2 pt-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="sacred-title text-2xl md:text-3xl font-bold text-slate-900 italic">Tổng Kết Hiệp Thông</h1>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Thống kê công tác & ngân quỹ đoàn</p>
        </div>
        <button onClick={xuatBaoCao} className="active-pill px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
          <FileDown size={16} /> Xuất dữ liệu tổng kết
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Chuyên cần bình quân', value: stats.avgAttendance + '%', icon: <ClipboardCheck size={20}/>, color: 'text-amberGold' },
          { label: 'Ngân quỹ minh bạch', value: stats.balance.toLocaleString() + 'đ', icon: <Wallet size={20}/>, color: 'text-emeraldGreen' },
          { label: 'Sổ bộ anh chị em', value: stats.total.toString(), icon: <Users size={20}/>, color: 'text-royalBlue' },
        ].map((m, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/60 flex flex-col gap-3 group hover:shadow-xl transition-all bg-white/70">
             <div className={`p-3 rounded-xl w-fit bg-slate-50 ${m.color} border border-slate-100 group-hover:scale-110 transition-transform`}>{m.icon}</div>
             <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                <h3 className={`text-2xl font-black tracking-tighter mt-1 ${m.color}`}>{m.value}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[2.5rem] border-white/60 shadow-lg space-y-6 bg-white/70">
           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2 italic"><BarChart3 size={16} className="text-amberGold" /> Biến động hiện diện</h3>
           <div className="h-40 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center justify-center text-slate-300 italic text-[10px] font-black uppercase tracking-widest">Biểu đồ đang được tối ưu</div>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/10">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic relative z-10 text-emerald-400"><PieChart size={16} /> Cân đối ngân thu chi</h3>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng ngân thu</span>
                 <span className="text-xl font-black text-emerald-400">{stats.totalIn.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng ngân chi</span>
                 <span className="text-xl font-black text-rose-400">{stats.totalOut.toLocaleString()}đ</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagement;
