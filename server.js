const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Database ve WhatsApp client'ı başlat
const db = require('./database');
const { initWhatsApp } = require('./whatsapp-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');
const whatsappRoutes = require('./routes/whatsapp');
const telegramRoutes = require('./routes/telegram');

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/telegram', telegramRoutes);

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Form görüntüleme sayfası
app.get('/form/:formId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
    // WhatsApp client'ı başlat
    console.log('WhatsApp client başlatılıyor...');
    initWhatsApp();
});

