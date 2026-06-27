// ==========================================
// 1. SCROLLYTELLING VIDEO (MP4 SCRUBBING)
// ==========================================
const video = document.getElementById("scrolly-video");

// Force the video to load its metadata so we know how long it is
video.load();

// The magic scroll function
window.addEventListener("scroll", () => {
    // Only run if the video is ready and has a duration
    if (video.duration) {
        const scrollTop = document.documentElement.scrollTop;
        const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
        
        // Calculate the percentage of the scroll (0.0 to 1.0)
        let scrollFraction = scrollTop / maxScrollTop;
        
        // Ensure the fraction doesn't go below 0 or above 1
        if (scrollFraction < 0) scrollFraction = 0;
        if (scrollFraction > 1) scrollFraction = 1;
        
        // Use requestAnimationFrame for buttery smooth video scrubbing
        requestAnimationFrame(() => {
            // Set the video time exactly to the scroll percentage
            video.currentTime = scrollFraction * video.duration;
        });
    }
});


// ==========================================
// 2. MOBILE MENU FUNCTIONALITY
// ==========================================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    });
});


// ==========================================
// 3. SCROLL REVEAL ANIMATIONS
// ==========================================
const reveals = document.querySelectorAll(".reveal");
const revealOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px" 
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealObserver.observe(reveal);
});

// ==========================================
// 4. DYNAMIC BACKGROUND COLOR SHIFT
// ==========================================
const sections = document.querySelectorAll("section");
const body = document.querySelector("body");

const sectionOptions = {
    root: null,
    threshold: 0.4, 
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            body.className = '';
            body.classList.add(`theme-${entry.target.id}`);
        }
    });
}, sectionOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});