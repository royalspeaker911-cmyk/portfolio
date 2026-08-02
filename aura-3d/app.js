// Aura 3D — HorizonX & Aura.build WebGL Spatial AI Engine

let scene, camera, renderer, controls;
let cardGroup, cards = [], particles;
const mouse = new THREE.Vector2();

// Spatial Node Specs
const nodeSpecs = [
  {
    id: 'engine',
    title: 'WebGL Spatial Engine',
    subtitle: '60 FPS Three.js Canvas & Shaders',
    color: 0xf43f5e,
    icon: '⚡'
  },
  {
    id: 'ai',
    title: 'Gemini AI Sales Agent',
    subtitle: '24/7 Automated Buyer Qualification',
    color: 0xfbbf24,
    icon: '🤖'
  },
  {
    id: 'motion',
    title: 'GSAP Motion System',
    subtitle: 'ScrollTrigger & Camera Storytelling',
    color: 0x38bdf8,
    icon: '✨'
  }
];

// Generate High-Res 3D Card Texture
function createNodeTexture(spec) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, '#130e1a');
  grad.addColorStop(1, '#030305');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Outer Glowing Border
  ctx.strokeStyle = spec.color;
  ctx.lineWidth = 14;
  ctx.strokeRect(16, 16, 480, 736);

  // Large Central Icon
  ctx.font = '120px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spec.icon, 256, 300);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px "Outfit", sans-serif';
  ctx.fillText(spec.title, 256, 460);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(spec.subtitle, 256, 510);

  // Bottom Badge
  ctx.fillStyle = spec.color;
  ctx.fillRect(130, 600, 252, 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.fillText('AURA SPATIAL 3D', 256, 632);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function init3D() {
  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030305);
  scene.fog = new THREE.FogExp2(0x030305, 0.015);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.2, 14);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 25;
  controls.minDistance = 5;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  const goldLight = new THREE.PointLight(0xfbbf24, 3.5, 40);
  goldLight.position.set(12, 15, 12);
  scene.add(goldLight);

  const crimsonLight = new THREE.PointLight(0xf43f5e, 3, 35);
  crimsonLight.position.set(-12, -8, 10);
  scene.add(crimsonLight);

  buildParticles();
  build3DCards();

  window.addEventListener('resize', onWindowResize);
  animate();
}

function buildParticles() {
  const count = 500;
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 50;
    pos[i + 1] = (Math.random() - 0.5) * 35;
    pos[i + 2] = (Math.random() - 0.5) * 35;
  }

  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.12,
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geom, mat);
  scene.add(particles);
}

function build3DCards() {
  cardGroup = new THREE.Group();

  nodeSpecs.forEach((spec, index) => {
    const texture = createNodeTexture(spec);

    const frontMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.12,
      metalness: 0.25,
      emissive: new THREE.Color(spec.color),
      emissiveIntensity: 0.08
    });

    const glassEdgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d0e16,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0
    });

    const mats = [glassEdgeMat, glassEdgeMat, glassEdgeMat, glassEdgeMat, frontMat, glassEdgeMat];
    const geom = new THREE.BoxGeometry(4.4, 6.6, 0.12);
    const card = new THREE.Mesh(geom, mats);

    const angle = (index - 1) * 0.95;
    card.position.set(Math.sin(angle) * 7.5, 0, Math.cos(angle) * 3.5 - 2);
    card.rotation.y = -angle * 0.5;

    card.userData = spec;
    cardGroup.add(card);
    cards.push(card);
  });

  scene.add(cardGroup);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (particles) particles.rotation.y += 0.0006;

  if (cardGroup) {
    cardGroup.rotation.y = Math.sin(Date.now() * 0.0004) * 0.14;
    cards.forEach((card, i) => {
      card.position.y = Math.sin(Date.now() * 0.0012 + i * 1.5) * 0.18;
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// UI & AI Chat Logic
document.addEventListener('DOMContentLoaded', () => {
  init3D();

  const nodeCards = document.querySelectorAll('.node-card');
  nodeCards.forEach(card => {
    card.addEventListener('click', () => {
      nodeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const index = parseInt(card.dataset.node);
      const targetMesh = cards[index];

      if (targetMesh) {
        gsap.to(camera.position, {
          x: targetMesh.position.x,
          y: targetMesh.position.y + 0.3,
          z: targetMesh.position.z + 7.5,
          duration: 1.4,
          ease: "power2.inOut"
        });
      }
    });
  });

  // AI Chat Engine Response Trigger
  const sendBtn = document.getElementById('send-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-msg';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // AI Simulated Reply
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'message ai-msg';
      aiMsg.textContent = "Aura Spatial AI: I can deploy this exact 3D WebGL experience integrated with Gemini AI for your brand. Would you like to schedule a 60-second concept review?";
      chatMessages.appendChild(aiMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
});
