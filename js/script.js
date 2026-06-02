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

// --- Розумний вічнозелений таймер (Evergreen Timer) ---
// Час дії пропозиції для користувача: 2 години (в мілісекундах)
const PROMO_DURATION = 2 * 60 * 60 * 1000; 
// Якщо таймер закінчився більше ніж 24 години тому, скидаємо його для нового візиту
const RESET_AFTER = 24 * 60 * 60 * 1000; 

function getTimerTarget() {
  const savedEnd = localStorage.getItem('ugc_promo_end');
  const now = Date.now();

  if (!savedEnd) {
    const newEnd = now + PROMO_DURATION;
    localStorage.setItem('ugc_promo_end', newEnd.toString());
    return newEnd;
  }

  const endTimestamp = parseInt(savedEnd, 10);

  // Якщо таймер закінчився
  if (now > endTimestamp) {
    // Якщо минуло більше ніж 24 години, запускаємо таймер заново (новий візит)
    if (now - endTimestamp > RESET_AFTER) {
      const newEnd = now + PROMO_DURATION;
      localStorage.setItem('ugc_promo_end', newEnd.toString());
      return newEnd;
    }
  }

  return endTimestamp;
}

let timerInterval;

function updateTimer() {
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (!hoursElement || !minutesElement || !secondsElement) return;

  const targetTime = getTimerTarget();
  const now = Date.now();
  let diff = targetTime - now;

  if (diff <= 0) {
    diff = 0;
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  hoursElement.innerText = hours < 10 ? "0" + hours : hours;
  minutesElement.innerText = minutes < 10 ? "0" + minutes : minutes;
  secondsElement.innerText = seconds < 10 ? "0" + seconds : seconds;
}

// Запуск таймера, якщо елементи присутні на сторінці
if (document.getElementById("countdown")) {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}
