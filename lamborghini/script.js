/* ================================
   LAMBORGHINI — DRAG TO REVEAL
   Clean & Simple — No bugs
   ================================ */

gsap.registerPlugin(ScrollTrigger)

// ── Elements ─────────────────────────────────────────────────
const hero          = document.querySelector('.hero')
const video         = document.getElementById('reveal-video')
const ringFill      = document.getElementById('ringFill')
const ringSvg       = document.querySelector('.ring-svg')
const ringPercent   = document.getElementById('ringPercent')
const dragLabel     = document.getElementById('dragLabel')
const dragTrackFill = document.getElementById('dragTrackFill')
const dragCursor    = document.getElementById('dragCursor')
const nav           = document.getElementById('nav')

// ── Constants ─────────────────────────────────────────────────
const CIRC    = 2 * Math.PI * 44   // 276.46
const MAX_DRAG = () => window.innerWidth * 0.8

// ── State ─────────────────────────────────────────────────────
let isDragging = false
let lastX      = 0
let totalDrag  = 0
let velocity   = 0
let target     = 0     // 0-1
let current    = 0     // 0-1 lerped
let revealed   = false
let ready      = false

// ── Video: preload + wait for ready ──────────────────────────
video.muted   = true
video.preload = 'auto'
video.addEventListener('play', () => video.pause(), { passive: true })

// Show loading state
const overlay = Object.assign(document.createElement('div'), {
  id: 'loadOverlay',
  innerHTML: `
    <div class="lb-bar-wrap"><div class="lb-bar" id="lbBar"></div></div>
    <p class="lb-txt">LOADING</p>
  `
})
overlay.className = 'load-overlay'
hero.appendChild(overlay)

// Add overlay CSS inline (doesn't touch existing CSS file)
const style = document.createElement('style')
style.textContent = `
  .load-overlay{position:absolute;inset:0;z-index:100;background:#0C0805;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;transition:opacity .6s ease}
  .lb-bar-wrap{width:180px;height:2px;background:rgba(255,242,207,.1);border-radius:2px;overflow:hidden}
  .lb-bar{height:100%;width:0%;background:#FF5B32;border-radius:2px;transition:width .15s linear}
  .lb-txt{font:600 10px/1 Inter,sans-serif;letter-spacing:.3em;color:rgba(255,242,207,.35)}
`
document.head.appendChild(style)

function showReady() {
  ready = true
  video.currentTime = 0
  overlay.style.opacity = '0'
  setTimeout(() => overlay.remove(), 700)
}

// Progress during loading
video.addEventListener('progress', () => {
  if (!video.duration) return
  try {
    const buf  = video.buffered
    const pct  = buf.length ? (buf.end(buf.length - 1) / video.duration) * 100 : 0
    const bar  = document.getElementById('lbBar')
    if (bar) bar.style.width = pct + '%'
  } catch(e) {}
}, { passive: true })

video.addEventListener('canplaythrough', showReady, { once: true })
// Fallback: if video loads quickly
setTimeout(() => { if (!ready && video.readyState >= 3) showReady() }, 3000)

// ── Ring init ─────────────────────────────────────────────────
gsap.set(ringSvg, { rotation: -90, transformOrigin: '50% 50%' })

// ── RAF Tick ──────────────────────────────────────────────────
function tick() {

  // Inertia
  if (!isDragging && Math.abs(velocity) > 0.2) {
    velocity  *= 0.88
    totalDrag  = Math.max(0, Math.min(MAX_DRAG(), totalDrag + velocity))
    target     = totalDrag / MAX_DRAG()
  }

  // Lerp
  current += (target - current) * (isDragging ? 0.2 : 0.1)
  const p  = current

  // ── Video seek ───────────────────────────────────────────────
  if (ready && video.readyState >= 2 && video.duration > 0) {
    const want = target * video.duration
    if (Math.abs(video.currentTime - want) > 0.02) {
      video.currentTime = want
    }
  }

  // ── Ring spin ────────────────────────────────────────────────
  gsap.set(ringSvg, { rotation: -90 + p * 360, transformOrigin: '50% 50%' })

  // ── Ring fill ────────────────────────────────────────────────
  ringFill.style.strokeDashoffset = CIRC - p * CIRC

  // ── Percentage (counter-rotate to stay upright) ───────────────
  if (ringPercent) {
    ringPercent.style.transform = `rotate(${90 - p * 360}deg)`
    ringPercent.textContent = Math.round(p * 100) + '%'
  }

  // ── Track ────────────────────────────────────────────────────
  const pct = (p * 100).toFixed(2) + '%'
  dragTrackFill.style.width = pct
  dragCursor.style.left     = pct

  // ── Label ────────────────────────────────────────────────────
  if (p < 0.02) {
    dragLabel.textContent   = 'DRAG TO REVEAL'
    dragLabel.style.opacity = '0.7'
  } else if (p >= 0.98) {
    dragLabel.textContent   = 'FULLY REVEALED'
    dragLabel.style.opacity = '1'
    if (!revealed) {
      revealed = true
      ringFill.style.stroke = '#FFF2CF'
      gsap.to('.drag-ring-wrap', { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 })
    }
  } else {
    dragLabel.textContent   = 'KEEP DRAGGING'
    dragLabel.style.opacity = '0.2'
    if (revealed) { revealed = false; ringFill.style.stroke = '#FF5B32' }
  }

  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)

