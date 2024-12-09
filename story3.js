// Scene setup
const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera3.position.set(0, 0, 10); // Set initial camera position inside the object

const renderer3 = new THREE.WebGLRenderer({
	antialias: true,
	// precision: 'highp',
	// powerPreference: 'high-performance',
});

const devicePixelRatio = window.devicePixelRatio || 1; // Account for high-DPI displays

// Set the renderer size to match the window dimensions with increased pixel density
renderer3.setSize(window.innerWidth, window.innerHeight);
renderer3.setPixelRatio(devicePixelRatio);

// Append the renderer to the element with id="story3"
const container3 = document.getElementById('story3');
const bod = document.getElementById('bod');
if (container3) {
	container3.appendChild(renderer3.domElement);
} else {
	console.error('Element with id="story3" not found.');
}

// Lighting
// helmet3.position.set(-0.2, -1.5, -2.5); // Adjust as necessary
const lg1 = new THREE.PointLight(0xffffff, 2, 5);
lg1.position.set(0, -2, -11);
scene3.add(lg1);

const lg2 = new THREE.PointLight(0xffffff, 2, 5);
lg2.position.set(0, -2, -9);
scene3.add(lg2);

const lg3 = new THREE.PointLight(0xffffff, 2, 5);
lg3.position.set(0, -1.7, -6);
scene3.add(lg3);

const lg4 = new THREE.PointLight(0xffffff, 1, 5);
lg4.position.set(0, -2, 0);
scene3.add(lg4);

const lg5 = new THREE.PointLight(0xffffff, 1, 5);
lg5.position.set(0, -2, 10);
scene3.add(lg5);

const lg6 = new THREE.PointLight(0xffffff, 1, 5);
lg6.position.set(0, -2, 7);
scene3.add(lg6);

function flickerLight() {
	const originalIntensity = 1; // Define the base intensity
	const flickerDuration = 500; // Flicker duration in milliseconds

	// Start flickering
	const flickerInterval = setInterval(() => {
		lg3.intensity = 0.2 + Math.random() * 0.2;
		lg2.intensity = 0.5 + Math.random() * 0.7;
		lg1.intensity = 0.5 + Math.random() * 0.7;
		lg5.intensity = 0.5 + Math.random() * 0.7; // Flicker intensity range
		lg6.intensity = 0.5 + Math.random() * 0.7; // Flicker intensity range
	}, 50); // Adjust for faster flicker rate

	// Stop flickering after the defined duration
	setTimeout(() => {
		clearInterval(flickerInterval);
		lg3.intensity = Math.random() < 0.5 ? 5 : 0;
		lg2.intensity = 2;
		lg1.intensity = 2;
		lg5.intensity = originalIntensity; // Reset to original intensity
		lg6.intensity = originalIntensity; // Reset to original intensity
	}, flickerDuration);
}

// Trigger the flickering effect every 5 seconds
setInterval(flickerLight, 5000);

// Start the flickering effect

const blueLightRight3 = new THREE.PointLight(0x0000ff, 2, 5);
blueLightRight3.position.set(0, -3, -9);
scene3.add(blueLightRight3);

const blueLightRight4 = new THREE.PointLight(0x0000ff, 1, 1);
blueLightRight4.position.set(0, -3, -2.5);
scene3.add(blueLightRight4);

const outsideLight = new THREE.PointLight(0xff0000, 2, 20);
outsideLight.position.set(-4, 1, -10);
scene3.add(outsideLight);

const outsideLight3 = new THREE.PointLight(0xff0000, 2, 20);
outsideLight3.position.set(-4, 0.1, -4);
scene3.add(outsideLight3);

// blackhole.position.set(-12, -1.5, -6); //

// PointerLockControls for first-person navigation
const controls3 = new THREE.PointerLockControls(camera3, document.body);
scene3.add(controls3.getObject()); // Add the controls object to the scene

// Lock the pointer on click or long press
let lockTimeout;
document.addEventListener('mousedown', () => {
	controls3.lock();
	// bod.style.overflow = 'hidden';
});

document.addEventListener('mouseup', () => {
	clearTimeout(lockTimeout); // Cancel pointer lock if mouse is released too early
});

document.addEventListener('keydown', (event) => {
	if (event.code === 'Escape') {
		console.log(event.code);
		controls3.unlock();
		// bod.style.overflow = 'auto !important';
		console.log('Pointer unlocked manually');
	}
});

// Movement variables
const movement = { forward: 0, backward: 0, left: 0, right: 0 };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Keypress event listeners
document.addEventListener('keydown', (event) => {
	switch (event.code) {
		case 'KeyW':
			movement.forward = 1;
			break;
		case 'KeyS':
			movement.backward = 1;
			break;
		case 'KeyA':
			movement.left = 1;
			break;
		case 'KeyD':
			movement.right = 1;
			break;
	}
});

document.addEventListener('keyup', (event) => {
	switch (event.code) {
		case 'KeyW':
			movement.forward = 0;
			break;
		case 'KeyS':
			movement.backward = 0;
			break;
		case 'KeyA':
			movement.left = 0;
			break;
		case 'KeyD':
			movement.right = 0;
			break;
	}
});

