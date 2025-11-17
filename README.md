# <img src="images/logo.png" alt="WhatsForm" width="32" height="32"> WhatsForm

WhatsApp və Telegram form yaratma platformu. İstifadəçilər kod yazmadan form yarada bilər və form göndərişləri birbaşa WhatsApp və ya Telegram-a göndərilir.

## Xüsusiyyətlər

- 📱 WhatsApp ilə qeydiyyat və giriş
- 🔐 4 rəqəmli təsdiqləmə kodu sistemi
- 📝 Kod yazmadan form yaratma
- 🔗 Form linki paylaşma
- 📲 WhatsApp və ya Telegram-a avtomatik mesaj göndərmə
- 📊 Form göndərişlərini görüntüləmə

## Quraşdırma

1. Asılılıqları yükləyin:
```bash
npm install
```

2. `.env` faylı yaradın (istəyə bağlı):
```
PORT=3000
```

3. Serveri başladın:
```bash
npm start
```

və ya inkişaf rejimi üçün:
```bash
npm run dev
```

## İstifadə

1. Ana səhifədə telefon nömrənizi daxil edin
2. WhatsApp-dan gələn 4 rəqəmli kodu daxil edin
3. Dashboard-da yeni form yaradın
4. Form sahələrini əlavə edin
5. WhatsApp və ya Telegram platformunu seçin
6. Form linkini paylaşın

## WhatsApp Web Bağlantısı

İlk istifadədə WhatsApp Web-ə qoşulmaq üçün QR kod yaradılacaq. QR kodu `/api/whatsapp/qr` endpoint-indən əldə edə bilərsiniz.

## Qeydlər

- WhatsApp Web bağlantısı üçün QR kod skan etməlisiniz
- Telegram istifadəsi üçün bot token və chat ID tələb olunur
- Təsdiqləmə kodları 10 dəqiqə etibarlıdır

## Texnologiyalar

- Node.js
- Express.js
- WhatsApp Web.js
- Telegram Bot API
- SQLite
- Vanilla JavaScript

---

<div align="center">
  <img src="images/shdev.jpg" alt="shdevs" width="150" height="150" style="border-radius: 50%;">
  <br>
  <strong>shdevs</strong>
</div>
