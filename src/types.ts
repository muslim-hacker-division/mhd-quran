/** Data surah dari endpoint daftar surah */
export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

/** Satu ayat di dalam detail surah */
export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

/** Detail surah lengkap beserta daftar ayat */
export interface SurahDetail extends Surah {
  ayat: Ayat[];
  next: { nomor: number; namaLatin: string; nama: string } | null;
  prev: { nomor: number; namaLatin: string; nama: string } | null;
}

/** Item tafsir per ayat */
export interface TafsirAyat {
  nomorAyat: number;
  teks: string;
  tafsir: {
    id: string;
    kemenag: {
      short: string;
      long: string;
    };
  };
}

export interface DoaItem {
  nama: string;
  arab: string;
  latin: string;
  terjemahan: string;
  sumber: string;
}

export interface DzikirItem {
  nama: string;
  arab: string;
  latin: string;
  terjemahan: string;
}
