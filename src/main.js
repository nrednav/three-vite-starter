import * as THREE from "three";
import Tweakpane from "tweakpane";
import Stats from "stats.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Debug
const debugPane = new Tweakpane({ title: "Debug" });
const debugParams = {
  cube: {
    scale: 1.0,
    color: "#87ceeb",
  },
};

// Stats
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Config
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas & Renderer
const canvas = document.querySelector("#webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Handle window resizing
window.addEventListener("resize", () => {
  // Update dimensions
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Scene
const scene = new THREE.Scene();

// Lighting
const light = new THREE.DirectionalLight("#ffffff");
light.position.set(0, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight("#ffffff", 0.25);
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 3);
scene.add(camera);

// Orbit Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: debugParams.cube.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Object Debug
let cubeFolder = debugPane.addFolder({ title: "Cube" });
cubeFolder
  .addInput(debugParams.cube, "scale", { min: 0.5, max: 2.0 })
  .on("change", (ev) => mesh.scale.set(ev.value, ev.value, ev.value));
cubeFolder
  .addInput(debugParams.cube, "color")
  .on("change", (ev) => (mesh.material.color = new THREE.Color(ev.value)));

// Render & Animation
const clock = new THREE.Clock();
const render = () => {
  stats.begin();

  // Animation logic
  const elapsedTime = clock.getElapsedTime();
  mesh.rotation.y = elapsedTime;

  orbitControls.update();
  renderer.render(scene, camera);

  stats.end();

  requestAnimationFrame(render);
};

requestAnimationFrame(render);
