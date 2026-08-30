import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env.config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const httpError = err as Error & { status?: number; type?: string };

  if (httpError.type === 'entity.parse.failed' && httpError.status === 400) {
    res.status(400).json({
      basarili: false,
      hata: { mesaj: 'Geçersiz JSON gövdesi' },
    });
    return;
  }

  if (httpError.type === 'entity.too.large' && httpError.status === 413) {
    res.status(413).json({
      basarili: false,
      hata: { mesaj: 'İstek gövdesi çok büyük' },
    });
    return;
  }

  // 1. ApiError ise direkt yanıtla
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      basarili: false,
      hata: {
        mesaj: err.message,
        ...(err.details ? { detaylar: err.details } : {}),
      },
    });
    return;
  }

  // 2. Mongoose validasyon hatası
  if (err instanceof MongooseError.ValidationError) {
    const detaylar = Object.values(err.errors).map((e) => ({
      alan: e.path,
      mesaj: e.message,
    }));

    res.status(400).json({
      basarili: false,
      hata: { mesaj: 'Veritabanı doğrulama hatası', detaylar },
    });
    return;
  }

  // 3. Geçersiz ObjectId (CastError)
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({
      basarili: false,
      hata: { mesaj: `Geçersiz ${err.path}: ${err.value}` },
    });
    return;
  }

  // 4. Duplicate key (unique constraint ihlali)
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: number }).code === 11000
  ) {
    res.status(409).json({
      basarili: false,
      hata: { mesaj: 'Bu kayıt zaten mevcut' },
    });
    return;
  }

  // 5. Beklenmeyen hata
  console.error('💥 Beklenmeyen hata:', {
    mesaj: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({
    basarili: false,
    hata: {
      mesaj: 'Sunucu hatası oluştu',
      ...(env.NODE_ENV === 'development' && {
        detaylar: err.message,
        stack: err.stack,
      }),
    },
  });
};
