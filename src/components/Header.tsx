import { memo } from 'react';

interface HeaderProps {
  onLogoClick: () => void;
  showBack: boolean;
  onBack: () => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
}

export const Header = memo(function Header({ onLogoClick, showBack, onBack, isLightMode, onToggleTheme }: HeaderProps) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        {showBack && (
          <button className="btn-back" onClick={onBack} aria-label="Kembali ke daftar surah">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
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
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLogoClick(); } }}
        >
          <img src="/logoMHD.png" alt="Logo MHD" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div className="brand-text">QUR<span>'</span>AN</div>
        </div>
        
        <button 
          className="btn-icon theme-toggle" 
          onClick={onToggleTheme} 
          aria-label={isLightMode ? "Ganti ke mode gelap" : "Ganti ke mode terang"}
          style={{ marginLeft: 'auto' }}
        >
          {isLightMode ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
});
