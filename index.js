// Tab functionality
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    for(tablink of tablinks) {
        tablink.classList.remove("active-link");
        tablink.setAttribute('aria-selected', 'false');
    }
    for(tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    event.currentTarget.setAttribute('aria-selected', 'true');
    document.getElementById(tabname).classList.add("active-tab");
}

// Mobile menu functionality
function openmenu() {
    const sidemenu = document.querySelector('.sidemenu');
    sidemenu.style.right = "0";
    sidemenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
}

function closemenu() {
    const sidemenu = document.querySelector('.sidemenu');
    sidemenu.style.right = "-280px";
    sidemenu.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Contact form submission with validation
const scriptURL = 'https://script.google.com/macros/s/AKfycbw3OYjHoEg7HOfiVjF3Sk4qqjf9YvrYZ-J_8DfxetqakBcE-rBs3amuRH_VfYTJYRHpPQ/exec';
const form = document.forms['submit-to-google-sheet'];

// Form validation functions
function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
    }
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

if (form) {
    // Real-time validation
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');

    if (nameField) {
        nameField.addEventListener('blur', function() {
            if (!validateName(this.value)) {
                showFieldError('name', 'Name must be at least 2 characters long');
            } else {
                clearFieldError('name');
            }
        });
    }

    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (!validateEmail(this.value)) {
                showFieldError('email', 'Please enter a valid email address');
            } else {
                clearFieldError('email');
            }
        });
    }

    if (messageField) {
        messageField.addEventListener('blur', function() {
            if (!validateMessage(this.value)) {
                showFieldError('message', 'Message must be at least 10 characters long');
            } else {
                clearFieldError('message');
            }
        });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Clear previous errors
        clearFieldError('name');
        clearFieldError('email');
        clearFieldError('message');
        
        // Validate all fields
        const name = nameField ? nameField.value : '';
        const email = emailField ? emailField.value : '';
        const message = messageField ? messageField.value : '';
        
        let isValid = true;
        
        if (!validateName(name)) {
            showFieldError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        if (!validateEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!validateMessage(message)) {
            showFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        if (!isValid) {
            showMessage('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                console.log('Success!', response);
                showMessage('Message sent successfully! Thank you for reaching out.', 'success');
                form.reset();
                // Clear any remaining error messages
                clearFieldError('name');
                clearFieldError('email');
                clearFieldError('message');
            })
            .catch(error => {
                console.error('Error!', error.message);
                showMessage('Failed to send message. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Show message function
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ${type === 'success' ? 'background: linear-gradient(45deg, #4CAF50, #45a049);' : 'background: linear-gradient(45deg, #f44336, #da190b);'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                closemenu();
            }
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for children
                const children = entry.target.querySelectorAll('.service-card, .work, .tab-contents ul li');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('#about, #services, #portfolio, #contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add animation to service cards and work items
    const animatedElements = document.querySelectorAll('.service-card, .work, .tab-contents ul li');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Typing effect for header text
    const headerTitle = document.querySelector('.header-text h1');
    if (headerTitle) {
        const text = headerTitle.innerHTML;
        headerTitle.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                headerTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 2000);
    }

    // Add hover effects to navigation items
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const sidemenu = document.querySelector('.sidemenu');
        const menuButton = document.querySelector('.fa-bars');
        
        if (sidemenu && sidemenu.classList.contains('active') && 
            !sidemenu.contains(e.target) && !menuButton.contains(e.target)) {
            closemenu();
        }
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidemenu = document.querySelector('.sidemenu');
            if (sidemenu && sidemenu.classList.contains('active')) {
                closemenu();
            }
        }
    });

    // Parallax effect for header background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.getElementById('header');
        if (header) {
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity to 0 for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    /* Smooth transitions for all interactive elements */
    a, button, .tab-links, .service-card, .work {
        transition: all 0.3s ease;
    }
    
    /* Focus styles for accessibility */
    a:focus, button:focus, input:focus, textarea:focus {
        outline: 2px solid #ff004f;
        outline-offset: 2px;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #1a1a1a;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #ff004f, #ff3366);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(45deg, #ff3366, #ff004f);
    }
`;
document.head.appendChild(style);

