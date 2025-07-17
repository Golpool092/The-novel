let passportOpen = false;
let diaryOpen = false;
let settingsOpen = false;
let deferredPrompt = null;
let playerName = "Игрок";
let textSpeed = 60;
let audioVolume = 1.0;
let isTyping = false;
let currentText = '';
let currentCallback = null;
let gameState = {
  reputation: 40,
  friendship: 50,
  knowledge: 60,
  money: 150,
  location: 'bedroom',
  progress: 0
};

// Элементы UI
const startScreen = document.getElementById('start-screen');
const playBtn = document.getElementById('play-btn');
const videoContainer = document.getElementById('video-container');
const introVideo = document.getElementById('intro-video');
const introAudio = document.getElementById('intro-audio');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('player-name');
const nameSubmit = document.getElementById('name-submit');
const gameScreen = document.getElementById('game-screen');
const settingsModal = document.getElementById('settings-modal');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const textSpeedSlider = document.getElementById('text-speed');
const brightnessSlider = document.getElementById('brightness');
const resetProgressBtn = document.getElementById('reset-progress');
const settingsClose = document.getElementById('settings-close');
const moneyAmount = document.getElementById('money-amount');
const paperSound = document.getElementById('paper-sound');
const screenOverlay = document.querySelector('.screen-overlay');
const dialogueText = document.getElementById('dialogue-text');
const choicesContainer = document.getElementById('choices');

// Добавляем backdrop для модальных окон
const modalBackdrop = document.createElement('div');
modalBackdrop.className = 'modal-backdrop';
document.body.appendChild(modalBackdrop);

// Функция для очистки выбора
function clearChoices() {
  while (choicesContainer.firstChild) {
    choicesContainer.removeChild(choicesContainer.firstChild);
  }
  choicesContainer.style.display = 'none';
}

// Функция для закрытия всех модальных окон
function closeAllModals() {
  passportOpen = false;
  diaryOpen = false;
  settingsOpen = false;
  document.getElementById('passport-modal').style.display = 'none';
  document.getElementById('diary-modal').style.display = 'none';
  document.getElementById('settings-modal').style.display = 'none';
  modalBackdrop.style.display = 'none';
  document.body.classList.remove('modal-open');
}

// Функция для отображения текста
function showText(text, callback) {
  if (isTyping) {
    dialogueText.textContent = currentText;
    isTyping = false;
    clearChoices();
    if (currentCallback) currentCallback();
    return;
  }

  currentText = text;
  currentCallback = callback;
  isTyping = true;
  dialogueText.textContent = '';
  
  let i = 0;
  function type() {
    if (i < text.length && isTyping) {
      dialogueText.textContent = text.substring(0, i + 1);
      i++;
      setTimeout(type, textSpeed);
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }
  type();
}

// Обработчик клика по тексту
dialogueText.addEventListener('click', () => {
  if (isTyping) {
    dialogueText.textContent = currentText;
    isTyping = false;
    clearChoices();
    if (currentCallback) currentCallback();
  } else if (currentCallback) {
    currentCallback();
  }
});

// Инициализация игры
function initGame() {
  loadGameState();
  updateUI();
  
  // Устанавливаем фон в зависимости от сохраненной локации
  if (gameState.location === 'kitchen') {
    gameScreen.style.backgroundImage = 'url("pages/fon3.png")';
  } else {
    gameScreen.style.backgroundImage = 'url("pages/fon1.png")';
  }
  
  startStory();
  
  // Обработчики для паспорта и дневника
  document.getElementById('passport-button').addEventListener('click', () => {
    if (passportOpen) {
      closeAllModals();
    } else {
      passportOpen = true;
      document.getElementById('passport-modal').style.display = 'flex';
      modalBackdrop.style.display = 'block';
      document.body.classList.add('modal-open');
      paperSound.currentTime = 0;
      paperSound.volume = audioVolume;
      paperSound.play();
    }
  });
  
  document.getElementById('diary-button').addEventListener('click', () => {
    if (diaryOpen) {
      closeAllModals();
    } else {
      diaryOpen = true;
      document.getElementById('diary-modal').style.display = 'flex';
      modalBackdrop.style.display = 'block';
      document.body.classList.add('modal-open');
      paperSound.currentTime = 0;
      paperSound.volume = audioVolume;
      paperSound.play();
    }
  });
  
  // Обработчик для бэкдропа
  modalBackdrop.addEventListener('click', closeAllModals);
  
  // Обработчик для настроек
  document.getElementById('settings-btn').addEventListener('click', () => {
    if (settingsOpen) {
      closeAllModals();
    } else {
      settingsOpen = true;
      document.getElementById('settings-modal').style.display = 'flex';
      modalBackdrop.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  });
}

// Обновление UI
function updateUI() {
  document.querySelector('.progress-fill.rep').style.width = gameState.reputation + '%';
  document.querySelector('.progress-fill.frnd').style.width = gameState.friendship + '%';
  document.querySelector('.progress-fill.knwl').style.width = gameState.knowledge + '%';
  moneyAmount.textContent = gameState.money;
}

// Сохранение/загрузка состояния
function saveGameState() {
  localStorage.setItem('school13_gameState', JSON.stringify(gameState));
  localStorage.setItem('school13_playerName', playerName);
}

function loadGameState() {
  const savedState = localStorage.getItem('school13_gameState');
  const savedName = localStorage.getItem('school13_playerName');
  
  if (savedState) gameState = JSON.parse(savedState);
  if (savedName) playerName = savedName;
}

// Сброс прогресса
function resetProgress() {
  if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
    gameState = {
      reputation: 40,
      friendship: 50,
      knowledge: 60,
      money: 150,
      location: 'bedroom',
      progress: 0
    };
    playerName = "Игрок";
    saveGameState();
    updateUI();
    startStory();
  }
}

// Проверка ориентации
function checkOrientation() {
  const warning = document.querySelector('.orientation-warning');
  if (window.matchMedia("(orientation: portrait)").matches) {
    warning.style.display = "flex";
    startScreen.style.display = "none";
    gameScreen.style.display = "none";
    videoContainer.style.display = "none";
  } else {
    warning.style.display = "none";
    startScreen.style.display = "flex";
  }
}

// Обработчики событий
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const prompt = document.getElementById('install-prompt');
  prompt.style.display = 'flex';

  document.getElementById('install-btn').onclick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Установка PWA подтверждена');
        } else {
          console.log('Установка PWA отклонена');
        }
        deferredPrompt = null;
        prompt.style.display = 'none';
      });
    }
  };
});

