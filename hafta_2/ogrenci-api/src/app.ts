import express, { Application } from 'express';
import routes from './routes';
import { logger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { notFoundError } from './middleware/notFound.middleware';
const app: Application = express();

// Built-in middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(logger);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    basarili: true,
    durum: 'çalışıyor',
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
