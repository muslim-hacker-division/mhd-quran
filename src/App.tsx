import { useState, useEffect, useCallback } from 'react';
import type { Surah } from './types';
import { fetchAllSurahs } from './api';
import { Header } from './components/Header';
import { SurahList } from './components/SurahList';
import { SurahDetail } from './components/SurahDetail';
import { Footer } from './components/Footer';

type View =
  | { type: 'list' }
  | { type: 'detail'; surahNumber: number };

export default function App() {
  const [view, setView] = useState<View>({ type: 'list' });
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllSurahs();
      setSurahs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const openSurah = useCallback((nomor: number) => {
    setView({ type: 'detail', surahNumber: nomor });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setView({ type: 'list' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="app">
      <Header
        onLogoClick={goBack}
        showBack={view.type === 'detail'}
        onBack={goBack}
      />
      <main className="main-content">
        {view.type === 'list' ? (
          <SurahList
            surahs={surahs}
            loading={loading}
            error={error}
            onRetry={loadSurahs}
            onSelectSurah={openSurah}
          />
        ) : (
          <SurahDetail
            nomor={view.surahNumber}
            onBack={goBack}
            onSelectSurah={openSurah}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
