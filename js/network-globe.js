/* ============================================================
   LESLIE S. HULAR PORTFOLIO — 3D Network Defensive Mesh
   Three.js Interactive Background
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  // ─── SCENE SETUP ─────────────────────────────────────────
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  camera.position.z = 28;

  // ─── NODE PARAMETERS ─────────────────────────────────────
  const NODE_COUNT    = 80;
  const CONNECTION_DIST = 7;
  const SPHERE_RADIUS = 14;

  // ─── COLOR PALETTE ────────────────────────────────────────
  const COLOR_NODE_PRIMARY   = new THREE.Color(0x00c8ff);
  const COLOR_NODE_SECONDARY = new THREE.Color(0xffd700);
  const COLOR_NODE_ALERT     = new THREE.Color(0xff3355);
  const COLOR_EDGE_NORMAL    = new THREE.Color(0x00c8ff);
  const COLOR_EDGE_HOT       = new THREE.Color(0xffd700);

  // ─── NODES ────────────────────────────────────────────────
  const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const nodes   = [];
  const velocities = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    // Distribute nodes on a sphere surface
    const phi   = Math.acos(-1 + (2 * i) / NODE_COUNT);
    const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
    const r     = SPHERE_RADIUS * (0.6 + Math.random() * 0.4);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const isAlert = Math.random() < 0.06;
    const isGold  = Math.random() < 0.12;

    const color = isAlert ? COLOR_NODE_ALERT : isGold ? COLOR_NODE_SECONDARY : COLOR_NODE_PRIMARY;
    const mat   = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: isAlert ? 0.9 : 0.7 });
    const mesh  = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = { isAlert, isGold, pulsePhase: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    nodes.push(mesh);

    velocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.008,
      (Math.random() - 0.5) * 0.008,
      (Math.random() - 0.5) * 0.008
    ));
  }

  // ─── GLOW SPHERES ─────────────────────────────────────────
  const glowGeo = new THREE.SphereGeometry(0.35, 12, 12);
  nodes.forEach((node) => {
    if (node.userData.isAlert || node.userData.isGold) {
      const glowMat = new THREE.MeshBasicMaterial({
        color: node.userData.isAlert ? COLOR_NODE_ALERT : COLOR_NODE_SECONDARY,
        transparent: true,
        opacity: 0.12,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.copy(node.position);
      scene.add(glow);
      node.userData.glowMesh = glow;
    }
  });

  // ─── EDGES ────────────────────────────────────────────────
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: COLOR_EDGE_NORMAL,
    transparent: true,
    opacity: 0.08,
    vertexColors: false,
  });

  const edgeGroup = new THREE.Group();
  scene.add(edgeGroup);

  function buildEdges() {
    // Clear existing edges
    while (edgeGroup.children.length) {
      const child = edgeGroup.children[0];
      child.geometry.dispose();
      child.material.dispose();
      edgeGroup.remove(child);
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < CONNECTION_DIST) {
          const alpha = 1 - dist / CONNECTION_DIST;
          const isHot = nodes[i].userData.isAlert || nodes[j].userData.isAlert
                     || nodes[i].userData.isGold  || nodes[j].userData.isGold;

          const geo = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position.clone(),
            nodes[j].position.clone(),
          ]);

          const mat = new THREE.LineBasicMaterial({
            color: isHot ? COLOR_EDGE_HOT : COLOR_EDGE_NORMAL,
            transparent: true,
            opacity: alpha * (isHot ? 0.18 : 0.07),
          });

          edgeGroup.add(new THREE.Line(geo, mat));
        }
      }
    }
  }

  buildEdges();

  // ─── OUTER WIREFRAME SPHERE ────────────────────────────────
  const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS * 1.05, 20, 20);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x00c8ff,
    wireframe: true,
    transparent: true,
    opacity: 0.025,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);

  // ─── DATA PACKETS (Animated "pulses" along random edges) ──
  const packetGeo = new THREE.SphereGeometry(0.08, 6, 6);
  const packetMat = new THREE.MeshBasicMaterial({ color: 0x00ffea, transparent: true, opacity: 0.9 });
  const packets   = [];

  for (let i = 0; i < 12; i++) {
    const mesh = new THREE.Mesh(packetGeo, packetMat.clone());
    mesh.userData = { progress: Math.random(), fromIdx: 0, toIdx: 1 };
    assignPacketRoute(mesh, true);
    scene.add(mesh);
    packets.push(mesh);
  }

  function assignPacketRoute(packet, initial = false) {
    let a = Math.floor(Math.random() * nodes.length);
    let b = Math.floor(Math.random() * nodes.length);
    while (b === a) b = Math.floor(Math.random() * nodes.length);
    packet.userData.fromIdx = a;
    packet.userData.toIdx   = b;
    packet.userData.progress = initial ? Math.random() : 0;
    packet.userData.speed   = 0.004 + Math.random() * 0.008;
  }

  // ─── MOUSE INTERACTION ────────────────────────────────────
  const mouse = { x: 0, y: 0 };
  const target = { rx: 0, ry: 0 };
  const current = { rx: 0, ry: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    target.rx = mouse.y * 0.3;
    target.ry = mouse.x * 0.5;
  });

  // ─── RESIZE ───────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── CLOCK & EDGE REBUILD INTERVAL ────────────────────────
  const clock = new THREE.Clock();
  let edgeTimer = 0;

  // ─── ANIMATION LOOP ───────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const dt   = clock.getDelta();
    const time = clock.getElapsedTime();

    edgeTimer += dt;

    // Slow drift of nodes
    nodes.forEach((node, i) => {
      node.position.add(velocities[i]);

      // Keep within sphere
      if (node.position.length() > SPHERE_RADIUS * 1.1) {
        velocities[i].negate();
      }

      // Pulse scale
      const pulse = 1 + Math.sin(time * 2 + node.userData.pulsePhase) * 0.15;
      node.scale.setScalar(pulse);

      if (node.userData.glowMesh) {
        node.userData.glowMesh.position.copy(node.position);
        const glowPulse = 1 + Math.sin(time * 1.5 + node.userData.pulsePhase) * 0.4;
        node.userData.glowMesh.scale.setScalar(glowPulse);
        node.userData.glowMesh.material.opacity = 0.08 + Math.sin(time + node.userData.pulsePhase) * 0.04;
      }
    });

    // Rebuild edges every 0.3s for drift accuracy
    if (edgeTimer > 0.3) {
      buildEdges();
      edgeTimer = 0;
    }

    // Animate data packets
    packets.forEach((pkt) => {
      pkt.userData.progress += pkt.userData.speed;
      if (pkt.userData.progress >= 1) {
        assignPacketRoute(pkt);
        return;
      }
      const from = nodes[pkt.userData.fromIdx].position;
      const to   = nodes[pkt.userData.toIdx].position;
      pkt.position.lerpVectors(from, to, pkt.userData.progress);
      pkt.material.opacity = Math.sin(pkt.userData.progress * Math.PI) * 0.9;
    });

    // Smooth camera rotation following mouse
    current.rx += (target.rx - current.rx) * 0.04;
    current.ry += (target.ry - current.ry) * 0.04;

    scene.rotation.x = current.rx + Math.sin(time * 0.07) * 0.05;
    scene.rotation.y = current.ry + time * 0.04;

    // Sphere wireframe gentle rotation
    sphereMesh.rotation.y = time * -0.02;
    sphereMesh.rotation.x = time * 0.012;

    renderer.render(scene, camera);
  }

  animate();
})();
