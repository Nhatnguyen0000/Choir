import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useToastStore } from '../store';

const AUTO_DISMISS_MS = 3500;

const ToastItem: React.FC<{ id: string; message: string; type: 'success' | 'error' }> = ({ id, message, type }) => {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const t = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [id, removeToast]);

  const isSuccess = type === 'success';
  return (
    <div
      className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl shadow-xl border backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 ${
        isSuccess ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' : 'bg-rose-50/95 border-rose-200 text-rose-800'
      }`}
      role="status"
    >
      {isSuccess ? <CheckCircle2 size={22} className="flex-shrink-0 text-emerald-500" /> : <XCircle size={22} className="flex-shrink-0 text-rose-500" />}
      <span className="text-[15px] font-medium flex-1">{message}</span>
      <button
        type="button"
        onClick={() => removeToast(id)}
        className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Đóng"
      >
        <X size={18} />
      </button>
    </div>
  );
};

const Toast: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[400] w-full max-w-md px-4 flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
};

export default Toast;
