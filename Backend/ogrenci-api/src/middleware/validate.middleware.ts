import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

export type RequestPart = 'body' | 'query' | 'params';

declare module 'express-serve-static-core' {
  interface Request {
    validated?: Partial<Record<RequestPart, unknown>>;
  }
}

export const validate = (
  schema: ZodSchema,
  source: RequestPart = 'body'
) => (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const validated = schema.parse(req[source]);

    req.validated ??= {};
    req.validated[source] = validated;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        alan: issue.path.join('.'),
        mesaj: issue.message,
      }));

      next(ApiError.badRequest('Validasyon-Doğrulama Hatası', details));
      return;
    }
    next(error);
  }
};

export const getValidatedData = <T>(req: Request, source: RequestPart): T => {
  const validated = req.validated?.[source];
  if (validated === undefined) {
    throw ApiError.internal(`Doğrulanmış ${source} verisi bulunamadı`);
  }
  return validated as T;
};
