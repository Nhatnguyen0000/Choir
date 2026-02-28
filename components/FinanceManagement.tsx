import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, X, Trash2, Wallet, ArrowUpRight, ArrowDownLeft, FileDown, Plus, History, ChevronDown, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore, useToastStore } from '../store';
import { Transaction } from '../types';
import ConfirmDialog from './ConfirmDialog';
import { suggestCategory } from '../services/financeCategorizer';
import * as XLSX from 'xlsx';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

const MONTH_LABELS: Record<number, string> = {
  1: 'T1', 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6',
  7: 'T7', 8: 'T8', 9: 'T9', 10: 'T10', 11: 'T11', 12: 'T12',
};

const FinanceManagement: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useFinanceStore();
  const addToast = useToastStore((s) => s.addToast);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null; description: string }>({ open: false, id: null, description: '' });
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    description: '', amount: 0, type: 'IN', category: 'Đóng góp', date: new Date().toISOString().split('T')[0]
  });

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    const byMonth: Record<string, { monthKey: string; month: string; thu: number; chi: number }> = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      const [y, mo] = m.split('-').map(Number);
      const label = `${MONTH_LABELS[mo] || mo} ${String(y).slice(2)}`;
      if (!byMonth[m]) byMonth[m] = { monthKey: m, month: label, thu: 0, chi: 0 };
      if (t.type === 'IN') byMonth[m].thu += t.amount;
      else byMonth[m].chi += t.amount;
    });
    return Object.values(byMonth)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .slice(-6)
      .map(({ month, thu, chi }) => ({ month, thu, chi }));
  }, [transactions]);

  const filtered = useMemo(() => transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;
    const autoCategory = suggestCategory(newTx.description || '');
    addTransaction({
      ...newTx as Transaction,
      id: crypto.randomUUID(), choirId: 'c-thienthan',
      category: newTx.category || autoCategory,
      date: newTx.date || new Date().toISOString().split('T')[0],
      description: newTx.description || '', amount: Number(newTx.amount) || 0,
      type: (newTx.type as 'IN' | 'OUT') || 'IN',
    });
    addToast('Đã thêm phiếu giao dịch');
    setIsModalOpen(false);
    setNewTx({ description: '', amount: 0, type: 'IN', category: 'Đóng góp', date: new Date().toISOString().split('T')[0] });
  };

  const handleConfirmDeleteTx = () => {
    if (confirmDelete.id) { deleteTransaction(confirmDelete.id); addToast('Đã xóa phiếu giao dịch'); }
    setConfirmDelete({ open: false, id: null, description: '' });
  };

  const handleExportFinance = () => {
    const rows = filtered.map((t, i) => [
      i + 1, t.date, t.description, t.category,
      t.type === 'IN' ? t.amount : '', t.type === 'OUT' ? t.amount : '',
    ]);
    const header = ['STT', 'Ngày', 'Nội dung', 'Hạng mục', 'Thu (đ)', 'Chi (đ)'];
    const summary = [
      [], ['', '', '', 'TỔNG THU', stats.income, ''],
      ['', '', '', 'TỔNG CHI', '', stats.expense],
      ['', '', '', 'SỐ DƯ', stats.balance, ''],
    ];
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows, ...summary]);
    ws['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sổ quỹ');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SoQuy_ThienThan_${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Đã xuất file Excel sổ quỹ');
  };

  return (
    <div className="w-full space-y-6 lg:space-y-8 animate-fade-in">
      <div className="page-header-2026">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Ngân quỹ đoàn</h1>
            <p className="page-subtitle">Quỹ đoàn · Bắc Hòa</p>
          </div>
          <div className="page-actions-2026 flex items-center gap-2 flex-wrap">
          <Button variant="secondary" onClick={handleExportFinance} className="flex items-center gap-2">
            <FileDown size={16} /> Xuất dữ liệu
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> Lập phiếu mới
          </Button>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {[
          { label: 'Số dư', value: stats.balance, icon: Wallet, bg: 'bg-[var(--background-muted)]', color: 'text-[var(--foreground-muted)]' },
          { label: 'Thu', value: stats.income, icon: TrendingUp, bg: 'bg-[var(--success-bg)]', color: 'text-[var(--success)]' },
          { label: 'Chi', value: stats.expense, icon: TrendingDown, bg: 'bg-[var(--error-bg)]', color: 'text-[var(--error)]' },
        ].map((m, idx) => (
          <Card key={idx} variant="glass" className="p-5 lg:p-6 text-center">
            <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${m.bg} ${m.color}`}>
              <m.icon size={22} />
            </div>
            <p className="section-label mt-3">{m.label}</p>
            <p className="text-lg font-bold text-[var(--foreground)] mt-0.5">{m.value.toLocaleString('vi-VN')}đ</p>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card variant="glass" className="rounded-2xl p-5 lg:p-6">
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">Thu chi theo tháng</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }} axisLine={false} tickLine={false} width={50} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                  formatter={(value: number, name: string) => [`${value.toLocaleString('vi-VN')}đ`, name === 'thu' ? 'Thu' : 'Chi']}
                />
                <Bar dataKey="thu" fill="url(#financeThuGradient)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="chi" fill="url(#financeChiGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="financeThuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="financeChiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <Card variant="glass" className="rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <History size={16} className="text-[var(--foreground-muted)]" /> Nhật ký giao dịch
          </h3>
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--foreground-muted)]" />
            <Input type="text" placeholder="Tìm phiếu..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-[var(--background-muted)] border-b border-[var(--border)] text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                <th className="px-6 py-4 w-16 text-center">STT</th>
                <th className="px-4 py-4">Nội dung</th>
                <th className="px-4 py-4 text-center">Hạng mục</th>
                <th className="px-4 py-4 text-right">Số tiền (đ)</th>
                <th className="px-6 py-4 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((t, idx) => (
                <tr key={t.id} className="hover:bg-[var(--background-muted)]/50 transition-colors group">
                  <td className="px-6 py-4 text-center text-xs font-medium text-[var(--foreground-muted)]">{idx + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'IN' ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--error-bg)] text-[var(--error)]'}`}>
                        {t.type === 'IN' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--foreground)] leading-tight">{t.description}</span>
                        <span className="text-xs text-[var(--foreground-muted)] mt-0.5">{t.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1.5 bg-[var(--background-muted)] text-[var(--foreground-muted)] rounded-full text-xs font-semibold">{t.category}</span>
                  </td>
                  <td className={`px-4 py-4 text-sm font-semibold text-right ${t.type === 'IN' ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" onClick={() => setConfirmDelete({ open: true, id: t.id, description: t.description })} className="p-2 opacity-0 group-hover:opacity-100 text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all rounded-xl">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Wallet size={40} className="mx-auto text-[var(--foreground-muted)] mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-[var(--foreground-muted)]">Chưa có phiếu thu chi nào</p>
                    <Button className="mt-3" onClick={() => setIsModalOpen(true)}>Lập phiếu đầu tiên</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 min-h-screen overflow-y-auto bg-black/25 backdrop-blur-md">
          <Card variant="glass" className="w-full max-w-md rounded-2xl p-6 my-auto relative z-10 shadow-[var(--shadow-lg)]">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="sacred-title text-xl font-bold leading-none">Lập Phiếu Thu Chi</h3>
                <p className="section-label mt-1">Ghi nhận minh bạch đoàn quỹ</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-muted)] transition-all" aria-label="Đóng"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="section-label ml-0.5">Nội dung phiếu</label>
                <Input required value={newTx.description ?? ''} onChange={e => setNewTx({ ...newTx, description: e.target.value })} placeholder="VD: Đóng quỹ tháng 1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Phân loại</label>
                  <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value as 'IN' | 'OUT' })} className="w-full h-11 px-4 rounded-[var(--radius-md)] text-sm border border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 appearance-none cursor-pointer">
                    <option value="IN">Thu (+)</option>
                    <option value="OUT">Chi (-)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="section-label ml-0.5">Số tiền (đ)</label>
                  <Input type="number" required value={newTx.amount ?? 0} onChange={e => setNewTx({ ...newTx, amount: Number(e.target.value) })} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Hủy</Button>
                <Button type="submit" className="flex-[2] flex items-center justify-center gap-2">
                  <Save size={16} /> Ghi sổ quỹ
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete.open} title="Xóa phiếu giao dịch"
        message={`Bạn có chắc muốn xóa phiếu "${confirmDelete.description}" khỏi sổ quỹ? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa" onConfirm={handleConfirmDeleteTx}
        onCancel={() => setConfirmDelete({ open: false, id: null, description: '' })} danger
      />
    </div>
  );
};

export default FinanceManagement;
