(function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        createParticles();
    }

    function createParticles() {
        particles = [];
        const area = canvas.width * canvas.height;
        const count = Math.min(Math.floor(area / 12000), 120);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.8 + 1
            });
        }
    }

    function drawParticles() {
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
        });
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    const opacity = (1 - dist / 140) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }

            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const opacity = (1 - dist / mouse.radius) * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * force * 2;
                    p.y += Math.sin(angle) * force * 2;
                }
            }

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            p.x = Math.max(0, Math.min(canvas.width, p.x));
            p.y = Math.max(0, Math.min(canvas.height, p.y));
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateParticles();
        drawLines();
        drawParticles();
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resizeCanvas();
        animate();
    });

    resizeCanvas();
    animate();
})();

(function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    function handleScroll() {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
})();

(function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('navMenu');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    const links = nav.querySelectorAll('.header__link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (
            nav.classList.contains('active') &&
            !nav.contains(e.target) &&
            !toggle.contains(e.target)
        ) {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
})();

(function initActiveLink() {
    const links = document.querySelectorAll('.header__link');
    const sections = document.querySelectorAll('section[id]');

    function updateActive() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActive);
    updateActive();
})();

(function initSkillsAnimation() {
    const fills = document.querySelectorAll('.skill__fill');
    if (!fills.length) return;

    function animateSkills() {
        fills.forEach(fill => {
            const rect = fill.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight - 50 && !fill.classList.contains('animated')) {
                const percent = fill.getAttribute('data-percent');
                fill.style.width = percent + '%';
                fill.classList.add('animated');
            }
        });
    }

    window.addEventListener('scroll', animateSkills);
    window.addEventListener('load', animateSkills);
    animateSkills();
})();

(function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    function toggleVisible() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleVisible);
    toggleVisible();

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

(function initPortfolioFilter() {
    const filters = document.querySelectorAll('.portfolio__filter');
    const cards = document.querySelectorAll('.portfolio-card');
    if (!filters.length || !cards.length) return;

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.getAttribute('data-filter');

            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
})();

(function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const avatars = document.querySelectorAll('.testimonial-avatar');
    if (!slides.length || !avatars.length) return;

    function showSlide(index) {
        // اسلایدها
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // آواتارها
        avatars.forEach((avatar, i) => {
            avatar.classList.toggle('active', i === index);
        });
    }

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            const index = parseInt(avatar.getAttribute('data-index'), 10);
            showSlide(index);
        });
    });

    let currentIndex = 1; 
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, 6000);
})();

(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        let isValid = true;

        if (name.length < 3) {
            alert('لطفاً نام خود را وارد کنید (حداقل ۳ کاراکتر).');
            isValid = false;
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('لطفاً یک ایمیل معتبر وارد کنید.');
            isValid = false;
        }
        else if (message.length < 10) {
            alert('لطفاً متن پیام خود را وارد کنید (حداقل ۱۰ کاراکتر).');
            isValid = false;
        }

        if (isValid) {
            alert('پیام شما با موفقیت ارسال شد. متشکریم!');
            form.reset();
        }
    });
})();

(function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const backdrop = lightbox ? lightbox.querySelector('.lightbox__backdrop') : null;
    const openers = document.querySelectorAll('.js-open-lightbox');

    if (!lightbox || !openers.length) return;

    let currentIndex = 0;
    const gallery = Array.from(openers).map(opener => ({
        src: opener.getAttribute('data-image'),
        title: opener.getAttribute('data-title') || ''
    }));

    function openLightbox(index) {
        currentIndex = index;
        const item = gallery[currentIndex];

        lightboxImage.src = item.src;
        lightboxImage.alt = item.title;
        lightboxCaption.textContent = item.title;

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navigate(direction) {
        currentIndex = (currentIndex + direction + gallery.length) % gallery.length;
        const item = gallery[currentIndex];

        lightboxImage.style.animation = 'none';
        lightboxImage.offsetHeight; // force reflow
        lightboxImage.style.animation = 'lightboxImageIn 0.5s var(--ease-smooth)';

        setTimeout(() => {
            lightboxImage.src = item.src;
            lightboxImage.alt = item.title;
            lightboxCaption.textContent = item.title;
        }, 120);
    }

    openers.forEach((opener, i) => {
        opener.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(i);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(1);   
        if (e.key === 'ArrowRight') navigate(-1); 
    });
})();