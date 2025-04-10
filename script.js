// Custom Cursor
const cursor = {
    dot: document.querySelector('.cursor-dot'),
    outline: document.querySelector('.cursor-outline'),
    init() {
        document.addEventListener('mousemove', (e) => {
            this.dot.style.left = e.clientX + 'px';
            this.dot.style.top = e.clientY + 'px';

            setTimeout(() => {
                this.outline.style.left = e.clientX + 'px';
                this.outline.style.top = e.clientY + 'px';
            }, 80);
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.outline.style.opacity = '0.5';
            });
            el.addEventListener('mouseleave', () => {
                this.outline.style.transform = 'translate(-50%, -50%) scale(1)';
                this.outline.style.opacity = '1';
            });
        });
    }
};

class Carousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
        this.dots = Array.from(container.querySelectorAll('.carousel-dot'));
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.currentIndex = 0;
        this.autoScrollInterval = null;

        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            this.pauseAutoScroll();
        });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
            this.startAutoScroll();
        });

        // Pause on mouse hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoScroll());
        this.container.addEventListener('mouseleave', () => this.startAutoScroll());

        // Pause on tab inactive
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.pauseAutoScroll();
            else this.startAutoScroll();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        this.startAutoScroll();
    }

    goToSlide(index) {
        this.currentIndex = (index + this.slides.length) % this.slides.length;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateDots();
    }

    next() {
        this.goToSlide(this.currentIndex + 1);
    }

    prev() {
        this.goToSlide(this.currentIndex - 1);
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    handleSwipe(startX, endX) {
        if (startX - endX > 50) this.next();
        else if (endX - startX > 50) this.prev();
    }

    startAutoScroll() {
        this.pauseAutoScroll();
        this.autoScrollInterval = setInterval(() => this.next(), 3000);
    }

    pauseAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
}

const themeToggle = {
    toggle: document.getElementById('theme-toggle'),
    init() {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.setTheme(savedTheme);
        this.toggle.checked = savedTheme === 'dark';

        this.toggle.addEventListener('change', () => {
            const theme = this.toggle.checked ? 'dark' : 'light';
            this.setTheme(theme);
            localStorage.setItem('theme', theme);
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        if (theme === 'dark') {
            cursorDot.style.backgroundColor = '#7c3aed';
            cursorOutline.style.borderColor = '#7c3aed';
        } else {
            cursorDot.style.backgroundColor = '#4f46e5';
            cursorOutline.style.borderColor = '#4f46e5';
        }
    }
};

const mobileMenu = {
    btn: document.querySelector('.mobile-menu-btn'),
    menu: document.querySelector('.mobile-menu'),
    links: document.querySelectorAll('.mobile-link'),
    init() {
        this.btn.addEventListener('click', () => this.toggle());
        this.links.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    },
    toggle() {
        this.menu.classList.toggle('active');
        this.btn.classList.toggle('active');

        const spans = this.btn.querySelectorAll('span');
        if (this.menu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    },
    close() {
        this.menu.classList.remove('active');
        this.btn.classList.remove('active');
        const spans = this.btn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
};

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll > lastScroll) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    } else {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    }

    lastScroll = currentScroll;
});

const parallax = {
    elements: document.querySelectorAll('.parallax'),
    init() {
        window.addEventListener('scroll', () => {
            this.elements.forEach(el => {
                const speed = 0.5;
                const rect = el.getBoundingClientRect();
                const visible = rect.top < window.innerHeight && rect.bottom > 0;

                if (visible) {
                    const yPos = -(rect.top * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }
};

const skillsCanvas = {
    canvas: document.getElementById('skillsCanvas'),
    ctx: null,
    particles: [],
    init() {
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    },
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    },
    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5
            });
        }
    },
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(79, 70, 229, 0.1)';
            this.ctx.fill();
        });

        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(79, 70, 229, ${0.2 - dist / 500})`;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
};

function msg_submit() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const msg = document.getElementById('message').value;

    const emailSubject = "Your website viewer";
    const emailBody = `Name: ${name}\nEmail: ${email}\nMessage: ${msg}`;
    window.location.href = `mailto:yabinjoel2003@gmail.com?subject=${emailSubject}&body=${emailBody}`;
}

function openWhatsApp() {
    const message = `Hi! Yabin`;
    const phoneNumber = "919342901190";
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(whatsappURL, "_blank");
}

const scroll = {
    init() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - sectionHeight / 3) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
};

document.getElementById('currentYear').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    cursor.init();
    mobileMenu.init();
    skillsCanvas.init();
    scroll.init();
    themeToggle.init();

    const carousels = document.querySelectorAll('.works-carousel');
    carousels.forEach(carousel => new Carousel(carousel));
});