const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ogrenciGuncellemeSchema,
  ogrenciListeleSchema,
  ogrenciOlusturmaSchema,
} = require('../dist/schemas/ogrenci.schemas');

test('öğrenci oluşturma verisini normalize eder ve varsayılan notu ekler', () => {
  const result = ogrenciOlusturmaSchema.parse({
    ad: '  Ada ',
    soyad: ' Lovelace  ',
    yas: 17,
    sinif: ' 11-a ',
    okul: '  Bilim Lisesi ',
    email: ' ADA@EXAMPLE.COM ',
  });

  assert.deepEqual(result, {
    ad: 'Ada',
    soyad: 'Lovelace',
    yas: 17,
    sinif: '11-A',
    okul: 'Bilim Lisesi',
    notOrtalamasi: 0,
    email: 'ada@example.com',
  });
});

test('boş güncelleme isteğini reddeder', () => {
  const result = ogrenciGuncellemeSchema.safeParse({});
  assert.equal(result.success, false);
});

test('listeleme sorgusunu sayfalama varsayılanlarıyla ayrıştırır', () => {
  const result = ogrenciListeleSchema.parse({
    sinif: '10-b',
    minNot: '75',
    sayfa: '2',
    limit: '10',
  });

  assert.deepEqual(result, {
    sinif: '10-B',
    minNot: 75,
    yon: 'asc',
    sayfa: 2,
    limit: 10,
  });
});

test('sayfa boyutunu 100 ile sınırlar', () => {
  const result = ogrenciListeleSchema.safeParse({ limit: '101' });
  assert.equal(result.success, false);
});
