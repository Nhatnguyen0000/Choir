import React from 'react';

export interface LogoBanDieuHanhProps {
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  accentColor?: string;
  className?: string;
}

const sizes = { sm: 32, md: 40, lg: 48 };

/**
 * Logo Ban điều hành — biểu tượng ban lãnh đạo / điều hành (không phải Ca đoàn).
 * Icon: nhóm người / hội đồng, gọn gàng.
 */
const LogoBanDieuHanh: React.FC<LogoBanDieuHanhProps> = ({
  size = 'md',
  iconOnly = false,
  accentColor = 'currentColor',
  className = '',
}) => {
  const px = sizes[size];
  const stroke = Math.max(1.2, px / 28);

  return (
    <div
      className={`inline-flex items-center gap-2 shrink-0 ${className}`}
      style={{ color: accentColor }}
      aria-hidden
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Nền bo góc — con dấu */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="currentColor"
          fillOpacity="0.1"
        />
        {/* Ba hình người (hội đồng / ban) — đơn giản */}
        <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth={stroke} fill="none" />
        <path d="M12 28c0-2 1.5-4 4-4s4 2 4 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" fill="none" />
        <circle cx="24" cy="16" r="4.5" stroke="currentColor" strokeWidth={stroke} fill="none" />
        <path d="M19.5 27c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" fill="none" />
        <circle cx="32" cy="18" r="4" stroke="currentColor" strokeWidth={stroke} fill="none" />
        <path d="M28 28c0-2 1.5-4 4-4s4 2 4 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" fill="none" />
        {/* Khung họp / bàn — đường ngang nối */}
        <path d="M8 36h32" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
      {!iconOnly && (
        <span
          className="font-bold text-[var(--foreground)] leading-tight tracking-tight"
          style={{ fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem' }}
        >
          Ban điều hành
        </span>
      )}
    </div>
  );
};

export default LogoBanDieuHanh;
