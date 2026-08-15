// ============================================================
// THARUN PORTFOLIO v2 — ALL EFFECTS
// ✅ Bug Fix: hero text wrap runs BEFORE GSAP
// ✅ Smooth Loader
// ✅ Custom Cursor
// ✅ 3D Card Tilt
// ✅ Magnetic Buttons
// ✅ Parallax Hero
// ✅ Lenis + GSAP ScrollTrigger + Three.js
// ============================================================

// ── 1. WRAP HERO TITLE TEXT IN SPANS (must be FIRST) ─────────
document.querySelectorAll('#hero-title .line').forEach(line => {
  const isGradient = line.classList.contains('gradient-text');
  const text = line.textContent.trim();
  const span = document.createElement('span');
  if (isGradient) {
    span.style.background = 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)';
    span.style.webkitBackgroundClip = 'text';
    span.style.webkitTextFillColor = 'transparent';
    span.style.backgroundClip = 'text';
    line.classList.remove('gradient-text');
  }
  span.textContent = text;
  span.style.display = 'block';
  span.style.transform = 'translateY(105%)';
  line.textContent = '';
  line.style.overflow = 'hidden';
  line.style.display = 'block';
  line.appendChild(span);
});

// ── 2. SMOOTH LOADER ─────────────────────────────────────────
const loaderBar = document.getElementById('loader-bar');
const loaderPct = document.getElementById('loader-pct');
const loader = document.getElementById('loader');

let progress = 0;
const loaderInterval = setInterval(() => {
  progress += Math.random() * 15;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderInterval);
    loaderBar.style.width = '100%';
    loaderPct.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      startAnimations(); // trigger hero animations after loader
    }, 400);
  }
  loaderBar.style.width = progress + '%';
  loaderPct.textContent = Math.floor(progress) + '%';
}, 80);

// ── 3. LENIS SMOOTH SCROLL ───────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ── 4. GSAP REGISTER ─────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── 5. THREE.JS PARTICLE CANVAS ──────────────────────────────
const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

const particleCount = 1400;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 14;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  const rand = Math.random();
  if (rand < 0.33) { colors[i*3]=0.39; colors[i*3+1]=0.40; colors[i*3+2]=0.95; }
  else if (rand < 0.66) { colors[i*3]=0.66; colors[i*3+1]=0.33; colors[i*3+2]=0.97; }
  else { colors[i*3]=0.93; colors[i*3+1]=0.29; colors[i*3+2]=0.60; }
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const material = new THREE.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: 0.9 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
});
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
const clock = new THREE.Clock();
function animate3D() {
  requestAnimationFrame(animate3D);
  const t = clock.getElapsedTime();
  particles.rotation.y = t * 0.035 + mouseX * 0.5;
  particles.rotation.x = t * 0.018 - mouseY * 0.3;
  renderer.render(scene, camera);
}
animate3D();

// ── 6. CUSTOM CURSOR ─────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => { cursorX = e.clientX; cursorY = e.clientY; });

function animateCursor() {
  // Dot follows instantly
  dotX += (cursorX - dotX) * 0.9;
  dotY += (cursorY - dotY) * 0.9;
  dot.style.left = dotX + 'px';
  dot.style.top = dotY + 'px';
  // Ring follows with lag
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor expand on hover
document.querySelectorAll('a, button, .service-card, .work-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '60px';
    ring.style.height = '60px';
    ring.style.borderColor = 'rgba(99,102,241,0.8)';
    dot.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(99,102,241,0.5)';
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ── 7. HERO ANIMATIONS (runs after loader) ────────────────────
function startAnimations() {
  const heroTl = gsap.timeline();
  heroTl
    .to('#hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    .to('#hero-title .line span', { y: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.2')
    .to('#hero-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .to('#hero-btns', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .to('#hero-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

  // Scroll animations
  initScrollAnimations();
}

// ── 8. SCROLL ANIMATIONS ─────────────────────────────────────
function initScrollAnimations() {
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.to(card, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.to(card, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('.step').forEach((step, i) => {
    gsap.to(step, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: title, start: 'top 85%' }
    });
  });
  gsap.from('.contact-inner', { opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 80%' }
  });
}

// ── 9. 3D CARD TILT ──────────────────────────────────────────
document.querySelectorAll('.service-card, .work-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform 0.5s ease';
  });
});

// ── 10. MAGNETIC BUTTONS ─────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s ease';
  });
});

// ── 11. PARALLAX HERO ────────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - scrollY / 600;
  }
});

// ── 12. NAV SCROLL EFFECT ────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 80) {
    nav.style.background = 'rgba(6,6,8,0.95)';
    nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
  } else {
    nav.style.background = 'rgba(6,6,8,0.7)';
  }
});

// ── 13. SMOOTH ANCHOR LINKS ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.5 });
  });
});

console.log('🔥 Portfolio v2 — All effects loaded!');
