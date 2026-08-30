# Öğrenci Yönetim Sistemi

TypeScript, Express ve MongoDB ile geliştirilmiş öğrenci yönetim uygulaması. Tarayıcı arayüzü üzerinden öğrenci ekleme, listeleme, düzenleme ve silme işlemleri yapılabilir; aynı işlemler REST API üzerinden de kullanılabilir.

Ana uygulama [`Backend/ogrenci-api`](./Backend/ogrenci-api) klasöründedir. Ayrıntılı kurulum, endpoint ve mimari bilgileri için [proje dokümantasyonuna](./Backend/ogrenci-api/README.md) bakın.

## Hızlı başlangıç

```bash
cd Backend/ogrenci-api
npm ci
cp .env.example .env
npm run dev
```

Kök klasörden de aşağıdaki komutlar kullanılabilir:

```bash
npm run check
npm run dev
```

Uygulamayı görmek için tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

GitHub Actions, her push ve pull request sırasında temiz bağımlılık kurulumu, TypeScript kontrolü, derleme ve testleri otomatik olarak çalıştırır.
