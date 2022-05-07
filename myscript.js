import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
camera.position.set(0, 0, 5);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setClearColor(0xEEF9F9);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
var canvas = renderer.domElement;
document.body.appendChild(canvas);

var light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 1));

let base = new THREE.Object3D();
scene.add(base);

const loader = new GLTFLoader().setPath( 'models/gltf/' );
    // loader.setKTX2Loader( ktx2Loader );
    // loader.setMeshoptDecoder( MeshoptDecoder );
loader.load( 'mymodel.glb', function ( gltf ) {
    gltf.scene.scale.setScalar(1);
    base.add( gltf.scene );
} );
// loader.load( 'DamagedHelmet.gltf', function ( gltf ) {
//   gltf.scene.scale.setScalar(2);
//   base.add( gltf.scene );
// } );

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();
canvas.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event){
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOfIntersection);
  base.lookAt(pointOfIntersection);
}

renderer.setAnimationLoop(() => {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
});

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
