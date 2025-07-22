let passportOpen = false;
let diaryOpen = false;
let settingsOpen = false;
let playerName = "Игрок";
let textSpeed = 40;
let audioVolume = 1.0;
let isTyping = false;
let currentText = '';
let currentSpeaker = '';
let currentCallback = null;
let startGameStarted = false;
let typingTimeout = null;
let gameState = {
  reputation: 40,
  friendship: 50,
  knowledge: 60,
  money: 150,
  location: 'bedroom',
  progress: 0
};
let soundEnabled = true;
let musicEnabled = true;
let subtitlesEnabled = true;

const bgMusic = document.getElementById('bg-music');
bgMusic.volume = audioVolume;
const doorOffSound = new Audio('audio/dooroff.mp3');
doorOffSound.volume = audioVolume;
const waterSound = new Audio('audio/water.mp3');
const liftSound = new Audio('audio/lift.mp3');

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
const dialogueSpeaker = document.getElementById('dialogue-speaker');
const choicesContainer = document.getElementById('choices');
const toggleSound = document.getElementById('toggle-sound');
const toggleMusic = document.getElementById('toggle-music');
const toggleSubtitles = document.getElementById('toggle-subtitles');
const returnMainBtn = document.getElementById('return-main');
const settingsBtn = document.getElementById('settings-btn');

const modalBackdrop = document.createElement('div');
modalBackdrop.className = 'modal-backdrop';
document.body.appendChild(modalBackdrop);

const darknessOverlay = document.createElement('div');
darknessOverlay.className = 'full-darkness';
document.body.appendChild(darknessOverlay);

document.documentElement.style.userSelect = 'none';
document.documentElement.style.webkitUserSelect = 'none';
document.documentElement.style.MozUserSelect = 'none';
document.documentElement.style.msUserSelect = 'none';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('mousedown', e => e.preventDefault());

function clearChoices() {
  choicesContainer.innerHTML = '';
  choicesContainer.style.display = 'none';
}

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

function stopTyping() {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  isTyping = false;
}

