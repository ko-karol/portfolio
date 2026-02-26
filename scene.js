/**
 * scene.js — Three.js papercraft world
 *
 * Loaded dynamically after first paint. Exports `init(canvas, state)`.
 * `state` is a shared object written by main.js: { scrollY, mouseX, mouseY }
 */

import * as THREE from 'three';

// ─── PALETTE (matches CSS tokens) ──────────────────────────
const C = {
  skyTop:     0xddeefa,
  skyBot:     0xc8dfef,
  mountain:   0x97b4c8,
  hillBack:   0x7aaa88,
  hillMid:    0x5a9468,
  hillFront:  0x3e8054,
  ground:     0x4a7040,
  paperWhite: 0xf8f4ef,
  paperCream: 0xede8df,
  ink:        0x16120e,
  red:        0xe03a22,
  yellow:     0xf5c538,
  green:      0x3a7d44,
  blue:       0x2860a0,
};

// ─── MATERIAL HELPERS ───────────────────────────────────────

/** Flat-shaded toon material — the core papercraft look */
function toon(color, opts = {}) {
  return new THREE.MeshToonMaterial({
    color,
    flatShading: true,
    ...opts,
  });
}

/** Unlit flat material (for outline planes, sun, etc.) */
function flat(color, opts = {}) {
  return new THREE.MeshBasicMaterial({ color, ...opts });
}

// ─── SCENE OBJECTS ──────────────────────────────────────────

/**
 * Build a wavy terrain slab.
 * wavePoints: array of {x, y} in normalised 0-1 space forming the top edge.
 * The slab always fills the bottom.
 */
function buildTerrain(color, wavePoints, zPos) {
  // Create a Shape from wave points then fill down to bottom
  const shape = new THREE.Shape();
  const W = 28; // world units wide
  const H = 10; // world units tall (below wave baseline)

  shape.moveTo(-W / 2, -H);
  shape.lineTo(-W / 2, wavePoints[0].y);
  for (let i = 1; i < wavePoints.length; i++) {
    shape.lineTo(wavePoints[i].x, wavePoints[i].y);
  }
  shape.lineTo(W / 2, -H);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape, 1);
  const mat = toon(color);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.z = zPos;
  mesh.receiveShadow = true;
  return mesh;
}

/** Low-poly mountain silhouette (series of triangular peaks) */
function buildMountains(color, peaks, baseY, zPos) {
  const shape = new THREE.Shape();
  const startX = peaks[0].x - 2;
  shape.moveTo(startX, baseY);
  for (const p of peaks) {
    shape.lineTo(p.x - p.w * 0.5, baseY);
    shape.lineTo(p.x, p.h);
    shape.lineTo(p.x + p.w * 0.5, baseY);
  }
  shape.lineTo(peaks[peaks.length - 1].x + 2, baseY);
  shape.lineTo(peaks[peaks.length - 1].x + 2, baseY - 8);
  shape.lineTo(startX, baseY - 8);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape);
  const mat = toon(color);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.z = zPos;
  mesh.receiveShadow = true;
  return mesh;
}

/** Paper tree: a cone + cylinder trunk */
function buildTree(x, y, scale = 1) {
  const group = new THREE.Group();

  const coneGeo = new THREE.ConeGeometry(0.35 * scale, 0.8 * scale, 5);
  const coneMat = toon(C.hillMid);
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = 0.5 * scale;
  cone.castShadow = true;
  group.add(cone);

  const trunkGeo = new THREE.CylinderGeometry(0.06 * scale, 0.08 * scale, 0.25 * scale, 5);
  const trunkMat = toon(0x5a4030);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0.1 * scale;
  group.add(trunk);

  group.position.set(x, y, 0.1);
  return group;
}

/** Sun disc + two dashed ring halos (approximated with torus) */
function buildSun(x, y) {
  const group = new THREE.Group();

  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 32),
    flat(C.yellow)
  );
  group.add(disc);

  // Outline ring (slightly larger disc of ink colour behind)
  const outline = new THREE.Mesh(
    new THREE.CircleGeometry(0.96, 32),
    flat(C.ink)
  );
  outline.position.z = -0.01;
  group.add(outline);

  // Halo rings (torus lying flat, then rotated to face camera)
  [1.5, 2.1].forEach((r, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.03, 6, 48),
      flat(C.ink, { opacity: 0.2 + i * 0.05, transparent: true })
    );
    ring.rotation.x = Math.PI / 2; // face camera (we use ortho-ish cam)
    group.add(ring);
  });

  group.position.set(x, y, -1.5);
  return group;
}

