document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar glassmorphism effect
    const navbar = document.getElementById('navbar');
    
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
    // 8. Horizontal Scroll for Portfolio
    const portfolioSection = document.getElementById('projects');
    const movieGrid = document.getElementById('movie-grid');
    
    if (portfolioSection && movieGrid) {
        window.addEventListener('scroll', () => {
            const sectionTop = portfolioSection.offsetTop;
            const sectionHeight = portfolioSection.offsetHeight;
            const scrollY = window.scrollY;
            
            // Check if we are inside the portfolio section
            if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight - window.innerHeight) {
                // Calculate percentage of scroll within the section
                const scrollPercent = (scrollY - sectionTop) / (sectionHeight - window.innerHeight);
                
                // Calculate max scroll distance (width of grid minus viewport width)
                const maxScroll = movieGrid.scrollWidth - window.innerWidth;
                
                // Apply translation
                movieGrid.style.transform = `translate3d(-${maxScroll * scrollPercent}px, 0, 0)`;
            }
        });
    // 9. Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-controls .dot');
    let currentSlide = 0;
    const slideInterval = 8000; // 8 seconds
    let sliderTimer;

    function goToSlide(index) {
        if (!slides.length) return;
        
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        // Reset animations on text by re-triggering reflow
        const titles = slides[index].querySelectorAll('.word');
        titles.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = null; 
        });

        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        if (!slides.length) return;
        let index = (currentSlide + 1) % slides.length;
        goToSlide(index);
    }

    function startSlider() {
        if(slides.length > 0) {
            sliderTimer = setInterval(nextSlide, slideInterval);
        }
    }
    
    function resetSliderTimer() {
        clearInterval(sliderTimer);
        startSlider();
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetSliderTimer();
            });
        });
        startSlider();
    }
});
