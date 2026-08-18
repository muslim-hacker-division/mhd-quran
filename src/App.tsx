import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Surah } from './types';
import { fetchAllSurahs } from './api';
import { Header } from './components/Header';
import { SurahList } from './components/SurahList';
import { SurahDetail } from './components/SurahDetail';
import { Footer } from './components/Footer';

// Import JSON
import doaData from './doa_harian.json';
import pagiDataRaw from './dzikir_pagi_up.json';
import soreDataRaw from './dzikir_petang_up.json';

// Types Sementara
interface DoaItem { nama: string; arab: string; latin: string; terjemahan: string; sumber: string; }
interface DzikirItemUnified { nomor: number; nama: string; judul?: string; arab: string; arti: string; terjemah?: string; faedah?: string; keterangan?: string; ketentuan_baca?: string; surat?: Array<{ nama: string; arab: string; terjemah: string }>; pahala_berlimpah?: string; }
interface DzikirFullFormat { judul: string; mukaddimah: { teks_arab: string; arti: string }; dzikir: DzikirItemUnified[]; catatan_kaki: string; }
type DzikirRaw = DzikirFullFormat | DzikirItemUnified[];

function normalizeData(raw: DzikirRaw) {
  if (Array.isArray(raw)) return { mukaddimah: null, items: raw.map((item) => ({ ...item, nama: item.nama || item.judul || '', arti: item.arti || item.terjemah || '' })) as DzikirItemUnified[], footer: null };
  return { mukaddimah: raw.mukaddimah, items: raw.dzikir.map((item) => ({ ...item, nama: item.nama || item.judul || '', arti: item.arti || item.terjemah || '' })) as DzikirItemUnified[], footer: raw.catatan_kaki || null };
}

const doaList = doaData as DoaItem[];
const pagi = normalizeData(pagiDataRaw as DzikirRaw);
const sore = normalizeData(soreDataRaw as DzikirRaw);

type View = { type: 'quran-list' } | { type: 'quran-detail'; surahNumber: number } | { type: 'doa' } | { type: 'dzikir' };

