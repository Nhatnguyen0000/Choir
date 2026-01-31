
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12 px-2 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="sacred-title text-2xl md:text-3xl font-bold text-slate-900 italic leading-none">Ngân Quỹ Minh Bạch</h1>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] italic">Sổ quỹ hiệp thông tài chính cộng đoàn</p>
        </div>
        <div className="flex gap-2">
          <button className="glass-button p-3 rounded-xl text-slate-400 hover:text-royalBlue transition-all shadow-sm border-white/60">
             <FileDown size={18} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="active-pill px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all">
             Lập phiếu mới <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Metrics Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Số dư hiện hữu', value: stats.balance, color: 'text-slate-900', icon: <Wallet size={18}/> },
          { label: 'Tổng Ngân thu', value: stats.income, color: 'text-emeraldGreen', icon: <TrendingUp size={18}/> },
          { label: 'Tổng Ngân chi', value: stats.expense, color: 'text-crimsonRed', icon: <TrendingDown size={18}/> },
        ].map((m, idx) => (
          <div key={idx} className={`glass-card p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 border-white/60 shadow-sm transition-all`}>
             <div className={`p-3 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 ${m.color === 'text-slate-900' ? '' : m.color}`}>{m.icon}</div>
             <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{m.label}</p>
                <h3 className={`text-xl font-black tracking-tighter ${m.color}`}>{m.value.toLocaleString()}đ</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Ledger Glass Card */}
      <div className="glass-card rounded-[2rem] border-white/60 shadow-sm overflow-hidden bg-white/60">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <History size={16} className="text-amberGold" /> Chi tiết biến động quỹ
            </h3>
            <div className="relative w-full md:w-64 group">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Tìm diễn giải..." 
                 className="w-full pl-10 pr-4 py-2.5 glass-card rounded-xl text-[12px] font-bold outline-none border-white/40 shadow-inner focus:ring-4 focus:ring-slate-100 transition-all bg-slate-50/50" 
                 value={searchTerm} 
                 onChange={(e) => setSearchTerm(e.target.value)} 
               />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[8px] font-black uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-4 w-12 text-center">STT</th>
                <th className="px-4 py-4">Nội dung & Thời gian</th>
                <th className="px-4 py-4 hidden md:table-cell">Mục lục</th>
                <th className="px-4 py-4">Số tiền</th>
                <th className="px-8 py-4 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t, idx) => (
                <tr key={t.id} className="table-row-hover transition-colors group">
                  <td className="px-8 py-5 text-center text-[10px] font-black text-slate-300">{idx + 1}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${t.type === 'IN' ? 'bg-emerald-50 text-emeraldGreen border-emerald-100' : 'bg-rose-50 text-crimsonRed border-rose-100'}`}>
                        {t.type === 'IN' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[13px] font-black text-slate-900 leading-tight">{t.description}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mt-0.5">{t.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 hidden md:table-cell">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-widest border border-slate-200">{t.category}</span>
                  </td>
                  <td className={`px-4 py-5 text-[15px] font-black tracking-tight ${t.type === 'IN' ? 'text-emeraldGreen' : 'text-crimsonRed'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}đ
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 glass-button rounded-lg text-slate-300 hover:text-royalBlue shadow-sm transition-all border-white/60"><Camera size={14} /></button>
                      <button onClick={() => { if(window.confirm('Xác nhận xóa phiếu này?')) deleteTransaction(t.id); }} className="p-2.5 glass-button rounded-lg text-slate-300 hover:text-crimsonRed shadow-sm transition-all border-white/60"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] italic opacity-40">Hiện chưa có biến động ngân quỹ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1e293b]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 bg-white/95 shadow-2xl animate-in zoom-in-95 border-white/40">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="sacred-title text-2xl font-bold text-slate-900 italic leading-none">Lập Phiếu Thu Chi</h3>
                 <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Ghi nhận minh bạch tài chính đoàn</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2.5 glass-button rounded-xl text-slate-300 hover:text-slate-900 border-white/60 shadow-sm"><X size={20} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung</label>
                    <input type="text" required value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner bg-slate-50/50" placeholder="VD: Thu tiền quỹ" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại phiếu</label>
                    <div className="relative">
                      <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as 'IN' | 'OUT'})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer">
                        <option value="IN">Thu (+)</option>
                        <option value="OUT">Chi (-)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Số tiền (đ)</label>
                    <input type="number" required value={newTx.amount} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} className="w-full px-4 py-3 glass-card rounded-xl text-sm font-bold outline-none border-white shadow-inner bg-slate-50/50" />
                  </div>
                </div>
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] hover:text-slate-900 transition-all">HUỶ BỎ</button>
                  <button type="submit" className="flex-[2] py-4 active-pill rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <TrendingUp size={16} /> GHI SỔ
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
