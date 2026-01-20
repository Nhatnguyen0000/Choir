
import React, { useState, useMemo } from 'react';
import { Plus, Trash, UserPen, TrendingUp, TrendingDown, FileSpreadsheet, X, ReceiptText, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';
import * as XLSX from 'xlsx';

interface FinanceManagementProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const FinanceManagement: React.FC<FinanceManagementProps> = ({ transactions, setTransactions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalIn = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
    return { totalIn, totalOut, balance: totalIn - totalOut };
  }, [transactions]);

  const handleSave = () => {
    if (!editingTransaction || !editingTransaction.description.trim()) return;
    setTransactions(prev => {
      const exists = prev.find(t => t.id === editingTransaction.id);
      if (exists) return prev.map(t => t.id === editingTransaction.id ? editingTransaction : t);
      return [editingTransaction, ...prev];
    });
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setTransactions(prev => prev.filter(t => t.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const exportFinance = () => {
    const data = transactions.map(t => ({
      'Ngày': t.date,
      'Nội dung': t.description,
      'Số tiền': t.amount,
      'Loại': t.type === 'IN' ? 'Thu' : 'Chi'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quy_Doan");
    XLSX.writeFile(wb, "BaoCaoTaiChinh.xlsx");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-950 dark:bg-black p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         <div className="relative z-10 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Số dư hiện tại</span>
            <h2 className="text-4xl font-black font-serif tracking-tighter">{stats.balance.toLocaleString()} <span className="text-sm opacity-50">đ</span></h2>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => { setEditingTransaction({ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], description: '', amount: 0, type: 'IN', category: 'Khác' }); setIsModalOpen(true); }} 
                className="p-4 bg-white text-slate-950 rounded-2xl shadow-xl active:scale-95 transition-all"
                title="Ghi giao dịch"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
              <button onClick={exportFinance} className="p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 active:scale-95 transition-all" title="Xuất báo cáo">
                <FileSpreadsheet size={24} />
              </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col items-center gap-2 shadow-sm">
            <TrendingUp size={24} className="text-emerald-500" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng thu</p>
            <p className="text-lg font-black text-slate-950 dark:text-white">{stats.totalIn.toLocaleString()}</p>
         </div>
         <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col items-center gap-2 shadow-sm">
            <TrendingDown size={24} className="text-rose-500" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng chi</p>
            <p className="text-lg font-black text-slate-950 dark:text-white">{stats.totalOut.toLocaleString()}</p>
         </div>
      </div>

      <div className="space-y-3 pb-24">
        <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-widest px-2">Nhật ký thu chi</h3>
        {transactions.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Chưa có giao dịch</div>
        ) : (
          transactions.sort((a,b) => b.date.localeCompare(a.date)).map(t => (
            <div key={t.id} className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'IN' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                    <ReceiptText size={20} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-950 dark:text-white leading-tight">{t.description}</h4>
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-400 mt-1 uppercase tracking-tighter">{t.date}</p>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className={`text-sm font-black ${t.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}
                 </span>
                 <div className="flex gap-1">
                   <button onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }} className="p-2 text-slate-950 dark:text-slate-400 active:scale-90" title="Sửa"><UserPen size={18}/></button>
                   <button onClick={() => setDeleteConfirmId(t.id)} className="p-2 text-rose-500 dark:text-rose-400 active:scale-90" title="Xóa"><Trash size={18}/></button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CRUD Bottom Sheet */}
      {isModalOpen && editingTransaction && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-8 pb-12 space-y-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Phiếu Thu Chi</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 dark:bg-white/10 rounded-full text-slate-950 dark:text-white active:scale-90"><X size={20}/></button>
            </div>
            
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-black/20 rounded-2xl">
              <button onClick={() => setEditingTransaction({...editingTransaction, type: 'IN'})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${editingTransaction.type === 'IN' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>Thu Quỹ</button>
              <button onClick={() => setEditingTransaction({...editingTransaction, type: 'OUT'})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${editingTransaction.type === 'OUT' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}>Chi Quỹ</button>
            </div>

            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nội dung</label>
                  <input type="text" value={editingTransaction.description} onChange={e => setEditingTransaction({...editingTransaction, description: e.target.value})} placeholder="Vd: Đóng quỹ, mua đồng phục..." className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Số tiền (đ)</label>
                    <input type="number" value={editingTransaction.amount} onChange={e => setEditingTransaction({...editingTransaction, amount: parseInt(e.target.value) || 0})} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black border-none outline-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Ngày</label>
                    <input type="date" value={editingTransaction.date} onChange={e => setEditingTransaction({...editingTransaction, date: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-950 dark:text-white font-black border-none outline-none" />
                 </div>
               </div>
            </div>

            <div className="flex gap-4">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-white/5 text-slate-950 dark:text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Hủy</button>
               <button onClick={handleSave} className="flex-[2] py-5 bg-slate-950 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Lưu Phiếu</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Sheet */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/90 backdrop-blur-md p-0 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] w-full max-w-lg p-10 pb-12 space-y-8 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                  <AlertCircle size={48} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">Xóa vĩnh viễn dòng tiền?</h3>
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400 px-4">Thông tin thu chi này sẽ bị gỡ bỏ. Bạn có chắc không?</p>
            </div>
            <div className="flex flex-col gap-3">
               <button onClick={confirmDelete} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/30 active:scale-95 transition-all">Xác nhận xóa</button>
               <button onClick={() => setDeleteConfirmId(null)} className="w-full py-5 bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
