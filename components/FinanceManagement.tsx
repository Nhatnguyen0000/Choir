
import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, X, Trash2, Wallet, ArrowUpRight, ArrowDownLeft, FileDown, Camera, Plus, History } from 'lucide-react';
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
  ), [transactions, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;
    addTransaction({ ...newTx as Transaction, id: `tx-${Date.now()}` });
    setIsModalOpen(false);
    setNewTx({ description: '', amount: 0, type: 'IN', category: 'Đóng góp', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16 px-4 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-4">
           <div className="space-y-1">
             <h2 className="sacred-title text-3xl font-bold text-slate-900 italic leading-none uppercase">Ngân Quỹ Minh Bạch</h2>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic mt-1">Sổ quỹ hiệp thông tài chính</p>
           </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-400 hover:text-royalBlue transition-all shadow-sm">
             <FileDown size={20} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="active-pill px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all">
             Lập phiếu mới <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Simplified Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Số dư hiện hữu', value: stats.balance, color: 'text-slate-900', icon: <Wallet size={20}/>, bg: 'bg-white' },
          { label: 'Tổng Ngân thu', value: stats.income, color: 'text-emerald-600', icon: <TrendingUp size={20}/>, bg: 'bg-emerald-50/30' },
          { label: 'Tổng Ngân chi', value: stats.expense, color: 'text-rose-600', icon: <TrendingDown size={20}/>, bg: 'bg-rose-50/30' },
        ].map((m, idx) => (
          <div key={idx} className={`p-6 rounded-[2rem] flex flex-col items-center text-center space-y-2 border border-slate-100 shadow-sm transition-all ${m.bg}`}>
             <div className="p-3 rounded-2xl bg-white text-slate-400 shadow-sm border border-slate-50">{m.icon}</div>
             <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                <h3 className={`text-xl font-black tracking-tighter ${m.color}`}>{m.value.toLocaleString()}đ</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2.5 italic">
              <History size={16} className="text-amberGold" /> Sổ Chi Tiết Quỹ
            </h3>
            <div className="relative w-full md:w-72">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Tìm kiếm..." 
                 className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium outline-none shadow-inner" 
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
                <th className="px-6 py-4">Diễn giải / Thời gian</th>
                <th className="px-6 py-4">Mục lục</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-8 py-4 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5 text-center text-[10px] font-black text-slate-300">{idx + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${t.type === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {t.type === 'IN' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[13px] font-bold text-slate-800 leading-tight mb-0.5">{t.description}</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{t.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-md text-[8px] font-black uppercase border border-slate-100">{t.category}</span>
                  </td>
                  <td className={`px-6 py-5 text-[14px] font-black tracking-tight ${t.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}đ
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-300 hover:text-royalBlue transition-colors"><Camera size={16} /></button>
                      <button onClick={() => deleteTransaction(t.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] italic">Sổ quỹ hiện đang để trống</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-card w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 bg-white shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
               <h3 className="sacred-title text-2xl font-bold text-slate-900 italic">Lập Phiếu Thu Chi</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diễn giải</label>
                    <input type="text" required value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại phiếu</label>
                    <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as 'IN' | 'OUT'})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none">
                       <option value="IN">Thu vào (+)</option>
                       <option value="OUT">Chi ra (-)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền</label>
                    <input type="number" required value={newTx.amount} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 active-pill rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg">Ghi nhận vào sổ quỹ</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
