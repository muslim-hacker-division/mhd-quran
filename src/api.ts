import type { Surah, SurahDetail, TafsirAyat } from './types';

const BASE_URL = 'https://equran.id/api/v2';

/** Mengambil daftar seluruh 114 surah */
export async function fetchAllSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE_URL}/surat`);
  if (!res.ok) throw new Error('Gagal memuat daftar surah');
  const json = await res.json();
  return json.data as Surah[];
}

/** Mengambil detail surah (info + semua ayat) */
export async function fetchSurahDetail(nomor: number): Promise<SurahDetail> {
  const res = await fetch(`${BASE_URL}/surat/${nomor}`);
  if (!res.ok) throw new Error('Gagal memuat detail surah');
  const json = await res.json();
  return json.data as SurahDetail;
}

/** Mengambil tafsir Kemenag per ayat dari sebuah surah */
export async function fetchTafsir(nomor: number): Promise<TafsirAyat[]> {
  const res = await fetch(`${BASE_URL}/tafsir/${nomor}`);
  if (!res.ok) throw new Error('Gagal memuat tafsir');
  const json = await res.json();
  const data = json.data;

  /* API kadang mengembalikan array, kadang objek */
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return Object.values(data) as TafsirAyat[];
  return [];
}
