import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env.config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // ApiError ise, statusCode ve detayları kullan
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

  // Beklenmeyen hata - production'da detayı saklıyoruz
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
      // Geliştirme ortamında stack trace döneriz, production'da asla
      ...(env.NODE_ENV === 'development' && {
        detaylar: err.message,
        stack: err.stack,
      }),
    },
  });
};