let currentPhone = '';
let currentUserId = null;

// Telefon numarası placeholder'ını güncelle
function updatePhonePlaceholder() {
    const countryCode = document.getElementById('countryCode').value;
    const phoneInput = document.getElementById('phoneInput');
    
    // Ülke koduna göre örnek numara placeholder'ı
    const placeholders = {
        '+994': '50 123 45 67',  // Azerbaycan
        '+90': '555 123 45 67',   // Türkiye
        '+1': '555 123 4567'      // ABD
    };
    
    phoneInput.placeholder = placeholders[countryCode] || '50 123 45 67';
}

// Login formunu göster
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('verificationSection').style.display = 'none';
}

// Kod gönder
async function sendCode() {
    const countryCode = document.querySelector('.country-code').value;
    const phoneInput = document.getElementById('phoneInput').value;
    
    if (!phoneInput) {
        alert('Zəhmət olmasa telefon nömrənizi daxil edin');
        return;
    }

    const phone = countryCode + phoneInput.replace(/\s/g, '');
    currentPhone = phone;

    try {
        const response = await fetch('/api/auth/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('verificationSection').style.display = 'block';
            document.getElementById('codeInput').focus();
        } else {
            alert(data.error || 'Kod göndərilə bilmədi');
            // Test için kod göster (production'da kaldırılmalı)
            if (data.code) {
                console.log('Test kodu:', data.code);
            }
        }
    } catch (error) {
        console.error('Xəta:', error);
        alert('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    }
}

// Kod doğrula
async function verifyCode() {
    const code = document.getElementById('codeInput').value;

    if (!code || code.length !== 4) {
        alert('Zəhmət olmasa 4 rəqəmli kodu daxil edin');
        return;
    }

    try {
        const response = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                phone: currentPhone, 
                code 
            })
        });

        const data = await response.json();

        if (data.success) {
            currentUserId = data.user.id;
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userPhone', data.user.phone);
            window.location.href = '/dashboard';
        } else {
            alert(data.error || 'Yanlış kod');
        }
    } catch (error) {
        console.error('Xəta:', error);
        alert('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    }
}

// Geri dön
function backToLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('verificationSection').style.display = 'none';
    document.getElementById('codeInput').value = '';
}

// Google ile giriş (placeholder)
function loginWithGoogle() {
    alert('Google ilə giriş tezliklə əlavə ediləcək');
}

// Typing animasyonu
function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const words = ['Qeydiyyat', 'Geribildirim', 'Rezervasyon', 'Sifarisler'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Yazma hızı (ms)
    let deletingSpeed = 50; // Silme hızı (ms)
    let pauseTime = 2000; // Kelimeler arası bekleme süresi (ms)

    function type() {
        const currentWord = words[wordIndex];
        let displayText = '';

        if (isDeleting) {
            // Silme işlemi
            displayText = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = deletingSpeed;

            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 200; // Yeni kelime öncesi kısa bekleme
            }
        } else {
            // Yazma işlemi
            displayText = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;

            if (charIndex === currentWord.length) {
                // Kelime tamamlandı, bekle ve sil
                typingSpeed = pauseTime;
                isDeleting = true;
            }
        }

        // Cursor'u yazının sonuna ekle
        typingElement.innerHTML = displayText + '<span class="typing-cursor">|</span>';

        setTimeout(type, typingSpeed);
    }

    // Animasyonu başlat
    type();
}

