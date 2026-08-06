import { useState, useMemo } from 'react';
import type { Surah } from '../types';

interface SurahListProps {
  surahs: Surah[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectSurah: (nomor: number) => void;
}

export function SurahList({ surahs, loading, error, onRetry, onSelectSurah }: SurahListProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return surahs;
    const q = search.toLowerCase().trim();
    return surahs.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.nama.includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nomor.toString() === q
    );
  }, [surahs, search]);

  /* --- State error --- */
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <p className="error-message">{error}</p>
        <button className="btn-retry" onClick={onRetry}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">AL-QUR&apos;AN</h1>
        <p className="hero-subtitle">
          Baca, dengarkan, dan renungkan setiap ayat Al-Qur&apos;an dengan tampilan modern
        </p>
      </section>

      {/* Pencarian */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Cari surah… (nama, arti, atau nomor)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari surah"
        />
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      {/* Konten daftar surah */}
      {loading ? (
        <div className="surah-grid" aria-label="Memuat daftar surah">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <p>Tidak ditemukan surah untuk &quot;{search}&quot;</p>
        </div>
      ) : (
        <div className="surah-grid" role="list">
          {filtered.map((surah, i) => (
            <div
              key={surah.nomor}
              className="surah-card"
              style={{ animationDelay: `${Math.min(i * 25, 300)}ms` }}
              onClick={() => onSelectSurah(surah.nomor)}
              role="listitem"
              tabIndex={0}
              aria-label={`Surah ${surah.namaLatin}, ${surah.arti}, ${surah.jumlahAyat} ayat`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSurah(surah.nomor);
                }
              }}
            >
              <div className="surah-number">{surah.nomor}</div>
              <div className="surah-info">
                <div className="surah-name-latin">{surah.namaLatin}</div>
                <div className="surah-meaning">{surah.arti}</div>
              </div>
              <div className="surah-meta">
                <div className="surah-name-arabic">{surah.nama}</div>
                <div className="surah-ayat-count">{surah.jumlahAyat} Ayat</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
