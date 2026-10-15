import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/PointerLockControls.js';

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 820;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ed0ff);
scene.fog = new THREE.Fog(0x9ed0ff, 18, 52);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const clock = new THREE.Clock();
const world = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const ambient = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(10, 20, 5);
sun.castShadow = false;
scene.add(sun);

// Better ground materials
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x7aa16b });
const dirtMaterial = new THREE.MeshLambertMaterial({ color: 0x8d5a37 });
const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x5ea84d });

function createBlock(x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  scene.add(mesh);
  world.push(mesh);
  return mesh;
}

function generateTerrain() {
  for (let x = -12; x <= 12; x += 1) {
    for (let z = -12; z <= 12; z += 1) {
      const height = Math.max(0, Math.round(Math.sin(x * 0.9) + Math.cos(z * 0.8)));
      for (let y = 0; y <= height; y += 1) {
        const material = y === height ? grassMaterial : y === height - 1 ? dirtMaterial : groundMaterial;
        createBlock(x, y, z, material);
      }
    }
  }
}

generateTerrain();

const keys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false, Space: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const tempVector = new THREE.Vector3();

const player = {
  height: 1.7,
  yVelocity: 0,
  grounded: false,
};

// Mobile control state
let joystickVector = new THREE.Vector2(0, 0);
let touchLooking = false;
let lastTouchX = null;
let lastTouchY = null;
let lookSensitivity = 0.0025;

// Setup mobile UI when needed
function setupMobileUI() {
  const container = document.createElement('div');
  container.id = 'mobile-controls';

  const joystick = document.createElement('div');
  joystick.id = 'joystick';
  const knob = document.createElement('div');
  knob.className = 'knob';
  joystick.appendChild(knob);
  container.appendChild(joystick);

  const buttons = document.createElement('div');
  buttons.id = 'action-buttons';

  const jumpBtn = document.createElement('div');
  jumpBtn.className = 'control-button';
  jumpBtn.id = 'jump-btn';
  jumpBtn.innerText = 'Jump';

  const actionBtn = document.createElement('div');
  actionBtn.className = 'control-button';
  actionBtn.id = 'action-btn';
  actionBtn.innerText = 'Use';

  buttons.appendChild(actionBtn);
  buttons.appendChild(jumpBtn);
  container.appendChild(buttons);

  const desktopHint = document.createElement('div');
  desktopHint.id = 'desktop-hint';
  desktopHint.innerText = isMobile ? 'Touch to look; joystick to move' : 'Press E or click to lock pointer';
  container.appendChild(desktopHint);

  document.body.appendChild(container);

  // Joystick touch handling
  let active = false;
  let startX = 0;
  let startY = 0;
  const maxRadius = 40;

  joystick.addEventListener('touchstart', (e) => {
    e.preventDefault();
    active = true;
    const t = e.targetTouches[0];
    const rect = joystick.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  }, { passive: false });

  joystick.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!active) return;
    const t = e.targetTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const clamped = Math.min(dist, maxRadius);
    const nx = dx / maxRadius;
    const ny = dy / maxRadius;
    joystickVector.set(nx, -ny); // invert Y so up is forward

    // position knob
    const angle = Math.atan2(dy, dx);
    const tx = Math.cos(angle) * clamped;
    const ty = Math.sin(angle) * clamped;
    knob.style.transform = `translate(${tx}px, ${ty}px)`;
  }, { passive: false });

  joystick.addEventListener('touchend', (e) => {
    e.preventDefault();
    active = false;
    joystickVector.set(0, 0);
    knob.style.transform = `translate(0px, 0px)`;
  });

  // Touch-look handling on right half
  let lookFingerId = null;
  window.addEventListener('touchstart', (e) => {
    if (!isMobile) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.clientX > window.innerWidth / 2) {
        lookFingerId = t.identifier;
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;
        break;
      }
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!isMobile) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === lookFingerId) {
        const dx = t.clientX - lastTouchX;
        const dy = t.clientY - lastTouchY;
        // apply rotation
        controls.getObject().rotation.y -= dx * lookSensitivity;
        camera.rotation.x -= dy * lookSensitivity;
        camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;
        break;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (!isMobile) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === lookFingerId) {
        lookFingerId = null;
      }
    }
  }, { passive: false });

  // Buttons
  jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); if (player.grounded) { player.yVelocity = 6.2; player.grounded = false; } }, { passive: false });
  actionBtn.addEventListener('touchstart', (e) => { e.preventDefault(); mobileAction(); }, { passive: false });
}

// Mobile action: raycast in camera direction to break/place with single button (alternate behavior)
function mobileAction() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const intersections = raycaster.intersectObjects(world, false);
  if (intersections.length > 0) {
    const hit = intersections[0];
    // toggle: if last action was remove, place a block; else remove
    // simple behavior: remove if within reach, otherwise place
    scene.remove(hit.object);
    const index = world.indexOf(hit.object);
    if (index > -1) world.splice(index, 1);
  } else {
    // place in front of camera
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const pos = controls.getObject().position.clone().add(dir.multiplyScalar(3));
    const blockPos = new THREE.Vector3(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
    createBlock(blockPos.x, blockPos.y, blockPos.z, grassMaterial);
  }
}

window.addEventListener('keydown', (event) => {
  if (event.code in keys) keys[event.code] = true;
  if (event.code === 'Space' && player.grounded) {
    player.yVelocity = 6.2;
    player.grounded = false;
  }
  if (event.code === 'KeyE') {
    controls.lock();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code in keys) keys[event.code] = false;
});

window.addEventListener('mousedown', (event) => {
  if (!controls.isLocked && !isMobile) {
    controls.lock();
    return;
  }

  if (isMobile && event.pointerType === 'touch') return;

  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);

  const intersections = raycaster.intersectObjects(world, false);
  if (intersections.length > 0) {
    const hit = intersections[0];
    if (event.button === 0) {
      scene.remove(hit.object);
      const index = world.indexOf(hit.object);
      if (index > -1) world.splice(index, 1);
    } else if (event.button === 2) {
      const pos = hit.object.position.clone().add(hit.face.normal);
      createBlock(pos.x, pos.y, pos.z, grassMaterial);
    }
  }
});

window.addEventListener('contextmenu', (event) => event.preventDefault());
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function updatePlayer(delta) {
  const speed = 7;
  velocity.x = 0;
  velocity.z = 0;

  // prefer joystick on mobile
  if (isMobile && (Math.abs(joystickVector.x) > 0.001 || Math.abs(joystickVector.y) > 0.001)) {
    direction.set(joystickVector.x, 0, joystickVector.y);
  } else {
    direction.z = Number(keys.KeyW) - Number(keys.KeyS);
    direction.x = Number(keys.KeyD) - Number(keys.KeyA);
  }

  if (direction.lengthSq() > 0) {
    direction.normalize();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    tempVector.copy(forward).multiplyScalar(direction.z * speed * delta);
    tempVector.add(right.multiplyScalar(direction.x * speed * delta));

    controls.getObject().position.add(tempVector);
  }

  player.yVelocity -= 18 * delta;
  controls.getObject().position.y += player.yVelocity * delta;

  if (controls.getObject().position.y < 4) {
    controls.getObject().position.y = 4;
    player.yVelocity = 0;
    player.grounded = true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (controls.isLocked || isMobile) {
    updatePlayer(delta);
  }

  renderer.render(scene, camera);
}

if (isMobile) setupMobileUI();

animate();
