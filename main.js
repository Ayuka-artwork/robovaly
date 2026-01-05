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
