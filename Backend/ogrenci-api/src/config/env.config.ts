import dotenv from 'dotenv';
import { z } from 'zod';

// Temel ayarları yükle. Geliştirmede .env.local değerleri bunları geçersiz kılabilir.
dotenv.config();
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local', override: true });
}

// Beklediğimiz environment şeması
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info'),
  MONGODB_URL: z
    .string({ required_error: 'MONGODB_URL zorunludur' })
    .url('MONGODB_URL geçerli bir URL olmalı'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Geçersiz environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
