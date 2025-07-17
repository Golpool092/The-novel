let extraShown = false;
let passportOpen = false;
let diaryOpen = false;
let deferredPrompt = null;

function changeRep(value) {
  const bar = document.querySelector('.progress-fill.rep');
  let current = parseInt(bar.style.width) || 40;
  let next = Math.min(100, Math.max(0, current + value));
  bar.style.width = next + '%';
}

function typeText(element, text, speed = 40) {
  element.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  element.appendChild(cursor);

  function type() {
    if (i < text.length) {
      element.textContent = text.substring(0, i + 1);
      element.appendChild(cursor);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function choose(optionDiv) {
  const dialogueText = document.getElementById('dialogue-text');
  const isGood = optionDiv.classList.contains('good');
  const text = isGood
    ? "Мама: Ну хоть где-то молодец, я на работу, завтрак на столе"
    : "Мама: Не дай бог опоздаешь, наказан будешь! Я на работу, завтрак на столе";
  changeRep(isGood ? 5 : -5);
  typeText(dialogueText, text);
  document.getElementById('choices').style.display = 'none';
}

function addChoice(text, isGood) {
  const choice = document.createElement('div');
  choice.className = 'choice ' + (isGood ? 'good' : 'bad');
  choice.textContent = text;
  choice.onclick = () => choose(choice);
  return choice;
}

function addExtraChoices() {
  if (extraShown) return;
  extraShown = true;
  const container = document.getElementById('choices');
  container.appendChild(addChoice("Хороший (ещё)", true));
  container.appendChild(addChoice("Плохой (ещё)", false));
}

function checkOrientation() {
  const warning = document.querySelector('.orientation-warning');
  const screen = document.querySelector('.static-screen');
  if (window.matchMedia("(orientation: portrait)").matches) {
    warning.style.display = "flex";
    screen.style.display = "none";
  } else {
    warning.style.display = "none";
    screen.style.display = "block";
  }
}

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

window.addEventListener('load', () => {
  checkOrientation();

  let name = prompt("Введите ваше имя:", "Игрок");
  if (!name) name = "Игрок";

  typeText(document.getElementById('dialogue-text'), `${name}, вставай, в школу пора. Итак 1 сентября прогулял, никчёмный ребёнок.`);

  document.querySelectorAll('.choice').forEach(c => {
    c.onclick = () => choose(c);
  });

  document.getElementById('add-choices-btn').onclick = addExtraChoices;

  const passportBtn = document.getElementById('passport-button');
  const passportModal = document.getElementById('passport-modal');
  passportBtn.onclick = () => {
    passportOpen = !passportOpen;
    passportModal.style.display = passportOpen ? 'flex' : 'none';
  };

  const diaryBtn = document.getElementById('diary-button');
  const diaryModal = document.getElementById('diary-modal');
  diaryBtn.onclick = () => {
    diaryOpen = !diaryOpen;
    diaryModal.style.display = diaryOpen ? 'flex' : 'none';
  };
}); 
