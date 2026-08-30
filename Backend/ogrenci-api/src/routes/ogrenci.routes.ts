import { Router } from 'express';
import * as ogrenciController from '../controllers/ogrenci.controller';
import { validate } from '../middleware/validate.middleware';
import {
  ogrenciOlusturmaSchema,
  ogrenciGuncellemeSchema,
  ogrenciIdSchema,
  ogrenciListeleSchema,
} from '../schemas/ogrenci.schemas';

const router = Router();

router.get(
  '/',
  validate(ogrenciListeleSchema, 'query'),
  ogrenciController.listele
);

router.get(
  '/:id',
  validate(ogrenciIdSchema, 'params'),
  ogrenciController.getir
);

router.post(
  '/',
  validate(ogrenciOlusturmaSchema, 'body'),
  ogrenciController.olustur
);

router.patch(
  '/:id',
  validate(ogrenciIdSchema, 'params'),
  validate(ogrenciGuncellemeSchema, 'body'),
  ogrenciController.guncelle
);

router.delete(
  '/:id',
  validate(ogrenciIdSchema, 'params'),
  ogrenciController.sil
);

export default router;
