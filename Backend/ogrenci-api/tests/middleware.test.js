const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
process.env.MONGODB_URL = 'mongodb://127.0.0.1:27017/ogrenci-api-test';

const app = require('../dist/app').default;
const { errorHandler } = require('../dist/middleware/error.middleware');
const {
  getValidatedData,
  validate,
} = require('../dist/middleware/validate.middleware');
const { ogrenciListeleSchema } = require('../dist/schemas/ogrenci.schemas');

const createResponse = () => ({
  statusCode: 200,
  body: undefined,
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test('Express teknoloji başlığını gizler', () => {
  assert.equal(app.disabled('x-powered-by'), true);
});

test('öğrenci yönetim arayüzü dağıtıma dahildir', () => {
  const html = fs.readFileSync(
    path.join(__dirname, '../public/index.html'),
    'utf8'
  );

  assert.match(html, /Öğrenci Yönetim Paneli/);
  assert.match(html, /app\.js/);
});

test('query doğrulaması dönüştürülmüş veriyi güvenli alanda saklar', () => {
  const request = { query: { minNot: '80', sayfa: '2' } };
  let nextError;

  validate(ogrenciListeleSchema, 'query')(
    request,
    createResponse(),
    (error) => {
      nextError = error;
    }
  );

  assert.equal(nextError, undefined);
  assert.deepEqual(getValidatedData(request, 'query'), {
    minNot: 80,
    yon: 'asc',
    sayfa: 2,
    limit: 20,
  });
});

test('bozuk JSON hatasını standart 400 yanıtına dönüştürür', () => {
  const error = new SyntaxError('Unexpected token');
  error.status = 400;
  error.type = 'entity.parse.failed';
  const response = createResponse();

  errorHandler(
    error,
    { originalUrl: '/api/v1/ogrenciler', method: 'POST' },
    response,
    () => undefined
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    basarili: false,
    hata: { mesaj: 'Geçersiz JSON gövdesi' },
  });
});
