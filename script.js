// ==========================================
// 1. SCROLLYTELLING CANVAS (PNG FRAMES - STARTS AT 000000)
// ==========================================
const canvas = document.getElementById("scrolly-video");
const ctx = canvas.getContext("2d");

// 000000 to 000239 equals exactly 240 frames
const frameCount = 240; 
const images = [];

// Helper function to match the PNG frame names
const currentFrame = (index) => {
    // No +1 needed because your new files start at 0!
    const paddedIndex = index.toString().padStart(6, '0');
    return `frames/frame_${paddedIndex}.png`;
};

// Preload all 240 images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

function render(index) {
    if (!images[index] || !images[index].complete) return;
    
    const img = images[index];
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(currentIndex);
}
window.addEventListener('resize', resizeCanvas);

let currentIndex = 0;

// Draw the first frame immediately when it loads
images[0].onload = resizeCanvas;
if (images[0].complete) {
    resizeCanvas();
}

// The magic scroll function
window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    
    let scrollFraction = scrollTop / maxScrollTop;
    if (scrollFraction < 0) scrollFraction = 0;
    if (scrollFraction > 1) scrollFraction = 1;
    
    currentIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
    
    requestAnimationFrame(() => render(currentIndex));
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