export default function App() {
  const [view, setView] = useState<View>({ type: 'quran-list' });
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pagi' | 'sore'>('pagi');
  const [searchDoa, setSearchDoa] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => { loadSurahs(); }, []);

  const loadSurahs = async () => {
    try { setLoading(true); setError(null); const data = await fetchAllSurahs(); setSurahs(data); }
    catch (err) { setError(err instanceof Error ? err.message : 'Terjadi kesalahan'); }
    finally { setLoading(false); }
  };

  const toggleTheme = useCallback(() => { setIsLightMode((prev) => !prev); }, []);

  const handleNavigate = useCallback((page: 'quran' | 'doa' | 'dzikir') => {
    if (page === 'quran') setView({ type: 'quran-list' });
    if (page === 'doa') { setView({ type: 'doa' }); setSearchDoa(''); }
    if (page === 'dzikir') setView({ type: 'dzikir' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openSurah = useCallback((nomor: number) => { setView({ type: 'quran-detail', surahNumber: nomor }); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const goBack = useCallback(() => {
    if (view.type === 'quran-detail') setView({ type: 'quran-list' });
    else setView({ type: 'quran-list' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view.type]);

  const dzikirData = activeTab === 'pagi' ? pagi : sore;

  const filteredDoa = useMemo(() => {
    if (!searchDoa.trim()) return doaList;
    const q = searchDoa.toLowerCase();
    return doaList.filter((d) => d.nama.toLowerCase().includes(q) || d.latin.toLowerCase().includes(q) || d.terjemahan.toLowerCase().includes(q));
  }, [searchDoa]);

  return (
    <div className={`app ${isLightMode ? 'light-mode' : ''}`}>
      <Header onLogoClick={goBack} showBack={view.type !== 'quran-list'} onBack={goBack} isLightMode={isLightMode} onToggleTheme={toggleTheme} />
      <main className="main-content">
        
        {view.type !== 'quran-detail' && (
          <div className="sticky-menu">
            <button className={view.type === 'quran-list' ? 'active' : ''} onClick={() => handleNavigate('quran')}>
              <img src="/icon-quran.png" alt="Qur'an" className="sm-icon-img" />
              <span>Qur'an</span>
            </button>
            <button className={view.type === 'doa' ? 'active' : ''} onClick={() => handleNavigate('doa')}>
              <img src="/icon-doa.png" alt="Doa" className="sm-icon-img" />
              <span>Doa</span>
            </button>
            <button className={view.type === 'dzikir' ? 'active' : ''} onClick={() => handleNavigate('dzikir')}>
              <img src="/icon-dzikir.png" alt="Dzikir" className="sm-icon-img" />
              <span>Dzikir</span>
            </button>
            <button onClick={() => window.open('https://saweria.co/MHDmedia', '_blank')}>
              <img src="/icon-donasi.png" alt="Donasi" className="sm-icon-img" />
              <span>Donasi</span>
            </button>
          </div>
        )}

        {view.type === 'quran-list' && <SurahList surahs={surahs} loading={loading} error={error} onRetry={loadSurahs} onSelectSurah={openSurah} />}
        {view.type === 'quran-detail' && <SurahDetail nomor={view.surahNumber} onSelectSurah={openSurah} />}

        {view.type === 'doa' && (
          <div className="content-list">
            <h2 className="page-title">Doa Harian</h2>
            <div className="search-container" style={{ marginBottom: '32px' }}>
              <input type="text" className="search-input" placeholder="Cari doa..." value={searchDoa} onChange={(e) => setSearchDoa(e.target.value)} />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            {filteredDoa.length === 0 ? (
              <div className="empty-state"><p>Tidak ditemukan doa untuk "{searchDoa}"</p></div>
            ) : (
              filteredDoa.map((doa, i) => (
                <article key={i} className="content-card">
                  <h3 className="content-card-title">{doa.nama}</h3>
                  <div className="content-card-arab">{doa.arab}</div>
                  <div className="content-card-latin">{doa.latin}</div>
                  <div className="content-card-translation">{doa.terjemahan}</div>
                  <div className="content-card-source">📚 {doa.sumber}</div>
                </article>
              ))
            )}
          </div>
        )}

        {view.type === 'dzikir' && (
          <div className="content-list">
            <h2 className="page-title">Dzikir Pagi & Sore</h2>
            <div className="tab-container">
              <button className={`tab-btn ${activeTab === 'pagi' ? 'active' : ''}`} onClick={() => setActiveTab('pagi')}>☀️ Pagi</button>
              <button className={`tab-btn ${activeTab === 'sore' ? 'active' : ''}`} onClick={() => setActiveTab('sore')}>🌙 Sore</button>
            </div>
            {dzikirData.mukaddimah && (
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div className="content-card-arab" style={{ display: 'inline-block', border: 'none', padding: 0, marginBottom: '8px' }}>{dzikirData.mukaddimah.teks_arab}</div>
                <div className="content-card-latin" style={{ fontStyle: 'normal', color: 'var(--text-secondary)' }}>{dzikirData.mukaddimah.arti}</div>
              </div>
            )}
            {dzikirData.items.map((item) => (
              <article key={item.nomor} className="content-card">
                <h3 className="content-card-title">{item.nomor}. {item.nama}</h3>
                {item.ketentuan_baca && <div className="content-card-source" style={{ marginBottom: '16px', background: 'var(--accent-glow)' }}>🔄 {item.ketentuan_baca}</div>}
                <div className="content-card-arab">{item.arab}</div>
                <div className="content-card-translation">{item.arti}</div>
                {item.surat && (
                  <div style={{ marginTop: '16px' }}>
                    {item.surat.map((s, i) => (
                      <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < item.surat!.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '8px', fontWeight: 600 }}>{s.nama}</div>
                        <div className="content-card-arab" style={{ border: 'none', padding: 0, marginBottom: '8px', fontSize: '22px' }}>{s.arab}</div>
                        <div className="content-card-translation" style={{ fontSize: '14px' }}>{s.terjemah}</div>
                      </div>
                    ))}
                  </div>
                )}
                {item.faedah && <div className="content-card-source" style={{ marginTop: '12px', background: 'var(--accent-glow)' }}>💡 {item.faedah}</div>}
                {item.keterangan && <div className="content-card-source" style={{ marginTop: '8px', background: 'rgba(100, 160, 255, 0.1)', color: 'var(--text-secondary)' }}>📌 {item.keterangan}</div>}
                {item.pahala_berlimpah && <div className="content-card-source" style={{ marginTop: '8px', background: 'var(--accent-glow)' }}>🌟 {item.pahala_berlimpah}</div>}
              </article>
            ))}
            {dzikirData.footer && <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>{dzikirData.footer}</div>}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
      }
