import { FilterQuery, SortOrder } from 'mongoose';
import { OgrenciModel, IOgrenci } from '../models/ogrenci.model';
import type {
  OgrenciGuncellemeInput,
  OgrenciOlusturmaInput,
} from '../schemas/ogrenci.schemas';

export interface ListeleParams {
  sinif?: string;
  minNot?: number;
  siralama?: 'ad' | 'soyad' | 'notOrtalamasi' | 'yas';
  yon?: 'asc' | 'desc';
  sayfa?: number;
  limit?: number;
}

export interface ListelemeSonucu {
  kayitlar: IOgrenci[];
  toplam: number;
  sayfa: number;
  limit: number;
  toplamSayfa: number;
}

export class OgrenciRepository {
  async findAll(params: ListeleParams = {}): Promise<ListelemeSonucu> {
    const filter: FilterQuery<IOgrenci> = { aktifMi: true };
    const sayfa = params.sayfa ?? 1;
    const limit = params.limit ?? 20;

    if (params.sinif) {
      filter.sinif = params.sinif;
    }

    if (params.minNot !== undefined) {
      filter.notOrtalamasi = { $gte: params.minNot };
    }

    let query = OgrenciModel.find(filter).skip((sayfa - 1) * limit).limit(limit);

    if (params.siralama) {
      const yon: SortOrder = params.yon === 'desc' ? -1 : 1;
      query = query.sort({ [params.siralama]: yon });
    } else {
      query = query.sort({ _id: 1 });
    }

    const [kayitlar, toplam] = await Promise.all([
      query.exec(),
      OgrenciModel.countDocuments(filter).exec(),
    ]);

    return {
      kayitlar,
      toplam,
      sayfa,
      limit,
      toplamSayfa: Math.ceil(toplam / limit),
    };
  }

  async findById(id: string): Promise<IOgrenci | null> {
    return OgrenciModel.findOne({ _id: id, aktifMi: true }).exec();
  }

  async findByAdSoyadSinif(
    ad: string,
    soyad: string,
    sinif: string
  ): Promise<IOgrenci | null> {
    return OgrenciModel.findOne({ ad, soyad, sinif, aktifMi: true })
      .collation({ locale: 'tr', strength: 2 })
      .exec();
  }

  async create(veri: OgrenciOlusturmaInput): Promise<IOgrenci> {
    const yeniOgrenci = new OgrenciModel(veri);
    return yeniOgrenci.save();
  }

  async update(
    id: string,
    guncellemeler: OgrenciGuncellemeInput
  ): Promise<IOgrenci | null> {
    return OgrenciModel.findOneAndUpdate(
      { _id: id, aktifMi: true },
      guncellemeler,
      {
        new: true, // Güncellenmiş dökümanı dön
        runValidators: true, // Validasyonları çalıştır
      }
    ).exec();
  }

  async delete(id: string): Promise<IOgrenci | null> {
    // Soft delete: gerçekten silmek yerine aktifMi: false yapıyoruz
    return OgrenciModel.findOneAndUpdate(
      { _id: id, aktifMi: true },
      { aktifMi: false },
      { new: true }
    ).exec();
  }
}

export const ogrenciRepository = new OgrenciRepository();
