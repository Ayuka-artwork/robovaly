document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     MENU BURGER (slide droite)
  ======================= */

  const burger    = document.querySelector(".burger");
  const menuPanel = document.querySelector(".menu-panel");
  const closeBtn  = document.querySelector(".close-menu");

  if (burger && menuPanel) {
    burger.addEventListener("click", () => {
      menuPanel.classList.add("open");
    });
  }

  if (closeBtn && menuPanel) {
    closeBtn.addEventListener("click", () => {
      menuPanel.classList.remove("open");
    });
  }

  /* ======================
     CARROUSEL ACTIVITÉS (home)
  ======================= */

  const track   = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dots    = document.querySelectorAll(".carousel-dot");

  if (track && prevBtn && nextBtn && dots.length) {

    const slides = track.querySelectorAll(".card");
    let currentIndex = 0;
    let autoplayId   = null;
    const AUTOPLAY_DELAY = 5000;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      currentIndex = index;
      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i === index)
      );
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    nextBtn.addEventListener("click", () => {
      stopAutoplay();
      goToSlide(currentIndex + 1);
      startAutoplay();
    });

    prevBtn.addEventListener("click", () => {
      stopAutoplay();
      goToSlide(currentIndex - 1);
      startAutoplay();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      });
    });

    const carousel = document.querySelector(".carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoplay);
      carousel.addEventListener("mouseleave", startAutoplay);
    }

    goToSlide(0);
    startAutoplay();
  }

  /* ======================
     PARALLAX ICONES HERO
  ======================= */

  const parallaxIcons = document.querySelectorAll(".bg-parallax img");

  if (parallaxIcons.length) {

    parallaxIcons.forEach((icon, i) => {
      icon.dataset.speed = 0.1 + (i * 0.03);
      icon.dataset.scale = 0.9 + Math.random() * 0.25;
      icon.dataset.angle = (Math.random() * 10 - 5).toFixed(2);
    });

    window.addEventListener("scroll", () => {
      const y = window.scrollY;

      parallaxIcons.forEach(icon => {
        const speed  = Number(icon.dataset.speed);
        const scale  = Number(icon.dataset.scale);
        const angle  = Number(icon.dataset.angle);
        const offset = y * speed;

        icon.style.transform =
          `translateY(${offset}px) rotate(${angle}deg) scale(${scale})`;
      });
    });
  }

  /* ======================
     BARRE "HEURE ACTUELLE" SUR LE PROGRAMME
  ======================= */

  const calendarGrid = document.querySelector(".calendar-grid");
  const nowBar       = document.querySelector(".calendar-now");

  if (calendarGrid && nowBar) {
    function updateNowBar() {
      const startHour = 10;  // début programme
      const endHour   = 18;  // fin programme

      const now   = new Date();
      const hours = now.getHours() + now.getMinutes() / 60;

      let t = (hours - startHour) / (endHour - startHour);

      if (t < 0 || t > 1) {
        nowBar.style.display = "none";
        return;
      }

      nowBar.style.display = "block";

      const height = calendarGrid.clientHeight;
      const top    = t * height;

      nowBar.style.top = `${top}px`;
    }

    updateNowBar();
    setInterval(updateNowBar, 60_000);
  }

});
