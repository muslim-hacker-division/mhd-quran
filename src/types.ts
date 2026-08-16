export interface DzikirItem {
  nomor: number;
  nama: string;
  arab: string;
  arti: string;
  faedah?: string;
  keterangan?: string;
  pahala_berlimpah?: string;
}

export interface DzikirData {
  judul: string;
  mukaddimah: {
    teks_arab: string;
    arti: string;
  };
  dzikir: DzikirItem[];
  catatan_kaki: string;
}
