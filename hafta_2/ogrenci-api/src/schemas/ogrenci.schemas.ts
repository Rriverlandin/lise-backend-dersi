import { z } from 'zod';

// Sınıf formatı: "10-A", "11-B" gibi
const sinifRegex = /^(9|1[0-2])-[A-D]$/;

export const ogrenciOlusturmaSchema = z.object({
  ad: z
    .string()
    .trim()
    .min(2, 'Ad en az 2 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  soyad: z
    .string()
    .trim()
    .min(2, 'Soyad en az 2 karakter olmalı')
    .max(50, 'Soyad en fazla 50 karakter olabilir'),
  yas: z
    .number()
    .int('Yaş tam sayı olmalı')
    .min(13, 'Yaş en az 13 olmalı')
    .max(20, 'Yaş en fazla 20 olabilir'),
  sinif: z
    .string()
    .regex(sinifRegex, 'Sınıf formatı geçersiz (örn: 10-A)'),
  okul: z
    .string(),  
  notOrtalamasi: z
    .number()
    .min(0, 'Not ortalaması 0\'dan küçük olamaz')
    .max(100, 'Not ortalaması 100\'den büyük olamaz')
    .default(0),
});

// Güncelleme için: tüm alanlar opsiyonel
export const ogrenciGuncellemeSchema = ogrenciOlusturmaSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'En az bir alan güncellenmeli' }
  );

// Param doğrulaması
export const ogrenciIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID sayısal olmalı'),
});

// Query string doğrulaması (filtreleme/sıralama için)
export const ogrenciListeleSchema = z.object({
  sinif: z.string().regex(sinifRegex).optional(),
  minNot: z.coerce.number().min(0).max(100).optional(),
  siralama: z.enum(['ad', 'notOrtalamasi', 'yas']).optional(),
  yon: z.enum(['asc', 'desc']).default('asc'),
});

// TypeScript tiplerini şemalardan otomatik üret
export type OgrenciOlusturmaInput = z.infer<typeof ogrenciOlusturmaSchema>;
export type OgrenciGuncellemeInput = z.infer<typeof ogrenciGuncellemeSchema>;
export type OgrenciListeleInput = z.infer<typeof ogrenciListeleSchema>;