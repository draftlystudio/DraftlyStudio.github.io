import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

const canvas = document.getElementById("card-canvas");

/* SCENE */

const scene = new THREE.Scene();

/* CAMERA */

const camera = new THREE.PerspectiveCamera(50,1,0.1,100);
camera.position.z = 2.4;

/* RENDERER */

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true,
    alpha:true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

/* LIGHT */

scene.add(new THREE.AmbientLight(0xffffff,2));

const dir = new THREE.DirectionalLight(0xffffff,5);
dir.position.set(3,3,5);
scene.add(dir);

/* TEXTURES */

const loader = new THREE.TextureLoader();

const front = loader.load("1.jpg");
const back  = loader.load("2.jpg");

front.colorSpace = THREE.SRGBColorSpace;
back.colorSpace  = THREE.SRGBColorSpace;

/* CARD GEOMETRY */

const geometry = new THREE.BoxGeometry(3.5,2.1,0.1);

/* MATERIALS (CORRECT FACE ORDER) */

const materials = [
 new THREE.MeshStandardMaterial({color:0x111111}),
 new THREE.MeshStandardMaterial({color:0x111111}),
 new THREE.MeshStandardMaterial({color:0x111111}),
 new THREE.MeshStandardMaterial({color:0x111111}),
 new THREE.MeshStandardMaterial({map:front}),
 new THREE.MeshStandardMaterial({map:back})
];

const card = new THREE.Mesh(geometry,materials);
scene.add(card);

/* FIT */

function fit(){
 const w=canvas.clientWidth;
 const h=canvas.clientHeight;

 renderer.setSize(w,h,false);
 camera.aspect=w/h;
 camera.updateProjectionMatrix();

 const visibleH=2*Math.tan((camera.fov*Math.PI/180)/2)*camera.position.z;
 const visibleW=visibleH*camera.aspect;

 const scaleX=visibleW/3.1;
 const scaleY=visibleH/0.2;

 const scale=Math.min(scaleX,scaleY)*0.8;
 card.scale.set(scale,scale,scale);
}

window.addEventListener("resize",fit);
fit();

/* INTERACTION */

let dragging=false;
let prevX=0;
let velocity=0;

let targetFlip=0;
let showFront=true;

/* CLICK FLIP */

canvas.addEventListener("click",()=>{
 showFront=!showFront;
 targetFlip = showFront ? 0 : Math.PI;
});

/* DRAG */

canvas.addEventListener("mousedown",(e)=>{
 dragging=true;
 prevX=e.clientX;
});

window.addEventListener("mouseup",()=> dragging=false);

window.addEventListener("mousemove",(e)=>{
 if(!dragging) return;
 const delta=e.clientX-prevX;
 velocity=delta*0.003;
 card.rotation.y+=velocity;
 prevX=e.clientX;
});

/* ANIMATE */

function animate(){
 requestAnimationFrame(animate);

 card.rotation.y += (targetFlip-card.rotation.y)*0.12;

 if(!dragging){
    card.rotation.y+=velocity+0.001;
    velocity*=0.93;
 }

 renderer.render(scene,camera);
}

animate();
