function startStory() {
  switch(gameState.progress) {
    case 0:
      startMorningScene();
      break;
    case 1:
      startKitchenScene();
      break;
  }
}

function startMorningScene() {
  clearChoices();
  updateBackground('bedroom');

  showText(`${playerName}, вставай, в школу пора. Итак 1 сентября прогулял, никчёмный ребёнок.`, () => {
    if (choicesContainer.children.length === 0) {
      createFirstChoices();
    }
  });
}

function createFirstChoices() {
  const choice1 = document.createElement('div');
  choice1.className = 'choice good';
  choice1.textContent = 'Сейчас встану';
  choice1.onclick = () => {
    clearChoices();
    gameState.reputation += 5;
    showText("(Говорит за дверью) Мама: Ну хоть где-то молодец, я на работу, завтрак на столе", () => {
      setTimeout(() => {
        createSecondChoices();
      }, 1000);
    });
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Ещё пять минут';
  choice2.onclick = () => {
    clearChoices();
    gameState.reputation -= 5;
    showText("(Говорит за дверью) Мама: Не дай бог опоздаешь, наказан будешь! Я на работу, завтрак на столе", () => {
      setTimeout(() => {
        createSecondChoices();
      }, 1000);
    });
  };

  choicesContainer.appendChild(choice1);
  choicesContainer.appendChild(choice2);
  choicesContainer.style.display = 'flex';
}

function createSecondChoices() {
  clearChoices();

  const choice1 = document.createElement('div');
  choice1.className = 'choice good';
  choice1.textContent = 'Пойти на кухню';
  choice1.onclick = () => {
    clearChoices();
    showText("Вы решили пойти на кухню...", () => {
      fadeOutInterface(() => {
        // Проигрываем звук двери
        const doorSound = new Audio('audio/dooroff.mp3');
        doorSound.volume = audioVolume;
        doorSound.play();
        
        setTimeout(() => {
          gameState.progress = 1;
          gameState.location = 'kitchen';
          saveGameState();
          fadeInInterface('kitchen', startKitchenScene);
        }, 5000);
      });
    });
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Полежать, а потом пойти';
  choice2.onclick = () => {
    clearChoices();
    showText("Вы решили немного полежать...", () => {
      fadeOutInterface(() => {
        // Проигрываем звук двери
        const doorSound = new Audio('audio/dooroff.mp3');
        doorSound.volume = audioVolume;
        doorSound.play();
        
        setTimeout(() => {
          gameState.progress = 1;
          gameState.location = 'kitchen';
          saveGameState();
          fadeInInterface('kitchen', startKitchenScene);
        }, 5000);
      });
    });
  };

  choicesContainer.appendChild(choice1);
  choicesContainer.appendChild(choice2);
  choicesContainer.style.display = 'flex';
}

function startKitchenScene() {
  clearChoices();
  updateBackground('kitchen');

  showText("Вы заходите на кухню. На столе стоит завтрак: яичница с колбасой и чай.", () => {
    if (choicesContainer.children.length === 0) {
      createKitchenChoices();
    }
  });
}

function createKitchenChoices() {
  const choice1 = document.createElement('div');
  choice1.className = 'choice good';
  choice1.textContent = 'Поесть и убрать за собой';
  choice1.onclick = () => {
    clearChoices();
    gameState.reputation += 10;
    showText("Вы аккуратно поели и помыли посуду. Мать будет довольна. (КОНЕЦ, ЗАВТРА ЗАЛЬЮ ОБНОВУ С ОЗВУЧКОЙ, МАТЕРЬЮ И НЕБОЛЬШИМ БЕТА ПРОДОЛЖЕНИЕМ)", () => {});
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Быстро перекусить и убежать';
  choice2.onclick = () => {
    clearChoices();
    gameState.reputation -= 5;
    gameState.money += 50;
    moneyAmount.textContent = gameState.money;
    showText("Вы быстро съели завтрак и заметили 50 рублей на столе. Посуду оставили грязной, но свистнули деньги. (КОНЕЦ, ЗАВТРА ЗАЛЬЮ ОБНОВУ С ОЗВУЧКОЙ, МАТЕРЬЮ И НЕБОЛЬШИМ БЕТА ПРОДОЛЖЕНИЕМ)", () => {});
  };

  choicesContainer.appendChild(choice1);
  choicesContainer.appendChild(choice2);
  choicesContainer.style.display = 'flex';
}

// Функция для плавного исчезновения интерфейса
function fadeOutInterface(callback) {
  const elements = [
    document.querySelector('.left-panel'),
    document.querySelector('.hud'),
    document.querySelector('.dialogue'),
    document.querySelector('.choices'),
    gameScreen
  ];
  
  // Плавное исчезновение всех элементов
  elements.forEach(el => {
    if (el) {
      el.style.transition = 'opacity 1s ease-in-out';
      el.style.opacity = '0';
    }
  });
  
  // Затемнение оверлея
  screenOverlay.style.transition = 'opacity 1s ease-in-out';
  screenOverlay.style.opacity = '1';
  
  setTimeout(() => {
    // Скрываем элементы после анимации
    elements.forEach(el => {
      if (el) el.style.display = 'none';
    });
    if (callback) callback();
  }, 1000);
}

// Функция для плавного появления интерфейса с новым фоном
function fadeInInterface(location, callback) {
  // Обновляем фон
  updateBackground(location);
  
  const elements = [
    document.querySelector('.left-panel'),
    document.querySelector('.hud'),
    document.querySelector('.dialogue'),
    gameScreen
  ];
  
  // Показываем элементы (но пока прозрачные)
  elements.forEach(el => {
    if (el) {
      el.style.display = el === gameScreen ? 'block' : 'flex';
      el.style.opacity = '0';
    }
  });
  
  // Начинаем с полностью черного экрана
  screenOverlay.style.opacity = '1';
  
  setTimeout(() => {
    // Плавное появление интерфейса
    elements.forEach(el => {
      if (el) {
        el.style.transition = 'opacity 1s ease-in-out';
        el.style.opacity = '1';
      }
    });
    
    // Плавное исчезновение оверлея
    screenOverlay.style.transition = 'opacity 1s ease-in-out';
    screenOverlay.style.opacity = '0';
    
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  }, 100);
}

// Функция обновления фона в зависимости от локации
function updateBackground(location) {
  if (location === 'kitchen') {
    gameScreen.style.backgroundImage = 'url("pages/fon3.png")';
  } else {
    gameScreen.style.backgroundImage = 'url("pages/fon1.png")';
  }
}
