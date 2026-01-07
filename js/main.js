document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     MENU BURGER (slide droite)
  ======================= */

  const burger = document.querySelector(".burger");
  const menuPanel = document.querySelector(".menu-panel");
  const closeBtn = document.querySelector(".close-menu");

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
     CARROUSEL ACTIVITÉS
  ======================= */

  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dots = document.querySelectorAll(".carousel-dot");

  if (track && prevBtn && nextBtn && dots.length) {

    const slides = track.querySelectorAll(".card");
    let currentIndex = 0;
    let autoplayId = null;

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


    // flèches
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


    // points
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      });
    });


    // pause au survol
    const carousel = document.querySelector(".carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoplay);
      carousel.addEventListener("mouseleave", startAutoplay);
    }


    // lancement
    goToSlide(0);
    startAutoplay();
  }

/* ======================
   PARALLAX — comme ddd.png : haut + bas, côtés
====================== */

const parallaxIcons = document.querySelectorAll(".bg-parallax img");

if (parallaxIcons.length) {

  parallaxIcons.forEach((icon, i) => {

    // petite variation de profondeur
    icon.dataset.speed = 0.1 + (i * 0.03);

    // variation d'échelle subtile
    icon.dataset.scale = 0.9 + Math.random() * 0.25;

    // rotation douce
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


});
