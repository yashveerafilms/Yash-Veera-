document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isHomePage   = document.body.classList.contains('home-page');

    // ─────────────────────────────────────────────
    // NAVBAR — mobile toggle + scroll class
    // ─────────────────────────────────────────────
    const navbar     = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksList = document.querySelector('.nav-links');
    const progress   = document.querySelector('.scroll-progress');

    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinksList.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksList.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    let scrollRafPending = false;
    const onScrollFrame = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        }
        scrollRafPending = false;
    };
    window.addEventListener('scroll', () => {
        if (!scrollRafPending) { scrollRafPending = true; requestAnimationFrame(onScrollFrame); }
    }, { passive: true });
    onScrollFrame();

    // ─────────────────────────────────────────────
    // CINEMA INTRO — loading bar + exit
    // ─────────────────────────────────────────────
    const intro = document.getElementById('cinema-intro');
    if (intro) {
        const skipIntro = reduceMotion || sessionStorage.getItem('yvf-intro') === '1';
        if (skipIntro) {
            intro.remove();
            if (isHomePage) triggerHeroCopy();
        } else {
            document.body.style.overflow = 'hidden';
            // Intro exits after 1700ms, then hero copy animates in
            setTimeout(() => {
                intro.classList.add('done');
                sessionStorage.setItem('yvf-intro', '1');
                setTimeout(() => {
                    intro.remove();
                    document.body.style.overflow = '';
                    if (isHomePage) triggerHeroCopy();
                }, 1050);
            }, 1700);
        }
    } else {
        if (isHomePage) triggerHeroCopy();
    }

    // ─────────────────────────────────────────────
    // HERO COPY — staggered line entrance
    // ─────────────────────────────────────────────
    function triggerHeroCopy() {
        if (reduceMotion) return;
        const heroCopy = document.getElementById('hero-copy');
        if (!heroCopy) return;
        // Small delay so the intro wipe has cleared
        setTimeout(() => heroCopy.classList.add('hero-copy-ready'), 120);
    }

    // ─────────────────────────────────────────────
    // SCROLL REVEALS — standard + stagger + scale + film-list
    // ─────────────────────────────────────────────
    const allRevealEls = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-scale, .film-list');

    if (reduceMotion) {
        allRevealEls.forEach(el => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        allRevealEls.forEach(el => revealObserver.observe(el));
    }

    // ─────────────────────────────────────────────
    // COUNTER ANIMATION — 0 → target number
    // ─────────────────────────────────────────────
    const counterEls = document.querySelectorAll('.counter-number');
    if (counterEls.length && !reduceMotion) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                const duration = 1800; // ms
                const startTime = performance.now();

                function easeOutExpo(t) {
                    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                }

                function tick(now) {
                    const elapsed  = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const value    = Math.round(easeOutExpo(progress) * target);
                    el.textContent = value + suffix;
                    if (progress < 1) requestAnimationFrame(tick);
                }

                requestAnimationFrame(tick);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        counterEls.forEach(el => counterObserver.observe(el));
    } else {
        // No animation — just show final value
        counterEls.forEach(el => {
            el.textContent = el.dataset.target + (el.dataset.suffix || '');
        });
    }

    // ─────────────────────────────────────────────
    // PARALLAX — release poster on scroll
    // ─────────────────────────────────────────────
    const releaseFeature = document.querySelector('.release-feature');
    if (releaseFeature && !reduceMotion) {
        let parallaxRafPending = false;
        window.addEventListener('scroll', () => {
            if (parallaxRafPending) return;
            parallaxRafPending = true;
            requestAnimationFrame(() => {
                const rect   = releaseFeature.getBoundingClientRect();
                const center = rect.top + rect.height / 2 - window.innerHeight / 2;
                const img    = releaseFeature.querySelector('img');
                if (img) {
                    // Moves up to ±22px vertically as the section scrolls through view
                    const shift = (center / window.innerHeight) * 22;
                    img.style.transform = `translateY(${shift}px) scale(1.06)`;
                }
                parallaxRafPending = false;
            });
        }, { passive: true });
    }

    // ─────────────────────────────────────────────
    // MANIFESTO SPOTLIGHT — follows mouse on desktop
    // ─────────────────────────────────────────────
    const manifestoSection  = document.querySelector('.manifesto-section');
    const manifestoSpotlight = document.querySelector('.manifesto-spotlight');
    if (manifestoSection && manifestoSpotlight && finePointer && !reduceMotion) {
        manifestoSection.addEventListener('mousemove', (e) => {
            const rect = manifestoSection.getBoundingClientRect();
            const x    = ((e.clientX - rect.left) / rect.width)  * 100;
            const y    = ((e.clientY - rect.top)  / rect.height) * 100;
            manifestoSpotlight.style.background =
                `radial-gradient(ellipse 520px 380px at ${x}% ${y}%, rgba(255,255,255,.14), transparent 70%)`;
        });
        manifestoSection.addEventListener('mouseleave', () => {
            // Drift back to CSS animation
            manifestoSpotlight.style.background = '';
        });
    }

    // ─────────────────────────────────────────────
    // SMOOTH ANCHOR SCROLLING — must register BEFORE page transition
    // ─────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            targetEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    // ─────────────────────────────────────────────
    // PAGE TRANSITION — fade-out wipe on link clicks
    // Only fires for same-origin .html page navigations
    // ─────────────────────────────────────────────
    const pageTransition = document.getElementById('page-transition');
    if (pageTransition && !reduceMotion) {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            // Skip: empty, anchors, mailto, tel, external URLs
            if (!href) return;
            if (href.startsWith('#')) return;
            if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (href.startsWith('http://') || href.startsWith('https://')) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                pageTransition.classList.add('exit');
                setTimeout(() => { window.location.href = href; }, 520);
            });
        });

        // Remove exit class on load so entering pages always start clean
        requestAnimationFrame(() => pageTransition.classList.remove('exit'));
    }

    // ─────────────────────────────────────────────
    // CONTACT FORM
    // ─────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.innerHTML = '<span style="letter-spacing:5px;">TRANSMITTING...</span>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
                const data = await response.json();

                if (data.success) {
                    btn.innerHTML = '<span>TRANSMISSION RECEIVED ✓</span>';
                    btn.style.borderColor = '#e5b85a';
                    btn.style.color = '#e5b85a';
                    btn.style.background = 'rgba(229,184,90,0.1)';
                    contactForm.reset();
                } else {
                    btn.innerHTML = '<span>TRANSMISSION FAILED</span>';
                    btn.style.borderColor = 'var(--red)';
                    btn.style.color = 'var(--red)';
                    btn.style.background = 'rgba(166,62,43,0.1)';
                }
            } catch {
                btn.innerHTML = '<span>TRANSMISSION FAILED</span>';
                btn.style.borderColor = 'var(--red)';
                btn.style.color = 'var(--red)';
                btn.style.background = 'rgba(166,62,43,0.1)';
            }

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.cssText = '';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 4000);
        });
    }

    // ─────────────────────────────────────────────
    // CUSTOM CURSOR
    // ─────────────────────────────────────────────
    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorDot  = document.querySelector('.cursor-dot');
    if (finePointer && cursorGlow && cursorDot) {
        document.body.classList.add('has-cursor');
        let glowX = 0, glowY = 0, dotX = 0, dotY = 0;
        let targetX = 0, targetY = 0;
        let cursorDirty = false;

        document.addEventListener('mousemove', (e) => {
            targetX = dotX = e.clientX;
            targetY = dotY = e.clientY;
            cursorDirty = true;
        }, { passive: true });

        const tickCursor = () => {
            if (cursorDirty) {
                const dotScale = cursorDot.dataset.scale || '1';
                cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%)) scale(${dotScale})`;

                glowX += (targetX - glowX) * 0.16;
                glowY += (targetY - glowY) * 0.16;
                cursorGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;

                if (Math.abs(targetX - glowX) < 0.1 && Math.abs(targetY - glowY) < 0.1) {
                    cursorDirty = false;
                }
            }
            requestAnimationFrame(tickCursor);
        };
        requestAnimationFrame(tickCursor);

        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '420px';
                cursorGlow.style.height = '420px';
                cursorDot.dataset.scale = '1.8';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '280px';
                cursorGlow.style.height = '280px';
                cursorDot.dataset.scale = '1';
            });
        });
    }

    // ─────────────────────────────────────────────
    // MAGNETIC BUTTONS
    // ─────────────────────────────────────────────
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.contact-circle, .round-arrow, .btn-primary').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width  / 2;
                const y = e.clientY - rect.top  - rect.height / 2;
                el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
            });
            el.addEventListener('mouseleave', () => { el.style.transform = ''; });
        });
    }

    // ─────────────────────────────────────────────
    // HERO PARALLAX — mouse-move depth effect
    // ─────────────────────────────────────────────
    const hero = document.getElementById('home');
    const heroSlidesEl = document.querySelector('.hero-slides');
    if (hero && heroSlidesEl && finePointer && !reduceMotion) {
        heroSlidesEl.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth  - 0.5) * 18;
            const y = (e.clientY / window.innerHeight - 0.5) * 12;
            heroSlidesEl.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
        });
        hero.addEventListener('mouseleave', () => { heroSlidesEl.style.transform = ''; });
    }

    // ─────────────────────────────────────────────
    // PROJECT CARD — 3D tilt
    // ─────────────────────────────────────────────
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect    = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -8;
                const rotateY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // ─────────────────────────────────────────────
    // GALLERY LIGHTBOX
    // ─────────────────────────────────────────────
    const galleryLightbox    = document.querySelector('.gallery-lightbox');
    const lightboxImage      = galleryLightbox?.querySelector('img');
    const lightboxNumber     = galleryLightbox?.querySelector('figcaption span');
    const lightboxTitle      = galleryLightbox?.querySelector('figcaption strong');
    const lightboxDescription = galleryLightbox?.querySelector('figcaption p');
    const lightboxClose      = galleryLightbox?.querySelector('.lightbox-close');
    const galleryItems       = Array.from(document.querySelectorAll('.gallery-item'));
    let lightboxIndex = 0;

    function openGalleryItem(index) {
        const item = galleryItems[index];
        if (!galleryLightbox || !lightboxImage || !item) return;
        lightboxIndex = index;
        lightboxImage.src = item.dataset.image;
        lightboxImage.alt = item.querySelector('img').alt;
        if (lightboxNumber)     lightboxNumber.textContent = `${item.dataset.number} / ${String(galleryItems.length).padStart(2,'0')}`;
        if (lightboxTitle)      lightboxTitle.textContent = item.dataset.title;
        if (lightboxDescription) lightboxDescription.textContent = item.dataset.description || '';
        galleryLightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lightboxClose?.focus();
    }

    function closeGalleryLightbox() {
        if (!galleryLightbox) return;
        galleryLightbox.hidden = true;
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, i) => item.addEventListener('click', () => openGalleryItem(i)));
    lightboxClose?.addEventListener('click', closeGalleryLightbox);
    galleryLightbox?.addEventListener('click', e => { if (e.target === galleryLightbox) closeGalleryLightbox(); });
    document.addEventListener('keydown', e => {
        if (galleryLightbox && !galleryLightbox.hidden) {
            if (e.key === 'Escape')      closeGalleryLightbox();
            if (e.key === 'ArrowRight') openGalleryItem((lightboxIndex + 1) % galleryItems.length);
            if (e.key === 'ArrowLeft')  openGalleryItem((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
        }
    });

    // ─────────────────────────────────────────────
    // HERO SLIDER — dots, counter, film label, timer
    // ─────────────────────────────────────────────
    const slides      = document.querySelectorAll('.hero-slide');
    const dots        = document.querySelectorAll('.hero-dot');
    const counter     = document.querySelector('.hero-counter');
    const heroSlider  = document.querySelector('.hero-backdrop');
    const filmLabel   = document.querySelector('.hero-film-label');
    const heroVideo   = slides[0]?.querySelector('video') || null;
    let currentSlide  = 0;
    let sliderTimer;

    function goToSlide(index) {
        if (!slides.length) return;
        // Pause previous video
        slides[currentSlide].querySelector('video')?.pause();
        slides[currentSlide].querySelector('video') && (slides[currentSlide].querySelector('video').currentTime = 0);

        slides[currentSlide].classList.remove('active');
        dots[currentSlide]?.classList.remove('active');

        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide]?.classList.add('active');

        // Update film label
        if (filmLabel) {
            const labelStrong = filmLabel.querySelector('strong');
            const labelSmall  = filmLabel.querySelector('small');
            if (labelStrong) labelStrong.textContent = slides[currentSlide].dataset.title  || '';
            if (labelSmall)  labelSmall.textContent  = slides[currentSlide].dataset.credit || '';
        }

        // Update counter
        if (counter) counter.innerHTML = `0${currentSlide + 1} <i>/ 0${slides.length}</i>`;

        // Play new video if present
        const newVideo = slides[currentSlide].querySelector('video');
        if (newVideo) { newVideo.currentTime = 0; newVideo.play().catch(() => {}); }
    }

    function startSlider() {
        clearInterval(sliderTimer);
        if (slides.length > 1 && (currentSlide !== 0 || !heroVideo)) {
            sliderTimer = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 8000);
        }
    }

    if (heroVideo) {
        heroVideo.addEventListener('ended', () => {
            if (currentSlide === 0) { goToSlide(1); startSlider(); }
        });
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startSlider(); }));

    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
        heroSlider.addEventListener('mouseleave', startSlider);
    }

    startSlider();

    // ─────────────────────────────────────────────
    // FILM ROWS — horizontal slide-in on scroll
    // (handled by .film-list in allRevealEls above,
    //  but we also need each .film-row to be styled —
    //  this is done via CSS; this section is a no-op
    //  placeholder kept for clarity)
    // ─────────────────────────────────────────────

    // ─────────────────────────────────────────────
    // GALLERY HOME GRID — tilt on hover
    // ─────────────────────────────────────────────
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.home-gallery-grid a').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect    = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -5;
                const rotateY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  5;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }
});
