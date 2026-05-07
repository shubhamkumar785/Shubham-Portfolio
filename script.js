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
        const gap = width > 992 ? 40 : 0;
        
        if (width > 992) testimonialVisibleCards = 2;
        else testimonialVisibleCards = 1;

        // Use clientWidth for more precise content area calculation
        const containerWidth = testimonialTrack.parentElement.clientWidth;
        
        testimonialCardWidth = (containerWidth - (testimonialVisibleCards > 1 ? gap : 0)) / testimonialVisibleCards;
        
        testimonialCards.forEach(card => {
            card.style.minWidth = `${testimonialCardWidth}px`;
            card.style.width = `${testimonialCardWidth}px`; // explicitly set width too
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

        const gap = window.innerWidth > 992 ? 40 : 0;
        const offset = testimonialIndex * (testimonialCardWidth + gap);
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

    // Services Auto-Slider (Mobile Only)
    const servicesTrack = document.querySelector('.services-grid');
    const servicesCards = document.querySelectorAll('.service-card');
    let servicesIndex = 0;
    let servicesInterval;

    function startServicesAutoSlider() {
        if (servicesInterval) clearInterval(servicesInterval);
        servicesInterval = setInterval(() => {
            if (window.innerWidth <= 992 && servicesTrack && servicesCards.length > 0) {
                servicesIndex++;
                if (servicesIndex >= servicesCards.length) servicesIndex = 0;
                // Use the first card's width for the most reliable translation step
                const cardWidth = servicesCards[0].offsetWidth;
                servicesTrack.style.transform = `translateX(-${servicesIndex * cardWidth}px)`;
            }
        }, 2000);
    }

    function resetServicesSlider() {
        if (servicesTrack && servicesCards.length > 0) {
            if (window.innerWidth > 992) {
                servicesTrack.style.transform = 'none';
                servicesIndex = 0;
            } else {
                // Re-align if resized but still in mobile/tablet
                const cardWidth = servicesCards[0].offsetWidth;
                servicesTrack.style.transform = `translateX(-${servicesIndex * cardWidth}px)`;
            }
        }
    }

    if (servicesTrack) {
        startServicesAutoSlider();
        
        // Pause on hover
        servicesTrack.addEventListener('mouseenter', () => clearInterval(servicesInterval));
        servicesTrack.addEventListener('mouseleave', () => startServicesAutoSlider());
    }

    // Projects Slider Slider Logic
    const track = document.querySelector('.projects-track');
    const cards = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.pagination-dots');

    let currentSlide = 0;
    const cardsPerView = window.innerWidth > 1100 ? 3 : (window.innerWidth > 992 ? 2 : 1);
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
        const isMobile = window.innerWidth <= 992;
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

    // Auto Scroll Every 2 Seconds
    let autoScrollInterval = setInterval(() => {
        moveToSlide(currentSlide + 1);
    }, 2000);

    const resetAutoScroll = () => {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            moveToSlide(currentSlide + 1);
        }, 2000);
    };

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    track.addEventListener('mouseleave', () => resetAutoScroll());

    // Update on resize
    window.addEventListener('resize', () => {
        resetServicesSlider();
        const newCardsPerView = window.innerWidth > 1100 ? 3 : (window.innerWidth > 992 ? 2 : 1);
        if (newCardsPerView !== cardsPerView) {
            location.reload(); // Simple reload for now as it's safer given the current structural implementation
        } else {
            moveToSlide(currentSlide);
        }
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Change button state
            const submitBtn = contactForm.querySelector('.btn-send');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // Hide previous status
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Destinations
            const scriptURL = 'https://script.google.com/macros/s/AKfycbz-a7wB3BvXrIxdQ6CJg5m5ICfXA6GbQXv0QUtS_REWTp7RhEbe4graXQg6Jo2uMrFw/exec';
            const emailURL = 'https://formsubmit.co/ajax/shubhammpathak566@gmail.com';

            try {
                // Send to both destinations concurrently
                const results = await Promise.allSettled([
                    // 1. Google Sheets (Existing)
                    fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' }),
                    
                    // 2. Email Notification (New)
                    fetch(emailURL, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                ]);

                // Check if any attempt was at least visually successful
                const isSuccessful = results.some(res => 
                    res.status === 'fulfilled' && (res.value.ok || res.value.type === 'opaque')
                );

                if (isSuccessful) {
                    formStatus.innerText = 'Message sent! Check Gmail for activation (first time).';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error('All submission attempts failed');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                formStatus.innerText = 'Error sending message. Please try again or email directly.';
                formStatus.classList.add('error');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                formStatus.style.display = 'block';
                
                // Hide message after 8 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 8000);
            }
        });
    }

    // Reset button functionality
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn && contactForm) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactForm.reset();
            formStatus.style.display = 'none';
        });
    }

    // Chatbot Functionality
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendMsg = document.getElementById('send-msg');
    const optionBtns = document.querySelectorAll('.option-btn');

    const responses = {
        skills: "Shubham specializes in Java, Spring Boot, Microservices, and Cloud Engineering (AWS). He also has a strong foundation in SQL, NoSQL, and System Design.",
        projects: "Some of Shubham's featured projects include CampusSetu (Smart Campus Management), a scalable E-Commerce platform, and an AI Chat Assistant. Check the Projects section for details!",
        contact: "You can reach Shubham at shubhammpathak566@gmail.com or call +91 7858024086. You can also use the form in the Contact section!",
        resume: "You can download Shubham's resume directly from the Hero section or by clicking the 'Download Resume' button in the chat menu.",
        default: "I'm not sure about that, but I can tell you about Shubham's skills, projects, or how to contact him. Choose an option above!"
    };

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            const tooltip = chatbotTrigger.querySelector('.chatbot-tooltip');
            if (tooltip) {
                tooltip.style.display = chatbotWindow.classList.contains('active') ? 'none' : 'block';
            }
        });
    }

    if (closeChatbot) {
        closeChatbot.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            const tooltip = chatbotTrigger.querySelector('.chatbot-tooltip');
            if (tooltip) tooltip.style.display = 'block';
        });
    }

    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            addMessage(btn.innerText, 'user');
            
            setTimeout(() => {
                addMessage(responses[type] || responses.default, 'bot');
            }, 500);
        });
    });

    function handleSend() {
        const text = chatbotInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatbotInput.value = '';
            
            setTimeout(() => {
                const lowerText = text.toLowerCase();
                let foundResponse = false;
                
                for (const key in responses) {
                    if (lowerText.includes(key)) {
                        addMessage(responses[key], 'bot');
                        foundResponse = true;
                        break;
                    }
                }
                
                if (!foundResponse) {
                    addMessage(responses.default, 'bot');
                }
            }, 800);
        }
    }

    if (sendMsg) {
        sendMsg.addEventListener('click', handleSend);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});
