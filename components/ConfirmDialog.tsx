import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Xóa',
  onConfirm,
  onCancel,
  danger = true,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-5 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="card bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="p-7">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${danger ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-600'}`}>
              <AlertTriangle size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="confirm-dialog-title" className="text-lg font-bold text-slate-900 leading-tight">
                {title}
              </h3>
              <p className="mt-2.5 text-[15px] text-slate-500 leading-snug">
                {message}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="flex-shrink-0 p-2 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => { onConfirm(); onCancel(); }}
              className={`flex-1 py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider text-white transition-colors ${
                danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
