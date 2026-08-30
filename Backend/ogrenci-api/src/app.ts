import express, { Application } from 'express';
import path from 'node:path';
import routes from './routes';
import { logger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { notFoundError } from './middleware/notFound.middleware';
import mongoose from 'mongoose';

const app: Application = express();

app.disable('x-powered-by');

// Built-in middleware
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// Custom middleware
app.use(logger);

// Kurulum gerektirmeyen öğrenci yönetim arayüzü
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    basarili: true,
    durum: 'çalışıyor',
    zamanDamgasi: new Date().toISOString(),
  });
});

// Veritabanı dahil uygulamanın trafik almaya hazır olup olmadığını gösterir.
app.get('/health/ready', (_req, res) => {
  const hazir = mongoose.connection.readyState === 1;
  res.status(hazir ? 200 : 503).json({
    basarili: hazir,
    durum: hazir ? 'hazır' : 'hazır değil',
    veritabani: hazir ? 'bağlı' : 'bağlı değil',
    zamanDamgasi: new Date().toISOString(),
  });
});

// API rotaları
app.use('/api/v1', routes);

// 404 handler (tüm route'lardan SONRA)
app.use(notFoundError);

// Global error handler (EN SON)
app.use(errorHandler);

export default app;
