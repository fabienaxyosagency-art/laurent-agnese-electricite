/* ==========================================================================
   LAURENT AGNESE ÉLECTRICITÉ GÉNÉRALE — INTERACTIONS
   Canvas particules · Scroll reveal · Highlights · Marquee · Form
   ========================================================================== */

(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ========== HEADER + SCROLL PROGRESS ========== */
    const header = document.getElementById('header');
    const progressBar = document.querySelector('.scroll-progress span');
    const SCROLL_THRESHOLD = 60;
    let ticking = false;

    const onScrollCompute = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);

        if (progressBar) {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScrollCompute);
            ticking = true;
        }
    }, { passive: true });

    onScrollCompute();

    /* ========== BURGER MENU ========== */
    const burger = document.querySelector('.burger');
    if (burger) {
        burger.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('nav-open');
            burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ========== NAV PILL — Liquid indicator ========== */
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        const navLinks = mainNav.querySelectorAll('.nav-link');
        let navLeaveTimer = null;

        const movePill = (link) => {
            const rect = link.getBoundingClientRect();
            const navRect = mainNav.getBoundingClientRect();
            const x = rect.left - navRect.left;
            const w = rect.width;

            // Compenser le scale du hover (1.08) pour que le pill reste aligné
            const scaleCompensation = w * 0.04;
            mainNav.style.setProperty('--nav-pill-x', `${x - scaleCompensation}px`);
            mainNav.style.setProperty('--nav-pill-width', `${w + (scaleCompensation * 2)}px`);
            mainNav.style.setProperty('--nav-pill-opacity', '1');
        };

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                clearTimeout(navLeaveTimer);
                movePill(link);
            });

            link.addEventListener('focus', () => movePill(link));
        });

        mainNav.addEventListener('mouseleave', () => {
            navLeaveTimer = setTimeout(() => {
                mainNav.style.setProperty('--nav-pill-opacity', '0');
            }, 80);
        });

        // Pill sur la section active au scroll (indicateur passif)
        const sections = ['services', 'zone', 'avis', 'apropos', 'faq']
            .map(id => document.getElementById(id))
            .filter(Boolean);

        if ('IntersectionObserver' in window && sections.length) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        const id = entry.target.id;
                        const activeLink = mainNav.querySelector(`a[href="#${id}"]`);
                        if (activeLink && !mainNav.matches(':hover')) {
                            navLinks.forEach(l => l.removeAttribute('data-section-active'));
                            activeLink.setAttribute('data-section-active', '');
                        }
                    }
                });
            }, { threshold: [0.3, 0.5, 0.7], rootMargin: '-80px 0px -40% 0px' });

            sections.forEach(s => sectionObserver.observe(s));
        }
    }

    /* ========== REVEAL ON SCROLL ========== */
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    /* ========== HIGHLIGHTS ROTATING ========== */
    const highlightsTrack = document.querySelector('[data-highlights]');
    if (highlightsTrack) {
        const items = highlightsTrack.querySelectorAll('.highlight-item');
        const dots = document.querySelectorAll('.highlights-dot');
        let idx = 0;
        let timer = null;
        const INTERVAL = 3500;

        const show = (i) => {
            items.forEach((el, j) => el.toggleAttribute('data-highlight-active', j === i));
            dots.forEach((d, j) => d.toggleAttribute('data-active', j === i));
            idx = i;
        };

        const next = () => show((idx + 1) % items.length);
        const restart = () => { clearInterval(timer); timer = setInterval(next, INTERVAL); };

        dots.forEach(d => {
            d.addEventListener('click', () => {
                show(parseInt(d.dataset.highlightIndex, 10));
                restart();
            });
        });

        show(0);
        if (dots[0]) dots[0].toggleAttribute('data-active', true);
        if (!prefersReducedMotion) restart();
    }

    /* ========== HERO — PARTICULES ÉLECTRIQUES ========== */
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas && !prefersReducedMotion) {
        const ctx = heroCanvas.getContext('2d');
        let width = 0, height = 0, dpr = window.devicePixelRatio || 1;
        const particles = [];
        const PARTICLE_COUNT = 42;
        const COLORS = ['#1E9FD9', '#2FB5E8', '#E63946', '#F04A56'];

        const resize = () => {
            const rect = heroCanvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            heroCanvas.width = width * dpr;
            heroCanvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        class Particle {
            constructor() { this.reset(true); }
            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -10;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = Math.random() * 0.5 + 0.15;
                this.r = Math.random() * 1.8 + 0.6;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.opacity = Math.random() * 0.4 + 0.15;
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.03 + 0.01;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += this.pulseSpeed;
                if (this.y > height + 10 || this.x < -10 || this.x > width + 10) this.reset();
            }
            draw() {
                const currentOpacity = this.opacity * (0.65 + Math.sin(this.pulse) * 0.35);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color + Math.floor(currentOpacity * 255).toString(16).padStart(2, '0');
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
                gradient.addColorStop(0, this.color + Math.floor(currentOpacity * 80).toString(16).padStart(2, '0'));
                gradient.addColorStop(1, this.color + '00');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        const connect = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i], p2 = particles[j];
                    const dx = p1.x - p2.x, dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        const alpha = ((1 - dist / 110) * 0.12).toFixed(3);
                        ctx.strokeStyle = `rgba(30, 159, 217, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            connect();
            requestAnimationFrame(animate);
        };

        resize();
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
        animate();

        window.addEventListener('resize', () => {
            particles.length = 0;
            resize();
            for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
        }, { passive: true });
    }

    /* ========== MARQUEE DRAG-TO-SCROLL (optionnel sur desktop) ========== */
    const marqueeTrack = document.querySelector('[data-marquee]');
    if (marqueeTrack) {
        let isDown = false, startX = 0, scrollLeft = 0, wrapper = marqueeTrack.parentElement;

        wrapper.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        wrapper.addEventListener('mouseleave', () => {
            if (!isDown) marqueeTrack.style.animationPlayState = 'running';
        });
    }

    /* ========== FORMULAIRE DEVIS ========== */
    const form = document.getElementById('devisForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());

            // Fallback mailto (pas de backend pour le moment)
            const subject = encodeURIComponent(`Demande de devis — ${data.service || 'Projet électrique'}`);
            const body = encodeURIComponent(
                `Bonjour Laurent,\n\n` +
                `Je souhaite obtenir un devis pour un projet.\n\n` +
                `Nom : ${data.name || ''}\n` +
                `Commune : ${data.city || ''}\n` +
                `Téléphone : ${data.phone || ''}\n` +
                `Email : ${data.email || ''}\n` +
                `Service : ${data.service || ''}\n\n` +
                `Détails du projet :\n${data.message || ''}\n\n` +
                `Cordialement.`
            );

            window.location.href = `mailto:elecgenerale.laurentagnese@gmail.com?subject=${subject}&body=${body}`;

            // Feedback UI
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const original = submitBtn.innerHTML;
                submitBtn.innerHTML = '✓ Email ouvert — envoyez pour valider';
                submitBtn.style.background = 'linear-gradient(135deg, #16A34A, #0F8C3E)';
                setTimeout(() => {
                    submitBtn.innerHTML = original;
                    submitBtn.style.background = '';
                }, 4000);
            }
        });
    }

    /* ========== SERVICES — PHOTO DE FOND PAR CATÉGORIE ========== */
    const serviceCards = document.querySelectorAll('.service-mini');
    if (serviceCards.length) {
        const bgMap = [
            { keyword: 'Rénovation',        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80' },
            { keyword: 'Dépannage',         url: 'https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?auto=format&fit=crop&w=900&q=80' },
            { keyword: 'Remise aux normes', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' },
            { keyword: 'Bornes',            url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80' },
            { keyword: 'tableau',           url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80' },
            { keyword: 'électrogène',       url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80' },
            { keyword: 'Luminaires',        url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80' },
        ];

        serviceCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const match = bgMap.find(b => title.includes(b.keyword));
            if (match) {
                card.style.setProperty('--card-bg', `url('${match.url}')`);
            }
        });
    }

    /* ========== LAZY FADE-IN POUR LES IFRAMES (map) ========== */
    const lazyIframes = document.querySelectorAll('iframe[loading="lazy"]');
    lazyIframes.forEach(iframe => {
        iframe.addEventListener('load', () => {
            iframe.style.opacity = '1';
        });
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 600ms ease';
        // Fallback si déjà chargée
        setTimeout(() => { iframe.style.opacity = '1'; }, 2000);
    });

})();
