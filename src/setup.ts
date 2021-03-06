var ViveController = require('three-vive-controller')(THREE);

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance
// hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias : true, alpha : true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x222222);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
export var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 10000);

var controls = new THREE.VRControls(camera);
controls.standing = true;

export var controller = new ViveController(0, controls)
scene.add(controller)

    // Apply VR stereo rendering to renderer.
    var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var params = {
  hideButton : false,   // Default: false.
  isUndistorted : false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
function animate(timestamp) {
  onFrame && onFrame(timestamp);
  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera);
  effect.render(scene, camera);

  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

var vrDisplay;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
export function run() {
  (<any>navigator).getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}

var onFrame;
export function setFrameCB(handler) { onFrame = handler; }
