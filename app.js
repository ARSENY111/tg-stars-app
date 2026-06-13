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

// Переменные для кошелька
const btnDepositOpen = document.getElementById('btn-deposit-open');
const btnWithdrawOpen = document.getElementById('btn-withdraw-open');
const modalDeposit = document.getElementById('modal-deposit');
const modalWithdraw = document.getElementById('modal-withdraw');
const modalOverlay = document.getElementById('modal-overlay');

const btnDepositConfirm = document.getElementById('btn-deposit-confirm');
const btnWithdrawConfirm = document.getElementById('btn-withdraw-confirm');

// Функции открытия модальных окон
function openModal(modal) {
    modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    }, 10);
}

function closeModal() {
    modalDeposit.style.transform = 'translateY(full)';
    modalWithdraw.style.transform = 'translateY(full)';
    modalOverlay.style.opacity = '0';
    setTimeout(() => {
        modalDeposit.classList.add('hidden');
        modalWithdraw.classList.add('hidden');
        modalOverlay.classList.add('hidden');
    }, 300);
}

btnDepositOpen.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    openModal(modalDeposit);
});

btnWithdrawOpen.addEventListener('click', () => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    openModal(modalWithdraw);
});

modalOverlay.addEventListener('click', closeModal);

// ЛОГИКА ПОПОЛНЕНИЯ (Интеграция с Telegram Stars)
btnDepositConfirm.addEventListener('click', () => {
    const amount = document.getElementById('input-deposit').value;
    if (!amount || amount <= 0) {
        alert('Введите корректное количество Stars');
        return;
    }

    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');

    // Важно: Сама платежка вызывается через бота на сервере, 
    // но мы можем отправить боту команду, что пользователь хочет купить Stars.
    tg.sendData(JSON.stringify({
        action: "deposit",
        stars_amount: parseInt(amount)
    }));
    
    closeModal();
    tg.close(); // Закрываем Mini App, бот сразу пришлет инвойс на оплату в чат!
});

// ЛОГИКА ВЫВОДА
btnWithdrawConfirm.addEventListener('click', () => {
    const wallet = document.getElementById('input-withdraw-wallet').value;
    const amount = document.getElementById('input-withdraw-amount').value;

    if (!wallet || !amount || amount <= 0) {
        alert('Заполните все поля корректно');
        return;
    }

    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('warning');

    // Передаем боту данные о заявке на вывод
    tg.sendData(JSON.stringify({
        action: "withdraw",
        wallet: wallet,
        stars_amount: parseInt(amount)
    }));

    alert('Заявка на вывод отправлена боту!');
    closeModal();
});
