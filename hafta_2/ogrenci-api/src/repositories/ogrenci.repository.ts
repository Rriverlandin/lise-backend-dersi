import { ogrenciler } from '../data/ogrenciler';
import { Ogrenci } from '../types/ogrenci.types';

export class OgrenciRepository {
  findAll(): Ogrenci[] {
    return [...ogrenciler]; // Kopya dön, dış dünya orijinali değiştirmesin
  }

  findById(id: string): Ogrenci | null {
    return ogrenciler.find((o) => o.id === id) ?? null;
  }

  findBySinif(sinif: string): Ogrenci[] {
    return ogrenciler.filter((o) => o.sinif === sinif);
  }

  create(ogrenci: Ogrenci): Ogrenci {
    ogrenciler.push(ogrenci);
    return ogrenci;
  }

  update(id: string, guncellemeler: Partial<Ogrenci>): Ogrenci | null {
    const index = ogrenciler.findIndex((o) => o.id === id);
    if (index === -1) return null;

    ogrenciler[index] = { ...ogrenciler[index], ...guncellemeler };
    return ogrenciler[index];
  }

  delete(id: string): Ogrenci | null {
    const index = ogrenciler.findIndex((o) => o.id === id);
    if (index === -1) return null;

    return ogrenciler.splice(index, 1)[0];
  }

  getNextId(): string {
    const maxId = ogrenciler.reduce(
      (max, o) => Math.max(max, parseInt(o.id, 10)),
      0
    );
    return (maxId + 1).toString();
  }
}

// Singleton instance
export const ogrenciRepository = new OgrenciRepository();