/** Simple ellipse cloud from two overlapping circles */
function buildCloud(x, y, scale = 1) {
  const group = new THREE.Group();
  const mat = flat(C.paperWhite);
  const outMat = flat(C.ink, { opacity: 0.18, transparent: true });

  const sizes = [
    { rx: 0.7 * scale, ry: 0.38 * scale, ox: 0, oy: 0 },
    { rx: 0.5 * scale, ry: 0.5 * scale,  ox: -0.5 * scale, oy: 0.12 * scale },
    { rx: 0.45 * scale, ry: 0.45 * scale, ox: 0.55 * scale, oy: 0.1 * scale },
  ];

  for (const s of sizes) {
    const geo = new THREE.CircleGeometry(1, 12);
    // Scale the geometry verts to make an ellipse
    geo.scale(s.rx, s.ry, 1);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(s.ox, s.oy, 0.01);
    group.add(m);
    // thin outline
    const outGeo = new THREE.CircleGeometry(1, 12);
    outGeo.scale(s.rx + 0.04, s.ry + 0.04, 1);
    const out = new THREE.Mesh(outGeo, outMat);
    out.position.set(s.ox, s.oy, 0);
    group.add(out);
  }

  group.position.set(x, y, -0.8);
  return group;
}

/**
 * Paper crane built from flat triangular faces.
 * Mirrors the SVG polygon geometry in 3D.
 */
function buildCrane() {
  const group = new THREE.Group();

  // Each face: [color, [v0, v1, v2, ...] as flat x,y pairs normalised -1..1]
  // Converted from the SVG viewBox 120x100, centred at 60,50
  const toV = (pts) =>
    pts.map((p) => new THREE.Vector2((p[0] - 60) / 40, -(p[1] - 50) / 40));

  const faces = [
    // body
    { color: C.red,    verts: toV([[60,10],[100,70],[60,55],[20,70]]) },
    // left wing
    { color: C.yellow, verts: toV([[20,70],[60,55],[10,90]]) },
    // right wing
    { color: C.yellow, verts: toV([[100,70],[60,55],[110,90]]) },
    // head
    { color: C.red,    verts: toV([[60,10],[75,30],[60,38],[45,30]]) },
    // tail
    { color: C.paperWhite, verts: toV([[60,55],[80,80],[60,75],[40,80]]) },
  ];

  for (const f of faces) {
    const shape = new THREE.Shape(f.verts);
    const geo = new THREE.ShapeGeometry(shape);
    const mat = toon(f.color, { side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    group.add(mesh);

    // Ink outline: slightly larger scale, behind, ink colour
    const outGeo = new THREE.ShapeGeometry(shape);
    const outMat = flat(C.ink, { side: THREE.DoubleSide });
    const outMesh = new THREE.Mesh(outGeo, outMat);
    outMesh.scale.setScalar(1.04);
    outMesh.position.z = -0.01;
    group.add(outMesh);
  }

  return group;
}

/**
 * Render text + simple box to a 2D canvas, return as THREE.CanvasTexture.
 * Used for sticky-note widgets.
 */
function makeNoteTexture(lines, bgColor = '#f8f4ef', accentColor = '#2860a0') {
  const W = 256, H = 128;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = '#16120e';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  // Text
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillStyle = accentColor;
  lines.forEach((line, i) => {
    ctx.fillStyle = line.accent ? accentColor : '#3a3228';
    ctx.fillText(line.text, 16, 38 + i * 30);
  });

  return new THREE.CanvasTexture(cv);
}

/** Flat note card mesh using CanvasTexture */
function buildStickyNote(lines, x, y, z, rotZ = 0, bgColor, accentColor) {
  const tex = makeNoteTexture(lines, bgColor, accentColor);
  const geo = new THREE.PlaneGeometry(2.2, 1.1);
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rotZ;

  // Hard drop-shadow (a slightly offset dark plane behind)
  const shadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.28, 1.18),
    flat(C.ink, { opacity: 0.18, transparent: true })
  );
  shadowMesh.position.set(x + 0.06, y - 0.06, z - 0.02);
  shadowMesh.rotation.z = rotZ;

  const group = new THREE.Group();
  group.add(shadowMesh, mesh);
  return group;
}