// Load GLTF Model
const loader3 = new THREE.GLTFLoader();
let helmet3, blackhole;

loader3.load(
	'./assets/spaceship_corridor/scene.gltf',
	function (gltf) {
		helmet3 = gltf.scene;
		scene3.add(helmet3);

		// Position and orientation
		helmet3.position.set(-0.2, -1.5, -2.5); // Adjust as necessary
		helmet3.rotation.y = THREE.MathUtils.degToRad(90); // 90 degrees in radians

		const helmetClone = helmet3.clone();

		// Rotate the clone in the opposite direction to the original helmet
		helmetClone.rotation.y = -helmet3.rotation.y;
		helmetClone.position.x = helmet3.position.x + 0.4; // Small movement on x-axis
		helmetClone.position.z = helmet3.position.z + 3.2; // S
		scene3.add(helmetClone);

		console.log('Model loaded and positioned.');
	},
	undefined,
	function (error) {
		console.error('An error occurred while loading the model:', error);
	}
);

loader3.load(
	'./assets/blackhole/scene.gltf',
	function (gltf) {
		blackhole = gltf.scene;
		scene3.add(blackhole);

		// Position and orientation
		blackhole.position.set(-350, -1, -6); // Adjust as necessary
		blackhole.rotation.y = THREE.MathUtils.degToRad(110); // 90 degrees in radians
		blackhole.rotation.x = THREE.MathUtils.degToRad(30); // Tilt 30 degrees along the x-axis
		blackhole.rotation.z = THREE.MathUtils.degToRad(15); // Tilt 1
		// blackhole.rotation.z = THREE.MathUtils.degToRad(40); // 90 degrees in radians

		blackhole.scale.set(200, 200, 200); //
		console.log('Model loaded and positioned.');
	},

	undefined,
	function (error) {
		console.error('An error occurred while loading the model:', error);
	}
);

let blposition = new THREE.Vector3();
// Animation loop
const bounds = {
	minX: -0.7, // Adjust these values to match your object's confines
	maxX: 0.7,
	minZ: -11,
	maxZ: 10,
	minY: 0, // Optional: Add Y-axis constraints if needed
	maxY: 0,
};

const clock = new THREE.Clock(); // Create a clock to track
function animate3() {
	requestAnimationFrame(animate3);

	// Movement logic relative to the camera's orientation
	const moveSpeed = 0.02; // Adjust speed as needed
	direction.set(0, 0, 0); // Reset direction vector

	if (movement.forward) direction.z = moveSpeed; // Forward
	if (movement.backward) direction.z = -moveSpeed; // Backward
	if (movement.left) direction.x = -moveSpeed; // Left
	if (movement.right) direction.x = moveSpeed; // Right

	// Apply movement in the camera's local space
	controls3.getObject().getWorldDirection(velocity); // Get the direction the camera is facing
	velocity.y = 0; // Ensure no vertical movement
	velocity.normalize(); // Normalize to ensure consistent movement speed

	const cameraPosition = controls3.getObject().position;
	const newPosition = cameraPosition.clone();

	// Move forward/backward along the camera's Z-axis
	newPosition.addScaledVector(velocity, direction.z);

	// Move left/right relative to the camera
	const leftVector = new THREE.Vector3(-velocity.z, 0, velocity.x); // Perpendicular to forward
	newPosition.addScaledVector(leftVector, direction.x);

	// Ensure Y-axis remains constant (no vertical movement)
	newPosition.y = cameraPosition.y;

	// Check boundaries before applying movement
	if (
		newPosition.x >= bounds.minX &&
		newPosition.x <= bounds.maxX &&
		newPosition.z >= bounds.minZ &&
		newPosition.z <= bounds.maxZ
	) {
		cameraPosition.copy(newPosition);
	}

	// Rotate the black hole if it exists
	if (blackhole) {
		// Compute rotation around the tilted axis
		const quaternion = new THREE.Quaternion(); // Temporary quaternion for rotation
		const tiltAxis = new THREE.Vector3(0, 1, 0); // Y-axis, adjusted for tilt

		// Adjust the tilt axis for the current tilt of the blackhole
		tiltAxis.applyEuler(
			new THREE.Euler(
				blackhole.rotation.x, // X tilt
				blackhole.rotation.y, // Y rotation
				blackhole.rotation.z // Z tilt
			)
		);

		// Rotate around the computed tilt axis
		quaternion.setFromAxisAngle(tiltAxis, 0.001); // Rotate by 0.01 radians (speed adjustable)
		blackhole.quaternion.multiplyQuaternions(
			quaternion,
			blackhole.quaternion
		);
	}

	renderer3.render(scene3, camera3);
}

// Handle window resize
window.addEventListener('resize', () => {
	camera3.aspect = window.innerWidth / window.innerHeight;
	camera3.updateProjectionMatrix();
	renderer3.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate3();
