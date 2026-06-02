// Ініціалізація AOS (Анімація при скролі)
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
  });
}

// Ініціалізація Vanilla Tilt (3D нахил карток)
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
    max: 5,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    scale: 1.02
  });
}

// Таймер зворотного відліку до кінця доби
function updateTimer() {
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (!hoursElement || !minutesElement || !secondsElement) return;

  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  let diff = endOfDay - now;
  if (diff < 0) diff = 0;

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  hoursElement.innerText = hours < 10 ? "0" + hours : hours;
  minutesElement.innerText = minutes < 10 ? "0" + minutes : minutes;
  secondsElement.innerText = seconds < 10 ? "0" + seconds : seconds;
}

// Запуск таймера, якщо елементи присутні на сторінці
if (document.getElementById("countdown")) {
  setInterval(updateTimer, 1000);
  updateTimer();
}
