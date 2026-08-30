import {
  ListelemeSonucu,
  ogrenciRepository,
} from '../repositories/ogrenci.repository';
import { IOgrenci } from '../models/ogrenci.model';
import {
  OgrenciOlusturmaInput,
  OgrenciGuncellemeInput,
  OgrenciListeleInput,
} from '../schemas/ogrenci.schemas';
import { ApiError } from '../utils/ApiError';

export class OgrenciService {
  async listele(filtreler: OgrenciListeleInput): Promise<ListelemeSonucu> {
    return ogrenciRepository.findAll(filtreler);
  }

  async getirById(id: string): Promise<IOgrenci> {
    const ogrenci = await ogrenciRepository.findById(id);
    if (!ogrenci) {
      throw ApiError.notFound(`${id} ID'li öğrenci bulunamadı`);
    }
    return ogrenci;
  }

  async olustur(veri: OgrenciOlusturmaInput): Promise<IOgrenci> {
    // İş kuralı: Aynı sınıfta aynı ad-soyad olmasın
    const cakisma = await ogrenciRepository.findByAdSoyadSinif(
      veri.ad,
      veri.soyad,
      veri.sinif
    );

    if (cakisma) {
      throw ApiError.conflict(
        `${veri.sinif} sınıfında zaten ${veri.ad} ${veri.soyad} adında bir öğrenci var`
      );
    }

    try {
      return await ogrenciRepository.create(veri);
    } catch (error: unknown) {
      // Mongoose'un duplicate key hatasını yakala (yarış durumu için)
      if (this.isDuplicateKeyError(error)) {
        throw ApiError.conflict('Bu öğrenci zaten kayıtlı');
      }
      throw error;
    }
  }

  async guncelle(
    id: string,
    veri: OgrenciGuncellemeInput
  ): Promise<IOgrenci> {
    try {
      const guncellenen = await ogrenciRepository.update(id, veri);
      if (!guncellenen) {
        throw ApiError.notFound(`${id} ID'li öğrenci bulunamadı`);
      }
      return guncellenen;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw ApiError.conflict('Aynı öğrenci veya email zaten kayıtlı');
      }
      throw error;
    }
  }

  async sil(id: string): Promise<IOgrenci> {
    const silinen = await ogrenciRepository.delete(id);
    if (!silinen) {
      throw ApiError.notFound(`${id} ID'li öğrenci bulunamadı`);
    }

    return silinen;
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    );
  }
}

export const ogrenciService = new OgrenciService();
