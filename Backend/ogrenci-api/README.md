# Öğrenci Yönetim Sistemi

TypeScript, Express 5 ve MongoDB/Mongoose ile geliştirilmiş öğrenci yönetim uygulaması. Tarayıcı arayüzü öğrenci kayıtlarını görsel olarak yönetir; katmanlı REST API ise doğrulama, filtreleme, sıralama, sayfalama ve soft-delete desteği sağlar.

## Özellikler

- Kurulum gerektirmeden Express tarafından sunulan responsive yönetim paneli
- Arayüzden öğrenci listeleme, arama, sınıfa göre filtreleme, ekleme, düzenleme ve silme
- Toplam öğrenci, sınıf ve not ortalaması istatistikleri
- Zod ile body, params ve query doğrulaması
- Controller → service → repository → model katmanları
- MongoDB üzerinde case-insensitive öğrenci benzersizliği
- Soft-delete ile uyumlu partial unique indeksler
- Merkezi hata yönetimi ve yapılandırılabilir JSON logları
- Liveness ve database readiness kontrolleri
- Node.js yerleşik test runner'ı ile dış servise ihtiyaç duymayan testler

## Gereksinimler

- Node.js 20 veya üzeri
- Çalışan bir MongoDB sunucusu

## Kurulum

```bash
git clone <repository-url>
cd <repository-folder>/Backend/ogrenci-api
npm ci
cp .env.example .env
npm run dev
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.

Bu adres tarayıcıda açıldığında öğrenci yönetim paneli görüntülenir. Panelde yapılan işlemler doğrudan MongoDB veritabanına kaydedilir.

Yerel MongoDB kullanırken `.env` içindeki uzak bağlantıyı silmek zorunda değilsiniz. Git tarafından yok sayılan `.env.local` dosyasına aşağıdaki değeri ekleyebilirsiniz; geliştirme ortamında bu değer `.env` dosyasının önüne geçer:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/ogrenci-api
```

Homebrew MongoDB servisini gerektiğinde şu komutla başlatabilirsiniz:

```bash
brew services start mongodb-community@8.0
```

### Ortam değişkenleri

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---:|---|---|
| `MONGODB_URL` | Evet | — | MongoDB bağlantı adresi |
| `PORT` | Hayır | `3000` | HTTP portu |
| `NODE_ENV` | Hayır | `development` | `development`, `test` veya `production` |
| `LOG_LEVEL` | Hayır | `info` | `debug`, `info`, `warn` veya `error` |

## Endpointler

Temel adres: `/api/v1/ogrenciler`

| Metot | Yol | Açıklama |
|---|---|---|
| `GET` | `/health` | Uygulama liveness kontrolü |
| `GET` | `/health/ready` | MongoDB readiness kontrolü |
| `GET` | `/api/v1/ogrenciler` | Öğrencileri listeler |
| `GET` | `/api/v1/ogrenciler/:id` | Bir öğrenciyi getirir |
| `POST` | `/api/v1/ogrenciler` | Öğrenci oluşturur |
| `PATCH` | `/api/v1/ogrenciler/:id` | Öğrenciyi kısmi günceller |
| `DELETE` | `/api/v1/ogrenciler/:id` | Öğrenciyi soft-delete eder |

Listeleme sorgusu `sinif`, `minNot`, `siralama`, `yon`, `sayfa` ve `limit` parametrelerini kabul eder. `limit` en fazla 100 olabilir.

```bash
curl "http://localhost:3000/api/v1/ogrenciler?sinif=11-A&minNot=70&siralama=notOrtalamasi&yon=desc&sayfa=1&limit=20"
```

Yeni öğrenci örneği:

```bash
curl -X POST http://localhost:3000/api/v1/ogrenciler \
  -H "Content-Type: application/json" \
  -d '{
    "ad": "Ada",
    "soyad": "Lovelace",
    "yas": 17,
    "sinif": "11-A",
    "okul": "Bilim Lisesi",
    "notOrtalamasi": 95,
    "email": "ada@example.com"
  }'
```

Başarılı listeleme yanıtında kayıtlar `veri`, sayfalama bilgileri `sayfalama` alanında döner. Hatalar her endpointte aynı yapıyı kullanır:

```json
{
  "basarili": false,
  "hata": {
    "mesaj": "Validasyon-Doğrulama Hatası",
    "detaylar": []
  }
}
```

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Temiz bir TypeScript derlemesi üretir |
| `npm run typecheck` | Dosya üretmeden tip kontrolü yapar |
| `npm test` | Projeyi derler ve testleri çalıştırır |
| `npm run check` | Tip kontrolü, derleme ve testleri birlikte çalıştırır |
| `npm start` | Derlenmiş uygulamayı çalıştırır |
| `npm run db:sync-indexes` | Mongoose indekslerini veritabanıyla eşitler |

`db:sync-indexes`, şemada artık bulunmayan indeksleri silebilir. Daha önce oluşturulmuş bir veritabanını yeni partial unique indekslere geçirirken önce yedek alın ve komutu bilinçli olarak çalıştırın. Yeni veritabanlarında buna gerek yoktur.

## Proje yapısı

```text
public/               # Tarayıcıda çalışan öğrenci yönetim paneli
├── index.html
├── styles.css
└── app.js
src/
├── config/         # Ortam ve MongoDB bağlantısı
├── controllers/    # HTTP istek/yanıt katmanı
├── mappers/        # Veritabanı modelinden API DTO'suna dönüşüm
├── middleware/     # Log, doğrulama ve hata yönetimi
├── models/         # Mongoose şemaları ve indeksler
├── repositories/   # Veritabanı sorguları
├── routes/         # Endpoint tanımları
├── schemas/        # Zod doğrulama şemaları
├── scripts/        # Bakım komutları
├── services/       # İş kuralları
└── types/          # API tipleri
```

## Güvenlik notu

API örnek/portföy kullanımı için hazırdır. İnternete açık gerçek bir sistemde kimlik doğrulama, yetkilendirme, rate limiting, izin verilen CORS origin'leri ve yönetilen secret altyapısı ayrıca eklenmelidir.

## Lisans

[ISC](./LICENSE)
