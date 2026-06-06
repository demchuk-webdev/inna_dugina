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

// Керування кастомною кнопкою запуску відео
const ugcVideo = document.getElementById("ugc-video");
const videoPlayBtn = document.getElementById("video-play-btn");

if (ugcVideo && videoPlayBtn) {
  const startVideo = () => {
    ugcVideo.play();
    ugcVideo.setAttribute("controls", "true");
    videoPlayBtn.classList.add("hidden");
  };

  videoPlayBtn.addEventListener("click", startVideo);
  
  // Якщо користувач запустить відео кліком по самому плеєру (на деяких мобільних пристроях)
  ugcVideo.addEventListener("play", () => {
    ugcVideo.setAttribute("controls", "true");
    videoPlayBtn.classList.add("hidden");
  });
}

// Індикатор прогресу прокрутки сторінки (Scroll Progress Bar) - Safari/iOS Сумісний з Throttling через requestAnimationFrame
const progressBar = document.getElementById("scroll-progress");
if (progressBar) {
  const updateProgressBar = () => {
    const winScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    const height = docHeight - window.innerHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = Math.min(scrolled, 100) + "%";
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgressBar();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateProgressBar, { passive: true });
  updateProgressBar();
}

// --- Google Analytics Event Tracking ---
document.addEventListener("DOMContentLoaded", () => {
  // Track Payment Button Click
  const payButtons = document.querySelectorAll('a[href*="wayforpay.com"]');
  payButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
          'event_category': 'engagement',
          'event_label': 'Pay Course Button'
        });
      }
    });
  });

  // Track Telegram Support Click
  const tgButtons = document.querySelectorAll('a[href*="t.me"]');
  tgButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_telegram', {
          'event_category': 'engagement',
          'event_label': 'Telegram Support Link'
        });
      }
    });
  });

  // Track Instagram Support Click
  const instaButtons = document.querySelectorAll('a[href*="instagram.com"]');
  instaButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_instagram', {
          'event_category': 'engagement',
          'event_label': 'Instagram Support Link'
        });
      }
    });
  });
});
