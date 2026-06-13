const tg = window.Telegram.WebApp;
tg.expand();

// Элементы навигации
const homeBtn = document.getElementById('home-btn');
const accountBtn = document.getElementById('account-btn');
const inventoryBtn = document.getElementById('inventory-btn');

// Экраны
const screenMain = document.getElementById('screen-main');
const screenProfile = document.getElementById('screen-profile');

// Массив цветов для Telegram-style аватарок
const avatarColors = [
    'linear-gradient(135deg, #ff9500, #ffcc00)', // Оранжевый
    'linear-gradient(135deg, #34c759, #00c7b1)', // Зеленый
    'linear-gradient(135deg, #5856d6, #af52de)', // Фиолетовый
    'linear-gradient(135deg, #007aff, #5ac8fa)', // Синий
    'linear-gradient(135deg, #ff3b30, #ff2d55)'  // Красный
];

// Получаем и настраиваем данные пользователя
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    
    document.getElementById('user-name').innerText = `${user.first_name} ${user.last_name || ''}`.trim();
    document.getElementById('user-username').innerText = user.username ? `@${user.username}` : `ID: ${user.id}`;
    
    // Генерация красивой текстовой аватарки
    const avatarEl = document.getElementById('user-avatar');
    if (user.first_name) {
        avatarEl.innerText = user.first_name.charAt(0).toUpperCase();
        // Даем случайный градиент из массива, чтобы выглядело нативно
        const randomColor = avatarColors[user.id % avatarColors.length];
        avatarEl.style.background = randomColor;
    }
} else {
    // Данные для теста в обычном браузере
    document.getElementById('user-name').innerText = "Дмитрий Иванов";
    document.getElementById('user-username').innerText = "@dima_test";
    const avatarEl = document.getElementById('user-avatar');
    avatarEl.innerText = "Д";
    avatarEl.style.background = avatarColors[3];
}

// Переключение на экран Профиля
accountBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    
    screenMain.classList.add('hidden');
    screenProfile.classList.remove('hidden');
});

// Переключение на Главный экран (Домик)
homeBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    
    screenProfile.classList.add('hidden');
    screenMain.classList.remove('hidden');
});

// Заглушка под кнопку инвентаря
inventoryBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    alert('Инвентарь в разработке');
});

// Умный живой онлайн
const onlineCountEl = document.getElementById('online-count');
function updateOnline() {
    const hour = new Date().getHours();
    let baseOnline = 30;
    if (hour >= 0 && hour < 6) baseOnline = 12;
    else if (hour >= 6 && hour < 12) baseOnline = 25;
    else if (hour >= 12 && hour < 18) baseOnline = 40;
    else baseOnline = 48;

    const fluctuation = Math.floor(Math.random() * 7) - 3;
    let finalOnline = Math.max(10, Math.min(50, baseOnline + fluctuation));
    onlineCountEl.innerText = finalOnline;
}
updateOnline();
setInterval(updateOnline, 5000);
