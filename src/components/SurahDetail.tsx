import { useState, useEffect, useRef, useCallback } from 'react';
import type { SurahDetail as SurahDetailType, TafsirAyat } from '../types';
import { fetchSurahDetail, fetchTafsir } from '../api';
import { AyatCard } from './AyatCard';

interface QueueItem {
  ayahNumber: number;
  url: string;
}

interface SurahDetailProps {
  nomor: number;
  onSelectSurah: (nomor: number) => void;
}

export function SurahDetail({ nomor, onSelectSurah }: SurahDetailProps) {
  const [detail, setDetail] = useState<SurahDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tafsirMap, setTafsirMap] = useState<Map<number, string>>(new Map());
  const [expandedTafsir, setExpandedTafsir] = useState<number | null>(null);

  const audioEl = useRef<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef<QueueItem[]>([]);
  const isAutoPlayingRef = useRef(false);

  const stopAutoPlay = useCallback(() => {
    if (audioEl.current) audioEl.current.pause();
    setIsAutoPlaying(false);
    isAutoPlayingRef.current = false;
    autoPlayRef.current = [];
    setPlayingAyah(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        stopAutoPlay();
        setExpandedTafsir(null);
        setTafsirMap(new Map());

        const [surahData, tafsirData] = await Promise.all([
          fetchSurahDetail(nomor),
          fetchTafsir(nomor).catch(() => [] as TafsirAyat[]),
        ]);

        if (cancelled) return;
        setDetail(surahData);

        const map = new Map<number, string>();
        for (const t of tafsirData) {
          if (t?.tafsir?.kemenag?.short) {
            map.set(t.nomorAyat, t.tafsir.kemenag.short);
          }
        }
        setTafsirMap(map);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
      stopAutoPlay();
      if (audioEl.current) {
        audioEl.current.pause();
        audioEl.current.removeAttribute('src');
      }
    };
  }, [nomor, stopAutoPlay]);

  const playAyah = useCallback(
    (ayahNumber: number, audioUrl: string, isAuto: boolean = false) => {
      if (!audioEl.current) return;

      if (isAutoPlayingRef.current) {
        stopAutoPlay();
        return;
      }

      if (playingAyah === ayahNumber && !isAuto) {
        audioEl.current.pause();
        setPlayingAyah(null);
        return;
      }

      if (isAuto) {
        const queue: QueueItem[] = (detail?.ayat || [])
          .filter((a) => a.nomorAyat >= ayahNumber)
          .map((a) => {
            const url = a.audio['01'];
            if (url) return { ayahNumber: a.nomorAyat, url };
            return null;
          })
          .filter((item): item is QueueItem => item !== null);

        if (queue.length === 0) return;

        isAutoPlayingRef.current = true;
        autoPlayRef.current = queue;
        setIsAutoPlaying(true);
        setPlayingAyah(queue[0].ayahNumber);

        audioEl.current.src = queue[0].url;
        audioEl.current.play().catch(() => stopAutoPlay());
      } else {
        audioEl.current.src = audioUrl;
        setPlayingAyah(ayahNumber);
        audioEl.current.play().catch(() => setPlayingAyah(null));
      }

      const handleEnded = () => {
        const next = autoPlayRef.current.shift();
        if (next && audioEl.current) {
          setPlayingAyah(next.ayahNumber);
          audioEl.current.src = next.url;
          audioEl.current.play().catch(() => stopAutoPlay());
        } else {
          stopAutoPlay();
        }
      };
      if (audioEl.current) {
        audioEl.current.addEventListener('ended', handleEnded);
      }
    },
    [playingAyah, detail, stopAutoPlay]
  );

  const toggleTafsir = useCallback((ayahNumber: number) => {
    setExpandedTafsir((prev) => (prev === ayahNumber ? null : ayahNumber));
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Memuat surah…</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <p className="error-message">{error || 'Surah tidak ditemukan'}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Coba Lagi
        </button>
      </div>
    );
  }

  const isMakkiyah = detail.tempatTurun === 'Mekah';
  const firstAyatAudio = detail.ayat[0]?.audio['01'];

  return (
    <>
      <audio ref={audioEl} preload="auto" style={{ display: 'none' }} />
      <div className="surah-detail-header">
        <div className="surah-detail-arabic">{detail.nama}</div>
        <h2 className="surah-detail-latin">{detail.namaLatin}</h2>
        <p className="surah-detail-meaning">{detail.arti}</p>
        <div className="surah-detail-meta">
          <span className={`badge ${isMakkiyah ? 'badge-makkiyah' : 'badge-madaniyah'}`}>
            {isMakkiyah ? 'Makkiyah' : 'Madaniyah'}
          </span>
          <span className="surah-detail-info">{detail.jumlahAyat} Ayat</span>
        </div>

        {detail.nomor !== 9 && detail.nomor !== 1 && firstAyatAudio && (
          <button
            className="btn-retry"
            onClick={() => {
              if (isAutoPlaying) {
                stopAutoPlay();
              } else {
                playAyah(1, firstAyatAudio, true);
              }
            }}
            style={{ marginTop: '16px', fontSize: '14px', display: 'block', width: '100%', maxWidth: '500px', margin: '0 auto' }}
          >
            {isAutoPlaying ? '⏹ Berhenti' : '▶ Putar Semua Ayat'}
          </button>
        )}

        {detail.nomor !== 9 && detail.nomor !== 1 && (
          <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</div>
        )}

        {(detail.ayat || []).map((ayah) => {
          const audioUrl = ayah.audio['01'];
          return (
            <AyatCard
              key={ayah.nomorAyat}
              ayah={ayah}
              isPlaying={playingAyah === ayah.nomorAyat}
              onPlay={() => audioUrl && playAyah(ayah.nomorAyat, audioUrl)}
              tafsirText={tafsirMap.get(ayah.nomorAyat)}
              isTafsirOpen={expandedTafsir === ayah.nomorAyat}
              onToggleTafsir={() => toggleTafsir(ayah.nomorAyat)}
            />
          );
        })}

        <nav className="surah-nav" aria-label="Navigasi surah">
          {detail.prev ? (
            <button className="surah-nav-btn" onClick={() => onSelectSurah(detail.prev!.nomor)}>
              <div className="surah-nav-label">Sebelumnya</div>
              <div className="surah-nav-name">{detail.prev.namaLatin} — {detail.prev.nama}</div>
            </button>
          ) : <div />}
          {detail.next ? (
            <button className="surah-nav-btn" onClick={() => onSelectSurah(detail.next!.nomor)}>
              <div className="surah-nav-label">Selanjutnya</div>
              <div className="surah-nav-name">{detail.next.namaLatin} — {detail.next.nama}</div>
            </button>
          ) : <div />}
        </nav>
      </div>
    </>
  );
}