document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar glassmorphism effect
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.innerHTML = '<span style="letter-spacing: 5px;">TRANSMITTING...</span>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                btn.innerHTML = '<span>TRANSMISSION RECEIVED</span>';
                btn.style.borderColor = '#e5b85a';
                btn.style.color = '#e5b85a';
                btn.style.background = 'rgba(229,184,90,0.1)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }, 4000);
            }, 1800);
        });
    }

    // 5. Custom Cursor Glow and Dot
    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (cursorGlow && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
                
                // Glow follows slightly behind (handled by CSS transition on left/top)
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        });

        // Expand glow on clickable elements & magnetic buttons
        const clickables = document.querySelectorAll('a, button, .movie-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '600px';
                cursorGlow.style.height = '600px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(217, 154, 44, 0.2) 0%, rgba(255,255,255,0) 70%)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorDot.style.backgroundColor = 'transparent';
                cursorDot.style.border = '1px solid var(--accent)';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '400px';
                cursorGlow.style.height = '400px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(217, 154, 44, 0.15) 0%, rgba(255,255,255,0) 70%)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.backgroundColor = 'var(--accent)';
                cursorDot.style.border = 'none';
                
                // Reset magnetic effect
                if(el.tagName === 'BUTTON' || el.classList.contains('btn-primary')) {
                    el.style.transform = 'translate(0px, 0px)';
                }
            });
            
            // Magnetic effect for buttons
            if(el.tagName === 'BUTTON' || el.classList.contains('btn-primary')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const h = rect.width / 2;
                    const w = rect.height / 2;
                    const x = e.clientX - rect.left - h;
                    const y = e.clientY - rect.top - w;
                    
                    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                });
            }
        });
    }

    // 6. Parallax Effect for Hero
    const heroBg = document.getElementById('hero-bg');
    const heroContent = document.getElementById('hero-content');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            requestAnimationFrame(() => {
                if(heroBg) heroBg.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.4}px)`;
                if(heroContent) heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
            });
        }
    });

    // Hero Mouse Parallax
    const hero = document.getElementById('home');
    if (hero && heroBg) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px shift
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            requestAnimationFrame(() => {
                heroBg.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            });
        });
        
        hero.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                heroBg.style.transform = `translate(-50%, -50%)`;
            });
        });
    }

    // 7. 3D Tilt Effect for Movie Cards
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            // Reset transition for smooth snap back
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseenter', () => {
            // Remove transition while moving to avoid jitter
            card.style.transition = 'none';
        });
    });

    // Gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryLightbox = document.querySelector('.gallery-lightbox');
    const lightboxImage = galleryLightbox ? galleryLightbox.querySelector('img') : null;
    const lightboxNumber = galleryLightbox ? galleryLightbox.querySelector('figcaption span') : null;
    const lightboxTitle = galleryLightbox ? galleryLightbox.querySelector('figcaption strong') : null;
    const lightboxDescription = galleryLightbox ? galleryLightbox.querySelector('figcaption p') : null;
    const lightboxClose = galleryLightbox ? galleryLightbox.querySelector('.lightbox-close') : null;

    function closeGalleryLightbox() {
        if (!galleryLightbox) return;
        galleryLightbox.hidden = true;
        document.body.style.overflow = '';
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!galleryLightbox || !lightboxImage) return;
            lightboxImage.src = item.dataset.image;
            lightboxImage.alt = item.querySelector('img').alt;
            lightboxNumber.textContent = `${item.dataset.number} / 06`;
            lightboxTitle.textContent = item.dataset.title;
            if (lightboxDescription) lightboxDescription.textContent = item.dataset.description || '';
            galleryLightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            lightboxClose.focus();
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeGalleryLightbox);
    if (galleryLightbox) galleryLightbox.addEventListener('click', event => {
        if (event.target === galleryLightbox) closeGalleryLightbox();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeGalleryLightbox();
    });

    // Hero slideshow
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
            filmLabel.querySelector('strong').textContent = slides[currentSlide].dataset.title;
            filmLabel.querySelector('small').textContent = slides[currentSlide].dataset.credit;
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
        if (slides.length > 1 && currentSlide !== 0) sliderTimer = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 8000);
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
