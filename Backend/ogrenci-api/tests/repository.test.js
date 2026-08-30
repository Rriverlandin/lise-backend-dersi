const test = require('node:test');
const assert = require('node:assert/strict');

const { OgrenciModel } = require('../dist/models/ogrenci.model');
const {
  OgrenciRepository,
} = require('../dist/repositories/ogrenci.repository');

test('ad ve soyadı RegExp oluşturmadan güvenli eşitlik sorgusunda kullanır', async () => {
  const originalFindOne = OgrenciModel.findOne;
  let receivedFilter;
  let receivedCollation;

  OgrenciModel.findOne = (filter) => {
    receivedFilter = filter;
    return {
      collation(options) {
        receivedCollation = options;
        return this;
      },
      exec() {
        return Promise.resolve(null);
      },
    };
  };

  try {
    const repository = new OgrenciRepository();
    await repository.findByAdSoyadSinif('A(', 'Deneme.*', '10-A');

    assert.deepEqual(receivedFilter, {
      ad: 'A(',
      soyad: 'Deneme.*',
      sinif: '10-A',
      aktifMi: true,
    });
    assert.deepEqual(receivedCollation, { locale: 'tr', strength: 2 });
  } finally {
    OgrenciModel.findOne = originalFindOne;
  }
});
