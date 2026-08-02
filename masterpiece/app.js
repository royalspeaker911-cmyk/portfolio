// AURA VORTEX Masterpiece — 3D Spatial Engine & Web Audio Synth

let scene, camera, renderer, controls;
let crystalMesh, innerMesh, particleSystem, particlePositions;
let pointLightPink, pointLightCyan, pointLightGold;
let audioCtx = null;

const particleCount = 5000;

// Initialize Web Audio API Synth Generator (Zero external MP3 dependency)
function playSynthSound(freq = 440, type = 'sine', duration = 0.15) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context fallback
  }
}

// 1. Initialize 3D World
function init3D() {
  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030308);
  scene.fog = new THREE.FogExp2(0x030308, 0.015);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 14);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 26;
  controls.minDistance = 5;

  // Ambient & Volumetric Point Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  pointLightPink = new THREE.PointLight(0xec4899, 4, 35);
  pointLightPink.position.set(10, 12, 10);
  scene.add(pointLightPink);

  pointLightCyan = new THREE.PointLight(0x06b6d4, 3.5, 35);
  pointLightCyan.position.set(-10, -8, 8);
  scene.add(pointLightCyan);

  pointLightGold = new THREE.PointLight(0xfbbf24, 3, 30);
  pointLightGold.position.set(0, 15, -10);
  scene.add(pointLightGold);

  // Build 3D Prismatic Crystal Core & Particle Swarm
  buildPrismaticCrystal();
  buildParticleSwarm();

  window.addEventListener('resize', onWindowResize);
  animate();
}

// 2. Build 3D Prismatic Crystal Core (High Physical Specular Transmission)
function buildPrismaticCrystal() {
  const crystalGroup = new THREE.Group();

  // Outer Prismatic Icosahedron Glass Mesh
  const outerGeom = new THREE.IcosahedronGeometry(2.8, 0);
  const outerMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    ior: 1.5,
    reflectivity: 0.9
  });

  crystalMesh = new THREE.Mesh(outerGeom, outerMat);
  crystalGroup.add(crystalMesh);

  // Inner Glowing Core Octahedron
  const innerGeom = new THREE.OctahedronGeometry(1.6, 0);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0xec4899,
    emissiveIntensity: 0.6,
    wireframe: true
  });

  innerMesh = new THREE.Mesh(innerGeom, innerMat);
  crystalGroup.add(innerMesh);

  scene.add(crystalGroup);
}

// 3. Build 5,000 Particle Curl Noise Swarm
function buildParticleSwarm() {
  const geom = new THREE.BufferGeometry();
  particlePositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPink = new THREE.Color(0xec4899);
  const colorCyan = new THREE.Color(0x06b6d4);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 4 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i + 2] = radius * Math.cos(phi);

    // Mixed Color Gradient
    const mixed = colorPink.clone().lerp(colorCyan, Math.random());
    colors[i] = mixed.r;
    colors[i + 1] = mixed.g;
    colors[i + 2] = mixed.b;
  }

  geom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(geom, mat);
  scene.add(particleSystem);
}

