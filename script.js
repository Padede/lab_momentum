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

  function getRandomNum(max = 20) {
    return Math.floor(Math.random() * max) + 1;
  }


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


function Weather(){
    
    let apiKey="7b68f4e59179a584892201957c6bd6c1";
    let city=document.querySelector('.city').value;
    let url=`http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&units=metric&appid=${apiKey}`;
    axios.get(url).then(res => {
    document.querySelector('.temperature').innerHTML = Math.floor(res.data.main.temp) + '°С' + " " +res.data.weather[0].main;
    document.querySelector('.humidity').innerHTML = "Humidity: " + Math.floor(res.data.main.humidity) + '%'
    document.querySelector('.wind').innerHTML = 'Wind speed: ' + Math.floor(res.data.wind.speed) + " m/s"
    let secondImage = document.getElementById('weatherimg');
    document.querySelector(".afterbegin").src=`http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
    }).catch(err=>{
        document.querySelector('.temperature').innerHTML="Error! city not found!";
        document.querySelector('.humidity').innerHTML="";
        document.querySelector('.wind').innerHTML="";
        document.querySelector(".afterbegin").src="";
    })
}


const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuoteButton = document.querySelector('.change-quote');
let currentQuoteNumber;

async function getQuotes() {
  const quotes = './quotesData.json';
  const res = await fetch(quotes);
  const data = await res.json();
  const quoteNum = getRandomNum(data.length) - 1;
  currentQuoteNumber = quoteNum;
  quote.textContent = data[quoteNum][`text-${state.language}`];
  author.textContent = data[quoteNum][`author-${state.language}`];
}

window.addEventListener('load', getQuotes);
changeQuoteButton.addEventListener('click', getQuotes);


const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

let randomNum = getRandomNum();

async function getLinkToImage() {
  const timeOfDay = getTimeOfDay();
  const tag = state.photoTag || timeOfDay;
  let link;
  if (state.photoSource === 'github') {
    const bgNum = randomNum.toString().padStart(2, '0');
    link = `https://raw.githubusercontent.com/Padede/stage1-tasks/assets/images//${timeOfDay}/${bgNum}.jpg`;
  } else if (state.photoSource === 'unsplash') {
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=oKOX10jBU_QzyHNFymlrF67_Esu3hx44mE1CRW5SO88`;
    const res = await fetch(url);
    const data = await res.json();
    link = data.urls.regular;
  } else if (state.photoSource === 'flickr') {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f29a10c99c597ccca9ef72ae92a09f1c&tags=${tag}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    const bgNum = getRandomNum(data.photos.photo.length - 1);
    link = data.photos.photo[bgNum].url_l;
  }
  return link;
}

async function setBg() {
  const img = new Image();
  img.src = await getLinkToImage();
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
}

function getSlideNext() {
  if (state.photoSource === 'github') {
    randomNum = randomNum === 20 ? 1 : randomNum + 1;
  }
  setBg();
}

function getSlidePrev() {
  if (state.photoSource === 'github') {
    randomNum = randomNum === 1 ? 20 : randomNum - 1;
  }
  setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

window.addEventListener('load', setBg);