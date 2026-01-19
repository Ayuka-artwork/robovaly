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
		 MAPS LINK (APPLE / GOOGLE)
	======================= */
	(() => {
		const directionsBtn = document.querySelector(".js-directions");
		if (!directionsBtn) return;

		const appleUrl = directionsBtn.getAttribute("data-apple");
		const googleUrl = directionsBtn.getAttribute("data-google") || directionsBtn.getAttribute("href");
		if (!appleUrl || !googleUrl) return;

		const ua = navigator.userAgent || "";
		const isApple = /iPad|iPhone|iPod|Macintosh/.test(ua);
		const isAndroid = /Android/.test(ua);
		const targetUrl = (!isAndroid && isApple) ? appleUrl : googleUrl;

		directionsBtn.setAttribute("href", targetUrl);
	})();

	/* ======================
		 MAP LIGHTBOX
	======================= */
	(() => {
		const trigger = document.querySelector(".map-zoom-trigger");
		const lightbox = document.querySelector(".map-lightbox");
		const closeBtn = document.querySelector(".map-lightbox-close");
		const viewport = document.querySelector(".map-lightbox-viewport");
		const mapImg = viewport?.querySelector("img");
		const zoomBtns = Array.from(document.querySelectorAll(".map-zoom-btn"));

		if (!trigger || !lightbox || !closeBtn || !viewport || !mapImg) return;

		mapImg.setAttribute("draggable", "false");

		let scale = 1;
		let minScale = 1;
		let translateX = 0;
		let translateY = 0;
		let isDragging = false;
		let startX = 0;
		let startY = 0;
		const mobileMq = window.matchMedia("(max-width: 600px)");

		function applyTransform() {
			mapImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
		}

		function getCoverScale() {
			const rect = viewport.getBoundingClientRect();
			const imgW = mapImg.naturalWidth || rect.width || 1;
			const imgH = mapImg.naturalHeight || rect.height || 1;
			return Math.max(rect.width / imgW, rect.height / imgH);
		}

		function setMinScaleForViewport() {
			if (mobileMq.matches) {
				minScale = getCoverScale() * 0.5;
			} else {
				minScale = 1;
			}
		}

		function resetTransform() {
			scale = minScale;
			translateX = 0;
			translateY = 0;
			applyTransform();
		}

		function openMap() {
			lightbox.classList.add("open");
			lightbox.setAttribute("aria-hidden", "false");
			document.body.classList.add("map-lightbox-open");
			setMinScaleForViewport();
			resetTransform();
		}

		function closeMap() {
			lightbox.classList.remove("open");
			lightbox.setAttribute("aria-hidden", "true");
			document.body.classList.remove("map-lightbox-open");
		}

		trigger.addEventListener("click", (e) => {
			e.preventDefault();
			openMap();
		});

		closeBtn.addEventListener("click", closeMap);

		lightbox.addEventListener("click", (e) => {
			if (e.target === lightbox) closeMap();
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") closeMap();
		});

		zoomBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				const action = btn.getAttribute("data-zoom");
				if (action === "in") scale = Math.min(4, scale + 0.25);
				if (action === "out") scale = Math.max(minScale, scale - 0.25);
				if (action === "reset") resetTransform();
				applyTransform();
			});
		});

		viewport.addEventListener("pointerdown", (e) => {
			if (scale <= 1) return;
			isDragging = true;
			startX = e.clientX - translateX;
			startY = e.clientY - translateY;
			viewport.setPointerCapture(e.pointerId);
			e.preventDefault();
		});

		viewport.addEventListener("pointermove", (e) => {
			if (!isDragging) return;
			translateX = e.clientX - startX;
			translateY = e.clientY - startY;
			applyTransform();
			e.preventDefault();
		});

		viewport.addEventListener("pointerup", () => {
			isDragging = false;
		});

		viewport.addEventListener("pointercancel", () => {
			isDragging = false;
		});

		viewport.addEventListener("touchstart", (e) => {
			if (scale <= 1) return;
			const touch = e.touches[0];
			if (!touch) return;
			isDragging = true;
			startX = touch.clientX - translateX;
			startY = touch.clientY - translateY;
			e.preventDefault();
		}, { passive: false });

		viewport.addEventListener("touchmove", (e) => {
			if (!isDragging) return;
			const touch = e.touches[0];
			if (!touch) return;
			translateX = touch.clientX - startX;
			translateY = touch.clientY - startY;
			applyTransform();
			e.preventDefault();
		}, { passive: false });

		viewport.addEventListener("touchend", () => {
			isDragging = false;
		});

		mapImg.addEventListener("load", () => {
			setMinScaleForViewport();
			resetTransform();
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
			let pointerId = null;
			let hasHorizontalDrag = false;

			const SWIPE_THRESHOLD = 60;
			const CANCEL_SCROLL_THRESHOLD = 8;

			function resetSwipePosition(animate = true) {
				setTransition(animate);
				indexTrack = startIndex;
				translate();
				updateDots();
				isAnimating = false;
			}

			windowEl.addEventListener("pointerdown", (e) => {
				disableAutoplayForever();
				down = true;
				pointerId = e.pointerId;
				hasHorizontalDrag = false;

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

				if (!hasHorizontalDrag && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > CANCEL_SCROLL_THRESHOLD) {
					down = false;
					windowEl.releasePointerCapture?.(pointerId);
					pointerId = null;
					resetSwipePosition(true);
					return;
				}

				if (Math.abs(dx) > Math.abs(dy)) hasHorizontalDrag = true;

				deltaX = dx;

				const w = windowEl.getBoundingClientRect().width || 1;
				const dragPercent = (dx / w) * 100;

				track.style.transform = `translateX(${-(startIndex * 100) + dragPercent}%)`;

				updateDotsFromTransform();
			});

			windowEl.addEventListener("pointerup", () => {
				if (!down) return;
				down = false;
				windowEl.releasePointerCapture?.(pointerId);
				pointerId = null;

				setTransition(true);

				if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
					goTo(deltaX < 0 ? startIndex + 1 : startIndex - 1);
				} else {
					resetSwipePosition(true);
				}
			});

			windowEl.addEventListener("pointercancel", () => {
				if (!down) return;
				down = false;
				windowEl.releasePointerCapture?.(pointerId);
				pointerId = null;
				resetSwipePosition(true);
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
		 PROGRAMME – ACCORDÉON INLINE
	======================= */
	const programEvents = Array.from(document.querySelectorAll(".calendar-event[data-detail]"));
	const programDetails = Array.from(document.querySelectorAll(".program-detail"));

	if (programEvents.length && programDetails.length) {
		const detailsById = new Map(programDetails.map((detail) => [detail.id, detail]));

		function closeAllDetails() {
			programDetails.forEach((detail) => { detail.open = false; });
			programEvents.forEach((eventEl) => {
				eventEl.classList.remove("is-active");
				eventEl.setAttribute("aria-expanded", "false");
			});
		}

		function openDetailFor(eventEl) {
			const targetId = eventEl.dataset.detail;
			const detail = targetId ? detailsById.get(targetId) : null;
			if (!detail) return;

			const wasOpen = detail.open;
			closeAllDetails();

			if (!wasOpen) {
				detail.open = true;
				eventEl.classList.add("is-active");
				eventEl.setAttribute("aria-expanded", "true");

				const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
				detail.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
			}
		}

		programEvents.forEach((eventEl) => {
			eventEl.setAttribute("role", "button");
			eventEl.setAttribute("tabindex", "0");
			eventEl.setAttribute("aria-controls", eventEl.dataset.detail || "");
			eventEl.setAttribute("aria-expanded", "false");

			eventEl.addEventListener("click", () => openDetailFor(eventEl));
			eventEl.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					openDetailFor(eventEl);
				}
			});
		});

		programDetails.forEach((detail) => {
			detail.addEventListener("click", (e) => {
				if (e.target.closest("a")) return;
				if (e.target.closest("summary")) return;
				detail.open = !detail.open;
			});

			detail.addEventListener("toggle", () => {
				if (detail.open) {
					programDetails.forEach((other) => {
						if (other !== detail) other.open = false;
					});
				}

				programEvents.forEach((eventEl) => {
					const isTarget = eventEl.dataset.detail === detail.id && detail.open;
					if (isTarget) eventEl.classList.add("is-active");
					else eventEl.classList.remove("is-active");
					eventEl.setAttribute("aria-expanded", isTarget ? "true" : "false");
				});
			});
		});
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
