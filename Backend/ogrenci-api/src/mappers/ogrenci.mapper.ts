import { IOgrenci } from '../models/ogrenci.model';
import { OgrenciResponse } from '../types/ogrenci.types';

export const toOgrenciResponse = (ogrenci: IOgrenci): OgrenciResponse => ({
  id: ogrenci._id.toString(),
  ad: ogrenci.ad,
  soyad: ogrenci.soyad,
  yas: ogrenci.yas,
  sinif: ogrenci.sinif,
  okul: ogrenci.okul,
  notOrtalamasi: ogrenci.notOrtalamasi,
  ...(ogrenci.email ? { email: ogrenci.email } : {}),
  aktifMi: ogrenci.aktifMi,
  createdAt: ogrenci.createdAt,
  updatedAt: ogrenci.updatedAt,
});
