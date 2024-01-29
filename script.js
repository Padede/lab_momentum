let state = {
    language: 'en',
    photoSource: 'github',
    photoTag: '',
    widgets: new Set([
      'time',
      'date',
      'greeting',
      'quote',
      'weather',
      'player',
      'todo',
    ]),
    dogLover: false,
  };


const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const nameInput = document.querySelector('.name');
const nameWidth = document.querySelector('.name-width');
const greetingTranslation = {
  'Good morning': 'Доброе утро',
  'Good afternoon': 'Добрый день',
  'Good evening': 'Добрый вечер',
  'Good night': 'Спокойной ночи',
};

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}

function showDate() {
  const dateOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  let currentDate = new Date().toLocaleDateString(state.language, dateOptions);
  currentDate = currentDate.replace(/^./, (str) => str.toUpperCase());
  // .split(' ')
  // .map((word) => word.replace(/^./, (str) => str.toUpperCase()))
  // .join(' ');
  date.textContent = currentDate;
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  const dayParts = ['night', 'morning', 'afternoon', 'evening'];
  return dayParts[Math.floor(hours / 6)];
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  let greetingText = `Good ${timeOfDay},`;
  if (state.language === 'ru') {
    greetingText = `${greetingTranslation[greetingText.slice(0, -1)]},`;
  }
  greeting.textContent = greetingText;
}

function setNameInputWidth() {
  const placeholder =
    state.language === 'en' ? '[Enter name]' : '[Введите имя]';
  nameWidth.textContent = nameInput.value ? nameInput.value : placeholder;
  const width = nameWidth.offsetWidth;
  nameInput.style.width = width + 'px';
}

window.addEventListener('load', showTime);
window.addEventListener('load', setNameInputWidth);
nameInput.addEventListener('change', () => {
  nameInput.blur();
});
nameInput.addEventListener('input', setNameInputWidth);