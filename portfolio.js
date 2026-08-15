// ============================================================
// THARUN PORTFOLIO — JS (Lenis + GSAP ScrollTrigger + Three.js)
// ============================================================

// ── 1. LENIS SMOOTH SCROLL ───────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ── 2. GSAP REGISTER ─────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── 3. THREE.JS HERO CANVAS ──────────────────────────────────
const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

// Geometry — floating particles
const particleCount = 1200;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 12;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

  // Purple/indigo/pink gradient colors
  const rand = Math.random();
  if (rand < 0.33) {
    colors[i * 3] = 0.39; colors[i * 3+1] = 0.40; colors[i * 3+2] = 0.95; // indigo
  } else if (rand < 0.66) {
    colors[i * 3] = 0.66; colors[i * 3+1] = 0.33; colors[i * 3+2] = 0.97; // purple
  } else {
    colors[i * 3] = 0.93; colors[i * 3+1] = 0.29; colors[i * 3+2] = 0.60; // pink
  }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.025,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Mouse parallax
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
const clock = new THREE.Clock();
function animate3D() {
  requestAnimationFrame(animate3D);
  const t = clock.getElapsedTime();
  particles.rotation.y = t * 0.04 + mouseX * 0.5;
  particles.rotation.x = t * 0.02 - mouseY * 0.3;
  renderer.render(scene, camera);
}
animate3D();

// ── 4. HERO ANIMATIONS ───────────────────────────────────────
const heroTl = gsap.timeline({ delay: 0.3 });

heroTl
  .to('#hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
  .to('#hero-title .line span', {
    y: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out'
  }, '-=0.3')
  .to('#hero-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
  .to('#hero-btns', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
  .to('#hero-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

// Fix: wrap each line text for clip animation
document.querySelectorAll('#hero-title .line').forEach(line => {
  const text = line.textContent;
  const isGradient = line.classList.contains('gradient-text');
  const span = document.createElement('span');
  if (isGradient) span.classList.add('gradient-text');
  span.textContent = text;
  line.textContent = '';
  line.appendChild(span);
  line.style.overflow = 'hidden';
  line.style.display = 'block';
  span.style.display = 'block';
  span.style.transform = 'translateY(100%)';
});

// ── 5. SCROLL ANIMATIONS ─────────────────────────────────────

// Service cards
gsap.utils.toArray('.service-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: i * 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
    }
  });
});

// Work cards
gsap.utils.toArray('.work-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    delay: i * 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
    }
  });
});

// Steps
gsap.utils.toArray('.step').forEach((step, i) => {
  gsap.to(step, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    delay: i * 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: step,
      start: 'top 85%',
    }
  });
});

// Section titles
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.from(title, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 85%',
    }
  });
});

// Contact section
gsap.from('.contact-inner', {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#contact',
    start: 'top 80%',
  }
});

// ── 6. NAV SCROLL EFFECT ─────────────────────────────────────
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    const nav = document.getElementById('nav');
    if (self.progress > 0) {
      nav.style.background = 'rgba(6,6,8,0.95)';
    } else {
      nav.style.background = 'rgba(6,6,8,0.7)';
    }
  }
});

// ── 7. SMOOTH ANCHOR LINKS ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.5 });
  });
});

console.log('🔥 Portfolio loaded — Lenis + GSAP + Three.js active');
