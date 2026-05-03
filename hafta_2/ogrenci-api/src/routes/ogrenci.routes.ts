

import { Router } from 'express';

import { tumOgrencileriGetir } from '../controllers/ogrenci.controllers';

const router = Router();

router.get("/",tumOgrencileriGetir);

export default router;