// Старт игры
playBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  videoContainer.style.display = 'flex';
  introVideo.play();
  introAudio.volume = audioVolume;
  introAudio.play();
  
  introVideo.addEventListener('click', startGame);
  introVideo.addEventListener('ended', startGame);
});

function startGame() {
  introVideo.pause();
  introAudio.pause();
  videoContainer.style.display = "none";
  nameModal.style.display = "flex";
  nameInput.value = playerName;
}

// Обработка ввода имени
nameSubmit.addEventListener('click', () => {
  if (nameInput.value.trim() !== '') {
    playerName = nameInput.value.trim();
    localStorage.setItem('school13_playerName', playerName);
  }
  nameModal.style.display = "none";
  gameScreen.style.display = "block";
  initGame();
});

// Настройки
volumeSlider.addEventListener('input', () => {
  audioVolume = volumeSlider.value / 100;
  volumeValue.textContent = `${volumeSlider.value}%`;
  introAudio.volume = audioVolume;
  paperSound.volume = audioVolume;
  localStorage.setItem('school13_audioVolume', audioVolume);
});

textSpeedSlider.addEventListener('input', () => {
  textSpeed = 120 - textSpeedSlider.value;
  localStorage.setItem('school13_textSpeed', textSpeed);
});

brightnessSlider.addEventListener('input', () => {
  document.documentElement.style.filter = `brightness(${brightnessSlider.value}%)`;
  localStorage.setItem('school13_brightness', brightnessSlider.value);
});

resetProgressBtn.addEventListener('click', resetProgress);
settingsClose.addEventListener('click', closeAllModals);

// Настройки в меню
document.getElementById('settings-menu-btn').onclick = () => {
  document.getElementById('settings-modal').style.display = 'flex';
  modalBackdrop.style.display = 'block';
  document.body.classList.add('modal-open');
};

// Инициализация при загрузке
window.addEventListener('load', () => {
  checkOrientation();
  
  // Загрузка настроек
  const savedVolume = localStorage.getItem('school13_audioVolume');
  if (savedVolume) {
    audioVolume = parseFloat(savedVolume);
    volumeSlider.value = audioVolume * 100;
    volumeValue.textContent = `${volumeSlider.value}%`;
  }
  
  const savedSpeed = localStorage.getItem('school13_textSpeed');
  if (savedSpeed) {
    textSpeed = parseInt(savedSpeed);
    textSpeedSlider.value = 120 - textSpeed;
  }
  
  const savedBrightness = localStorage.getItem('school13_brightness');
  if (savedBrightness) {
    brightnessSlider.value = savedBrightness;
    document.documentElement.style.filter = `brightness(${savedBrightness}%)`;
  }
});
