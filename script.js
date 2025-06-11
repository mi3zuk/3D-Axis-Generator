import * as THREE from 'three';
import { TrackballControls } from './lib/TrackballControls.js';
    
let scene, camera, renderer, controls;
const arrowSize = 80;
const headLength = 15;
const headWidth = 10;

init();
window.addEventListener('resize', onWindowResize, false);
animate();
    
function init() {
    // シーン作成
    scene = new THREE.Scene();
    
    // カメラ作成（原点をターゲットとする）
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(100, 100, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    // レンダラー作成（preserveDrawingBuffer:true で画像保存可能に）
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);
    document.getElementById('container').appendChild(renderer.domElement);
    
    // OrbitControls の初期化
    // ここでターゲットを (0,0,0) に固定し、パン操作を無効にする
    controls = new TrackballControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.dynamicDampingFactor = 0.3;
    controls.enableDamping = false; // すぐに反応させるために慣性は無効
    //controls.enablePan = false;      // 平行移動は無効化（原点固定）
    controls.update();
    
    // 各軸の矢印生成
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), arrowSize, 0xff0000, headLength, headWidth);
    scene.add(arrowX);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), arrowSize, 0x00ff00, headLength, headWidth);
    scene.add(arrowY);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), arrowSize, 0x0000ff, headLength, headWidth);
    scene.add(arrowZ);
    
    // ※ラベル等を追加する場合は、ここに makeTextSprite 関数等を使って追加してください
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
    
// 各座標平面へのビュー切替と画像保存のグローバル関数
window.setView = function(view) {
    let targetPos;
    switch(view) {
        case 'xy': targetPos = { x: 0, y: 0, z: 150 }; break;
        case 'yz': targetPos = { x: 150, y: 0, z: 0 }; break;
        case 'zx': targetPos = { x: 0, y: 150, z: 0 }; break;
        default: targetPos = { x: 100, y: 100, z: 100 };
    }
    camera.position.set(targetPos.x, targetPos.y, targetPos.z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    controls.update();
}

window.saveImage = function() {
    const dataURL = renderer.domElement.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'coordinate_axes.png';
    link.href = dataURL;
    link.click();
}