// ── Mouse ─────────────────────────────────────────────────────
hero.addEventListener('mousedown', e => {
  isDragging = true; lastX = e.clientX; velocity = 0
  hero.classList.add('dragging'); e.preventDefault()
}, { passive: false })

window.addEventListener('mousemove', e => {
  if (!isDragging) return
  const d   = e.clientX - lastX; lastX = e.clientX
  velocity  = d * 0.9
  totalDrag = Math.max(0, Math.min(MAX_DRAG(), totalDrag + d))
  target    = totalDrag / MAX_DRAG()
})

window.addEventListener('mouseup', () => {
  isDragging = false; hero.classList.remove('dragging')
})

// ── Touch ─────────────────────────────────────────────────────
hero.addEventListener('touchstart', e => {
  isDragging = true; lastX = e.touches[0].clientX; velocity = 0
  e.preventDefault()
}, { passive: false })

window.addEventListener('touchmove', e => {
  if (!isDragging) return
  const d   = e.touches[0].clientX - lastX; lastX = e.touches[0].clientX
  velocity  = d * 0.9
  totalDrag = Math.max(0, Math.min(MAX_DRAG(), totalDrag + d))
  target    = totalDrag / MAX_DRAG()
}, { passive: true })

window.addEventListener('touchend', () => { isDragging = false })

// ── Nav ───────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80)
  const ids = ['hero','performance','engineering','configure']
  let cur = 'hero'
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el && window.scrollY >= el.offsetTop - 200) cur = id
  })
  document.querySelectorAll('.nav-link').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur))
}, { passive: true })

// ── Smooth links ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'))
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }) }
  })
)

// ── GSAP Scroll ───────────────────────────────────────────────

gsap.utils.toArray('.section-eyebrow').forEach(el =>
  gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 90%' }, x: -30, opacity: 0, duration: 0.7, ease: 'power3.out' })
)

gsap.utils.toArray('.section-title').forEach(el =>
  gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' })
)

gsap.set('.spec-card', { opacity: 1, y: 0 })
gsap.from('.spec-card', {
  scrollTrigger: { trigger: '.specs-grid', start: 'top 95%', once: true },
  rotateX: 20, y: 50, opacity: 0, duration: 0.8, stagger: 0.08,
  ease: 'power3.out', transformPerspective: 900
})

gsap.to('#wheelDeco', {
  scrollTrigger: { trigger: '.section-performance', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
  rotation: 360, transformOrigin: 'center center', ease: 'none'
})

gsap.fromTo('#wheelDeco', { opacity: 0, scale: 0.75 }, {
  scrollTrigger: { trigger: '.section-performance', start: 'top 78%' },
  opacity: 0.07, scale: 1, duration: 1.2, ease: 'power2.out'
})

gsap.from('.eng-left', {
  scrollTrigger: { trigger: '.eng-layout', start: 'top 80%' },
  x: -60, rotation: -2, opacity: 0, duration: 1, ease: 'power3.out'
})
gsap.from('.eng-right', {
  scrollTrigger: { trigger: '.eng-layout', start: 'top 80%' },
  x: 60, rotation: 2, opacity: 0, duration: 1, ease: 'power3.out'
})

gsap.from('.feature-item', {
  scrollTrigger: { trigger: '.eng-right', start: 'top 82%' },
  y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
})

gsap.from('.eng-body, .btn-outline', {
  scrollTrigger: { trigger: '.eng-body', start: 'top 88%' },
  y: 20, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out'
})

gsap.to('.video-strip-inner video', {
  scrollTrigger: { trigger: '.video-strip', start: 'top bottom', end: 'bottom top', scrub: true },
  yPercent: -12, ease: 'none'
})

gsap.from('.strip-text', {
  scrollTrigger: { trigger: '.video-strip', start: 'top 75%' },
  y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
})

gsap.to('#ctaRing', {
  scrollTrigger: { trigger: '.section-configure', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  rotation: -180, transformOrigin: 'center center', ease: 'none'
})

gsap.from('.cta-title, .cta-body', {
  scrollTrigger: { trigger: '.section-configure', start: 'top 82%' },
  y: 50, opacity: 0, duration: 0.9, stagger: 0.2, ease: 'power3.out'
})

gsap.from('.cta-buttons', {
  scrollTrigger: { trigger: '.cta-buttons', start: 'top 92%' },
  y: 25, opacity: 0, duration: 0.7, ease: 'power2.out'
})

gsap.to('.hero-content', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  y: -80, opacity: 0.2, ease: 'none'
})
gsap.to('.drag-ui', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: '40% top', scrub: true },
  y: -50, opacity: 0, ease: 'none'
})

console.log('🏎️ Lamborghini loaded')
