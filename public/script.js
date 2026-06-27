// AROMASTAR ELITE SCRIPT

// 1. Scroll Effect for Navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('#navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 2. Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// 3. Form Handling
const contactForm = document.querySelector('#contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Strategic Strategy Received. Our growth directors will contact you within 24 hours.");
        contactForm.reset();
    });
}