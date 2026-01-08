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

	// ===== Carousel tactile (swipe) =====
(() => {
  const windowEl = document.querySelector(".carousel-window");
  const track = document.querySelector(".carousel-track");
  if (!windowEl || !track) return;

  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));

  const slides = Array.from(track.children);
  if (!slides.length) return;

  let index = 0;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function updateCarousel() {
    index = clamp(index, 0, slides.length - 1);
    track.style.transition = "transform 0.35s ease";
    track.style.transform = `translateX(${-index * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  // Boutons / dots
  prevBtn?.addEventListener("click", () => { index--; updateCarousel(); });
  nextBtn?.addEventListener("click", () => { index++; updateCarousel(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { index = i; updateCarousel(); }));

  // --- Swipe / drag ---
  let isDown = false;
  let startX = 0;
  let deltaX = 0;
  let startIndex = 0;


  const SWIPE_THRESHOLD = 40; // px

  function onDown(e) {
    isDown = true;
    startX = e.clientX;
    deltaX = 0;
    startIndex = index;
    track.style.transition = "none";
    windowEl.setPointerCapture?.(e.pointerId);
  }

  function onMove(e) {
    if (!isDown) return;

    deltaX = e.clientX - startX;

    // Convertit px -> %
    const width = windowEl.getBoundingClientRect().width || 1;
    const dragPercent = (deltaX / width) * 100;

    // position "suivante" pendant drag
    track.style.transform = `translateX(${-(startIndex * 100) + dragPercent}%)`;
  }

  function onUp() {
    if (!isDown) return;
    isDown = false;

    // Décide si on change de slide
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) index = startIndex + 1;
      else index = startIndex - 1;
    } else {
      index = startIndex;
    }

    updateCarousel();
  }

  // Pointer Events (souris + tactile)
  windowEl.addEventListener("pointerdown", onDown);
  windowEl.addEventListener("pointermove", onMove);
  windowEl.addEventListener("pointerup", onUp);
  windowEl.addEventListener("pointercancel", onUp);
  windowEl.addEventListener("pointerleave", onUp);

  // Init
  updateCarousel();
})();

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

	/* ======================
		 ITINÉRAIRES MAPS (Google / Apple)
	======================= */

	const appleBtn = document.querySelector(".map-btn--apple");
	const gmapsBtn = document.querySelector(".map-btn--gmaps");

	if (appleBtn && gmapsBtn) {
		const ua = navigator.userAgent || navigator.vendor || window.opera;
		const isApple = /iPhone|iPad|iPod|Macintosh/.test(ua);

		if (isApple) {
			appleBtn.classList.add("primary-map");
		} else {
			gmapsBtn.classList.add("primary-map");
		}
	}
