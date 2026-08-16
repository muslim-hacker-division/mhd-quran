import { useState, useEffect, useCallback } from 'react';
import type { Surah } from './types';
import { fetchAllSurahs } from './api';
import { Header } from './components/Header';
import { HomeMenu } from './components/HomeMenu';
import { SurahList } from './components/SurahList';
import { SurahDetail } from './components/SurahDetail';
import { DoaList } from './components/DoaList';
import { DzikirList } from './components/DzikirList';
import { Footer } from './components/Footer';

type View =
  | { type: 'home' }
  | { type: 'quran-list' }
  | { type: 'quran-detail'; surahNumber: number }
  | { type: 'doa' }
  | { type: 'dzikir' };

export default function App() {
  const [view, setView] = useState<View>({ type: 'home' });
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

  const handleNavigate = useCallback((page: 'quran' | 'doa' | 'dzikir') => {
    if (page === 'quran') setView({ type: 'quran-list' });
    if (page === 'doa') setView({ type: 'doa' });
    if (page === 'dzikir') setView({ type: 'dzikir' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openSurah = useCallback((nomor: number) => {
    setView({ type: 'quran-detail', surahNumber: nomor });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    if (view.type === 'quran-detail') {
      setView({ type: 'quran-list' });
    } else {
      setView({ type: 'home' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view.type]);

  return (
    <div className="app">
      <Header
        onLogoClick={goBack}
        showBack={view.type !== 'home'}
        onBack={goBack}
      />
      <main className="main-content">
        {view.type === 'home' && <HomeMenu onNavigate={handleNavigate} />}
        
        {view.type === 'quran-list' && (
          <SurahList
            surahs={surahs}
            loading={loading}
            error={error}
            onRetry={loadSurahs}
            onSelectSurah={openSurah}
          />
        )}

        {view.type === 'quran-detail' && (
          <SurahDetail
            nomor={view.surahNumber}
            onSelectSurah={openSurah}
          />
        )}

        {view.type === 'doa' && <DoaList />}
        {view.type === 'dzikir' && <DzikirList />}
      </main>
      <Footer />
    </div>
  );
}
