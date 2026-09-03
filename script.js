document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const progress = document.querySelector('.scroll-progress');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Throttle scroll handler via rAF so it runs at most once per frame
    let scrollRafPending = false;
    const onScrollChrome = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        }
        scrollRafPending = false;
    };
    window.addEventListener('scroll', () => {
        if (!scrollRafPending) {
            scrollRafPending = true;
            requestAnimationFrame(onScrollChrome);
        }
    }, { passive: true });
    onScrollChrome();

    const revealElements = document.querySelectorAll('.reveal');
    if (reduceMotion) {
        revealElements.forEach(el => el.classList.add('active'));
    } else {
        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach(el => revealOnScroll.observe(el));
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.innerHTML = '<span style="letter-spacing: 5px;">TRANSMITTING...</span>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    btn.innerHTML = '<span>TRANSMISSION RECEIVED</span>';
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
            } catch (error) {
                btn.innerHTML = '<span>TRANSMISSION FAILED</span>';
                btn.style.borderColor = 'var(--red)';
                btn.style.color = 'var(--red)';
                btn.style.background = 'rgba(166,62,43,0.1)';
            }

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.style.background = '';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 4000);
        });
    }

    const intro = document.getElementById('cinema-intro');
    if (intro) {
        const skipIntro = reduceMotion || sessionStorage.getItem('yvf-intro') === '1';
        if (skipIntro) {
            intro.remove();
        } else {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                intro.classList.add('done');
                sessionStorage.setItem('yvf-intro', '1');
                setTimeout(() => {
                    intro.remove();
                    document.body.style.overflow = '';
                }, 1100);
            }, 1600);
        }
    }

    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorDot = document.querySelector('.cursor-dot');
    if (finePointer && cursorGlow && cursorDot) {
        document.body.classList.add('has-cursor');
        let glowX = 0;
        let glowY = 0;
        let dotX = 0;
        let dotY = 0;
        let targetX = 0;
        let targetY = 0;
        let cursorDirty = false;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            dotX = e.clientX;
            dotY = e.clientY;
            cursorDirty = true;
        }, { passive: true });

        const tickCursor = () => {
            if (cursorDirty) {
                // Dot follows instantly — always update when dirty
                const dotScale = cursorDot.dataset.scale || '1';
                cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%)) scale(${dotScale})`;

                // Glow trails with spring easing
                const newGlowX = glowX + (targetX - glowX) * 0.16;
                const newGlowY = glowY + (targetY - glowY) * 0.16;
                glowX = newGlowX;
                glowY = newGlowY;
                cursorGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;

                // Stop dirty writes once glow has settled within 0.1px
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

    const magnetics = document.querySelectorAll('.contact-circle, .round-arrow, .btn-primary');
    if (finePointer && !reduceMotion) {
        magnetics.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    const hero = document.getElementById('home');
    const heroSlides = document.querySelector('.hero-slides');
    if (hero && heroSlides && finePointer && !reduceMotion) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 18;
            const y = (e.clientY / window.innerHeight - 0.5) * 12;
            heroSlides.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
        });
        hero.addEventListener('mouseleave', () => {
            heroSlides.style.transform = '';
        });
        heroSlides.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
    }

    document.querySelectorAll('.project-card').forEach(card => {
        if (!finePointer || reduceMotion) return;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
            const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    const galleryLightbox = document.querySelector('.gallery-lightbox');
    const lightboxImage = galleryLightbox ? galleryLightbox.querySelector('img') : null;
    const lightboxNumber = galleryLightbox ? galleryLightbox.querySelector('figcaption span') : null;
    const lightboxTitle = galleryLightbox ? galleryLightbox.querySelector('figcaption strong') : null;
    const lightboxDescription = galleryLightbox ? galleryLightbox.querySelector('figcaption p') : null;
    const lightboxClose = galleryLightbox ? galleryLightbox.querySelector('.lightbox-close') : null;
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let lightboxIndex = 0;

    function openGalleryItem(index) {
        const item = galleryItems[index];
        if (!galleryLightbox || !lightboxImage || !item) return;
        lightboxIndex = index;
        lightboxImage.src = item.dataset.image;
        lightboxImage.alt = item.querySelector('img').alt;
        if (lightboxNumber) lightboxNumber.textContent = `${item.dataset.number} / ${String(galleryItems.length).padStart(2, '0')}`;
        if (lightboxTitle) lightboxTitle.textContent = item.dataset.title;
        if (lightboxDescription) lightboxDescription.textContent = item.dataset.description || '';
        galleryLightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        if (lightboxClose) lightboxClose.focus();
    }

    function closeGalleryLightbox() {
        if (!galleryLightbox) return;
        galleryLightbox.hidden = true;
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openGalleryItem(index));
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeGalleryLightbox);
    if (galleryLightbox) galleryLightbox.addEventListener('click', event => {
        if (event.target === galleryLightbox) closeGalleryLightbox();
    });
    document.addEventListener('keydown', event => {
        if (galleryLightbox && !galleryLightbox.hidden) {
            if (event.key === 'Escape') closeGalleryLightbox();
            if (event.key === 'ArrowRight') openGalleryItem((lightboxIndex + 1) % galleryItems.length);
            if (event.key === 'ArrowLeft') openGalleryItem((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
        }
    });

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const counter = document.querySelector('.hero-counter');
    const heroSlider = document.querySelector('.hero-backdrop');
    const filmLabel = document.querySelector('.hero-film-label');
    const heroVideo = slides[0] ? slides[0].querySelector('video') : null;
    let currentSlide = 0;
    let sliderTimer;

    function goToSlide(index) {
        if (!slides.length) return;
        const previousVideo = slides[currentSlide].querySelector('video');
        if (previousVideo) {
            previousVideo.pause();
            previousVideo.currentTime = 0;
        }
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        if (filmLabel) {
            const labelStrong = filmLabel.querySelector('strong');
            const labelSmall = filmLabel.querySelector('small');
            if (labelStrong) labelStrong.textContent = slides[currentSlide].dataset.title || '';
            if (labelSmall) labelSmall.textContent = slides[currentSlide].dataset.credit || '';
        }
        if (counter) counter.innerHTML = `0${currentSlide + 1} <i>/ 0${slides.length}</i>`;
        const activeVideo = slides[currentSlide].querySelector('video');
        if (activeVideo) {
            activeVideo.currentTime = 0;
            activeVideo.play().catch(() => {});
        }
    }

    function startSlider() {
        clearInterval(sliderTimer);
        // Only auto-advance when the first slide (logo video) is not active,
        // or when there is no hero video (non-home pages). The 'ended' event
        // on the hero video handles the transition away from slide 0.
        if (slides.length > 1 && (currentSlide !== 0 || !heroVideo)) {
            sliderTimer = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 8000);
        }
    }

    if (heroVideo) heroVideo.addEventListener('ended', () => {
        if (currentSlide === 0) {
            goToSlide(1);
            startSlider();
        }
    });

    dots.forEach((dot, index) => dot.addEventListener('click', () => { goToSlide(index); startSlider(); }));
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
        heroSlider.addEventListener('mouseleave', startSlider);
    }
    startSlider();
});
