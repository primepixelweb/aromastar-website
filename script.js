// ==========================================
// 1. SCROLLYTELLING CANVAS (BULLETPROOF .WEBP VERSION)
// ==========================================
const canvas = document.getElementById("scrolly-video");
const ctx = canvas.getContext("2d");

const frameCount = 240; 
const images = [];

const currentFrame = (index) => {
    const paddedIndex = index.toString().padStart(6, '0');
    return `frames/frame_${paddedIndex}.webp`;
};

let loadedCount = 0;

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
            resizeCanvas();
        }
    };
    images.push(img);
}

function render(index) {
    if (!images[index] || !images[index].complete || images[index].naturalWidth === 0) {
        for(let i = 0; i < frameCount; i++) {
            if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
                index = i;
                break;
            }
        }
    }
    
    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    
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
window.addEventListener('load', resizeCanvas);

let currentIndex = 0;

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

// ==========================================
// 5. FAQ ACCORDION FUNCTIONALITY
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = 0;
            }
        });

        item.classList.toggle('active');
        const answer = item.querySelector('.faq-answer');
        
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = 0;
        }
    });
});

// ==========================================
// 6. MEDIUM API BLOG FETCHER & READING MODAL
// ==========================================
const mediumUserName = '@aromastar25'; 

const rssUrl = `https://medium.com/feed/${mediumUserName}`;
const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

const blogContainer = document.getElementById('medium-blogs-container');
const blogModal = document.getElementById('blog-modal');
const blogModalBody = document.getElementById('blog-modal-body');
const closeModal = document.querySelector('.close-modal');

if(blogContainer) {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok' && data.items.length > 0) {
                blogContainer.innerHTML = ''; 
                const posts = data.items.slice(0, 3); 
                
                posts.forEach(post => {
                    const card = document.createElement('div');
                    card.className = 'blog-card';
                    
                    let imageUrl = post.thumbnail;
                    if(!imageUrl) {
                        const imgRegex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
                        const match = imgRegex.exec(post.content);
                        imageUrl = match ? match[1] : 'logo.png'; 
                    }

                    const date = new Date(post.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = post.content;
                    const textContent = tempDiv.textContent || tempDiv.innerText || "";
                    const excerpt = textContent.substring(0, 100) + '...';

                    card.innerHTML = `
                        <div class="blog-image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
                        <div class="blog-content">
                            <span class="blog-date">${date}</span>
                            <h3 class="blog-title">${post.title}</h3>
                            <p class="blog-excerpt">${excerpt}</p>
                            <a href="#" class="blog-read-more">Read Blog <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    `;
                    
                    card.querySelector('.blog-read-more').addEventListener('click', (e) => {
                        e.preventDefault();
                        openBlogModal(post.title, date, post.content);
                    });

                    blogContainer.appendChild(card);
                });
            } else {
                blogContainer.innerHTML = '<p style="color: var(--text-gray); text-align: center; width: 100%; font-size: 18px;">No blogs published yet. Check back soon!</p>';
            }
        })
        .catch(error => {
            console.error("Error fetching Medium feed:", error);
            blogContainer.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Could not load blogs. Please try again later.</p>';
        });
}

function openBlogModal(title, date, content) {
    if(!blogModalBody) return;
    blogModalBody.innerHTML = `
        <h1 style="color: var(--gold); font-family: 'Playfair Display', serif; margin-bottom: 5px;">${title}</h1>
        <p style="color: var(--text-gray); font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">Published on ${date}</p>
        <div class="modal-article-content">${content}</div>
    `;
    blogModal.style.display = "block";
    document.body.style.overflow = "hidden"; 
}

if(closeModal) {
    closeModal.addEventListener('click', () => {
        blogModal.style.display = "none";
        blogModalBody.innerHTML = '';
        document.body.style.overflow = "auto"; 
    });
}

window.addEventListener('click', (e) => {
    if (e.target == blogModal) {
        blogModal.style.display = "none";
        blogModalBody.innerHTML = '';
        document.body.style.overflow = "auto";
    }
});