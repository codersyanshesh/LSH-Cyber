/* ============================================================
   INTEL 3D TACTICAL VISUALIZATION
   ============================================================ */
(function initIntel3D() {
  const container = document.getElementById('intel-3d-canvas');
  if (!container || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high DPI
  container.appendChild(renderer.domElement);

  // Core Shape (Icosahedron / Threat Sphere)
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00c8ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const coreSphere = new THREE.Mesh(geometry, material);
  scene.add(coreSphere);

  // Inner Core (Solid, glowing)
  const innerGeometry = new THREE.IcosahedronGeometry(0.8, 0);
  const innerMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x005588,
    transparent: true,
    opacity: 0.8
  });
  const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
  scene.add(innerSphere);

  // Orbiting Data Nodes (Particles)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 150;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    // Generate positions in a wider sphere
    posArray[i] = (Math.random() - 0.5) * 8; 
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00ff88,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Animation Loop
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();

    // Rotate core
    coreSphere.rotation.y += 0.005;
    coreSphere.rotation.x += 0.002;
    
    innerSphere.rotation.y -= 0.01;
    innerSphere.rotation.z += 0.005;

    // Rotate particles slowly
    particlesMesh.rotation.y = -0.1 * elapsedTime;
    
    // Parallax effect based on mouse
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    
    scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
    scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

    // Pulse effect on inner sphere
    const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
    innerSphere.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  }

  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();
