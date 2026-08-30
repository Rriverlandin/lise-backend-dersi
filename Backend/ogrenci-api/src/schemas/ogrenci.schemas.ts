import { z } from 'zod';

const sinifRegex = /^(9|1[0-2])-[A-D]$/;

export const ogrenciOlusturmaSchema = z.object({
  ad: z.string().trim().min(2, 'Ad en az 2 karakter olmalı').max(50),
  soyad: z.string().trim().min(2, 'Soyad en az 2 karakter olmalı').max(50),
  yas: z.number().int('Yaş tam sayı olmalı').min(13).max(20),
  sinif: z
    .string()
    .trim()
    .toUpperCase()
    .regex(sinifRegex, 'Sınıf formatı geçersiz (örn: 10-A)'),
  okul: z.string().trim().min(2, 'Okul en az 2 karakter olmalı').max(100),
  notOrtalamasi: z.number().min(0).max(100).default(0),
  email: z
    .string()
    .trim()
    .email('Geçerli bir email giriniz')
    .toLowerCase()
    .optional(),
});

export const ogrenciGuncellemeSchema = ogrenciOlusturmaSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'En az bir alan güncellenmeli' }
  );

// MongoDB ObjectId formatı: 24 karakter hexadecimal
export const ogrenciIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Geçersiz ID formatı'),
});

export const ogrenciListeleSchema = z.object({
  sinif: z.string().trim().toUpperCase().regex(sinifRegex).optional(),
  minNot: z.coerce.number().min(0).max(100).optional(),
  siralama: z.enum(['ad', 'soyad', 'notOrtalamasi', 'yas']).optional(),
  yon: z.enum(['asc', 'desc']).default('asc'),
  sayfa: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type OgrenciOlusturmaInput = z.infer<typeof ogrenciOlusturmaSchema>;
export type OgrenciGuncellemeInput = z.infer<typeof ogrenciGuncellemeSchema>;
export type OgrenciListeleInput = z.infer<typeof ogrenciListeleSchema>;
