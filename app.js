// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Логика кнопки аккаунта
const accountBtn = document.getElementById('account-btn');
accountBtn.addEventListener('click', () => {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    alert('Переход в профиль / аккаунт');
});

// Умный живой онлайн (10-50 в зависимости от времени суток)
const onlineCountEl = document.getElementById('online-count');

function updateOnline() {
    const hour = new Date().getHours();
    let baseOnline = 30; // Среднее значение

    // Логика зависимости от времени суток
    if (hour >= 0 && hour < 6) {
        baseOnline = 12;  // Глубокая ночь: минимальный онлайн
    } else if (hour >= 6 && hour < 12) {
        baseOnline = 25;  // Утро: плавный подъем
    } else if (hour >= 12 && hour < 18) {
        baseOnline = 40;  // День: рабочий актив
    } else {
        baseOnline = 451;  // Вечер (18-00): самый пик
    }

    // Добавляем небольшое случайное колебание (±3 человека)
    const fluctuation = Math.floor(Math.random() * 7) - 3;
    let finalOnline = baseOnline + fluctuation;

    // Удерживаем строгие рамки от 10 до 50
    finalOnline = Math.max(10, Math.min(50, finalOnline));

    onlineCountEl.innerText = finalOnline;
}

// Запускаем сразу при загрузке и обновляем каждые 5 секунд
updateOnline();
setInterval(updateOnline, 5000);