
# URL Shortener Service

## Proje Hakkında

Bu proje, uzun URL’leri kısa, kolay paylaşılabilir linklere dönüştüren bir **URL Kısaltma Servisi**dir.  
Kullanıcılar kendi özel kısa isimlerini (custom alias) belirleyebilir, linklerin süresini sınırlayabilir, QR kod oluşturabilir ve sistem isteklerini sınırlayan rate limiting mekanizması ile korunur.

---

## Teknolojiler

- **Node.js & Express.js** — REST API geliştirme  
- **PostgreSQL** — Veritabanı  
- **Docker** — PostgreSQL ve Redis konteynerleri için  
- **Redis** — Rate limiting için hızlı cache sistemi  
- **QRCode** — Kısa URL'ler için QR kod üretimi  
- **Postman** — API testleri için  

---

## Özellikler

- Uzun URL’yi kısa linke dönüştürme  
- Özel kısa isim (custom alias) desteği  
- Link için geçerlilik süresi (expiration date)  
- Tıklama sayısı ve temel analytics (IP, cihaz, referer) kaydı  
- QR kod üretimi  
- Rate limiting (dakikada max 5 istek)  
- Aktif/pasif link yönetimi  

---

## Kurulum

### Gereksinimler

- Node.js (v16 ve üzeri önerilir)  
- Docker  
- npm veya yarn  

### Adımlar

1. Projeyi klonlayın:

```bash
git clone https://github.com/aliyasirusta/url-shortener.git
cd url-shortener
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Docker ile PostgreSQL ve Redis konteynerlerini çalıştırın:

```bash
docker run --name pg-url-shortener -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=url_shortener -p 5432:5432 -d postgres

docker run --name redis-rate-limit -p 6379:6379 -d redis
```

4. `.env` dosyasını oluşturun ve veritabanı bilgilerini girin:

```
DB_USER=user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener

REDIS_HOST=localhost
REDIS_PORT=6379
```

5. Veritabanı tablolarını oluşturun (psql veya pgAdmin kullanabilirsiniz):

```sql
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  custom_alias VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  url_id INTEGER REFERENCES urls(id),
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(50),
  user_agent TEXT,
  referer TEXT
);
```

6. Sunucuyu başlatın:

```bash
npm run dev
```

---

## API Endpoints

| Method | URL                      | Açıklama                         | Request Body                                     |
| ------ | ------------------------ | --------------------------------| ------------------------------------------------|
| POST   | `/api/url/shorten`       | URL kısaltma                    | `{ "original_url": "...", "custom_alias": "...", "expires_at": "ISODate" }` (custom_alias ve expires_at opsiyonel) |
| GET    | `/api/url/:short_code`   | Kısa URL yönlendirme            | -                                                |
| GET    | `/api/url/:short_code/qr`| Kısa URL için QR kod üretimi    | -                                                |

---

## Rate Limiting

- Aynı IP’den 1 dakikada en fazla 5 istek yapılabilir.  
- Limit aşılırsa `429 Too Many Requests` ve uyarı mesajı döner.

---

## Test

Projeyi Postman veya benzeri API test araçlarıyla test edebilirsiniz:

- Kısa URL oluşturma  
- Özel alias ile çakışma kontrolü  
- Süresi dolmuş link yönlendirme testi  
- QR kod görüntüleme  
- Rate limit tesi

- 
URL Kısaltma Servisi projesi başarıyla hazırlandı 🎉
