const tg = window.Telegram.WebApp;
tg.expand();

// Переменные навигации и экранов
const homeBtn = document.getElementById('home-btn');
const accountBtn = document.getElementById('account-btn');
const inventoryBtn = document.getElementById('inventory-btn');
const screenMain = document.getElementById('screen-main');
const screenProfile = document.getElementById('screen-profile');

// --- ДИНАМИЧЕСКИЙ БАЛАНС ИЗ URL ---
const urlParams = new URLSearchParams(window.location.search);
let userBalance = parseInt(urlParams.get('balance')) || 0;

function refreshBalanceUI() {
    document.getElementById('balance-stars').innerText = userBalance.toLocaleString();
    document.getElementById('profile-balance').innerText = userBalance.toLocaleString();
}
refreshBalanceUI();

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

// --- УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ ПОПОЛНЕНИЯ ---
const btnDepositOpen = document.getElementById('btn-deposit-open');
const modalDeposit = document.getElementById('modal-deposit');
const modalOverlay = document.getElementById('modal-overlay');
const btnDepositConfirm = document.getElementById('btn-deposit-confirm');

function openModal(modal) {
    modalOverlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    }, 10);
}

function closeModal() {
    modalDeposit.style.transform = 'translateY(100%)';
    modalOverlay.style.opacity = '0';
    setTimeout(() => {
        modalDeposit.classList.add('hidden');
        modalOverlay.classList.add('hidden');
    }, 300);
}

btnDepositOpen.addEventListener('click', () => { if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); openModal(modalDeposit); });
modalOverlay.addEventListener('click', closeModal);

// ПОДТВЕРЖДЕНИЕ ПОПОЛНЕНИЯ
btnDepositConfirm.addEventListener('click', () => {
    const amount = document.getElementById('input-deposit').value;
    if (!amount || amount <= 0) { alert('Введите корректное количество Stars'); return; }
    
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify({ action: "deposit", stars_amount: parseInt(amount) }));
    closeModal();
});

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
