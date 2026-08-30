import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { OgrenciModel } from '../models/ogrenci.model';

const syncIndexes = async (): Promise<void> => {
  await connectDatabase();
  const kaldirilanIndeksler = await OgrenciModel.syncIndexes();
  console.log('✅ Öğrenci indeksleri güncellendi', { kaldirilanIndeksler });
  await disconnectDatabase();
};

void syncIndexes().catch(async (error: unknown) => {
  console.error('❌ İndeksler güncellenemedi:', error);
  await disconnectDatabase();
  process.exitCode = 1;
});
