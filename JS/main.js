
    // Initialize the scene, camera, and renderer
    const mainCanvas = document.getElementById('canvas1');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer({mainCanvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add a rotating cube
    const loader = new THREE.GLTFLoader();
    loader.load(
        'Models3D/supra.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, 0); // Set initial position (x, y, z)
            model.scale.set(1, 1, 1);   // Optional: adjust the scale
            scene.add(gltf.scene);

            animateModel = model;
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );

    

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, -1);
    scene.add(light);

    // Position the camera
    camera.position.z = 5;

    window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/ window.innerHeight;
  camera.updateProjectionMatrix();
    })
let animateModel;
    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        if (animateModel) {
            // Example: Move the model along the X-axis
            
    
            // Optionally, rotate the model
            animateModel.rotation.y += 0.01; // Rotate around Y-axis
        }
        renderer.render(scene, camera);
    }
    // Handle window resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    animate();
