const express = require('express');
const router = express.Router();
const db = require('../database');
const { sendVerificationCode, initWhatsApp, formatPhoneNumber } = require('../whatsapp-client');

// 4 haneli random kod oluştur
function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Kod gönder
router.post('/send-code', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Telefon numarası gerekli' });
        }

        // WhatsApp client'ı başlat
        initWhatsApp();

        // Doğrulama kodu oluştur
        const code = generateVerificationCode();
        
        // Kodu veritabanına kaydet (10 dakika geçerli)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        db.run(
            'INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)',
            [phone, code, expiresAt.toISOString()],
            async function(err) {
                if (err) {
                    console.error('Kod kaydetme hatası:', err);
                    return res.status(500).json({ error: 'Kod gönderilemedi' });
                }

                // WhatsApp'a kod gönder
                try {
                    // Telefon numarasını formatla
                    const formattedPhone = formatPhoneNumber(phone);
                    await sendVerificationCode(formattedPhone, code);
                    res.json({ 
                        success: true, 
                        message: 'Doğrulama kodu gönderildi',
                        expiresIn: 600 // 10 dakika
                    });
                } catch (error) {
                    console.error('WhatsApp mesaj gönderme hatası:', error);
                    res.status(500).json({ 
                        error: 'Kod gönderilemedi. WhatsApp bağlantısını kontrol edin. Lütfen WhatsApp Web\'e bağlandığınızdan emin olun.',
                        code: code, // Test için kod döndür (production'da kaldırılmalı)
                        needsQR: !error.message.includes('hazır değil') ? false : true
                    });
                }
            }
        );
    } catch (error) {
        console.error('Kod gönderme hatası:', error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

// Kod doğrula ve giriş yap
router.post('/verify-code', (req, res) => {
    try {
        const { phone, code } = req.body;

        if (!phone || !code) {
            return res.status(400).json({ error: 'Telefon numarası ve kod gerekli' });
        }

        // Kodu kontrol et
        db.get(
            'SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND used = 0 AND expires_at > datetime("now") ORDER BY id DESC LIMIT 1',
            [phone, code],
            (err, row) => {
                if (err) {
                    console.error('Kod kontrol hatası:', err);
                    return res.status(500).json({ error: 'Bir hata oluştu' });
                }

                if (!row) {
                    return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş kod' });
                }

                // Kodu kullanıldı olarak işaretle
                db.run('UPDATE verification_codes SET used = 1 WHERE id = ?', [row.id]);

                // Kullanıcıyı bul veya oluştur
                db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, user) => {
                    if (err) {
                        console.error('Kullanıcı sorgu hatası:', err);
                        return res.status(500).json({ error: 'Bir hata oluştu' });
                    }

                    if (!user) {
                        // Yeni kullanıcı oluştur
                        db.run('INSERT INTO users (phone) VALUES (?)', [phone], function(err) {
                            if (err) {
                                console.error('Kullanıcı oluşturma hatası:', err);
                                return res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
                            }

                            res.json({
                                success: true,
                                user: {
                                    id: this.lastID,
                                    phone: phone
                                },
                                message: 'Giriş başarılı'
                            });
                        });
                    } else {
                        res.json({
                            success: true,
                            user: {
                                id: user.id,
                                phone: user.phone,
                                name: user.name
                            },
                            message: 'Giriş başarılı'
                        });
                    }
                });
            }
        );
    } catch (error) {
        console.error('Doğrulama hatası:', error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

module.exports = router;

