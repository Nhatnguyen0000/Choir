
import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, X, Trash2, Wallet, ArrowUpRight, ArrowDownLeft, FileDown, Camera, Plus, History, ChevronDown, Save } from 'lucide-react';
import { useFinanceStore } from '../store';
import { Transaction } from '../types';

const FinanceManagement: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState<Partial<Transaction>>({ 
    description: '', 
    amount: 0, 
    type: 'IN', 
    category: 'Đóng góp', 
    date: new Date().toISOString().split('T')[0] 
  });

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const filtered = useMemo(() => transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;
    addTransaction({ ...newTx as Transaction, id: `tx-${Date.now()}` });
    setIsModalOpen(false);
    setNewTx({ description: '', amount: 0, type: 'IN', category: 'Đóng góp', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-[2rem] border-white/80 bg-white/40 shadow-sm">
        <div className="space-y-1">
          <h1 className="sacred-title text-2xl font-bold text-slate-900 leading-none italic">Đoàn Quỹ Minh Bạch</h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-1 leading-none italic">Hiệp thông tài chánh cộng đoàn</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none glass-button px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-royalBlue flex items-center justify-center gap-2">
            <FileDown size={14} /> <span className="hidden sm:inline">Xuất Dữ Liệu</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none active-glass px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
            <Plus size={14} /> <span className="hidden sm:inline">Lập Phiếu Mới</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Số dư hiện có', value: stats.balance, color: 'text-slate-900', icon: <Wallet size={16}/>, bg: 'bg-white/40' },
          { label: 'Tổng ngân thu', value: stats.income, color: 'text-emeraldGreen', icon: <TrendingUp size={16}/>, bg: 'bg-emerald-50/40' },
          { label: 'Tổng ngân chi', value: stats.expense, color: 'text-rose-500', icon: <TrendingDown size={16}/>, bg: 'bg-rose-50/40' },
        ].map((m, idx) => (
          <div key={idx} className={`glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 border-white/60 shadow-sm ${m.bg}`}>
             <div className={`p-2.5 rounded-xl bg-white shadow-sm border border-white ${m.color === 'text-slate-900' ? 'text-slate-400' : m.color}`}>{m.icon}</div>
             <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none italic mb-1">{m.label}</p>
                <h3 className={`text-lg font-bold tracking-tight ${m.color}`}>{m.value.toLocaleString()}đ</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-[2rem] overflow-hidden bg-white/40 border-white shadow-sm">
        <div className="px-6 py-4 border-b border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 italic">
              <History size={14} className="text-amberGold" /> Nhật ký hiệp thông tài chính
            </h3>
            <div className="relative w-full md:w-64">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
               <input 
                 type="text" 
                 placeholder="Tìm phiếu..." 
                 className="w-full pl-10 pr-4 py-2 glass-card rounded-xl text-[11px] font-bold outline-none border-white focus:border-amberGold bg-white/50" 
                 value={searchTerm} 
                 onChange={(e) => setSearchTerm(e.target.value)} 
               />
            </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/60 text-slate-400 text-[8px] font-bold uppercase tracking-widest border-b border-slate-100 italic">
                <th className="px-8 py-4 w-16 text-center">STT</th>
                <th className="px-4 py-4">Nội Dung</th>
                <th className="px-4 py-4 text-center">Hạng Mục</th>
                <th className="px-4 py-4 text-right">Số Tiền (đ)</th>
                <th className="px-8 py-4 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filtered.map((t, idx) => (
                <tr key={t.id} className="hover:bg-white/60 transition-colors group">
                  <td className="px-8 py-4 text-center text-[10px] font-bold text-slate-300 italic">{idx + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm bg-white ${t.type === 'IN' ? 'text-emeraldGreen' : 'text-rose-500'}`}>
                        {t.type === 'IN' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[13px] font-bold text-slate-900 leading-tight">{t.description}</span>
                         <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic mt-0.5">{t.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2.5 py-1 bg-slate-100/80 border border-slate-200 text-slate-500 rounded-lg text-[8px] font-bold uppercase tracking-widest">{t.category}</span>
                  </td>
                  <td className={`px-4 py-4 text-[14px] font-bold text-right ${t.type === 'IN' ? 'text-emeraldGreen' : 'text-rose-500'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}đ
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button onClick={() => { if(window.confirm('Anh/chị xác nhận xóa phiếu?')) deleteTransaction(t.id); }} className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-[2.5rem] p-8 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 border-white">
             <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                 <h3 className="sacred-title text-2xl font-bold text-slate-900 italic leading-none">Lập Phiếu Thu Chi</h3>
                 <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-2 italic">Ghi nhận minh bạch đoàn quỹ</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Nội dung phiếu</label>
                    <input type="text" required value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} className="w-full px-5 py-3 glass-card rounded-xl text-[13px] font-bold outline-none border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50" placeholder="VD: Đóng quỹ tháng 1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Phân loại</label>
                    <div className="relative">
                      <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as 'IN' | 'OUT'})} className="w-full px-5 py-3 glass-card rounded-xl text-[13px] font-bold outline-none appearance-none cursor-pointer border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50">
                        <option value="IN">Ngân thu (+)</option>
                        <option value="OUT">Ngân chi (-)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Số tiền (đ)</label>
                    <input type="number" required value={newTx.amount} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} className="w-full px-5 py-3 glass-card rounded-xl text-[13px] font-bold outline-none border-slate-100 shadow-inner focus:border-amberGold transition-all bg-slate-50/50" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all italic">HUỶ BỎ</button>
                  <button type="submit" className="flex-[2] py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <Save size={16} /> GHI SỔ QUỸ
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