// ─── MAIN EXPORT ────────────────────────────────────────────

export function init(canvas, state) {
  // ── Renderer ───────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(C.skyBot, 1);

  // ── Camera ─────────────────────────────────────────────────
  // Orthographic-ish feel with a long focal length
  const camera = new THREE.PerspectiveCamera(
    30, window.innerWidth / window.innerHeight, 0.1, 200
  );
  camera.position.set(0, 1, 22);
  camera.lookAt(0, 0, 0);

  // Camera rig for scroll animation
  const cameraRig = new THREE.Group();
  cameraRig.add(camera);

  // ── Scene ──────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.add(cameraRig);

  // Sky gradient via background colour lerp (updated per frame)
  scene.background = new THREE.Color(C.skyTop);
  scene.fog = new THREE.FogExp2(C.skyTop, 0.018);

  // ── Lights ─────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xfff5e0, 1.2);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffeebb, 2.5);
  sun.position.set(5, 10, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
  sun.shadow.camera.left = -15;
  sun.shadow.camera.right = 15;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.bias = -0.001;
  scene.add(sun);

  const fillLight = new THREE.DirectionalLight(0xc8e8f0, 0.8);
  fillLight.position.set(-6, 4, 6);
  scene.add(fillLight);

  // ── Sky plane (colour gradient backdrop) ───────────────────
  // Simple: a large plane with a vertex-colour gradient
  const skyGeo = new THREE.PlaneGeometry(60, 30, 1, 4);
  const skyMat = new THREE.MeshBasicMaterial({
    color: C.skyTop,
    vertexColors: false,
  });
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  skyMesh.position.set(0, 0, -8);
  scene.add(skyMesh);

  // ── Sun ────────────────────────────────────────────────────
  const sunObj = buildSun(5, 5);
  scene.add(sunObj);

  // ── Clouds ─────────────────────────────────────────────────
  const cloud1 = buildCloud(-6, 5.5, 1.1);
  const cloud2 = buildCloud(0.5, 6.2, 0.85);
  const cloud3 = buildCloud(7, 5.8, 0.95);
  scene.add(cloud1, cloud2, cloud3);

  // ── Terrain layers ─────────────────────────────────────────
  // Mountains — sharp peaked silhouette
  const mountains = buildMountains(C.mountain,
    [
      { x: -12, h: 5.5, w: 4.5 },
      { x: -7,  h: 7.2, w: 5.0 },
      { x: -2,  h: 4.8, w: 4.0 },
      { x:  3,  h: 6.8, w: 5.5 },
      { x:  9,  h: 5.2, w: 4.2 },
      { x: 13,  h: 4.2, w: 3.5 },
    ],
    1.2, -2
  );
  scene.add(mountains);

  // Hill layers (wavy terrain slabs)
  const wavePts = (rawPts) =>
    rawPts.map(([x, y]) => ({ x: x - 14, y }));

  const hillBack = buildTerrain(C.hillBack, wavePts([
    [0,1.8],[2,0.8],[4,2.2],[6,0.6],[8,1.9],[10,0.5],[12,1.7],[14,0.8],[16,1.6],[18,0.4],[20,1.5],[22,0.7],[24,1.3],[26,0.5],[28,1.0],
  ]), -1);
  scene.add(hillBack);

  const hillMid = buildTerrain(C.hillMid, wavePts([
    [0,0.5],[2,-0.4],[4,1.0],[6,-0.6],[8,0.7],[10,-0.7],[12,0.5],[14,-0.5],[16,0.6],[18,-0.8],[20,0.4],[22,-0.6],[24,0.3],[26,-0.5],[28,0.2],
  ]), 0);
  scene.add(hillMid);

  const hillFront = buildTerrain(C.hillFront, wavePts([
    [0,-0.8],[2,-1.6],[4,-0.3],[6,-1.8],[8,-0.6],[10,-1.9],[12,-0.7],[14,-1.5],[16,-0.5],[18,-1.7],[20,-0.9],[22,-1.6],[24,-0.8],[26,-1.5],[28,-1.0],
  ]), 1);
  scene.add(hillFront);

  const ground = buildTerrain(C.ground, wavePts([
    [0,-2.2],[4,-2.5],[8,-2.1],[12,-2.4],[16,-2.0],[20,-2.3],[24,-2.1],[28,-2.2],
  ]), 2);
  scene.add(ground);

  // ── Trees ──────────────────────────────────────────────────
  scene.add(buildTree(-10.5, -2.1, 1.0));
  scene.add(buildTree(-9.2,  -2.3, 0.8));
  scene.add(buildTree(-11.5, -2.4, 1.2));
  scene.add(buildTree( 9.0,  -2.2, 0.9));
  scene.add(buildTree( 10.2, -2.4, 1.1));

  // ── Paper crane ────────────────────────────────────────────
  const crane = buildCrane();
  crane.scale.setScalar(1.6);
  crane.position.set(5.5, 3.2, 1.0);
  scene.add(crane);

  // ── Sticky notes ───────────────────────────────────────────
  const note1 = buildStickyNote(
    [
      { text: 'console.log(', accent: true },
      { text: '  "hello"', accent: false },
      { text: ')', accent: true },
    ],
    5.5, 0.5, 2.5, 0.04
  );
  scene.add(note1);

  const note2 = buildStickyNote(
    [{ text: '★  4.9k stars', accent: false }],
    7.5, -0.8, 2.5, -0.05,
    '#f8f4ef', '#f5c538'
  );
  scene.add(note2);

  const note3 = buildStickyNote(
    [{ text: 'open source', accent: false }],
    6.8, -2.0, 2.5, 0.03,
    '#3a7d44', '#f8f4ef'
  );
  scene.add(note3);

  const note4 = buildStickyNote(
    [
      { text: '~12ms p99', accent: false },
      { text: '████████░░', accent: true },
    ],
    4.2, -1.4, 2.5, -0.03
  );
  scene.add(note4);

  // ── Resize handler ─────────────────────────────────────────
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // ── Animation loop ─────────────────────────────────────────
  let craneT = 0;

  // Camera target — interpolated smoothly
  const camTarget = { x: 0, y: 1, z: 22 };
  const camCurrent = { x: 0, y: 1, z: 22 };

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    requestAnimationFrame(animate);
    const dt = 0.016; // ~60fps assumption for animations
    craneT += dt;

    // ── Crane float animation
    crane.position.y = 3.2 + Math.sin(craneT * 0.9) * 0.18;
    crane.rotation.z = Math.sin(craneT * 0.6) * 0.06;

    // ── Cloud drift
    cloud1.position.x = -6 + Math.sin(craneT * 0.08) * 0.4;
    cloud2.position.x = 0.5 + Math.sin(craneT * 0.06 + 1) * 0.3;
    cloud3.position.x = 7 + Math.sin(craneT * 0.07 + 2) * 0.35;

    // ── Sun halo spin (rotate the whole sunObj slowly)
    sunObj.rotation.z = craneT * 0.03;

    // ── Notes gentle bob
    note1.position.y = 0.5  + Math.sin(craneT * 0.7) * 0.05;
    note2.position.y = -0.8 + Math.sin(craneT * 0.8 + 1) * 0.04;
    note3.position.y = -2.0 + Math.sin(craneT * 0.65 + 2) * 0.05;
    note4.position.y = -1.4 + Math.sin(craneT * 0.75 + 3) * 0.04;

    // ── Scroll-driven camera: pan up/out as user scrolls
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = maxScroll > 0 ? state.scrollY / maxScroll : 0;

    // Hero → cards: camera pulls back and tilts slightly
    camTarget.z = 22 + scrollPct * 12;
    camTarget.y = 1  - scrollPct * 2;

    // Mouse parallax (subtle)
    const mx = (state.mouseX / window.innerWidth - 0.5) * 2;
    const my = (state.mouseY / window.innerHeight - 0.5) * 2;
    camTarget.x = mx * -0.6;
    camTarget.y += my * -0.3;

    // Smooth lerp toward target
    camCurrent.x = lerp(camCurrent.x, camTarget.x, 0.06);
    camCurrent.y = lerp(camCurrent.y, camTarget.y, 0.06);
    camCurrent.z = lerp(camCurrent.z, camTarget.z, 0.04);

    camera.position.set(camCurrent.x, camCurrent.y, camCurrent.z);
    camera.lookAt(camCurrent.x * 0.3, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Signal ready to CSS
  canvas.classList.add('ready');

  // Cleanup function
  return () => {
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}
