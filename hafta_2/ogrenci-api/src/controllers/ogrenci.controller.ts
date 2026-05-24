import { Request, Response } from 'express';
import { ogrenciService } from '../services/ogrenci.service';
import { asyncHandler } from '../utils/asyncHandler';
import {
  OgrenciOlusturmaInput,
  OgrenciGuncellemeInput,
  OgrenciListeleInput,
} from '../schemas/ogrenci.schemas';

export const listele = asyncHandler(async (req: Request, res: Response) => {
  const filtreler = req.query as unknown as OgrenciListeleInput;
  const ogrenciler = ogrenciService.listele(filtreler);

  res.status(200).json({
    basarili: true,
    veri: ogrenciler,
    toplam: ogrenciler.length,
  });
});

export const getir = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ogrenci = ogrenciService.getirById(id as string);

  res.status(200).json({
    basarili: true,
    veri: ogrenci,
  });
});

export const olustur = asyncHandler(async (req: Request, res: Response) => {
  const veri = req.body as OgrenciOlusturmaInput;
  const yeniOgrenci = ogrenciService.olustur(veri);

  res.status(201).json({
    basarili: true,
    veri: yeniOgrenci,
  });
});

export const guncelle = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const veri = req.body as OgrenciGuncellemeInput;
  const guncellenen = ogrenciService.guncelle(id, veri);

  res.status(200).json({
    basarili: true,
    veri: guncellenen,
  });
});

export const sil = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const silinen = ogrenciService.sil(id);

  res.status(200).json({
    basarili: true,
    veri: silinen,
    mesaj: 'Öğrenci başarıyla silindi',
  });
});