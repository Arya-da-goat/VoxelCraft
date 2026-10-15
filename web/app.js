import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/PointerLockControls.js';

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

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(10, 20, 5);
scene.add(sun);

const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x6dbb5c });
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
  if (!controls.isLocked) {
    controls.lock();
    return;
  }

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

  direction.z = Number(keys.KeyW) - Number(keys.KeyS);
  direction.x = Number(keys.KeyD) - Number(keys.KeyA);

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

  if (controls.isLocked) {
    updatePlayer(delta);
  }

  renderer.render(scene, camera);
}

animate();
