import { Request, Response } from 'express';
import { ogrenciService } from '../services/ogrenci.service';
import { asyncHandler } from '../utils/asyncHandler';
import { toOgrenciResponse } from '../mappers/ogrenci.mapper';
import { getValidatedData } from '../middleware/validate.middleware';
import {
  OgrenciOlusturmaInput,
  OgrenciGuncellemeInput,
  OgrenciListeleInput,
} from '../schemas/ogrenci.schemas';

export const listele = asyncHandler(async (req: Request, res: Response) => {
  const filtreler = getValidatedData<OgrenciListeleInput>(req, 'query');
  const sonuc = await ogrenciService.listele(filtreler);

  res.status(200).json({
    basarili: true,
    veri: sonuc.kayitlar.map(toOgrenciResponse),
    sayfalama: {
      toplam: sonuc.toplam,
      sayfa: sonuc.sayfa,
      limit: sonuc.limit,
      toplamSayfa: sonuc.toplamSayfa,
    },
  });
});

export const getir = asyncHandler(async (req: Request, res: Response) => {
  const { id } = getValidatedData<{ id: string }>(req, 'params');
  const ogrenci = await ogrenciService.getirById(id);

  res.status(200).json({
    basarili: true,
    veri: toOgrenciResponse(ogrenci),
  });
});

export const olustur = asyncHandler(async (req: Request, res: Response) => {
  const veri = getValidatedData<OgrenciOlusturmaInput>(req, 'body');
  const yeniOgrenci = await ogrenciService.olustur(veri);

  res.status(201).json({
    basarili: true,
    veri: toOgrenciResponse(yeniOgrenci),
  });
});

export const guncelle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = getValidatedData<{ id: string }>(req, 'params');
  const veri = getValidatedData<OgrenciGuncellemeInput>(req, 'body');
  const guncellenen = await ogrenciService.guncelle(id, veri);

  res.status(200).json({
    basarili: true,
    veri: toOgrenciResponse(guncellenen),
  });
});

export const sil = asyncHandler(async (req: Request, res: Response) => {
  const { id } = getValidatedData<{ id: string }>(req, 'params');
  const silinen = await ogrenciService.sil(id);

  res.status(200).json({
    basarili: true,
    veri: toOgrenciResponse(silinen),
    mesaj: 'Öğrenci başarıyla silindi',
  });
});
