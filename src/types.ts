// Hapus DzikirItem dan DzikirData yang lama, ganti dengan ini:

export interface DzikirItemUnified {
  nomor: number;
  nama: string;
  judul?: string;       
  arab: string;
  arti: string;
  terjemah?: string;    
  faedah?: string;
  keterangan?: string;
  ketentuan_baca?: string; 
  surat?: Array<{       
    nama: string;
    arab: string;
    terjemah: string;
  }>;
  pahala_berlimpah?: string;
}

export interface DzikirFullFormat {
  judul: string;
  mukaddimah: {
    teks_arab: string;
    arti: string;
  };
  dzikir: DzikirItemUnified[];
  catatan_kaki: string;
}