// Demo form interaktivliği
function initDemoForm() {
    // Pastry seçimleri
    const pastryOptions = document.querySelectorAll('.pastry-option');
    pastryOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Tüm seçimleri kaldır
            pastryOptions.forEach(opt => opt.classList.remove('selected'));
            // Tıklananı seç
            this.classList.add('selected');
        });
    });

    // Cinsiyet seçimleri
    const genderOptions = document.querySelectorAll('.gender-option');
    genderOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Tüm seçimleri kaldır
            genderOptions.forEach(opt => opt.classList.remove('selected'));
            // Tıklananı seç
            this.classList.add('selected');
        });
    });

    // Submit butonu
    const submitBtn = document.getElementById('demoSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const name = document.getElementById('demoName').value || 'Alice Fox';
            const address = document.getElementById('demoAddress').value || '#15, 5th Avenue. Crossby Street';
            const selectedPastry = document.querySelector('.pastry-option.selected');
            const selectedGender = document.querySelector('.gender-option.selected');
            
            if (!selectedPastry) {
                alert('Zəhmət olmasa şirniyyat seçin');
                return;
            }

            if (!selectedGender) {
                alert('Zəhmət olmasa cinsiyyət seçin');
                return;
            }

            const pastryName = selectedPastry.querySelector('span').textContent.replace(/[•○]/g, '').trim();
            const pastryType = selectedPastry.getAttribute('data-pastry');
            const pastryTexts = {
                'chocolate': 'Şokolad',
                'vanilla': 'Vanil',
                'strawberry': 'Çiyələk',
                'carrot': 'Yerkökü'
            };
            const pastryText = pastryTexts[pastryType] || 'Şokolad';
            const price = selectedPastry.getAttribute('data-price');
            const gender = selectedGender.getAttribute('data-gender');

            // Sağ telefona mesaj gönder
            sendDemoMessage(name, pastryText, price, address, gender);
        });
    }
}

// WhatsApp bildirim sesi çal
function playNotificationSound() {
    try {
        // Web Audio API ile bildirim sesi oluştur
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // WhatsApp bildirim sesi benzeri ton
        oscillator.frequency.value = 800; // Yüksek perde
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // İkinci kısa ses (WhatsApp bildirim sesi gibi)
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();

            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);

            oscillator2.frequency.value = 1000;
            oscillator2.type = 'sine';

            gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator2.start(audioContext.currentTime);
            oscillator2.stop(audioContext.currentTime + 0.2);
        }, 150);
    } catch (error) {
        console.log('Ses çalınamadı:', error);
    }
}

// Demo mesaj gönder
function sendDemoMessage(name, pastry, price, address, gender) {
    const shopMessage = document.getElementById('shopMessage');
    const shopMessageContent = document.getElementById('shopMessageContent');
    const shopMessageTime = document.getElementById('shopMessageTime');
    const userMessage = document.getElementById('userMessage');
    const userMessageTime = document.getElementById('userMessageTime');
    const contactAvatar = document.getElementById('contactAvatar');
    const contactName = document.getElementById('contactName');

    // Profil resmini ve ismi güncelle
    if (gender === 'female') {
        contactAvatar.src = 'female.jpg';
    } else {
        contactAvatar.src = 'male.jpg';
    }
    contactName.textContent = name || 'Müştəri';

    // Saat bilgisi
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    // Mağaza mesajını göster
    shopMessageContent.innerHTML = `
        <strong>Adınız:</strong> ${name}<br>
        <strong>Şirniyyat seçimi:</strong> ${pastry} - $${price}<br>
        <strong>Çatdırılma ünvanı:</strong> ${address}
    `;
    shopMessageTime.textContent = timeStr;
    shopMessage.style.display = 'block';

    // Bildirim sesi çal
    playNotificationSound();

    // Scroll'u en alta al
    const chatContainer = document.getElementById('whatsappChat');
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 2 saniye sonra otomatik cevap gönder
    setTimeout(() => {
        const responseTime = new Date(now.getTime() + 2000);
        const responseTimeStr = responseTime.getHours().toString().padStart(2, '0') + ':' + responseTime.getMinutes().toString().padStart(2, '0');
        
        userMessageTime.textContent = responseTimeStr + ' ✓✓';
        userMessage.style.display = 'block';
        
        // Scroll'u tekrar en alta al
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }, 2000);
}

// Enter tuşu ile kod gönderme
document.addEventListener('DOMContentLoaded', () => {
    // Typing animasyonunu başlat
    initTypingAnimation();

    // Demo formu başlat
    initDemoForm();

    // İlk yüklemede placeholder'ı güncelle
    updatePhonePlaceholder();

    const codeInput = document.getElementById('codeInput');
    if (codeInput) {
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyCode();
            }
        });
    }
});