function showText(speaker, text, callback) {
  stopTyping();
  currentSpeaker = speaker;
  currentText = text;
  currentCallback = callback;
  isTyping = true;
  
  dialogueSpeaker.textContent = speaker;
  dialogueText.textContent = '';
  
  let i = 0;
  function type() {
    if (!isTyping) return;
    if (i < text.length) {
      dialogueText.textContent = text.substring(0, i + 1);
      i++;
      typingTimeout = setTimeout(type, textSpeed);
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }
  type();
}

dialogueText.addEventListener('click', () => {
  if (isTyping) {
    stopTyping();
    dialogueText.textContent = currentText;
    if (currentCallback) currentCallback();
  } else if (currentCallback) {
    currentCallback();
  }
});

function applySoundSetting() {
  paperSound.muted = !soundEnabled;
  doorOffSound.muted = !soundEnabled;
  waterSound.muted = !soundEnabled;
  liftSound.muted = !soundEnabled;
}

function applyMusicSetting() {
  introAudio.muted = !musicEnabled;
  bgMusic.muted = !musicEnabled;
  
  if (!startGameStarted) {
    bgMusic.pause();
    return;
  }
  
  if (musicEnabled) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
}

function applySubtitlesSetting() {
  dialogueText.style.display = subtitlesEnabled ? 'block' : 'none';
}

function initSettings() {
  soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
  subtitlesEnabled = localStorage.getItem('subtitlesEnabled') !== 'false';
  
  toggleSound.checked = soundEnabled;
  toggleMusic.checked = musicEnabled;
  toggleSubtitles.checked = subtitlesEnabled;
  
  applySoundSetting();
  applyMusicSetting();
  applySubtitlesSetting();
}

function initGame() {
  loadGameState();
  updateUI();
  initSettings();
  
  startStory();
  
  document.getElementById('passport-button').onclick = () => {
    if (passportOpen) {
      closeAllModals();
    } else {
      passportOpen = true;
      document.getElementById('passport-modal').style.display = 'flex';
      modalBackdrop.style.display = 'block';
      document.body.classList.add('modal-open');
      paperSound.currentTime = 0;
      paperSound.volume = audioVolume;
      paperSound.muted = !soundEnabled;
      paperSound.play().catch(() => {});
    }
  };
  
  document.getElementById('diary-button').onclick = () => {
    if (diaryOpen) {
      closeAllModals();
    } else {
      diaryOpen = true;
      document.getElementById('diary-modal').style.display = 'flex';
      modalBackdrop.style.display = 'block';
      document.body.classList.add('modal-open');
      paperSound.currentTime = 0;
      paperSound.volume = audioVolume;
      paperSound.muted = !soundEnabled;
      paperSound.play().catch(() => {});
    }
  };
  
  modalBackdrop.onclick = closeAllModals;
  
  settingsBtn.onclick = () => {
    if (settingsOpen) {
      closeAllModals();
    } else {
      settingsOpen = true;
      document.getElementById('settings-modal').style.display = 'flex';
      modalBackdrop.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  };
}

function updateUI() {
  document.querySelector('.progress-fill.rep').style.width = gameState.reputation + '%';
  document.querySelector('.progress-fill.frnd').style.width = gameState.friendship + '%';
  document.querySelector('.progress-fill.knwl').style.width = gameState.knowledge + '%';
  moneyAmount.textContent = gameState.money;
}

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

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

playBtn.onclick = () => {
  startScreen.style.display = 'none';
  videoContainer.style.display = 'flex';
  introVideo.play().catch(() => {});
  introAudio.volume = audioVolume;
  introAudio.muted = !musicEnabled;
  introAudio.play().catch(() => {});
  
  introVideo.onclick = () => !startGameStarted && startGame();
  introVideo.onended = () => !startGameStarted && startGame();
};

function startGame() {
  if (startGameStarted) return;
  startGameStarted = true;
  introVideo.pause();
  introAudio.pause();
  videoContainer.style.display = "none";
  nameModal.style.display = "flex";
  nameInput.value = playerName;
  applyMusicSetting();
  bgMusic.volume = audioVolume;
  bgMusic.loop = true;
  bgMusic.play().catch(() => {});
}

nameSubmit.onclick = () => {
  if (nameInput.value.trim() !== '') {
    playerName = nameInput.value.trim();
    localStorage.setItem('school13_playerName', playerName);
  }
  nameModal.style.display = "none";
  gameScreen.style.display = "block";
  initGame();
};

function playEffectSound(sound) {
  if (!sound) return;
  
  const originalVolume = bgMusic.volume;
  bgMusic.volume = originalVolume / 5;
  
  sound.currentTime = 0;
  sound.volume = audioVolume;
  sound.muted = !soundEnabled;
  sound.play().catch(() => {});
  
  sound.onended = () => {
    bgMusic.volume = originalVolume;
  };
}

function changeBackground(newBackgroundUrl, sound, callback) {
  darknessOverlay.style.opacity = '1';
  darknessOverlay.style.pointerEvents = 'auto';
  
  playEffectSound(sound);
  
  setTimeout(() => {
    gameScreen.style.backgroundImage = `url("${newBackgroundUrl}")`;
    
    setTimeout(() => {
      darknessOverlay.style.opacity = '0';
      
      setTimeout(() => {
        darknessOverlay.style.pointerEvents = 'none';
        if (callback) callback();
      }, 1000);
    }, 3000);
  }, 1000);
}

volumeSlider.oninput = () => {
  audioVolume = volumeSlider.value / 100;
  volumeValue.textContent = `${volumeSlider.value}%`;
  introAudio.volume = audioVolume;
  paperSound.volume = audioVolume;
  bgMusic.volume = audioVolume;
  doorOffSound.volume = audioVolume;
  waterSound.volume = audioVolume;
  liftSound.volume = audioVolume;
  localStorage.setItem('school13_audioVolume', audioVolume);
};

textSpeedSlider.oninput = () => {
  textSpeed = 120 - textSpeedSlider.value;
  localStorage.setItem('school13_textSpeed', textSpeed);
};

brightnessSlider.oninput = () => {
  const val = brightnessSlider.value;
  document.documentElement.style.filter = `brightness(${val}%)`;
  localStorage.setItem('school13_brightness', val);
};

resetProgressBtn.onclick = resetProgress;
settingsClose.onclick = closeAllModals;

document.getElementById('settings-menu-btn').onclick = () => {
  settingsOpen = true;
  document.getElementById('settings-modal').style.display = 'flex';
  modalBackdrop.style.display = 'block';
  document.body.classList.add('modal-open');
};

returnMainBtn.onclick = () => {
  closeAllModals();
  gameScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  startGameStarted = false;
  bgMusic.pause();
};

toggleSound.onchange = e => {
  soundEnabled = e.target.checked;
  localStorage.setItem('soundEnabled', soundEnabled);
  applySoundSetting();
};

toggleMusic.onchange = e => {
  musicEnabled = e.target.checked;
  localStorage.setItem('musicEnabled', musicEnabled);
  applyMusicSetting();
};

toggleSubtitles.onchange = e => {
  subtitlesEnabled = e.target.checked;
  localStorage.setItem('subtitlesEnabled', subtitlesEnabled);
  applySubtitlesSetting();
};

window.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    bgMusic.pause();
  } else if (startGameStarted && musicEnabled) {
    bgMusic.play().catch(() => {});
  }
});

window.addEventListener('load', () => {
  checkOrientation();
  
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
  
  initSettings();
});

settingsModal.style.overflowY = 'auto';
settingsModal.style.paddingTop = '10px';
settingsModal.style.paddingBottom = '10px';

function updateBackground(location) {
  switch(location) {
    case 'bedroom':
      gameScreen.style.backgroundImage = 'url("pages/fon1.png")';
      break;
    case 'kitchen':
      gameScreen.style.backgroundImage = 'url("pages/fon5-1.png")';
      break;
    case 'corridor':
      gameScreen.style.backgroundImage = 'url("pages/fon5.png")';
      break;
    case 'kitchen_tea':
      gameScreen.style.backgroundImage = 'url("pages/fon5-2.png")';
      break;
    case 'exit':
      gameScreen.style.backgroundImage = 'url("pages/fon9-1.png")';
      break;
    default:
      gameScreen.style.backgroundImage = 'url("pages/fon1.png")';
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      console.log('Service Worker зарегистрирован:', reg.scope);
    }).catch(err => {
      console.error('Ошибка регистрации Service Worker:', err);
    });
  });
}

let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const installScreen = document.getElementById('install-screen');
const gameWrapper = document.getElementById('game-wrapper');

function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

if (isPWA()) {
  installScreen.style.display = 'none';
  gameWrapper.style.display = 'block';
} else {
  installScreen.style.display = 'block';
  gameWrapper.style.display = 'none';
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.disabled = false;
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  if (result.outcome === 'accepted') {
    installBtn.textContent = '✅ Установлено';
    installBtn.disabled = true;
    location.reload();
  }
  deferredPrompt = null;
});
