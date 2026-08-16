import { useState } from 'react';
import pagiData from '../dzikir_pagi.json';
import soreData from '../dzikir_sore.json'; // Pastikan file ini ada & formatnya sama
import type { DzikirData } from '../types';

const pagi = pagiData as DzikirData;
const sore = soreData as DzikirData;

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

      {/* Mukaddimah */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="content-card-arab" style={{ display: 'inline-block', border: 'none', padding: 0, marginBottom: '8px' }}>
          {data.mukaddimah.teks_arab}
        </div>
        <div className="content-card-latin" style={{ fontStyle: 'normal', color: 'var(--text-secondary)' }}>
          {data.mukaddimah.arti}
        </div>
      </div>

      {/* Daftar Dzikir */}
      {data.dzikir.map((item) => (
        <article key={item.nomor} className="content-card">
          <h3 className="content-card-title">{item.nomor}. {item.nama}</h3>
          <div className="content-card-arab">{item.arab}</div>
          <div className="content-card-translation">{item.arti}</div>
          
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
        </article>
      ))}

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        {data.catatan_kaki}
      </div>
    </div>
  );
}          <div className="content-card-translation">{dzikir.terjemahan}</div>
        </article>
      ))}
    </div>
  );
}
