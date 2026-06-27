// ==========================================
// 1. APPLE-STYLE SCROLLYTELLING CANVAS VIDEO
// ==========================================
const canvas = document.getElementById("scrolly-video");
const ctx = canvas.getContext("2d");

// We have 240 frames (0 to 239)
const frameCount = 240; 
const images = [];

// Helper function to match your exact file name format and folder
const currentFrame = (index) => {
    // Adds the zeros to the front (e.g., 5 becomes "000005")
    const paddedIndex = index.toString().padStart(6, '0');
    
    // UPDATED: Now looking inside the "public/frames/" folder!
    return `public/frames/frame_${paddedIndex}.png`;
};

// Preload all 240 images into the browser's memory so there is ZERO lag
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Function to make the image cover the whole screen beautifully (Object-Fit: Cover)
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

// Ensure canvas is always the exact size of the user's screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(currentIndex);
}
window.addEventListener('resize', resizeCanvas);

// Draw the very first frame immediately when it loads
images[0].onload = () => {
    resizeCanvas();
};

let currentIndex = 0;

// The magic scroll function
window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    // Calculate how far down the user can possibly scroll
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate the percentage of the scroll (0.0 to 1.0)
    const scrollFraction = scrollTop / maxScrollTop;
    
    // Map that percentage to a frame number (0 to 239)
    currentIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
    
    // requestAnimationFrame makes it buttery smooth
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