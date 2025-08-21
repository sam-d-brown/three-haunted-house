import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/addons/objects/Sky.js";
import GUI from "lil-gui";
import Stats from "stats.js";
var stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Floor textures
 */
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");
const floorColourTexture = textureLoader.load("./floor/diff.jpg");
const floorARMTexture = textureLoader.load("./floor/arm.jpg");
const floorNormalTexture = textureLoader.load("./floor/norm.jpg");
const floorDispTexture = textureLoader.load("./floor/disp.jpg");

floorColourTexture.colorSpace = THREE.SRGBColorSpace;

floorColourTexture.wrapS = THREE.RepeatWrapping;
floorColourTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDispTexture.wrapS = THREE.RepeatWrapping;
floorDispTexture.wrapT = THREE.RepeatWrapping;

floorColourTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDispTexture.repeat.set(8, 8);

/**
 * House
 */

const wallColourTexture = textureLoader.load("./wall/diff.jpg");
wallColourTexture.colorSpace = THREE.SRGBColorSpace;
const wallARMTexture = textureLoader.load("./wall/arm.jpg");
const wallNormalTexture = textureLoader.load("./wall/norm.jpg");

const houseGrp = new THREE.Group();
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColourTexture,
    normalMap: wallNormalTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
  })
);
const wallsHeight = walls.geometry.parameters.height;
houseGrp.add(walls);

walls.position.y = wallsHeight * 0.5;
scene.add(houseGrp);

const roofColourTexture = textureLoader.load("./roof/diff.jpg");
roofColourTexture.colorSpace = THREE.SRGBColorSpace;
const roofARMTexture = textureLoader.load("./roof/arm.jpg");
const roofNormalTexture = textureLoader.load("./roof/norm.jpg");

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.75, 4),
  new THREE.MeshStandardMaterial({
    map: roofColourTexture,
    normalMap: roofNormalTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
  })
);

roofColourTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColourTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roof.rotation.y = Math.PI / 4;
roof.position.y = wallsHeight + roof.geometry.parameters.height / 2;
houseGrp.add(roof);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    // wireframe: true,
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColourTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDispTexture,
    displacementScale: 0.3,
    displacementBias: -0.18,
  })
);
gui.add(floor.material, "displacementScale").min(0).max(1).step(0.001);
gui.add(floor.material, "displacementBias").min(-1).max(1).step(0.001);
floor.rotation.x = 0.5 * -Math.PI;
houseGrp.add(floor);

/**
 * Door
 */

const doorColourTexture = textureLoader.load("./door/color.jpg");
const doorAlphaTexture = textureLoader.load("./door/alpha.jpg");
const doorAOTexture = textureLoader.load("./door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("./door/height.jpg");
const doorNormalTexture = textureLoader.load("./door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg");

doorColourTexture.colorSpace = THREE.SRGBColorSpace;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAOTexture,
    map: doorColourTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);

door.position.y = door.geometry.parameters.height / 2;
door.position.z = 2 + 0.01;
houseGrp.add(door);

/**
 * Bushes
 */

const bushColourTexture = textureLoader.load("./bush/diff.jpg");
bushColourTexture.colorSpace = THREE.SRGBColorSpace;
const bushARMTexture = textureLoader.load("./bush/arm.jpg");
const bushNormalTexture = textureLoader.load("./bush/norm.jpg");

bushColourTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColourTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColourTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

houseGrp.add(bush1, bush2, bush3);

/**
 * Graves
 */

const graveColourTexture = textureLoader.load("./grave/diff.jpg");
graveColourTexture.colorSpace = THREE.SRGBColorSpace;
const graveARMTexture = textureLoader.load("./grave/arm.jpg");
const graveNormalTexture = textureLoader.load("./grave/norm.jpg");

graveColourTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

const graveGeom = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMat = new THREE.MeshStandardMaterial({
  map: graveColourTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});
const gravesGrp = new THREE.Group();

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeom, graveMat);
  gravesGrp.add(grave);

  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  grave.position.y =
    (grave.geometry.parameters.height / 2) * Math.random() + 0.01;
  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;

  grave.rotation.x = (Math.random() - 0.5) * 0.3;
}

scene.add(gravesGrp);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// door light
const doorLight = new THREE.PointLight("#ff7d45", 5);
doorLight.position.set(0, 2.2, 2.5);
scene.add(doorLight);

/**
 * ghosts
 */

const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// cast and receive the shadows
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

gravesGrp.children.forEach((grave) => {
  grave.castShadow = true;
  grave.receiveShadowShadow = true;
});

//shadow mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */

const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 10;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  stats.begin();
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // * animate ghosts
  const ghost1Angle = elapsedTime;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);
  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);
  const ghost3Angle = elapsedTime * 1.3;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  stats.end();
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
