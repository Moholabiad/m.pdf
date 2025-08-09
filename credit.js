document.addEventListener('DOMContentLoaded', function() {
    const YOUR_SITE = 'https://www.newsnfame.com/';
    const BOT_TOKEN = '8046263011:AAHorMJl4j11A05nr3JSRJgt2zyr323WnZs';
    const CHAT_ID = '-1002605627772'; // مثال: -1001234567890
    const MESSAGE = 🔔 الكود اشتغل على: ${location.hostname};

    // اختيار العنصر الذي يحتوي على النص
    const article = document.querySelector('.post-body') || document.body;

    if (article) {
        // الحصول على النص بدون HTML
        const textOnly = article.innerText;

        // تقسيم النص إلى كلمات (باستخدام الفراغات وعلامات الترقيم)
        const words = textOnly.split(/[\s,;:.!?()«»"'\-–—]+/).filter(w => w.length >= 3);

        if (words.length > 0) {
            // اختيار كلمة عشوائية
            const randomWord = words[Math.floor(Math.random() * words.length)];

            // استبدال الكلمة بالرابط (أول ظهور فقط)
            const html = article.innerHTML;
            const replaced = html.replace(new RegExp(\\b${randomWord}\\b, "u"), <a href="${YOUR_SITE}" target="_blank" rel="dofollow">${randomWord}</a>);
            article.innerHTML = replaced;
        }
    }

    // إرسال إشعار تيليجرام
    fetch(https://api.telegram.org/bot${BOT_TOKEN}/sendMessage, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, text: MESSAGE})
    }).catch(err => console.error('Telegram error:', err));
});
