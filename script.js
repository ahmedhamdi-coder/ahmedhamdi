// ==========================================================================
// Dynamic Project Loading
// ==========================================================================
const projectsContainer = document.getElementById('projects-container');

if (projectsContainer && typeof projectsData !== 'undefined') {
    projectsData.forEach(project => {
        // Get appropriate icon for tag
        const getIconClass = (tag) => {
            const t = tag.toLowerCase();
            if(t.includes('react')) return 'devicon-react-original';
            if(t.includes('vue')) return 'devicon-vuejs-plain';
            if(t.includes('next')) return 'devicon-nextjs-plain';
            if(t.includes('tailwind')) return 'devicon-tailwindcss-original';
            if(t.includes('three')) return 'devicon-threejs-original';
            if(t.includes('webgl')) return 'devicon-opengl-plain';
            if(t.includes('framer')) return 'devicon-framer-original';
            if(t.includes('html')) return 'devicon-html5-plain';
            if(t.includes('css')) return 'devicon-css3-plain';
            if(t.includes('js') || t.includes('javascript')) return 'devicon-javascript-plain';
            return 'ph ph-code'; // fallback to phosphor icon
        };

        // Create tags HTML
        const tagsHtml = project.tags.map(tag => `
            <div class="tech-icon" title="${tag}">
                <i class="${getIconClass(tag)}"></i>
            </div>
        `).join('');
        
        // Determine the link for the project card
        const projectLink = project.liveDemo || project.sourceCode || '#';
        const targetAttr = projectLink !== '#' ? 'target="_blank"' : '';

        // Construct the project card HTML
        const projectHtml = `
            <a href="${projectLink}" ${targetAttr} class="project-card fade-up ${project.delayClass}">
                <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.title}" class="project-img">
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.longDescription}</p>
                    <div class="project-tech-stack">
                        ${tagsHtml}
                    </div>
                </div>
            </a>
        `;
        
        // Append to container
        projectsContainer.innerHTML += projectHtml;
    });
}

// ==========================================================================
// Custom Cursor
// ==========================================================================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

// Device check
const isMobile = window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window;

if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate cursor update
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Smooth follower update using requestAnimationFrame
    function updateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.5)`;
            cursor.style.backgroundColor = 'transparent';
            cursor.style.border = '1px solid var(--accent)';
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(1.5)`;
            follower.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
            cursor.style.backgroundColor = 'var(--accent)';
            cursor.style.border = 'none';
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(1)`;
            follower.style.borderColor = 'var(--glass-border)';
        });
    });
} else {
    // Hide cursors completely on mobile
    if(cursor) cursor.style.display = 'none';
    if(follower) follower.style.display = 'none';
}

// ==========================================================================
// Three.js 3D Marble Logo & Particle Background
// ==========================================================================
const canvasContainer = document.getElementById('canvas-container');

// Scene Setup
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 2));
canvasContainer.appendChild(renderer.domElement);

// --- Create Abstract Tech Shape ---
const geometry = new THREE.TorusKnotGeometry(2.2, 0.6, 150, 32);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
});

const marbleLogo = new THREE.Mesh(geometry, material);
// Move it slightly to the right to balance the text on the left (desktop)
marbleLogo.position.x = window.innerWidth > 768 ? 4 : 0;
if (window.innerWidth <= 768) {
    marbleLogo.scale.set(0.6, 0.6, 0.6);
}
scene.add(marbleLogo);

// --- Particle Background ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = isMobile ? 200 : 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30; // Spread across 30 units
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const blueLight = new THREE.PointLight(0x4a90e2, 2);
blueLight.position.set(-5, -5, 2);
scene.add(blueLight);

const purpleLight = new THREE.PointLight(0x9013fe, 2);
purpleLight.position.set(5, -5, 2);
scene.add(purpleLight);


// --- Animation Loop ---
let clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate marble logo
    marbleLogo.rotation.y = elapsedTime * 0.2;
    marbleLogo.rotation.x = elapsedTime * 0.1;
    
    // Float marble logo
    const basePosY = isMobile ? 1.5 : 0;
    marbleLogo.position.y = basePosY + Math.sin(elapsedTime * 0.5) * 0.3;

    // Slowly rotate particles
    particlesMesh.rotation.y = elapsedTime * 0.05;

    // Mouse parallax effect
    if (!isMobile) {
        const parallaxX = (mouseX / window.innerWidth - 0.5) * 2;
        const parallaxY = (mouseY / window.innerHeight - 0.5) * 2;
        
        camera.position.x += (parallaxX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-parallaxY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Adjust logo position based on screen size
    if (window.innerWidth > 768) {
        gsap.to(marbleLogo.position, { x: 4, duration: 1 });
        gsap.to(marbleLogo.scale, { x: 1, y: 1, z: 1, duration: 1 });
    } else {
        gsap.to(marbleLogo.position, { x: 0, duration: 1 });
        gsap.to(marbleLogo.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 1 });
    }
});


// ==========================================================================
// GSAP Animations & Preloader
// ==========================================================================
gsap.registerPlugin(ScrollTrigger);

// Preloader Sequence
const preloaderTl = gsap.timeline({
    onComplete: () => {
        document.body.style.overflowY = 'auto'; // Re-enable scrolling
        animate(); // Start Three.js loop
    }
});

// Initially hide scrolling
document.body.style.overflowY = 'hidden';

// Fake loading progress
preloaderTl.to('.loader-progress::after', {
    width: '100%',
    duration: 1.5,
    ease: 'power2.inOut'
})
.to('.preloader', {
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
        document.querySelector('.preloader').style.display = 'none';
    }
}, "+=0.2")
.fromTo('.navbar', 
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
)
.fromTo('.hero-title .reveal-text',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
    "-=0.5"
)
.fromTo('.hero-subtitle',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    "-=0.5"
)
.fromTo(marbleLogo.scale,
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' },
    "-=1"
)
.fromTo('.scroll-indicator',
    { opacity: 0 },
    { opacity: 1, duration: 1 },
    "-=0.5"
);


// Scroll Animations for sections
const fadeUpElements = document.querySelectorAll('.fade-up');

fadeUpElements.forEach((el) => {
    // Check if it has a delay class
    let delay = 0;
    if(el.classList.contains('delay-1')) delay = 0.1;
    if(el.classList.contains('delay-2')) delay = 0.2;
    if(el.classList.contains('delay-3')) delay = 0.3;

    gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
            y: 0, 
            opacity: 1,
            duration: 0.8,
            delay: delay,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%', // Trigger when top of element hits 85% of viewport
                toggleActions: 'play none none reverse'
            }
        }
    );
});

// Skill Progress Bars Animation
const skillFills = document.querySelectorAll('.skill-progress-fill');

skillFills.forEach(fill => {
    const targetWidth = fill.getAttribute('data-width');
    
    gsap.fromTo(fill,
        { width: '0%' },
        {
            width: targetWidth,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: fill.parentElement.parentElement, // trigger on the skill-item
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );
});

// ==========================================================================
// 3D Tilt Effect for Project Cards (Vanilla JS)
// ==========================================================================
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        // Add a smooth transition back
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            card.style.transition = 'transform var(--transition-slow), border-color var(--transition-fast)';
        }, 500);
    });
});

// ==========================================================================
// Mobile Navigation Toggle
// ==========================================================================
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });
}
