const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Database tablolarını oluştur
db.serialize(() => {
    // Kullanıcılar tablosu
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Formlar tablosu
    db.run(`CREATE TABLE IF NOT EXISTS forms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        fields TEXT NOT NULL,
        platform TEXT NOT NULL,
        telegram_bot_token TEXT,
        telegram_chat_id TEXT,
        whatsapp_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Form gönderimleri tablosu
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        form_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (form_id) REFERENCES forms(id)
    )`);

    // WhatsApp oturumları tablosu
    db.run(`CREATE TABLE IF NOT EXISTS whatsapp_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_data TEXT,
        is_connected INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Doğrulama kodları tablosu
    db.run(`CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0
    )`);
});

module.exports = db;

