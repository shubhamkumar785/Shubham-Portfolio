document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Logic
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Theme toggle logic...

    // Terminal typing effect (simpler version)
    const terminalLines = document.querySelectorAll('.terminal-body .line.res');
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.transition = 'opacity 0.5s ease-in';
            line.style.opacity = '1';
        }, (index + 1) * 800);
    });

    // Mouse movement light effect
    const gradientLight = document.querySelector('.gradient-light');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (gradientLight) {
            gradientLight.style.transform = `translate(${x / 50}px, ${y / 50}px)`;
        }
    });

    // FAQ Accordion logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Testimonials Slider Logic
    const testimonialTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialNextBtn = document.querySelector('.next-testimonial');
    const testimonialPrevBtn = document.querySelector('.prev-testimonial');
    const testimonialPagination = document.querySelector('.testimonial-pagination');

    let testimonialIndex = 0;
    let testimonialCardWidth = 0;
    let testimonialVisibleCards = 1;

    function updateTestimonialSliderConfig() {
        if (!testimonialTrack) return;
        const width = window.innerWidth;
        if (width > 992) testimonialVisibleCards = 2; // Increased size, showing 2 cards
        else testimonialVisibleCards = 1;

        testimonialCardWidth = testimonialTrack.parentElement.offsetWidth / testimonialVisibleCards;
        testimonialCards.forEach(card => {
            card.style.minWidth = `${testimonialCardWidth - (testimonialVisibleCards > 1 ? 20 : 0)}px`;
        });

        // Re-align track
        moveTestimonialSlider();
    }

    // Create pagination dots
    function createTestimonialDots() {
        if (!testimonialPagination) return;
        const totalSlides = Math.ceil(testimonialCards.length / testimonialVisibleCards);
        testimonialPagination.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                testimonialIndex = i * testimonialVisibleCards;
                moveTestimonialSlider();
                updateTestimonialDots();
            });
            testimonialPagination.appendChild(dot);
        }
    }

    function moveTestimonialSlider() {
        if (!testimonialTrack) return;
        const totalCards = testimonialCards.length;
        if (testimonialIndex >= totalCards) testimonialIndex = 0;
        if (testimonialIndex < 0) testimonialIndex = totalCards - testimonialVisibleCards;

        const offset = testimonialIndex * (testimonialCardWidth);
        testimonialTrack.style.transform = `translateX(-${offset}px)`;
        updateTestimonialDots();
    }

    function updateTestimonialDots() {
        if (!testimonialPagination) return;
        const dots = testimonialPagination.querySelectorAll('.dot');
        const activeDotIndex = Math.floor(testimonialIndex / testimonialVisibleCards);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    if (testimonialNextBtn && testimonialPrevBtn) {
        testimonialNextBtn.addEventListener('click', () => {
            testimonialIndex += testimonialVisibleCards;
            if (testimonialIndex >= testimonialCards.length) testimonialIndex = 0;
            moveTestimonialSlider();
            resetTestimonialAutoScroll();
        });

        testimonialPrevBtn.addEventListener('click', () => {
            testimonialIndex -= testimonialVisibleCards;
            if (testimonialIndex < 0) testimonialIndex = Math.max(0, testimonialCards.length - testimonialVisibleCards);
            moveTestimonialSlider();
            resetTestimonialAutoScroll();
        });
    }

    // Auto Scroll Every 2 Seconds
    let testimonialAutoScrollInterval = setInterval(() => {
        testimonialIndex += testimonialVisibleCards;
        if (testimonialIndex >= testimonialCards.length) testimonialIndex = 0;
        moveTestimonialSlider();
    }, 2000);

    function resetTestimonialAutoScroll() {
        clearInterval(testimonialAutoScrollInterval);
        testimonialAutoScrollInterval = setInterval(() => {
            testimonialIndex += testimonialVisibleCards;
            if (testimonialIndex >= testimonialCards.length) testimonialIndex = 0;
            moveTestimonialSlider();
        }, 2000);
    }

    // Pause on hover
    if (testimonialTrack) {
        testimonialTrack.addEventListener('mouseenter', () => clearInterval(testimonialAutoScrollInterval));
        testimonialTrack.addEventListener('mouseleave', () => resetTestimonialAutoScroll());
    }

    // Initialize slider
    window.addEventListener('resize', () => {
        updateTestimonialSliderConfig();
        createTestimonialDots();
    });

    if (testimonialTrack) {
        updateTestimonialSliderConfig();
        createTestimonialDots();
    }

    // Projects Slider Slider Logic
    const track = document.querySelector('.projects-track');
    const cards = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.pagination-dots');

    let currentSlide = 0;
    const cardsPerView = window.innerWidth > 1100 ? 3 : (window.innerWidth > 768 ? 2 : 1);
    const maxSlides = Math.ceil(cards.length / cardsPerView);

    // Create pagination dots
    for (let i = 0; i < maxSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsNav.appendChild(dot);
    }

    const dots = Array.from(dotsNav.children);

    const updateDots = (index) => {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    };

    const moveToSlide = (index) => {
        if (index < 0) index = maxSlides - 1;
        if (index >= maxSlides) index = 0;

        currentSlide = index;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const isMobile = window.innerWidth <= 768;
        const gap = isMobile ? 0 : 30; // gap between cards
        const amountToMove = index * (cardWidth * cardsPerView + gap * (cardsPerView > 1 ? cardsPerView - 1 : 0));

        track.style.transform = `translateX(-${amountToMove}px)`;
        updateDots(index);
    };

    nextBtn.addEventListener('click', () => {
        moveToSlide(currentSlide + 1);
        resetAutoScroll();
    });

    prevBtn.addEventListener('click', () => {
        moveToSlide(currentSlide - 1);
        resetAutoScroll();
    });

    // Auto Scroll Every 3 Seconds
    let autoScrollInterval = setInterval(() => {
        moveToSlide(currentSlide + 1);
    }, 3000);

    const resetAutoScroll = () => {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            moveToSlide(currentSlide + 1);
        }, 3000);
    };

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    track.addEventListener('mouseleave', () => resetAutoScroll());

    // Update on resize
    window.addEventListener('resize', () => {
        const newCardsPerView = window.innerWidth > 1100 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (newCardsPerView !== cardsPerView) {
            location.reload(); // Simple reload for now as it's safer given the current structural implementation
        } else {
            moveToSlide(currentSlide);
        }
    });
});
