# WhatsForm

WhatsApp və Telegram forma yaratma platforması. İstifadəçilər kod yazmadan formalar yarada bilərlər və forma təqdimləri birbaşa WhatsApp və ya Telegram-a göndərilir.

## Özellikler

- 📱 Qeydiyyatdan keçin və WhatsApp ilə daxil olun
- 🔐 4-rəqəmli doğrulama kodu sistemi
- 📝 Kod yazmadan formalar yaradın
- 🔗 Forma bağlantılarını paylaşın
- 📲 WhatsApp və ya Telegram-a avtomatik mesajlar göndərin
- 📊 Forma təqdimatlarına baxın

## Quraşdırma

1. Asılılıqları quraşdırın:
```bash
npm install
```

2. `.env` fayl yaradın (opsiyonel):
```
PORT=3000
```

3. Serveri işə salın:
```bash
npm start
```

və ya developer rejimi üçün:
```bash
npm run dev
```

## İstifadəsi

1. Əsas səhifədə telefon nömrənizi daxil edin
2. WhatsApp-dan 4 rəqəmli kodu daxil edin
3. İdarə panelində yeni forma yaradın
4. Forma sahələrini əlavə edin
5. WhatsApp və ya Telegram platformasını seçin
6. Formanın linkini paylaşın

## WhatsApp Web Linki

İlk istifadə zamanı WhatsApp Web-ə qoşulmaq üçün QR kodu yaradılacaq. QR kodunu `/api/whatsapp/qr` son nöqtəsindən əldə edə bilərsiniz.

## Qeydlər

- WhatsApp Web-ə qoşulmaq üçün QR kodu skan etməlisiniz.
- Telegramdan istifadə etmək üçün bot nişanı və söhbət ID tələb olunur.
- Doğrulama kodları 10 dəqiqə ərzində etibarlıdır.

## Texnologiyalar

- Node.js
- Express.js
- WhatsApp Web.js
- Telegram Bot API
- SQLite
- Vanilla JavaScript


