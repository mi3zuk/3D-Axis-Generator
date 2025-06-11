import * as THREE from 'three';
import { TrackballControls } from './lib/TrackballControls.js';

let scene, camera, renderer, controls;
const arrowSize = 100;
const headLength = 15;
const headWidth = 10;

init();
window.addEventListener('resize', onWindowResize, false);
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(100, 100, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.dynamicDampingFactor = 0.3;
    controls.enableDamping = false;
    controls.minDistance = 80;
    controls.maxDistance = 400; 
    controls.update();

    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), arrowSize, 0xff0000, headLength, headWidth);
    scene.add(arrowX);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), arrowSize, 0x00ff00, headLength, headWidth);
    scene.add(arrowY);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), arrowSize, 0x0000ff, headLength, headWidth);
    scene.add(arrowZ);

    addAxisLabel('X', arrowSize + 15, 0, 0, 'black');
    addAxisLabel('Y', 0, arrowSize + 15, 0, 'black');
    addAxisLabel('Z', 0, 0, arrowSize + 15, 'black');
}

function addAxisLabel(text, x, y, z, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(20, 20, 1);
    sprite.position.set(x, y, z);
    scene.add(sprite);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Save Image
window.saveImage = function() {
    const dataURL = renderer.domElement.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'coordinate_axes.png';
    link.href = dataURL;
    link.click();
};

// Set Axis
window.setView = function(plane) {
    const dist = 200;
    let pos, up;

    switch (plane) {
        case 'xy':
            // x↑ y→
            pos = new THREE.Vector3(0, 0, -dist); 
            up = new THREE.Vector3(0, 0, 1);  
            break;
        case 'yz':
            // y↑ z→
            pos = new THREE.Vector3(-dist, 0, 0); 
            up = new THREE.Vector3(0, 1, 0);    
            break;
        case 'zx':
            // z↑ x→
            pos = new THREE.Vector3(0, -dist, 0); 
            up = new THREE.Vector3(1, 0, 0);  
            break;
        default:
            return;
    }

    camera.position.copy(pos);
    camera.up.copy(up);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
};

// Rotate Axis
let rotationEuler = new THREE.Euler(0, 0, 0, 'XYZ');

window.rotateAxis = function(axis) {
    let deg = 90;
    if (axis === 'x') deg = parseFloat(document.getElementById('rotate-x').value) || 0;
    if (axis === 'y') deg = parseFloat(document.getElementById('rotate-y').value) || 0;
    if (axis === 'z') deg = parseFloat(document.getElementById('rotate-z').value) || 0;

    const rad = THREE.MathUtils.degToRad(deg);

    const pos = camera.position.clone().sub(controls.target);
    const euler = new THREE.Euler(
        axis === 'x' ? rad : 0,
        axis === 'y' ? rad : 0,
        axis === 'z' ? rad : 0,
        'XYZ'
    );
    pos.applyEuler(euler);
    camera.position.copy(pos.add(controls.target));

    camera.up.applyEuler(euler);

    camera.lookAt(controls.target);
    controls.update();
};
