function startStory() {
  switch(gameState.progress) {
    case 0:
      startMorningScene();
      break;
    case 1:
      startKitchenScene();
      break;
    case 2:
      startAfterCleaningScene();
      break;
    case 3:
      startTeaScene();
      break;
    case 4:
      startAfterRunningScene();
      break;
    default:
      startMorningScene();
  }
}

function startMorningScene() {
  clearChoices();
  updateBackground('bedroom');
  
  showText('Мама', `${playerName}, вставай, в школу пора. Итак 1 сентября прогулял, никчёмный ребёнок.`, () => {
    createFirstChoices();
  });
}

function createFirstChoices() {
  clearChoices();
  
  const choice1 = document.createElement('div');
  choice1.className = 'choice good';
  choice1.textContent = 'Сейчас встану';
  choice1.onclick = () => {
    clearChoices();
    gameState.reputation += 5;
    updateUI();
    
    showText('Мама', 'Ну хоть где-то молодец, я на работу, завтрак на столе', () => {
      setTimeout(() => {
        createSecondChoices();
      }, 500);
    });
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Ещё пять минут';
  choice2.onclick = () => {
    clearChoices();
    gameState.reputation -= 5;
    updateUI();
    
    showText('Мама', 'Не дай бог опоздаешь, наказан будешь! Я на работу, завтрак на столе', () => {
      setTimeout(() => {
        createSecondChoices();
      }, 500);
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
    showText('', 'Вы решили пойти на кухню...', () => {
      changeBackground('pages/fon5-1.png', doorOffSound, () => {
        gameState.progress = 1;
        gameState.location = 'kitchen';
        saveGameState();
        startKitchenScene();
      });
    });
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Полежать, а потом пойти';
  choice2.onclick = () => {
    clearChoices();
    showText('', 'Вы решили немного полежать...', () => {
      setTimeout(() => {
        changeBackground('pages/fon5-1.png', doorOffSound, () => {
          gameState.progress = 1;
          gameState.location = 'kitchen';
          saveGameState();
          startKitchenScene();
        });
      }, 2000);
    });
  };

  choicesContainer.appendChild(choice1);
  choicesContainer.appendChild(choice2);
  choicesContainer.style.display = 'flex';
}

function startKitchenScene() {
  clearChoices();
  updateBackground('kitchen');
  
  showText('', 'Вы заходите на кухню. На столе стоит завтрак: яичница с колбасой и чай.', () => {
    createKitchenChoices();
  });
}

function createKitchenChoices() {
  clearChoices();
  
  const choice1 = document.createElement('div');
  choice1.className = 'choice good';
  choice1.textContent = 'Поесть и убрать за собой';
  choice1.onclick = () => {
    clearChoices();
    gameState.reputation += 10;
    updateUI();
    
    showText('', 'Вы аккуратно поели и помыли посуду. Мать будет довольна.', () => {
      setTimeout(() => {
        changeBackground('pages/fon5.png', waterSound, () => {
          gameState.progress = 2;
          gameState.location = 'corridor';
          saveGameState();
          startAfterCleaningScene();
        });
      }, 1000);
    });
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Быстро перекусить и убежать';
  choice2.onclick = () => {
    clearChoices();
    gameState.reputation -= 5;
    gameState.money += 50;
    updateUI();
    
    showText('', 'Вы быстро съели завтрак и заметили 50 рублей на столе. Посуду оставили грязной, но свистнули деньги.', () => {
      setTimeout(() => {
        changeBackground('pages/fon9-1.png', liftSound, () => {
          gameState.progress = 4;
          gameState.location = 'exit';
          saveGameState();
          startAfterRunningScene();
        });
      }, 1000);
    });
  };

  choicesContainer.appendChild(choice1);
  choicesContainer.appendChild(choice2);
  choicesContainer.style.display = 'flex';
}

function startAfterCleaningScene() {
  clearChoices();
  updateBackground('corridor');
  
  showText('', 'Вы закончили уборку. Теперь можно идти в школу.', () => {
    createAfterCleaningChoices();
  });
}

function createAfterCleaningChoices() {
  clearChoices();
  
  const choice1 = document.createElement('div');
  choice1.className = 'choice good';
  choice1.textContent = 'Пойти в школу';
  choice1.onclick = () => {
    clearChoices();
    showText('', 'Вы пошли в школу. Пришли вовремя. (КОНЕЦ СЦЕНЫ)', () => {});
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Заварить еще чаю';
  choice2.onclick = () => {
    clearChoices();
    showText('', 'Вы решили заварить чай...', () => {
      setTimeout(() => {
        changeBackground('pages/fon5-2.png', null, () => {
          gameState.progress = 3;
          gameState.location = 'kitchen_tea';
          saveGameState();
          startTeaScene();
        });
      }, 1000);
    });
  };

  choicesContainer.appendChild(choice1);
  choicesContainer.appendChild(choice2);
  choicesContainer.style.display = 'flex';
}

function startTeaScene() {
  clearChoices();
  updateBackground('kitchen_tea');
  
  showText('', 'Вы заварили чай. Но время идет...', () => {
    createTeaChoices();
  });
}

function createTeaChoices() {
  clearChoices();
  
  const choice1 = document.createElement('div');
  choice1.className = 'choice bad';
  choice1.textContent = 'Выпить чаю и выбежать';
  choice1.onclick = () => {
    clearChoices();
    showText('', 'Вы выпили чай, но опоздали на первый урок. (КОНЕЦ СЦЕНЫ)', () => {});
  };

  const choice2 = document.createElement('div');
  choice2.className = 'choice bad';
  choice2.textContent = 'Понять что опоздаю и выбежать';
  choice2.onclick = () => {
    clearChoices();
    showText('', 'Вы бросили чай и побежали, но все равно опоздали. (КОНЕЦ СЦЕНЫ)', () => {});
  };

  choicesContainer.appendChild(choice1);
  choicesContainer.appendChild(choice2);
  choicesContainer.style.display = 'flex';
}

function startAfterRunningScene() {
  clearChoices();
  updateBackground('exit');
  
  playEffectSound(liftSound);
  
  showText('', 'Вы выбежали из квартиры и вызвали лифт. Теперь в школу!', () => {});
                                         }
