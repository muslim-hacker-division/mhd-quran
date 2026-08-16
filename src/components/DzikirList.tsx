import { useState } from 'react';
import pagiDataRaw from '../dzikir_pagi.json';
import soreDataRaw from '../dzikir_sore.json';
import type { DzikirFullFormat, DzikirItemUnified } from '../types';

type DzikirRaw = DzikirFullFormat | DzikirItemUnified[];

// Fungsi untuk menyeragamkan data pagi & sore
function normalizeData(raw: DzikirRaw) {
  if (Array.isArray(raw)) {
    // Format Sore (langsung array)
    return {
      mukaddimah: null,
      items: raw.map((item) => ({
        ...item,
        nama: item.nama || item.judul || '',
        arti: item.arti || item.terjemah || '',
      })) as DzikirItemUnified[],
      footer: null,
    };
  } else {
    // Format Pagi (objek pembungkus)
    return {
      mukaddimah: raw.mukaddimah,
      items: raw.dzikir.map((item) => ({
        ...item,
        nama: item.nama || item.judul || '',
        arti: item.arti || item.terjemah || '',
      })) as DzikirItemUnified[],
      footer: raw.catatan_kaki || null,
    };
  }
}

const pagi = normalizeData(pagiDataRaw as DzikirRaw);
const sore = normalizeData(soreDataRaw as DzikirRaw);

export function DzikirList() {
  const [activeTab, setActiveTab] = useState<'pagi' | 'sore'>('pagi');
  const data = activeTab === 'pagi' ? pagi : sore;

  return (
    <div className="content-list">
      <h2 className="page-title">Dzikir Pagi & Sore</h2>
      
      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'pagi' ? 'active' : ''}`}
          onClick={() => setActiveTab('pagi')}
        >
          ☀️ Pagi
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sore' ? 'active' : ''}`}
          onClick={() => setActiveTab('sore')}
        >
          🌙 Sore
        </button>
      </div>

      {/* Mukaddimah (Hanya muncul di Pagi) */}
      {data.mukaddimah && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="content-card-arab" style={{ display: 'inline-block', border: 'none', padding: 0, marginBottom: '8px' }}>
            {data.mukaddimah.teks_arab}
          </div>
          <div className="content-card-latin" style={{ fontStyle: 'normal', color: 'var(--text-secondary)' }}>
            {data.mukaddimah.arti}
          </div>
        </div>
      )}

      {/* Daftar Dzikir */}
      {data.items.map((item) => (
        <article key={item.nomor} className="content-card">
          <h3 className="content-card-title">{item.nomor}. {item.nama}</h3>
          
          {item.ketentuan_baca && (
            <div className="content-card-source" style={{ marginBottom: '16px', background: 'rgba(0, 255, 102, 0.05)' }}>
              🔄 {item.ketentuan_baca}
            </div>
          )}

          <div className="content-card-arab">{item.arab}</div>
          <div className="content-card-translation">{item.arti}</div>
          
          {/* Khusus untuk menampilkan detail surat (seperti di dzikir sore nomor 2) */}
          {item.surat && (
            <div style={{ marginTop: '16px' }}>
              {item.surat.map((s, i) => (
                <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < item.surat!.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '8px', fontWeight: 600 }}>
                    {s.nama}
                  </div>
                  <div className="content-card-arab" style={{ border: 'none', padding: 0, marginBottom: '8px', fontSize: '22px' }}>
                    {s.arab}
                  </div>
                  <div className="content-card-translation" style={{ fontSize: '14px' }}>
                    {s.terjemah}
                  </div>
                </div>
              ))}
            </div>
          )}

          {item.faedah && (
            <div className="content-card-source" style={{ marginTop: '12px', background: 'rgba(0, 255, 102, 0.05)' }}>
              💡 {item.faedah}
            </div>
          )}
          {item.keterangan && (
            <div className="content-card-source" style={{ marginTop: '8px', background: 'rgba(100, 160, 255, 0.05)', color: 'var(--text-secondary)' }}>
              📌 {item.keterangan}
            </div>
          )}
          {item.pahala_berlimpah && (
            <div className="content-card-source" style={{ marginTop: '8px', background: 'rgba(0, 255, 102, 0.05)' }}>
              🌟 {item.pahala_berlimpah}
            </div>
          )}
        </article>
      ))}

      {data.footer && (
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {data.footer}
        </div>
      )}
    </div>
  );
}
