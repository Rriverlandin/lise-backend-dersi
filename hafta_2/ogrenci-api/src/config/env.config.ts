import dotenv from 'dotenv';
import { z } from 'zod';

// .env dosyasını yükle
dotenv.config();

// Beklediğimiz environment şeması
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Geçersiz environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;