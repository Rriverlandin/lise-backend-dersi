import { Router } from 'express';
import ogrenciRoutes from './ogrenci.routes';

const router = Router();

router.use('/ogrenciler', ogrenciRoutes);
// İleride: router.use('/kurslar', kursRoutes);
// İleride: router.use('/ogretmenler', ogretmenRoutes);

export default router;