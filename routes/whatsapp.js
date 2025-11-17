const express = require('express');
const router = express.Router();
const { initWhatsApp, getQRCode, getConnectionStatus } = require('../whatsapp-client');

// WhatsApp QR kodunu al
router.get('/qr', (req, res) => {
    try {
        initWhatsApp();
        const qrData = getQRCode();
        
        if (!qrData) {
            return res.json({ 
                success: false, 
                message: 'QR kod henüz oluşturulmadı. Lütfen bekleyin...' 
            });
        }

        res.json({ 
            success: true, 
            qr: qrData.qr,
            image: qrData.image 
        });
    } catch (error) {
        console.error('QR kod alma hatası:', error);
        res.status(500).json({ error: 'QR kod alınamadı' });
    }
});

// Bağlantı durumunu kontrol et
router.get('/status', (req, res) => {
    try {
        const status = getConnectionStatus();
        res.json({ success: true, ...status });
    } catch (error) {
        console.error('Durum kontrol hatası:', error);
        res.status(500).json({ error: 'Durum kontrol edilemedi' });
    }
});

module.exports = router;

