// wellcome text
const logo = document.querySelector('.logo');

const lang = ["Hello World", "Hola Mundo", "ハロー・ワールド"];

let i = 0;

setInterval(() => {
    i = (i + 1) % lang.length;
    logo.textContent = lang[i];
}, 2000);



(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----------------------------------------------------------------------
       Mobile navigation
       -------------------------------------------------------------------- */
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-nav');

    const closeNav = () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    const toggleNav = () => {
        const isOpen = header.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', toggleNav);

        primaryNav.addEventListener('click', (event) => {
            if (event.target.closest('a')) closeNav();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && header.classList.contains('nav-open')) {
                closeNav();
                navToggle.focus();
            }
        });

        // Close the mobile panel if the viewport grows back to desktop size.
        window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
            if (event.matches) closeNav();
        });
    }

    /* ----------------------------------------------------------------------
       Header background state on scroll
       -------------------------------------------------------------------- */
    const setHeaderState = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    /* ----------------------------------------------------------------------
       Scrollspy — highlight the nav link for the section in view
       -------------------------------------------------------------------- */
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
    const sections = navLinks
        .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    navLinks.forEach((link) => {
                        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                        link.toggleAttribute('aria-current', isActive);
                        if (isActive) link.setAttribute('aria-current', 'true');
                    });
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );

        sections.forEach((section) => spy.observe(section));
    }

    /* ----------------------------------------------------------------------
       Hero greeting — a small rotating multilingual "hello", paused for
       people who've asked for less motion, and on hover/focus.
       -------------------------------------------------------------------- */
    const greeting = document.getElementById('hero-greeting');
    const greetings = ['Hello', 'Hola', 'Bonjour', 'こんにちは'];

    if (greeting && !prefersReducedMotion) {
        let index = 0;
        let paused = false;

        const rotate = () => {
            if (paused) return;
            index = (index + 1) % greetings.length;
            greeting.textContent = greetings[index];
        };

        const timer = window.setInterval(rotate, 2400);

        greeting.addEventListener('mouseenter', () => { paused = true; });
        greeting.addEventListener('mouseleave', () => { paused = false; });
        greeting.addEventListener('focus', () => { paused = true; });
        greeting.addEventListener('blur', () => { paused = false; });

        // Stop rotating once the hero has scrolled well out of view.
        if ('IntersectionObserver' in window) {
            const heroWatcher = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    paused = !entry.isIntersecting;
                });
            }, { threshold: 0 });
            heroWatcher.observe(document.getElementById('top'));
        }

        window.addEventListener('pagehide', () => window.clearInterval(timer));
    }

    /* ----------------------------------------------------------------------
       Copy email to clipboard
       -------------------------------------------------------------------- */
    const emailButton = document.getElementById('email-copy');
    const emailStatus = document.getElementById('email-copy-status');

    if (emailButton && emailStatus) {
        emailButton.addEventListener('click', async () => {
            const email = emailButton.dataset.email;
            let copied = false;

            try {
                await navigator.clipboard.writeText(email);
                copied = true;
            } catch (err) {
                copied = false;
            }

            emailStatus.textContent = copied ? 'Copied' : 'Copy failed — email me directly';
            emailStatus.classList.add('is-visible');

            window.clearTimeout(emailButton._statusTimer);
            emailButton._statusTimer = window.setTimeout(() => {
                emailStatus.classList.remove('is-visible');
            }, 2200);
        });
    }

    /* ----------------------------------------------------------------------
       Footer year
       -------------------------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();