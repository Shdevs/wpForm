# WhatsForm

WhatsApp ve Telegram form oluşturma platformu. Kullanıcılar kod yazmadan form oluşturabilir ve form gönderimleri doğrudan WhatsApp veya Telegram'a gönderilir.

## Özellikler

- 📱 WhatsApp ile kayıt olma ve giriş yapma
- 🔐 4 haneli doğrulama kodu sistemi
- 📝 Kod yazmadan form oluşturma
- 🔗 Form linki paylaşma
- 📲 WhatsApp veya Telegram'a otomatik mesaj gönderme
- 📊 Form gönderimlerini görüntüleme

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyası oluşturun (opsiyonel):
```
PORT=3000
```

3. Sunucuyu başlatın:
```bash
npm start
```

veya geliştirme modu için:
```bash
npm run dev
```

## Kullanım

1. Ana sayfada telefon numaranızı girin
2. WhatsApp'tan gelen 4 haneli kodu girin
3. Dashboard'da yeni form oluşturun
4. Form alanlarını ekleyin
5. WhatsApp veya Telegram platformunu seçin
6. Form linkini paylaşın

## WhatsApp Web Bağlantısı

İlk kullanımda WhatsApp Web'e bağlanmak için QR kod oluşturulacaktır. QR kodu `/api/whatsapp/qr` endpoint'inden alabilirsiniz.

## Notlar

- WhatsApp Web bağlantısı için QR kod taramanız gerekmektedir
- Telegram kullanımı için bot token ve chat ID gereklidir
- Doğrulama kodları 10 dakika geçerlidir

## Teknolojiler

- Node.js
- Express.js
- WhatsApp Web.js
- Telegram Bot API
- SQLite
- Vanilla JavaScript

