import mongoose from 'mongoose';
import { env } from './env.config';

/**
 * MongoDB veritabanına bağlanır.
 * Bağlantı başarısız olursa hatayı başlangıç katmanına iletir.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // Mongoose ayarları
    mongoose.set('strictQuery', true); // Sadece şemada tanımlı alanlarla sorgu

    await mongoose.connect(env.MONGODB_URL, {
      // Modern Mongoose'da çoğu opsiyon default. Sadece kritik olanlar:
      serverSelectionTimeoutMS: 10000, // Bağlantı timeout (10sn)
      socketTimeoutMS: 45000, // Socket timeout
    });

    console.log('✅ MongoDB bağlantısı kuruldu');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    throw error;
  }
};

/**
 * Veritabanı bağlantısını düzgün şekilde kapatır.
 * Graceful shutdown sırasında çağrılır.
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('❌ MongoDB kapatma hatası:', error);
  }
};

// Bağlantı olaylarını dinle (sektörde standart)
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose: MongoDB\'ye bağlandı');
});

mongoose.connection.on('error', (err) => {
  console.error('💥 Mongoose bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose: MongoDB bağlantısı koptu');
});
