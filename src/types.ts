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

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
  next: { nomor: number; namaLatin: string; nama: string } | null;
  prev: { nomor: number; namaLatin: string; nama: string } | null;
}

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
