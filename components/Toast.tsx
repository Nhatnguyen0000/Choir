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
      className="toast-item flex items-center gap-4 px-5 py-4 rounded-[var(--radius-xl)] border shadow-[var(--shadow-md)]"
      style={isSuccess ? { backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)' } : { backgroundColor: 'var(--error-bg)', borderColor: 'var(--error)' }}
      role="status"
    >
      {isSuccess ? (
        <CheckCircle2 size={22} className="flex-shrink-0" style={{ color: 'var(--success)' }} />
      ) : (
        <XCircle size={22} className="flex-shrink-0" style={{ color: 'var(--error)' }} />
      )}
      <span className="text-[15px] font-medium flex-1 text-[var(--foreground)]">{message}</span>
      <button type="button" onClick={() => removeToast(id)} className="p-2 rounded-xl hover:bg-black/5 transition-colors touch-manipulation min-h-[44px] min-w-[44px] text-[var(--foreground-muted)]" aria-label="Đóng">
        <X size={18} />
      </button>
    </div>
  );
};

const Toast: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[3000] w-full max-w-md px-4 flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto toast-list">
        {toasts.map((t, i) => (
          <div key={t.id} className="toast-wrap" style={{ animationDelay: `${i * 50}ms` }}>
            <ToastItem id={t.id} message={t.message} type={t.type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;
