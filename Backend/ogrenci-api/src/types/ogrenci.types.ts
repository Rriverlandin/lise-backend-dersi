export interface OgrenciResponse {
  id: string;
  ad: string;
  soyad: string;
  yas: number;
  sinif: string;
  okul: string;
  notOrtalamasi: number;
  email?: string;
  aktifMi: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SayfalamaMeta {
  toplam: number;
  sayfa: number;
  limit: number;
  toplamSayfa: number;
}
