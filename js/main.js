/* ======================
	 MENU BURGER + NAV ACTIVE + CAROUSEL + PARALLAX + PROGRAMME + FAQ
====================== */

document.addEventListener("DOMContentLoaded", () => {
	/* ======================
		 MENU BURGER
	======================= */
	const burger = document.querySelector(".burger");
	const menuPanel = document.querySelector(".menu-panel");
	const closeBtn = document.querySelector(".close-menu");

	burger?.addEventListener("click", () => menuPanel?.classList.add("open"));
	closeBtn?.addEventListener("click", () => menuPanel?.classList.remove("open"));

	/* ======================
		 NAV ACTIVE
	======================= */
	(() => {
		const path = window.location.pathname.split("/").pop() || "index.html";
		document.querySelectorAll(".menu-desktop a, .menu-panel a").forEach((a) => {
			const href = (a.getAttribute("href") || "").split("/").pop();
			if (!href) return;

			const isIndex = (path === "" || path === "index.html") && href === "index.html";
			const isSame = href === path;

			if (isIndex || isSame) a.classList.add("is-active");
		});
	})();

	/* ======================
		 CAROUSEL – INFINITE / SWIPE / WHEEL (DOTS FIX)
	======================= */
	const track = document.querySelector(".carousel-track");
	const windowEl = document.querySelector(".carousel-window");
	const prevBtn = document.querySelector(".carousel-btn.prev");
	const nextBtn = document.querySelector(".carousel-btn.next");
	const dots = Array.from(document.querySelectorAll(".carousel-dot"));

	if (track && windowEl && prevBtn && nextBtn && dots.length >= 2) {
		const realSlides = Array.from(track.querySelectorAll(".card"));
		const total = realSlides.length;

		if (total >= 2) {
			// Clones
			const firstClone = realSlides[0].cloneNode(true);
			const lastClone = realSlides[total - 1].cloneNode(true);
			firstClone.classList.add("is-clone");
			lastClone.classList.add("is-clone");

			track.insertBefore(lastClone, realSlides[0]);
			track.appendChild(firstClone);

			let indexTrack = 1;

			let autoplayId = null;
			let autoplayEnabled = true;
			const AUTOPLAY_DELAY = 5000;

			let isAnimating = false;

			function setTransition(on) {
				track.style.transition = on ? "transform 0.35s ease" : "none";
			}

			function translate() {
				track.style.transform = `translateX(-${indexTrack * 100}%)`;
			}

			function getRealIndexFromTrack(iTrack = indexTrack) {
				let i = iTrack - 1;
				if (i < 0) i = total - 1;
				if (i >= total) i = 0;
				return i;
			}

			function updateDotsByRealIndex(realIndex) {
				dots.forEach((d, n) => d.classList.toggle("active", n === realIndex));
			}

			function updateDots() {
				updateDotsByRealIndex(getRealIndexFromTrack());
			}

			function updateDotsFromTransform() {
				const transform = getComputedStyle(track).transform;
				if (!transform || transform === "none") {
					updateDots();
					return;
				}

				const m = new DOMMatrixReadOnly(transform);
				const x = m.m41;
				const w = windowEl.getBoundingClientRect().width || 1;

				const floatIndex = (-x / w);
				let nearest = Math.round(floatIndex);

				nearest = Math.max(0, Math.min(total + 1, nearest));

				const real = getRealIndexFromTrack(nearest);
				updateDotsByRealIndex(real);
			}

			function disableAutoplayForever() {
				autoplayEnabled = false;
				if (autoplayId) clearInterval(autoplayId);
				autoplayId = null;
			}

			function startAutoplay() {
				if (!autoplayEnabled) return;
				if (autoplayId) clearInterval(autoplayId);

				autoplayId = setInterval(() => {
					goTo(indexTrack + 1, true, true);
				}, AUTOPLAY_DELAY);
			}

			function goTo(i, animate = true, fromAutoplay = false) {
				if (isAnimating) return;

				if (!fromAutoplay) disableAutoplayForever();

				isAnimating = true;
				indexTrack = i;

				setTransition(animate);
				translate();
				updateDots();
			}

			function snapIfClone() {
				if (indexTrack === total + 1) {
					setTransition(false);
					indexTrack = 1;
					translate();
				}

				if (indexTrack === 0) {
					setTransition(false);
					indexTrack = total;
					translate();
				}

				updateDots();
			}

			track.addEventListener("transitionend", () => {
				snapIfClone();
				isAnimating = false;
			});

			// Init
			setTransition(false);
			indexTrack = 1;
			translate();
			updateDots();
			isAnimating = false;
			startAutoplay();

			// Boutons
			nextBtn.addEventListener("click", () => goTo(indexTrack + 1));
			prevBtn.addEventListener("click", () => goTo(indexTrack - 1));

			// Dots
			dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i + 1)));

			/* ----- SWIPE ----- */
			let down = false;
			let startX = 0;
			let startY = 0;
			let deltaX = 0;
			let startIndex = 1;

			const SWIPE_THRESHOLD = 60;

			windowEl.addEventListener("pointerdown", (e) => {
				disableAutoplayForever();
				down = true;

				startX = e.clientX;
				startY = e.clientY;
				deltaX = 0;
				startIndex = indexTrack;

				setTransition(false);
				windowEl.setPointerCapture?.(e.pointerId);
			});

			windowEl.addEventListener("pointermove", (e) => {
				if (!down) return;

				const dx = e.clientX - startX;
				const dy = e.clientY - startY;

				if (Math.abs(dy) > Math.abs(dx)) return;

				deltaX = dx;

				const w = windowEl.getBoundingClientRect().width || 1;
				const dragPercent = (dx / w) * 100;

				track.style.transform = `translateX(${-(startIndex * 100) + dragPercent}%)`;

				updateDotsFromTransform();
			});

			windowEl.addEventListener("pointerup", () => {
				if (!down) return;
				down = false;

				setTransition(true);

				if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
					goTo(deltaX < 0 ? startIndex + 1 : startIndex - 1);
				} else {
					indexTrack = startIndex;
					translate();
					updateDots();
					isAnimating = false;
				}
			});

			windowEl.addEventListener("pointercancel", () => {
				down = false;
				isAnimating = false;
				updateDots();
			});

			/* ----- WHEEL (trackpad) ----- */
			windowEl.addEventListener(
				"wheel",
				(e) => {
					if (isAnimating) return;

					const dx = e.deltaX || 0;
					const dy = e.deltaY || 0;
					const primary = Math.abs(dx) > Math.abs(dy) ? dx : dy;

					if (Math.abs(primary) < 25) return;

					e.preventDefault();
					goTo(primary > 0 ? indexTrack + 1 : indexTrack - 1);
				},
				{ passive: false }
			);
		}
	}

	/* ======================
		 COUNTDOWN – INDEX
	======================= */
	const countdownSection = document.querySelector(".countdown");
	if (countdownSection) {
		const target = countdownSection.getAttribute("data-countdown-date");
		const targetDate = target ? new Date(target) : null;
		const values = {
			days: countdownSection.querySelector('[data-unit="days"]'),
			hours: countdownSection.querySelector('[data-unit="hours"]'),
			minutes: countdownSection.querySelector('[data-unit="minutes"]'),
			seconds: countdownSection.querySelector('[data-unit="seconds"]'),
		};

		function pad(value) {
			return String(value).padStart(2, "0");
		}

		function updateCountdown() {
			if (!targetDate || Number.isNaN(targetDate.getTime())) return;

			const now = new Date();
			let delta = Math.max(0, targetDate.getTime() - now.getTime());

			const totalSeconds = Math.floor(delta / 1000);
			const days = Math.floor(totalSeconds / 86400);
			const hours = Math.floor((totalSeconds % 86400) / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;

			if (values.days) values.days.textContent = pad(days);
			if (values.hours) values.hours.textContent = pad(hours);
			if (values.minutes) values.minutes.textContent = pad(minutes);
			if (values.seconds) values.seconds.textContent = pad(seconds);
		}

		updateCountdown();
		setInterval(updateCountdown, 1000);
	}

	/* ======================
		 PARALLAX
	======================= */
	const icons = document.querySelectorAll(".bg-parallax img");
	if (icons.length) {
		icons.forEach((icon, i) => {
			icon.dataset.speed = String(0.1 + i * 0.03);
			icon.dataset.angle = String(Math.random() * 10 - 5);
			icon.dataset.scale = String(0.9 + Math.random() * 0.25);
		});

		window.addEventListener("scroll", () => {
			const y = window.scrollY;
			icons.forEach((icon) => {
				const speed = Number(icon.dataset.speed);
				const angle = Number(icon.dataset.angle);
				const scale = Number(icon.dataset.scale);
				icon.style.transform = `translateY(${y * speed}px) rotate(${angle}deg) scale(${scale})`;
			});
		});
	}

	/* ======================
		 PROGRAMME – BARRE HEURE (ALWAYS SHOW IF WITHIN HOURS)
	======================= */
	const calendarGrid = document.querySelector(".calendar-grid");
	const nowBar = document.querySelector(".calendar-now");

	if (calendarGrid && nowBar) {
		const START_HOUR = 10;
		const END_HOUR = 18;

		function getGridHeight() {
			const styles = getComputedStyle(calendarGrid);
			const rowSize = parseFloat(styles.getPropertyValue("--calendar-row")) || 56;
			const rowCount = parseFloat(styles.getPropertyValue("--calendar-rows")) || 9;
			return rowSize * rowCount;
		}

		function updateNowBar() {
			const now = new Date();

			const current = now.getHours() + now.getMinutes() / 60;

			const clamped = Math.min(Math.max(current, START_HOUR), END_HOUR);
			nowBar.style.display = "block";

			const ratio = (clamped - START_HOUR) / (END_HOUR - START_HOUR);
			const height = calendarGrid.clientHeight || getGridHeight();
			nowBar.style.top = `${ratio * height}px`;
		}

		updateNowBar();
		setInterval(updateNowBar, 60000);
	}

	/* ======================
		 FAQ – CLICK ANYWHERE ON CARD
	======================= */
	document.querySelectorAll(".faq-list details").forEach((details) => {
		details.addEventListener("click", (e) => {
			if (e.target.closest("a")) return;
			if (e.target.closest("summary")) return;
			details.open = !details.open;
		});
	});
});

/* ======================
	 MAPS BUTTON AUTO
====================== */
(() => {
	const apple = document.querySelector(".map-btn--apple");
	const google = document.querySelector(".map-btn--gmaps");
	if (!apple || !google) return;

	if (/iPhone|iPad|Mac/.test(navigator.userAgent)) apple.classList.add("primary-map");
	else google.classList.add("primary-map");
})();
