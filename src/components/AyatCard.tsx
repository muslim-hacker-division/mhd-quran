import { memo } from 'react';
import type { Ayat } from '../types';

interface AyatCardProps {
  ayah: Ayat;
  isPlaying: boolean;
  onPlay: () => void;
  tafsirText?: string;
  isTafsirOpen: boolean;
  onToggleTafsir: () => void;
}

export const AyatCard = memo(function AyatCard({
  ayah,
  isPlaying,
  onPlay,
  tafsirText,
  isTafsirOpen,
  onToggleTafsir,
}: AyatCardProps) {
  return (
    <article className="ayah-card">
      {/* Baris atas: nomor & tombol aksi */}
      <div className="ayah-header">
        <div className="ayah-number">{ayah.nomorAyat}</div>
        <div className="ayah-actions">
          {/* Tombol tafsir — hanya tampil jika ada data tafsir */}
          {tafsirText && (
            <button
              className={`btn-icon ${isTafsirOpen ? 'tafsir-active' : ''}`}
              onClick={onToggleTafsir}
              aria-label={isTafsirOpen ? 'Tutup tafsir' : `Lihat tafsir ayat ${ayah.nomorAyat}`}
              title="Tafsir"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M8 7h8" />
                <path d="M8 11h6" />
              </svg>
            </button>
          )}
          {/* Tombol audio */}
          <button
            className={`btn-icon ${isPlaying ? 'playing' : ''}`}
            onClick={onPlay}
            aria-label={isPlaying ? `Hentikan audio ayat ${ayah.nomorAyat}` : `Putar audio ayat ${ayah.nomorAyat}`}
            title={isPlaying ? 'Hentikan' : 'Putar audio'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Teks Arab */}
      <div className="ayah-arabic">{ayah.teksArab}</div>

      {/* Transliterasi Latin */}
      <div className="ayah-latin">{ayah.teksLatin}</div>

      {/* Terjemahan Indonesia */}
      <div className="ayah-translation">{ayah.teksIndonesia}</div>

      {/* Tafsir (expandable) */}
      {tafsirText && (
        <>
          <button
            className={`tafsir-toggle ${isTafsirOpen ? 'open' : ''}`}
            onClick={onToggleTafsir}
            aria-expanded={isTafsirOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            {isTafsirOpen ? 'Tutup Tafsir' : 'Lihat Tafsir'}
          </button>
          <div className={`tafsir-content ${isTafsirOpen ? 'expanded' : ''}`} role="region" aria-label={`Tafsir ayat ${ayah.nomorAyat}`}>
            <div className="tafsir-text">{tafsirText}</div>
          </div>
        </>
      )}
    </article>
  );
});
