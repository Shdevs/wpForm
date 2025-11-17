const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');

// Telegram bot test
router.post('/test', async (req, res) => {
    try {
        const { botToken, chatId, message } = req.body;

        if (!botToken || !chatId) {
            return res.status(400).json({ error: 'Bot token ve chat ID gerekli' });
        }

        const bot = new TelegramBot(botToken);
        await bot.sendMessage(chatId, message || 'Test mesajı');

        res.json({ success: true, message: 'Test mesajı gönderildi' });
    } catch (error) {
        console.error('Telegram test hatası:', error);
        res.status(500).json({ error: 'Telegram mesajı gönderilemedi: ' + error.message });
    }
});

module.exports = router;

