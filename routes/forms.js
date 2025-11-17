const express = require('express');
const router = express.Router();
const db = require('../database');
const { sendMessage } = require('../whatsapp-client');
const TelegramBot = require('node-telegram-bot-api');

// Form oluştur
router.post('/create', (req, res) => {
    try {
        const { userId, title, description, fields, platform, telegramBotToken, telegramChatId, whatsappNumber } = req.body;

        if (!userId || !title || !fields || !platform) {
            return res.status(400).json({ error: 'Eksik bilgiler' });
        }

        if (platform === 'telegram' && (!telegramBotToken || !telegramChatId)) {
            return res.status(400).json({ error: 'Telegram bot token ve chat ID gerekli' });
        }

        if (platform === 'whatsapp' && !whatsappNumber) {
            return res.status(400).json({ error: 'WhatsApp numarası gerekli' });
        }

        db.run(
            'INSERT INTO forms (user_id, title, description, fields, platform, telegram_bot_token, telegram_chat_id, whatsapp_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description, JSON.stringify(fields), platform, telegramBotToken || null, telegramChatId || null, whatsappNumber || null],
            function(err) {
                if (err) {
                    console.error('Form oluşturma hatası:', err);
                    return res.status(500).json({ error: 'Form oluşturulamadı' });
                }

                res.json({
                    success: true,
                    form: {
                        id: this.lastID,
                        title,
                        description,
                        fields: JSON.parse(fields),
                        platform,
                        link: `/form/${this.lastID}`
                    }
                });
            }
        );
    } catch (error) {
        console.error('Form oluşturma hatası:', error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

// Kullanıcının formlarını getir
router.get('/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        db.all('SELECT * FROM forms WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
            if (err) {
                console.error('Form listeleme hatası:', err);
                return res.status(500).json({ error: 'Formlar getirilemedi' });
            }

            const forms = rows.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description,
                fields: JSON.parse(row.fields),
                platform: row.platform,
                created_at: row.created_at,
                link: `/form/${row.id}`
            }));

            res.json({ success: true, forms });
        });
    } catch (error) {
        console.error('Form listeleme hatası:', error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

// Form detayını getir
router.get('/:formId', (req, res) => {
    try {
        const { formId } = req.params;

        db.get('SELECT * FROM forms WHERE id = ?', [formId], (err, row) => {
            if (err) {
                console.error('Form getirme hatası:', err);
                return res.status(500).json({ error: 'Form getirilemedi' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Form bulunamadı' });
            }

            res.json({
                success: true,
                form: {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    fields: JSON.parse(row.fields),
                    platform: row.platform
                }
            });
        });
    } catch (error) {
        console.error('Form getirme hatası:', error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

// Form gönderimi
router.post('/:formId/submit', async (req, res) => {
    try {
        const { formId } = req.params;
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ error: 'Form verisi gerekli' });
        }

        // Formu getir
        db.get('SELECT * FROM forms WHERE id = ?', [formId], async (err, form) => {
            if (err) {
                console.error('Form getirme hatası:', err);
                return res.status(500).json({ error: 'Form getirilemedi' });
            }

            if (!form) {
                return res.status(404).json({ error: 'Form bulunamadı' });
            }

            // Gönderimi kaydet
            db.run(
                'INSERT INTO submissions (form_id, data) VALUES (?, ?)',
                [formId, JSON.stringify(data)],
                async function(err) {
                    if (err) {
                        console.error('Gönderim kaydetme hatası:', err);
                        return res.status(500).json({ error: 'Gönderim kaydedilemedi' });
                    }

                    // Mesajı formatla
                    let message = `*${form.title}*\n\n`;
                    const formData = JSON.parse(data);
                    const formFields = JSON.parse(form.fields);

                    formFields.forEach((field, index) => {
                        if (formData[field.name]) {
                            message += `*${field.label}:* ${formData[field.name]}\n`;
                        }
                    });

                    // Platform'a göre gönder
                    try {
                        if (form.platform === 'whatsapp' && form.whatsapp_number) {
                            await sendMessage(form.whatsapp_number, message);
                        } else if (form.platform === 'telegram' && form.telegram_bot_token && form.telegram_chat_id) {
                            const bot = new TelegramBot(form.telegram_bot_token);
                            await bot.sendMessage(form.telegram_chat_id, message, { parse_mode: 'Markdown' });
                        }

                        res.json({ success: true, message: 'Form başarıyla gönderildi' });
                    } catch (error) {
                        console.error('Mesaj gönderme hatası:', error);
                        res.status(500).json({ error: 'Form kaydedildi ancak mesaj gönderilemedi' });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Form gönderim hatası:', error);
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
});

module.exports = router;

