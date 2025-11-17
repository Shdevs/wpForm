const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const db = require('./database');

let whatsappClient = null;
let qrCodeData = null;
let isReady = false;

// WhatsApp client'ı başlat
function initWhatsApp() {
    if (whatsappClient) {
        return whatsappClient;
    }

    whatsappClient = new Client({
        authStrategy: new LocalAuth({
            dataPath: './whatsapp-session'
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    whatsappClient.on('qr', async (qr) => {
        console.log('QR Kod oluşturuldu');
        qrCodeData = qr;
        
        // QR kodu terminale yazdır
        const qrTerminal = require('qrcode-terminal');
        qrTerminal.generate(qr, { small: true });
        
        // QR kodu base64 olarak kaydet
        try {
            const qrImage = await qrcode.toDataURL(qr);
            qrCodeData = { qr, image: qrImage };
        } catch (err) {
            console.error('QR kod görseli oluşturulamadı:', err);
        }
    });

    whatsappClient.on('ready', () => {
        console.log('WhatsApp Web bağlantısı hazır!');
        isReady = true;
    });

    whatsappClient.on('authenticated', () => {
        console.log('WhatsApp kimlik doğrulandı');
    });

    whatsappClient.on('auth_failure', (msg) => {
        console.error('WhatsApp kimlik doğrulama hatası:', msg);
        isReady = false;
    });

    whatsappClient.on('disconnected', (reason) => {
        console.log('WhatsApp bağlantısı kesildi:', reason);
        isReady = false;
        whatsappClient = null;
    });

    whatsappClient.initialize();

    return whatsappClient;
}

// Mesaj gönder
async function sendMessage(phoneNumber, message) {
    if (!isReady || !whatsappClient) {
        throw new Error('WhatsApp bağlantısı hazır değil');
    }

    // Telefon numarasını formatla (90XXXXXXXXXX formatına çevir)
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const chatId = `${formattedNumber}@c.us`;

    try {
        await whatsappClient.sendMessage(chatId, message);
        return { success: true };
    } catch (error) {
        console.error('Mesaj gönderme hatası:', error);
        throw error;
    }
}

// Telefon numarasını formatla
function formatPhoneNumber(phone) {
    // + işaretini ve boşlukları kaldır
    let cleaned = phone.replace(/[\s\+]/g, '');
    
    // Eğer 0 ile başlıyorsa, 0'ı kaldır (yerel format)
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }
    
    // Eğer ülke kodu yoksa varsayılan olarak 90 (Türkiye) ekle
    // Not: Bu mantık ihtiyaca göre özelleştirilebilir
    if (cleaned.length < 10) {
        cleaned = '90' + cleaned;
    }
    
    return cleaned;
}

// Doğrulama kodu gönder
async function sendVerificationCode(phoneNumber, code) {
    const message = `WhatsForm doğrulama kodunuz: ${code}\n\nBu kodu kimseyle paylaşmayın.`;
    return await sendMessage(phoneNumber, message);
}

// QR kod al
function getQRCode() {
    return qrCodeData;
}

// Bağlantı durumu
function getConnectionStatus() {
    return {
        isReady,
        hasQR: !!qrCodeData
    };
}

module.exports = {
    initWhatsApp,
    sendMessage,
    sendVerificationCode,
    getQRCode,
    getConnectionStatus,
    formatPhoneNumber
};

