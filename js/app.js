/* =========================================================
   Momentum Clone - Vanilla JS
   구성: 시계 / 로그인 / 인사말 / 투두 / 랜덤배경 / 날씨
   ========================================================= */

/* ---------- 1. 실시간 시계 & 날짜 ---------- */
const clock = document.querySelector("#clock");
const dateEl = document.querySelector("#date");

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  clock.innerText = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;
  dateEl.innerText = `${now.getFullYear()}년 ${pad(now.getMonth() + 1)}월 ${pad(
    now.getDate()
  )}일 ${DAYS[now.getDay()]}요일`;
}

updateClock();
setInterval(updateClock, 1000);

/* ---------- 2. 로그인 (localStorage) & 인사말 ---------- */
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-input");
const greeting = document.querySelector("#greeting");
const logoutBtn = document.querySelector("#logout");
const todoContainer = document.querySelector("#todo-container");

const USERNAME_KEY = "username";

function getGreetingWord() {
  const hour = new Date().getHours();
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 18) return "좋은 오후예요";
  return "좋은 저녁이에요";
}

function paintGreeting(username) {
  greeting.innerText = `${getGreetingWord()}, ${username}님!`;
  greeting.classList.remove("hidden");
}

function showLoggedIn(username) {
  loginForm.classList.add("hidden");
  paintGreeting(username);
  logoutBtn.classList.remove("hidden");
  todoContainer.classList.remove("hidden");
}

function onLoginSubmit(event) {
  event.preventDefault();
  const username = loginInput.value.trim();
  if (username === "") return;
  localStorage.setItem(USERNAME_KEY, username);
  showLoggedIn(username);
}

function logout() {
  localStorage.removeItem(USERNAME_KEY);
  location.reload();
}

loginForm.addEventListener("submit", onLoginSubmit);
logoutBtn.addEventListener("click", logout);

const savedUser = localStorage.getItem(USERNAME_KEY);
if (savedUser === null) {
  loginForm.classList.remove("hidden");
} else {
  showLoggedIn(savedUser);
}

/* ---------- 3. 투두리스트 (localStorage) ---------- */
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const TODOS_KEY = "todos";
let todos = []; // { id, text, done }

function saveTodos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  saveTodos();
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo__item" + (todo.done ? " done" : "");

    const span = document.createElement("span");
    span.className = "todo__text";
    span.innerText = todo.text;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "todo__btn";
    toggleBtn.innerText = todo.done ? "취소" : "완료";
    toggleBtn.addEventListener("click", () => toggleTodo(todo.id));

    const delBtn = document.createElement("button");
    delBtn.className = "todo__btn";
    delBtn.innerText = "삭제";
    delBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(span);
    li.appendChild(toggleBtn);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

function onTodoSubmit(event) {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (text === "") return;
  todos.push({ id: Date.now(), text, done: false });
  todoInput.value = "";
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", onTodoSubmit);

const savedTodos = localStorage.getItem(TODOS_KEY);
if (savedTodos !== null) {
  todos = JSON.parse(savedTodos);
  renderTodos();
}

/* ---------- 4. 유튜브 배경 음악 영상 ---------- */
// 배경으로 쓸 유튜브 영상 ID. 원하는 영상으로 바꾸세요.
// (유튜브 주소 watch?v=XXXX 의 XXXX 부분)
const VIDEO_ID = "x772Kv30xdg";

const bgIframe = document.querySelector("#bg-iframe");
const soundToggle = document.querySelector("#sound-toggle");

// mute 상태에 따라 iframe src를 만든다
function buildVideoSrc(muted) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: muted ? "1" : "0",
    controls: "0",
    loop: "1",
    playlist: VIDEO_ID, // loop이 동작하려면 playlist에 같은 ID 필요
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${VIDEO_ID}?${params.toString()}`;
}

let isMuted = true; // 브라우저 정책상 처음엔 음소거로 자동재생
bgIframe.src = buildVideoSrc(isMuted);

soundToggle.addEventListener("click", () => {
  isMuted = !isMuted;
  bgIframe.src = buildVideoSrc(isMuted); // src 교체로 소리 on/off
  soundToggle.innerText = isMuted ? "🔊 소리 켜기" : "🔇 소리 끄기";
});

/* ---------- 5. 날씨 & 위치 ---------- */
const weatherBox = document.querySelector("#weather");
const weatherCity = document.querySelector(".weather__city");
const weatherTemp = document.querySelector(".weather__temp");
const weatherDesc = document.querySelector(".weather__desc");

// ⚠️ https://openweathermap.org 에서 무료 API 키를 발급받아 넣으세요.
const API_KEY = "19e2633fadb3d41491cadb0710e34edb";

function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod && String(data.cod) !== "200") {
        weatherCity.innerText = "날씨 오류";
        weatherDesc.innerText = "API 키 확인";
        weatherBox.classList.remove("hidden");
        return;
      }
      weatherCity.innerText = data.name;
      weatherTemp.innerText = `${Math.round(data.main.temp)}°C`;
      weatherDesc.innerText = data.weather[0].description;
      weatherBox.classList.remove("hidden");
    })
    .catch(() => {
      weatherCity.innerText = "날씨 불러오기 실패";
      weatherBox.classList.remove("hidden");
    });
}

function onGeoError() {
  weatherCity.innerText = "위치 권한 거부됨";
  weatherBox.classList.remove("hidden");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
