import { memo } from 'react';

interface HeaderProps {
  onLogoClick: () => void;
  showBack: boolean;
  onBack: () => void;
}

export const Header = memo(function Header({ onLogoClick, showBack, onBack }: HeaderProps) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        {showBack && (
          <button className="btn-back" onClick={onBack} aria-label="Kembali ke daftar surah">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </button>
        )}
        <div
          className="brand"
          onClick={onLogoClick}
          role="button"
          tabIndex={0}
          aria-label="MHD Qur'an — Kembali ke beranda"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onLogoClick();
            }
          }}
        >
          <div className="brand-icon">MHD</div>
          <div className="brand-text">QUR<span>'</span>AN</div>
        </div>
      </div>
    </header>
  );
});
