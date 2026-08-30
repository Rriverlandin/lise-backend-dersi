import app from './app';
import { env } from './config/env.config';
import { connectDatabase, disconnectDatabase } from './config/database.config';

const start = async (): Promise<void> => {
  // Önce veritabanına bağlan
  await connectDatabase();

  // Sonra HTTP sunucusunu başlat
  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Sunucu http://localhost:${env.PORT} adresinde çalışıyor`);
    console.log(`📚 API: http://localhost:${env.PORT}/api/v1/ogrenciler`);
    console.log(`🌍 Ortam: ${env.NODE_ENV}`);
  });

  // Graceful shutdown
  let kapanisBasladi = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (kapanisBasladi) return;
    kapanisBasladi = true;

    console.log(`\n${signal} alındı, sunucu kapatılıyor...`);

    server.close(async () => {
      await disconnectDatabase();
      console.log('✅ Sunucu kapatıldı');
      process.exit(0);
    });

    const forceCloseTimer = setTimeout(() => {
      console.error('⏱️ Zaman aşımı, zorla kapatılıyor');
      process.exit(1);
    }, 10000);
    forceCloseTimer.unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

// Yakalanmamış hatalar
process.on('uncaughtException', (error) => {
  console.error('💥 Yakalanmamış istisna:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 İşlenmemiş Promise reddi:', reason);
  process.exit(1);
});

void start().catch((error: unknown) => {
  console.error('💥 Uygulama başlatılamadı:', error);
  process.exit(1);
});
