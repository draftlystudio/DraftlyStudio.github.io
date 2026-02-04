'use strict';

//Toggle Function
let model = null;

const elemToggleFunc = function(elem) { elem.classList.toggle('active'); }

// Header Sticky & Go-Top

const header = document.querySelector('[data-header]');
const goTopBtn = document.querySelector('[data-go-top]');
window.addEventListener('scroll', function(){ if(window.scrollY >= 10) { header.classList.add('active'); goTopBtn.classList.add('active'); }
                                                                else { header.classList.remove('active'); goTopBtn.classList.remove('active'); } });

// Mobile Menu

const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');

navToggleBtn.addEventListener('click', function() { 
    elemToggleFunc(navToggleBtn);
    elemToggleFunc(navbar);
    elemToggleFunc(document.body);
})

// Skills Toggling Button

const toggleBtnBox = document.querySelector('[data-toggle-box]');
const toggleBtns = document.querySelectorAll('[data-toggle-btn]');
const skillsBox = document.querySelector('[data-skills-box]');

for(let i = 0; i < toggleBtns.length; i++){
    toggleBtns[i].addEventListener('click', function(){
        elemToggleFunc(toggleBtnBox);

        for(let i = 0; i < toggleBtns.length; i++) { elemToggleFunc(toggleBtns[i]); }
        elemToggleFunc(skillsBox);
    });
}

// Dark & Light Theme Toggle

const themeToggleBtn = document.querySelector('[data-theme-btn]');

themeToggleBtn.addEventListener('click', function(){
    elemToggleFunc(themeToggleBtn);

    if(themeToggleBtn.classList.contains('active')){
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');

        localStorage.setItem('theme', 'light-theme');
    }else{
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');

        localStorage.setItem('theme', 'dark-theme');
    }
})

//Applying Theme kept in Local Storage 

if(localStorage.getItem('theme') === 'light-theme'){
    themeToggleBtn.classList.add('active');
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
}else{
    themeToggleBtn.classList.remove('active');
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');

}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    // 1. SEND TO FORMSPREE
    await fetch("https://formspree.io/f/xykjleea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message
      })
    });

    // 2. OPEN GMAIL COMPOSE
    const recipient = "yourmail@gmail.com";
    const subject = encodeURIComponent("New Contact Message");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");

    // optional: reset form
    form.reset();
  });
});


gsap.from(".h1, .navbar ,.navbar-actions", {
  y: -20,
  duration: 1.5,
  opacity: 0,
  delay:0.5,
  stagger:0.2,

});

 import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene;
let camera;
let renderer;
let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;


// SCENE
scene = new THREE.Scene();

// CAMERA
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(12,5,12);
camera.lookAt(0, 0 ,0 );


// RENDERER
renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearColor(0x000000, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById("hero-3d");
container.appendChild(renderer.domElement);


// LIGHT
const ambient = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff, 1.5);
dir.position.set(5, 10, 5);
scene.add(dir);

// LOADER
const loader = new GLTFLoader();

loader.load("laser+cutting+machine+3d+model.glb", (gltf) => {
  model = gltf.scene;

  model.scale.set(20, 20, 20);
  model.position.set(0, -1, 0);

  scene.add(model);

  // gsap.fromTo(
  //   model.rotation,
  //   { y: Math.PI },
  //   { y: 0, duration: 1.2, ease: "power3.out" }
  // );
});


// ANIMATE LOOP
function animate() {
  requestAnimationFrame(animate);

  if (model !== null) {
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
const canvas = renderer.domElement;

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging || !model) return;

  const deltaX = e.clientX - prevMouseX;
  const deltaY = e.clientY - prevMouseY;

  model.rotation.y += deltaX * 0.001;
  model.rotation.x += deltaY * 0.001;

  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
});

animate();
