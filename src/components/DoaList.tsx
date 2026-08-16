import doaData from '../doa_harian.json';
import type { DoaItem } from '../types';

const doaList = doaData as DoaItem[];

export function DoaList() {
  return (
    <div className="content-list">
      <h2 className="page-title">Doa Harian</h2>
      {doaList.map((doa, index) => (
        <article key={index} className="content-card">
          <h3 className="content-card-title">{doa.nama}</h3>
          <div className="content-card-arab">{doa.arab}</div>
          <div className="content-card-latin">{doa.latin}</div>
          <div className="content-card-translation">{doa.terjemahan}</div>
          <div className="content-card-source">📚 {doa.sumber}</div>
        </article>
      ))}
    </div>
  );
}
