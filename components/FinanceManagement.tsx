
import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, X, Trash2, Wallet, ArrowUpRight, ArrowDownLeft, FileDown, Camera, Plus, History, ChevronDown } from 'lucide-react';
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
    <div className="w-full space-y-8 animate-fade-in pb-16 px-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1.5">
          <h1 className="sacred-title text-3xl font-bold text-slate-900 italic tracking-tight uppercase">Đoàn Quỹ Minh Bạch</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] italic leading-none">Sổ quỹ hiệp thông cộng đoàn</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-button p-3.5 rounded-2xl text-slate-400 hover:text-royalBlue shadow-sm border-white/60">
             <FileDown size={18} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="glass-button active-glass px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-sm">
             Lập phiếu mới <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-2">
        {[
          { label: 'Số dư hiện có', value: stats.balance, color: 'text-slate-900', icon: <Wallet size={20}/>, bg: 'bg-white/40' },
          { label: 'Tổng ngân thu', value: stats.income, color: 'text-emeraldGreen', icon: <TrendingUp size={20}/>, bg: 'bg-emerald-50/40' },
          { label: 'Tổng ngân chi', value: stats.expense, color: 'text-rose-500', icon: <TrendingDown size={20}/>, bg: 'bg-rose-50/40' },
        ].map((m, idx) => (
          <div key={idx} className={`glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-5 border-white/60 shadow-sm transition-all hover:-translate-y-1 ${m.bg}`}>
             <div className={`p-3 rounded-2xl bg-white shadow-sm border border-white ${m.color === 'text-slate-900' ? 'text-slate-400' : m.color}`}>{m.icon}</div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none italic">{m.label}</p>
                <h3 className={`text-2xl font-bold tracking-tight ${m.color}`}>{m.value.toLocaleString()}đ</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="px-2">
        <div className="glass-card rounded-[2.5rem] border-white/60 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                <History size={18} className="text-amberGold" /> Nhật ký hiệp thông tài chính
              </h3>
              <div className="relative w-full md:w-80">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                 <input 
                   type="text" 
                   placeholder="Tìm nội dung phiếu..." 
                   className="w-full pl-12 pr-6 py-3.5 glass-card rounded-2xl text-[13px] font-bold outline-none border-white/60 bg-white/20 focus:border-amberGold transition-all" 
                   value={searchTerm} 
                   onChange={(e) => setSearchTerm(e.target.value)} 
                 />
              </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-white/30 text-slate-400 text-[9px] font-bold uppercase tracking-widest border-b border-slate-100 italic">
                  <th className="px-10 py-5 w-20 text-center">STT</th>
                  <th className="px-6 py-5">Nội Dung & Thời Gian</th>
                  <th className="px-6 py-5 text-center">Hạng Mục</th>
                  <th className="px-6 py-5 text-right">Số Tiền (đ)</th>
                  <th className="px-10 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filtered.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-10 py-5 text-center text-[12px] font-bold text-slate-300 italic">{idx + 1}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm bg-white ${t.type === 'IN' ? 'text-emeraldGreen border-emerald-100' : 'text-rose-500 border-rose-100'}`}>
                          {t.type === 'IN' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[15px] font-bold text-slate-900 leading-tight tracking-tight">{t.description}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1 leading-none">{t.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1.5 bg-slate-100/50 border border-slate-200 text-slate-500 rounded-xl text-[9px] font-bold uppercase tracking-widest">{t.category}</span>
                    </td>
                    <td className={`px-6 py-5 text-[16px] font-bold tracking-tight text-right ${t.type === 'IN' ? 'text-emeraldGreen' : 'text-rose-500'}`}>
                      {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}đ
                    </td>
                    <td className="px-10 py-5 text-right">
                      <div className="flex justify-end gap-3 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 glass-button border-none rounded-xl text-slate-300 hover:text-royalBlue bg-white/40"><Camera size={16} /></button>
                        <button onClick={() => { if(window.confirm('Anh/chị xác nhận xóa phiếu thu chi này?')) deleteTransaction(t.id); }} className="p-2.5 glass-button border-none rounded-xl text-slate-300 hover:text-rose-500 bg-white/40"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-md rounded-[3rem] p-12 relative z-10 bg-white shadow-2xl animate-in zoom-in-95 border-white/60">
             <div className="flex justify-between items-start mb-10">
               <div className="space-y-3">
                 <h3 className="sacred-title text-3xl font-bold text-slate-900 italic leading-none">Lập Phiếu Hiệp Thông</h3>
                 <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 mt-2 italic">Ghi nhận minh bạch đoàn quỹ</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3.5 glass-button border-none text-slate-300 hover:text-slate-900 shadow-sm transition-transform hover:rotate-90"><X size={24} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Nội dung phiếu</label>
                    <input type="text" required value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner focus:border-amberGold transition-all" placeholder="VD: Đóng quỹ tháng 1" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Phân loại</label>
                    <div className="relative">
                      <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as 'IN' | 'OUT'})} className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none appearance-none cursor-pointer border-white shadow-inner focus:border-amberGold transition-all">
                        <option value="IN">Ngân thu (+)</option>
                        <option value="OUT">Ngân chi (-)</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Số tiền (đ)</label>
                    <input type="number" required value={newTx.amount} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} className="w-full px-6 py-4 glass-card rounded-2xl text-[15px] font-bold outline-none border-white shadow-inner focus:border-amberGold transition-all" />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4.5 text-slate-400 font-bold text-[12px] uppercase tracking-[0.3em] hover:text-slate-900 transition-all italic">HUỶ BỎ</button>
                  <button type="submit" className="flex-[2] py-4.5 bg-slate-900 text-white rounded-[2rem] font-bold text-[12px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <TrendingUp size={20} /> GHI SỔ QUỸ
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