// 4. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const time = Date.now() * 0.001;

  // Crystal rotations
  if (crystalMesh) {
    crystalMesh.rotation.x = Math.sin(time * 0.3) * 0.4;
    crystalMesh.rotation.y += 0.006;
  }

  if (innerMesh) {
    innerMesh.rotation.x = -Math.cos(time * 0.5) * 0.5;
    innerMesh.rotation.y -= 0.012;
  }

  // Particle swarm orbit
  if (particleSystem) {
    particleSystem.rotation.y = time * 0.05;
    particleSystem.rotation.z = Math.sin(time * 0.03) * 0.1;
  }

  // Volumetric Point Light movement
  if (pointLightPink) {
    pointLightPink.position.x = Math.sin(time * 0.7) * 12;
    pointLightPink.position.y = Math.cos(time * 0.5) * 10;
  }

  if (pointLightCyan) {
    pointLightCyan.position.x = -Math.cos(time * 0.6) * 12;
    pointLightCyan.position.z = Math.sin(time * 0.4) * 10;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// UI Interactions & AI Spatial Agent Logic
document.addEventListener('DOMContentLoaded', () => {
  init3D();

  // Audio Toggle
  const soundBtn = document.getElementById('sound-btn');
  let audioActive = true;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      audioActive = !audioActive;
      soundBtn.innerHTML = audioActive ? '<i class="fa-solid fa-volume-high"></i> AUDIO ON' : '<i class="fa-solid fa-volume-xmark"></i> AUDIO OFF';
      if (audioActive) playSynthSound(587.33, 'sine', 0.2);
    });
  }

  // Camera & Mode Buttons
  const presetBtns = document.querySelectorAll('.btn-preset');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (audioActive) playSynthSound(523.25, 'sine', 0.1);
      const mode = btn.dataset.mode;

      if (mode === 'crystal') {
        gsap.to(camera.position, { x: 0, y: 2, z: 12, duration: 1.5, ease: "power2.inOut" });
      } else if (mode === 'vortex') {
        gsap.to(camera.position, { x: 8, y: 6, z: 16, duration: 1.5, ease: "power2.inOut" });
      } else if (mode === 'lighting') {
        gsap.to(camera.position, { x: -6, y: -2, z: 10, duration: 1.5, ease: "power2.inOut" });
      } else if (mode === 'agent') {
        gsap.to(camera.position, { x: 3, y: 1, z: 8, duration: 1.5, ease: "power2.inOut" });
      }
    });
  });

  // Config Cards (Color Refraction)
  const configCards = document.querySelectorAll('.config-card');
  configCards.forEach(card => {
    card.addEventListener('click', () => {
      configCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (audioActive) playSynthSound(659.25, 'triangle', 0.15);
      const colorHex = card.dataset.color;

      if (innerMesh) {
        gsap.to(innerMesh.material.color, {
          r: new THREE.Color(colorHex).r,
          g: new THREE.Color(colorHex).g,
          b: new THREE.Color(colorHex).b,
          duration: 0.8
        });
        gsap.to(innerMesh.material.emissive, {
          r: new THREE.Color(colorHex).r,
          g: new THREE.Color(colorHex).g,
          b: new THREE.Color(colorHex).b,
          duration: 0.8
        });
      }
    });
  });

  // AI Chat Engine & Scene Control Triggers
  const sendBtn = document.getElementById('send-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const promptChips = document.querySelectorAll('.prompt-chip');

  function handleSendText(text) {
    if (!text) return;
    if (audioActive) playSynthSound(880, 'sine', 0.1);

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-msg';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Process Scene Actions or Respond
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Vortex AI Agent: I can engineer and deploy this exact 3D Spatial WebGL experience integrated with real-time Gemini AI lead qualification for your platform ($1,500 – $5,000).";

      if (lower.includes('cyan')) {
        reply = "Vortex AI Agent: Scene lighting shifted to Cyber Cyan light refraction mode!";
        if (pointLightCyan) pointLightCyan.intensity = 8;
        if (innerMesh) innerMesh.material.color.setHex(0x06b6d4);
      } else if (lower.includes('explode') || lower.includes('particle')) {
        reply = "Vortex AI Agent: Triggering particle shockwave dynamics!";
        gsap.to(particleSystem.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 0.6, yoyo: true, repeat: 1 });
      } else if (lower.includes('pricing') || lower.includes('cost') || lower.includes('package')) {
        reply = "Vortex AI Agent: Our High-Ticket Spatial Web Package ($1,500 – $5,000) includes: Custom 3D WebGL Canvas, Shaders, GSAP Motion, and 24/7 Gemini AI Buyer Qualification.";
      }

      const aiMsg = document.createElement('div');
      aiMsg.className = 'message ai-msg';
      aiMsg.textContent = reply;
      chatMessages.appendChild(aiMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
  }

  if (sendBtn) sendBtn.addEventListener('click', () => handleSendText(chatInput.value.trim()));
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendText(chatInput.value.trim());
    });
  }

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      handleSendText(prompt);
    });
  });
});
