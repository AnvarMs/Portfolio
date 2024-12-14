// Updated Three.js Code to Latest Version
//----------------------------------------------------------------- BASIC parameters
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;
}
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "fixed"; // Fix to background
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "-1"; // Push to the background
document.body.appendChild(renderer.domElement);


window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 2, 14);

var scene = new THREE.Scene();
var city = new THREE.Object3D();
var smoke = new THREE.Object3D();
var town = new THREE.Object3D();

var createCarPos = true;
var uSpeed = 0.0005;

//----------------------------------------------------------------- FOG background
var setcolor = 0xF02050;
scene.background = new THREE.Color(setcolor);
scene.fog = new THREE.Fog(setcolor, 10, 16);

//----------------------------------------------------------------- RANDOM Function
function mathRandom(num = 8) {
  return -Math.random() * num + Math.random() * num;
}

//----------------------------------------------------------------- CHANGE building colors
var setTintNum = true;
function setTintColor() {
  return setTintNum ? 0x000000 : 0x222222;
}

//----------------------------------------------------------------- CREATE City
function init() {
    for (var i = 1; i < 100; i++) {
      var geometry = new THREE.BoxGeometry(1, 1, 1); // Updated dimensions
      var material = new THREE.MeshStandardMaterial({
        color: setTintColor(),
        flatShading: false,
        side: THREE.DoubleSide,
      });
      var wireMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide,
      });
  
      var cube = new THREE.Mesh(geometry, material);
      var wire = new THREE.Mesh(geometry, wireMaterial);
      var floor = new THREE.Mesh(geometry, material);
      var wireFloor = new THREE.Mesh(geometry, wireMaterial);
  
      cube.add(wireFloor);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.rotationValue = 0.1 + Math.abs(mathRandom(8));
  
      floor.scale.y = 0.05;
      cube.scale.y = 0.1 + Math.abs(mathRandom(8));
      
      var cubeWidth = 0.9;
      cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
      cube.position.x = Math.round(mathRandom());
      cube.position.z = Math.round(mathRandom());
  
      floor.position.set(cube.position.x, 0, cube.position.z);
  
      town.add(floor);
      town.add(cube);
    }
  }
  

  //----------------------------------------------------------------- Particles
  var particleMaterial = new THREE.MeshToonMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  var particleGeometry = new THREE.CircleGeometry(0.01, 3);

  for (var h = 1; h < 300; h++) {
    var particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(mathRandom(5), mathRandom(5), mathRandom(5));
    particle.rotation.set(mathRandom(), mathRandom(), mathRandom());
    smoke.add(particle);
  }

  var planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  var planeGeometry = new THREE.PlaneGeometry(60, 60);
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.001;
  plane.receiveShadow = true;

  city.add(plane);


//----------------------------------------------------------------- MOUSE function
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouse.x = event.touches[0].pageX - window.innerWidth / 2;
    mouse.y = event.touches[0].pageY - window.innerHeight / 2;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouse.x = event.touches[0].pageX - window.innerWidth / 2;
    mouse.y = event.touches[0].pageY - window.innerHeight / 2;
  }
}

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("touchstart", onDocumentTouchStart, false);
window.addEventListener("touchmove", onDocumentTouchMove, false);

//----------------------------------------------------------------- Lights
var ambientLight = new THREE.AmbientLight(0xffffff, 4);
var lightFront = new THREE.SpotLight(0xffffff, 20, 10);
var lightBack = new THREE.PointLight(0xffffff, 0.5);

lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 2048;
lightFront.shadow.mapSize.height = 2048;
lightFront.penumbra = 0.1;
lightBack.position.set(0, 6, 0);

smoke.position.y = 2;

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

//----------------------------------------------------------------- GRID Helper
var gridHelper = new THREE.GridHelper(60, 120, 0xff0000, 0x000000);
city.add(gridHelper);



//----------------------------------------------------------------- ANIMATE
function animate() {
    requestAnimationFrame(animate);
  
    // Calculate rotation deltas
    const deltaY = (mouse.x * 8 - camera.rotation.y) * uSpeed;
    const deltaX = (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
  
    // Clamp the rotation deltas to a maximum speed
    const maxRotationSpeed = 0.015; // Adjust this value for smoothness
    const clampedDeltaY = THREE.MathUtils.clamp(deltaY, -maxRotationSpeed, maxRotationSpeed);
    const clampedDeltaX = THREE.MathUtils.clamp(deltaX, -maxRotationSpeed, maxRotationSpeed);
  
    // Apply clamped deltas to rotation
    city.rotation.y -= clampedDeltaY;
    city.rotation.x -= clampedDeltaX;
  
    // Restrict city rotation X within bounds
    city.rotation.x = THREE.MathUtils.clamp(city.rotation.x, -0.05, 1);
  
    // Rotate smoke for animation
    smoke.rotation.y += 0.01;
    smoke.rotation.x += 0.01;
  
    // Ensure camera points at the city
    camera.lookAt(city.position);
  
    // Render the scene
    renderer.render(scene, camera);
  }
  
//----------------------------------------------------------------- START functions
init();
animate();
