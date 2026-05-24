import { ogrenciRepository } from '../repositories/ogrenci.repository';
import { Ogrenci } from '../types/ogrenci.types';
import {
  OgrenciOlusturmaInput,
  OgrenciGuncellemeInput,
  OgrenciListeleInput,
} from  '../schemas/ogrenci.schemas';
import { ApiError } from '../utils/ApiError';

export class OgrenciService {
  listele(filtreler: OgrenciListeleInput): Ogrenci[] {
    let sonuclar = ogrenciRepository.findAll();

    // Sınıfa göre filtrele
    if (filtreler.sinif) {
      sonuclar = sonuclar.filter((o) => o.sinif === filtreler.sinif);
    }

    // Minimum nota göre filtrele
    if (filtreler.minNot !== undefined) {
      sonuclar = sonuclar.filter(
        (o) => o.notOrtalamasi >= filtreler.minNot!
      );
    }

    // Sıralama
    if (filtreler.siralama) {
      const yon = filtreler.yon === 'desc' ? -1 : 1;
      sonuclar.sort((a, b) => {
        const aValue = a[filtreler.siralama!];
        const bValue = b[filtreler.siralama!];
        if (aValue < bValue) return -1 * yon;
        if (aValue > bValue) return 1 * yon;
        return 0;
      });
    }

    return sonuclar;
  }

  getirById(id: string): Ogrenci {
    const ogrenci = ogrenciRepository.findById(id);
    if (!ogrenci) {
      throw ApiError.notFound(`${id} ID'li öğrenci bulunamadı`);
    }
    return ogrenci;
  }

  olustur(veri: OgrenciOlusturmaInput): Ogrenci {
    // İş kuralı: Aynı ad-soyad ve sınıfta öğrenci olmamalı
    const mevcutOgrenciler = ogrenciRepository.findBySinif(veri.sinif);
    const cakisma = mevcutOgrenciler.find(
      (o) =>
        o.ad.toLowerCase() === veri.ad.toLowerCase() &&
        o.soyad.toLowerCase() === veri.soyad.toLowerCase()
    );

    if (cakisma) {
      throw ApiError.conflict(
        `${veri.sinif} sınıfında zaten ${veri.ad} ${veri.soyad} adında bir öğrenci var`
      );
    }

    const yeniOgrenci: Ogrenci = {
      id: ogrenciRepository.getNextId(),
      ...veri,
      olusturma_tarihi: new Date(),
    };

    return ogrenciRepository.create(yeniOgrenci);
  }

  guncelle(id: string, veri: OgrenciGuncellemeInput): Ogrenci {
    // Önce var mı diye kontrol et
    this.getirById(id); // Bulamazsa zaten ApiError fırlatır

    const guncellenen = ogrenciRepository.update(id, veri);
    if (!guncellenen) {
      throw ApiError.internal('Güncelleme başarısız oldu');
    }

    return guncellenen;
  }

  sil(id: string): Ogrenci {
    const silinen = ogrenciRepository.delete(id);
    if (!silinen) {
      throw ApiError.notFound(`${id} ID'li öğrenci bulunamadı`);
    }
    return silinen;
  }
}

export const ogrenciService = new OgrenciService();
