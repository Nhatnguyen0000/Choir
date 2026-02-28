import React from 'react';

export interface LogoProps {
  /** Kích thước tổng (icon + text). */
  size?: 'sm' | 'md' | 'lg';
  /** Chỉ hiển thị icon (không chữ). */
  iconOnly?: boolean;
  /** Màu chính (fill) — thường dùng màu mùa phụng vụ. */
  accentColor?: string;
  className?: string;
}

const sizes = { sm: 32, md: 40, lg: 48 };

/**
 * Logo Ca Đoàn Thiên Thần — Giáo xứ Bắc Hòa.
 * Biểu tượng: thiên thần / cánh + nốt nhạc, gắn với ca đoàn và giáo xứ Bắc Hòa.
 */
const Logo: React.FC<LogoProps> = ({
  size = 'md',
  iconOnly = false,
  accentColor = 'currentColor',
  className = '',
}) => {
  const px = sizes[size];
  const stroke = Math.max(1.5, px / 24);

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
        {/* Nền tròn bo góc (pill/viên thuốc) — tạo cảm giác “con dấu” */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="14"
          fill="currentColor"
          fillOpacity="0.12"
        />
        {/* Cánh thiên thần (đơn giản hóa) — hai cánh vòng cung */}
        <path
          d="M18 26c0-2 2-6 6-6s6 4 6 6"
          stroke="currentColor"
          strokeWidth={stroke * 1.2}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 26c0 2 2 6 6 6s6-4 6-6"
          stroke="currentColor"
          strokeWidth={stroke * 1.2}
          strokeLinecap="round"
          fill="none"
        />
        {/* Đầu / vòng sáng (halo) */}
        <circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth={stroke} fill="none" />
        {/* Nốt nhạc — biểu tượng ca đoàn */}
        <path
          d="M28 34v-8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <ellipse cx="32" cy="34" rx="3" ry="2" fill="currentColor" />
      </svg>
      {!iconOnly && (
        <span className="logo-text font-bold text-[var(--foreground)] leading-tight tracking-tight" style={{ fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem' }}>
          Ban Điều Hành
          <span className="block text-[var(--foreground-muted)] font-semibold text-xs sm:text-sm">
            Ca Đoàn Thiên Thần
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo;
