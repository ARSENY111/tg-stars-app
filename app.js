const tg = window.Telegram.WebApp;
tg.expand();

// Переменные навигации и экранов
const homeBtn = document.getElementById('home-btn');
const accountBtn = document.getElementById('account-btn');
const inventoryBtn = document.getElementById('inventory-btn');
const screenMain = document.getElementById('screen-main');
const screenProfile = document.getElementById('screen-profile');

// --- НАСТРОЙКА ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ ---
const avatarColors = [
    'linear-gradient(135deg, #ff9500, #ffcc00)',
    'linear-gradient(135deg, #34c759, #00c7b1)',
    'linear-gradient(135deg, #5856d6, #af52de)',
    'linear-gradient(135deg, #007aff, #5ac8fa)',
    'linear-gradient(135deg, #ff3b30, #ff2d55)'
];

if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById('user-name').innerText = `${user.first_name} ${user.last_name || ''}`.trim();
    document.getElementById('user-username').innerText = user.username ? `@${user.username}` : `ID: ${user.id}`;
    
    const avatarEl = document.getElementById('user-avatar');
    if (user.first_name) {
        avatarEl.innerText = user.first_name.charAt(0).toUpperCase();
        const randomColor = avatarColors[user.id % avatarColors.length];
        avatarEl.style.background = randomColor;
    }
} else {
    document.getElementById('user-name').innerText = "Дмитрий Иванов";
    document.getElementById('user-username').innerText = "@dima_test";
    const avatarEl = document.getElementById('user-avatar');
    avatarEl.innerText = "Д";
    avatarEl.style.background = avatarColors[3];
}

// --- НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ ---
accountBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    screenMain.classList.add('hidden');
    screenProfile.classList.remove('hidden');
});

homeBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    screenProfile.classList.add('hidden');
    screenMain.classList.remove('hidden');
});

inventoryBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    alert('Инвентарь в разработке');
});

// --- ОНЛАЙН СЧЕТЧИК ---
const onlineCountEl = document.getElementById('online-count');
function updateOnline() {
    const hour = new Date().getHours();
    let baseOnline = 30;
    if (hour >= 0 && hour < 6) baseOnline = 12;
    else if (hour >= 6 && hour < 12) baseOnline = 25;
    else if (hour >= 12 && hour < 18) baseOnline = 40;
    else baseOnline = 48;
    const fluctuation = Math.floor(Math.random() * 7) - 3;
    onlineCountEl.innerText = Math.max(10, Math.min(50, baseOnline + fluctuation));
}
updateOnline();
setInterval(updateOnline, 5000);

// --- ЛОГИКА БАЛАНСА И ОПЛАТЫ STARS ---
const balanceEl = document.getElementById('stars-balance');
const buyBtn = document.getElementById('buy-stars-btn');

// Загружаем баланс из локального хранилища (для визуализации)
let currentBalance = parseInt(localStorage.getItem('stars_balance')) || 0;
balanceEl.innerText = currentBalance;

buyBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    
    // Передаем боту команду на создание инвойса.
    // ВАЖНО: tg.sendData работает ТОЛЬКО если Web App открыт через Reply-кнопку.
    // Если открыт через Inline-кнопку, лучше использовать отправку ссылки из бота,
    // но для простоты интеграции покажем нативный метод:
    try {
        tg.sendData(JSON.stringify({ action: "buy_stars", amount: 50 }));
        tg.close(); // Закрываем Mini App, бот сразу пришлет инвойс в чат
    } catch (e) {
        // Альтернативный вариант, если sendData недоступен (например, в десктопе или инлайне)
        tg.showPopup({
            title: "Инвойс",
            message: "Для генерации реального счета, пожалуйста, напиши боту команду /pay в чат."
        });
    }
});

// Обработчик события закрытия инвойса (если ссылка открывается прямо внутри Web App)
tg.onEvent('invoiceClosed', (object) => {
    if (object.status === 'paid') {
        tg.showToast("🎉 Оплата успешна! Баланс обновлен.");
        currentBalance += 50;
        localStorage.setItem('stars_balance', currentBalance);
        balanceEl.innerText = currentBalance;
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } else if (object.status === 'cancelled' || object.status === 'failed') {
        tg.showToast("❌ Оплата отменена или произошла ошибка.");
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
    }
});
