const scrollSvg = document.querySelector('.scroll-svg');

if (scrollSvg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    scrollSvg.style.transform = `
      translateY(${scrollY * 0.2}px)
      rotate(${scrollY * 0.05}deg)
    `;
  });
}

const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");

burger.addEventListener("click", () => {
  menu.classList.toggle("open");
});

