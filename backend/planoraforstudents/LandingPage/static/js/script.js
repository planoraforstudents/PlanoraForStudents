/**
 * =========================================
 * PLANORA FUTURISTIC THEME SCRIPT
 * - Theme Toggling
 * - Scroll Animations & Effects
 * - Interactive Card Tilt
 * - Mobile Navigation
 * =========================================
 */
document.addEventListener('DOMContentLoaded', () => {

    const app = {
        // --- Elements ---
        header: document.querySelector('.header'),
        themeToggle: document.getElementById('theme-toggle'),
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu-wrapper'),
        revealElements: document.querySelectorAll('.animate-reveal'),
        tiltCards: document.querySelectorAll('.card-tilt'),

        // --- Initializer ---
        init() {
            this.setupTheme();
            this.setupScrollEffects();
            this.setupIntersectionObserver();
            this.setupCardTilt();
            this.setupMobileNav();
        },

        // --- Theme Management ---
        setupTheme() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('theme');

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }

            this.themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            });
        },

        // --- Scroll-based Header Style ---
        setupScrollEffects() {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            }, { passive: true });
        },

        // --- Scroll-reveal Animations ---
        setupIntersectionObserver() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.delay) || 0;
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            this.revealElements.forEach(el => observer.observe(el));
        },

        // --- Interactive Card Tilt Effect ---
        setupCardTilt() {
            this.tiltCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 20; // Slower rotation
                    const rotateY = (centerX - x) / 20; // Slower rotation

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

                    const glow = card.querySelector('.card-glow');
                    if (glow) {
                        glow.style.transform = `translate(${x - centerX}px, ${y - centerY}px)`;
                        glow.style.opacity = '0.15';
                    }
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                    const glow = card.querySelector('.card-glow');
                    if (glow) {
                        glow.style.opacity = '0';
                    }
                });
            });
        },

        // --- Mobile Navigation ---
        setupMobileNav() {
            this.navToggle.addEventListener('click', () => {
                this.navToggle.classList.toggle('is-active');
                this.navMenu.classList.toggle('is-active');
                document.body.style.overflow = this.navMenu.classList.contains('is-active') ? 'hidden' : '';
            });

            // Close menu when a link is clicked
            this.navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.navToggle.classList.remove('is-active');
                    this.navMenu.classList.remove('is-active');
                    document.body.style.overflow = '';
                });
            });
        }
    };

    app.init();
});
