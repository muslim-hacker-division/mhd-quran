interface HomeMenuProps {
  onNavigate: (page: 'quran' | 'doa' | 'dzikir') => void;
}

export function HomeMenu({ onNavigate }: HomeMenuProps) {
  const handleDonasi = () => {
    window.open('https://saweria.co/MHDmedia', '_blank');
  };

  return (
    <div className="menu-grid">
      <button className="menu-card" onClick={() => onNavigate('quran')}>
        <div className="menu-icon">📖</div>
        <div className="menu-label">Al-Qur'an</div>
      </button>
      
      <button className="menu-card" onClick={() => onNavigate('doa')}>
        <div className="menu-icon">🤲</div>
        <div className="menu-label">Doa Harian</div>
      </button>
      
      <button className="menu-card" onClick={() => onNavigate('dzikir')}>
        <div className="menu-icon">📿</div>
        <div className="menu-label">Dzikir</div>
      </button>
      
      <button className="menu-card" onClick={handleDonasi}>
        <div className="menu-icon">💚</div>
        <div className="menu-label">Donasi</div>
      </button>
    </div>
  );
}
