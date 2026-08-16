import { useState } from 'react';
import dzikirPagiData from '../dzikir_pagi.json';
import dzikirSoreData from '../dzikir_sore.json'; // Pastikan file ini ada
import type { DzikirItem } from '../types';

const pagi = dzikirPagiData as DzikirItem[];
const sore = dzikirSoreData as DzikirItem[];

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

      {data.map((dzikir, index) => (
        <article key={index} className="content-card">
          <h3 className="content-card-title">{dzikir.nama}</h3>
          <div className="content-card-arab">{dzikir.arab}</div>
          <div className="content-card-latin">{dzikir.latin}</div>
          <div className="content-card-translation">{dzikir.terjemahan}</div>
        </article>
      ))}
    </div>
  );
}
