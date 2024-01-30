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

// audio

let ar=["assets/music/Серега Пират2.mp3","assets/music/Серега Пират3.mp3","assets/music/Серега Пират1.mp3","assets/music/Серега Пират4.mp3"];
let currentMusic=0,active=false,playhelp=false;
let audio=new Audio(ar[currentMusic]);
let playBtn=document.querySelector(".play");
let volume_img=document.getElementById("volume_img");
let range = document.getElementById('range');
audio.volume=0.05;
range.value=5;
function music(qq){   
    let elems=document.querySelectorAll('.play-item');

    for (let i=0;i<elems.length;i++){
        elems[i].style.color="#FFF";
    }
    document.getElementById(currentMusic).style.color="green"; 
    if (qq==1){
        audio.src=ar[currentMusic];
        audio.play();
        active=true;
        playhelp=true;
        playBtn.style.backgroundImage="url(assets/svg/pause.svg)";
        return;       
    }

    if (playhelp==false){
        audio.src=ar[currentMusic];
        audio.play();
        playhelp=true;
        playBtn.style.backgroundImage="url(assets/svg/pause.svg)";
    }
    else{
        if (active==false){
            active=true;
            audio.play();
            playBtn.style.backgroundImage="url(assets/svg/pause.svg)";
        } 
        else {
            active=false;
            audio.pause();
            playBtn.style.backgroundImage="url(assets/svg/play.svg)"
        }
    }   
}

setInterval(checkMusic, 1000);

function checkMusic(){
    if (audio.ended) {nextMusic();}
}


function nextMusic(){
    currentMusic++;
    if (currentMusic>3) currentMusic=0;
    music(1);
}

function prevMusic(){
    currentMusic--;
    if (currentMusic<0) currentMusic=3;
    music(1);
}

let helpItem;
function selectItem(id){   

    currentMusic=id;
    if(helpItem==id){
        music();
    }
    else music(1)
    helpItem=id;
}

const start = document.querySelector('.start')
const end = document.querySelector('.end')
const progressBar = document.querySelector('.progress-bar')
const now = document.querySelector('.now')

function conversion (value) {
  let minute = Math.floor(value / 60)
  minute = minute.toString().length === 1 ? ('0' + minute) : minute
  let second = Math.round(value % 60)
  second = second.toString().length === 1 ? ('0' + second) : second
  return `${minute}:${second}`
}

audio.onloadedmetadata = function () {
  end.innerHTML = conversion(audio.duration)
  start.innerHTML = conversion(audio.currentTime)
}

progressBar.addEventListener('click', function (event) {
  let coordStart = this.getBoundingClientRect().left
  let coordEnd = event.pageX
  let p = (coordEnd - coordStart) / this.offsetWidth
  now.style.width = p.toFixed(3) * 100 + '%'

  audio.currentTime = p * audio.duration
  audio.play()
})

setInterval(() => {
  start.innerHTML = conversion(audio.currentTime)
  now.style.width = audio.currentTime / audio.duration.toFixed(3) * 100 + '%'
}, 1000)



range.onchange = function(){
  audio.volume=this.value/100
  helpVolume=true;
}


let helpVolume=true,levelVolume;
function volumeOff(){
    if (audio.duration>0){
        if (helpVolume==true){
            levelVolume=range.value;
            audio.volume=0;
            helpVolume=false;
            volume_img.style.backgroundImage="url(assets/svg/volumeoff.png)";
        }
        else {
            audio.volume=levelVolume/100;
            range.value=levelVolume;
            helpVolume=true;
            volume_img.style.backgroundImage="url(assets/svg/volume.png)";
        }
    }
}


// ToDo 

const todo = document.querySelector('.todo-list');
const todoBtn = document.querySelector('.todo-list_icon');
const todoHeaders = document.querySelectorAll('.todo-header');
const todoInput = document.querySelector('.todo-input');
const todoAddBtn = document.querySelector('.todo-add');
const todoList = document.querySelector('.todo-list-todo');
const doneList = document.querySelector('.todo-list-todo_done');

let todoArray = [];
let doneArray = [];

function openTodo(e) {
  todo.classList.toggle('todo-hidden');
  // e.stopPropagation();
  if (!todo.classList.contains('todo-hidden')) {
    document.body.addEventListener('click', function closeTodo(e) {
      // console.log('close todo');
      if (!e.target.closest('.todo-list') && e.target !== todoBtn) {
        todo.classList.add('todo-hidden');
        document.body.removeEventListener('click', closeTodo);
      }
    });
  }
}

function addTodo(e) {
  if (todoInput.value === '') {
    return;
  }
  const todo = {
    id: Date.now().toString(),
    text: todoInput.value,
  };
  todoArray.push(todo);
  todoInput.value = '';
  if (e.target === todoAddBtn) {
    todoInput.blur();
  }
  renderTodos();
}

function createTodoElement(todo, done = false) {
  const checkbox = document.createElement('i');
  checkbox.classList.add(
    'fa-regular',
    done ? 'fa-square-check' : 'fa-square',
    'todo-checkbox'
  );
  checkbox.addEventListener('click', handleCheckboxClick);
  const todoText = document.createElement('span');
  todoText.classList.add('todo-text');
  todoText.textContent = todo.text;
  const deleteBtn = document.createElement('i');
  deleteBtn.classList.add('fa-solid', 'fa-trash', 'todo-trashcan');
  deleteBtn.addEventListener('click', handleDeleteBtnClick);
  const todoElement = document.createElement('li');
  todoElement.classList.add('todo-list-item');
  if (done) {
    todoElement.classList.add('todo-list-item_done');
  }
  todoElement.setAttribute('data-id', todo.id);
  todoElement.appendChild(checkbox);
  todoElement.appendChild(todoText);
  todoElement.appendChild(deleteBtn);
  return todoElement;
}

function renderTodos() {
  todoList.innerHTML = '';
  todoArray.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
  doneList.innerHTML = '';
  doneArray.forEach((done) => {
    const todoElement = createTodoElement(done, true);
    doneList.appendChild(todoElement);
  });
}

function handleCheckboxClick(e) {
  e.stopPropagation();
  const todoElement = e.target.closest('.todo-list-item');
  const id = todoElement.dataset.id;
  if (e.target.closest('.todo-list-item_done')) {
    doneArray = doneArray.filter((todo) => {
      if (todo.id === id) {
        todoArray.push(todo);
        return false;
      }
      return true;
    });
  } else {
    todoArray = todoArray.filter((todo) => {
      if (todo.id === id) {
        doneArray.push(todo);
        return false;
      }
      return true;
    });
  }
  renderTodos();
}

function handleDeleteBtnClick(e) {
  e.stopPropagation();
  const todoElement = e.target.closest('.todo-list-item');
  const id = todoElement.dataset.id;
  todoArray = todoArray.filter((todo) => todo.id !== id);
  doneArray = doneArray.filter((todo) => todo.id !== id);
  renderTodos();
}

window.addEventListener('load', renderTodos);

todoBtn.addEventListener('click', openTodo);

todoInput.addEventListener('change', addTodo);
todoAddBtn.addEventListener('click', addTodo);