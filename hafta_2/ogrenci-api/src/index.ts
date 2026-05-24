import app from './app';
import { env } from './config/env.config';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${env.PORT} adresinde çalışıyor`);
  console.log(`📚 API: http://localhost:${env.PORT}/api/v1/ogrenciler`);
  console.log(`🌍 Ortam: ${env.NODE_ENV}`);
});

// Graceful shutdown - sektörde standart bir uygulamadır
const shutdown = (signal: string) => {
  console.log(`\n${signal} alındı, sunucu kapatılıyor...`);
  server.close(() => {
    console.log('✅ Sunucu kapatıldı');
    process.exit(0);
  });

  // 10 saniye içinde kapanmazsa zorla kapat
  setTimeout(() => {
    console.error('⏱️ Zaman aşımı, zorla kapatılıyor');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Yakalanmamış hatalar
process.on('uncaughtException', (error) => {
  console.error('💥 Yakalanmamış istisna:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 İşlenmemiş Promise reddi:', reason);
  process.exit(1);
});