import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden
        onClick={onCancel}
      />
      <div
        ref={contentRef}
        className={cn(
          'relative z-[2501] w-full max-w-md p-6',
          'bg-[var(--background-elevated)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex-shrink-0 w-14 h-14 rounded-[var(--radius-xl)] flex items-center justify-center',
              danger ? 'bg-[var(--error-bg)]' : 'bg-[var(--background-muted)]'
            )}
          >
            <AlertTriangle
              size={28}
              className={danger ? 'text-[var(--error)]' : 'text-[var(--foreground-muted)]'}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h2>
            <p id="confirm-dialog-desc" className="mt-2 text-sm text-[var(--foreground-muted)] leading-snug">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex-shrink-0 p-2 rounded-xl hover:bg-[var(--background-muted)] transition-colors min-h-[44px] min-w-[44px] text-[var(--foreground-muted)]"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Hủy
          </Button>
          <Button
            variant={danger ? 'destructive' : 'default'}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
