// ================================
// DOM Elements
// ================================
const header = document.querySelector('header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactForm = document.getElementById('contactForm');
const skillLevels = document.querySelectorAll('.skill-level');

// ================================
// Mobile Menu Toggle
// ================================
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    
    // Update ARIA attribute
    const isExpanded = navLinks.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    
    // Animate hamburger menu
    const hamburgers = mobileMenuToggle.querySelectorAll('.hamburger');
    if (isExpanded) {
        hamburgers[0].style.transform = 'rotate(45deg) translateY(10px)';
        hamburgers[1].style.opacity = '0';
        hamburgers[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        hamburgers[0].style.transform = 'none';
        hamburgers[1].style.opacity = '1';
        hamburgers[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger animation
        const hamburgers = mobileMenuToggle.querySelectorAll('.hamburger');
        hamburgers[0].style.transform = 'none';
        hamburgers[1].style.opacity = '1';
        hamburgers[2].style.transform = 'none';
    });
});

// ================================
// Sticky Header on Scroll
// ================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        scrollToTopBtn.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollToTopBtn.classList.remove('visible');
    }
});

// ================================
// Scroll to Top Button
// ================================
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ================================
// Smooth Scroll for Navigation Links
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// Animate Skill Bars on Scroll
// ================================
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillLevel = entry.target;
            const level = skillLevel.getAttribute('data-level');
            skillLevel.style.setProperty('--skill-width', level + '%');
            skillLevel.classList.add('animated');
            skillObserver.unobserve(skillLevel);
        }
    });
}, observerOptions);

skillLevels.forEach(skill => {
    skillObserver.observe(skill);
});

// ================================
// Animate Elements on Scroll
// ================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-category, .hobby-item, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

// Initialize animations
animateOnScroll();

// ================================
// Form Validation and Submission
// ================================
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validateForm = () => {
    let isValid = true;
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        const errorMessage = input.parentElement.querySelector('.error-message');
        
        // Clear previous errors
        input.classList.remove('error');
        errorMessage.textContent = '';
        
        // Check if field is empty
        if (input.value.trim() === '') {
            isValid = false;
            input.classList.add('error');
            errorMessage.textContent = 'This field is required';
        } 
        // Validate email
        else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
        }
        // Validate name (minimum 2 characters)
        else if (input.id === 'name' && input.value.trim().length < 2) {
            isValid = false;
            input.classList.add('error');
            errorMessage.textContent = 'Name must be at least 2 characters';
        }
        // Validate message (minimum 10 characters)
        else if (input.id === 'message' && input.value.trim().length < 10) {
            isValid = false;
            input.classList.add('error');
            errorMessage.textContent = 'Message must be at least 10 characters';
        }
    });
    
    return isValid;
};

// Real-time validation
contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => {
        const errorMessage = input.parentElement.querySelector('.error-message');
        input.classList.remove('error');
        errorMessage.textContent = '';
        
        if (input.value.trim() === '') {
            input.classList.add('error');
            errorMessage.textContent = 'This field is required';
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            input.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
        }
    });
    
    // Clear error on input
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            input.classList.remove('error');
            input.parentElement.querySelector('.error-message').textContent = '';
        }
    });
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show success message
        const successMessage = document.getElementById('formSuccess');
        successMessage.textContent = `Thank you, ${formData.name}! Your message has been sent successfully. I'll get back to you soon.`;
        successMessage.classList.add('show');
        
        // Log form data (in production, you would send this to a server)
        console.log('Form submitted:', formData);
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// ================================
// Current Year in Footer
// ================================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ================================
// Keyboard Navigation Enhancement
// ================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus();
    }
});

// ================================
// Active Navigation Link Highlight
// ================================
const sections = document.querySelectorAll('section[id]');

const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavigation);

// ================================
// Lazy Loading Images
// ================================
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

// ================================
// Typing Effect for Hero Section
// ================================
const typingText = document.querySelector('.hero-content p');
if (typingText) {
    const originalText = typingText.textContent;
    typingText.textContent = '';
    let charIndex = 0;
    
    const typeWriter = () => {
        if (charIndex < originalText.length) {
            typingText.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after page loads
    setTimeout(typeWriter, 1000);
}

// ================================
// Media Controls Enhancement
// ================================
const audioElement = document.querySelector('audio');
const videoElement = document.querySelector('video');

// Pause video when audio plays
if (audioElement && videoElement) {
    audioElement.addEventListener('play', () => {
        videoElement.pause();
    });
    
    videoElement.addEventListener('play', () => {
        audioElement.pause();
    });
}

// ================================
// Parallax Effect for Hero Section
// ================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ================================
// Prevent Form Resubmission on Page Refresh
// ================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ================================
// Console Welcome Message
// ================================
console.log('%c👋 Welcome to my portfolio!', 'font-size: 20px; color: #3498db; font-weight: bold;');
console.log('%cIf you\'re interested in collaboration or have any questions, feel free to reach out!', 'font-size: 14px; color: #2c3e50;');

// ================================
// Initialize on Page Load
// ================================
window.addEventListener('load', () => {
    // Remove loading class if present
    document.body.classList.remove('loading');
    
    // Trigger initial navigation highlight
    highlightNavigation();
    
    // Add animation class to hero elements
    document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2').forEach(el => {
        el.style.animationPlayState = 'running';
    });
});

// ================================
// Handle Browser Back/Forward Navigation
// ================================
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});