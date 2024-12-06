const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.27,
	1000
);
const renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(window.innerWidth, window.innerHeight);
const controls = new THREE.OrbitControls(camera2, renderer2.domElement);
// Set the point around which the controls will orbit (the same point the camera looks at)

// // Enable damping for smooth rotation
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false; // Disable panning
controls.enableZoom = false;

// Append the renderer to the element with id="bl"
const container2 = document.getElementById('bl');
if (container2) {
	container2.appendChild(renderer2.domElement);
} else {
	console.error('Element with id="bl" not found.');
}

// Lighting

const loader2 = new THREE.GLTFLoader();
let helmet2, astronaut2;
let helmetBasePosition2 = new THREE.Vector3(); // Store base positions
let astronautBasePosition2 = new THREE.Vector3();

// Load Helmet Model
loader2.load(
	'./assets/blackhole/scene.gltf',
	function (gltf) {
		helmet2 = gltf.scene;
		scene2.add(helmet2);
		helmetBasePosition2.set(1.2, 0, 4); // Set base position
		helmet2.position.copy(helmetBasePosition2); // Apply base position
		helmet2.rotation.y = 243.13999999992353; // Rotate 180 degrees around Y-axis
		helmet2.rotation.x = Math.PI + 3.1;
		// helmet2.rotation.z = 6.1

		console.log('Helmet loaded and positioned:', helmetBasePosition2);
	},
	undefined,
	function (error) {
		console.error('An error occurred with helmet2:', error);
	}
);

// Camera position
camera2.position.z = 3.7;

// Animate the scene
let helmetFloatOffset2 = 0;
let astronautFloatOffset2 = 0;
let cameraAngle2 = 0; // Initial angle in radians
const cameraRadius2 = 5; // Distance from the center (orbit radius)
const cameraSpeed2 = 0.001;

const stopAfter2 = 14000; // Stop animation after 10 seconds (in milliseconds)
let startTime2 = Date.now(); // Track the start time
let scrollHandler; // Save the reference to the scroll event handler
let isScrollHandlerActive = false; // Track if the handler is active

let trig = 0; // Initialize trigger variable
let lastCameraPosition = {
	x: camera2.position.x,
	y: camera2.position.y,
	z: camera2.position.z,
}; // Variable to store last position

function focusCameraOnObject(object) {
	if (object) {
		const objectPosition = new THREE.Vector3();
		object.getWorldPosition(objectPosition); // Get the object's world position
		controls.target.copy(objectPosition); // Set the controls target to the object's position

		controls.update(); // Apply the target change
	}
}
let controlsEnabled = false; // Controls are disabled initially

// Animate the scene
function animate2() {
	requestAnimationFrame(animate2);

	const elapsedTime2 = Date.now() - startTime2;

	// Stop updating the camera after 10 seconds
	if (elapsedTime2 < stopAfter2) {
		stopScrollCamera();
		cameraAngle2 += cameraSpeed2; // Increment the angle
		camera2.position.x += 0.001; // Update X position
		camera2.position.z += 0.001; // Update Z position
		camera2.lookAt(0, 0, 0); // Keep the camera focused on the center of the scene
	} else {
		if (!controlsEnabled) {
			startScrollCamera(); // Start scroll interaction
			controlsEnabled = true; // Enable controls after animation stops
			controls.enabled = true; // Activate controls
			console.log('Controls enabled after animation.');
		}
		startScrollCamera();
		// Save the last position when the animation stops
		lastCameraPosition.x = camera2.position.x;
		lastCameraPosition.y = camera2.position.y;
		lastCameraPosition.z = camera2.position.z;

		// Focus the camera on the object after animation stops
		focusCameraOnObject(helmet2);
	}

	// If the helmet is loaded
	if (helmet2) {
		helmet2.rotation.y += 0.01; // Rotate
		helmet2.position.z =
			helmetBasePosition2.z + Math.sin(helmetFloatOffset2) * 0.01; // Float
	}

	renderer2.render(scene2, camera2);
}
controls.enabled = false; //
// Ensure controls focus on the object when animation completes
function resetCameraPosition() {
	camera2.position.x = lastCameraPosition.x;
	camera2.position.y = lastCameraPosition.y;
	camera2.position.z = lastCameraPosition.z;
	camera2.lookAt(0, 0, 0); // Refocus the camera
	focusCameraOnObject(helmet2); // Update the controls target to the helmet's position
}

let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
	// Disable controls during touch events to allow scrolling
	const handleTouchStart = () => {
		controls.enabled = false; // Disable OrbitControls
	};

	const handleTouchEnd = () => {
		controls.enabled = true; // Re-enable OrbitControls
	};

	// Attach touch event listeners
	window.addEventListener('touchstart', handleTouchStart);
	window.addEventListener('touchend', handleTouchEnd);
}

// Ensure scroll interaction works with other input types as well
function startScrollCamera() {
	if (isScrollHandlerActive) return; // Prevent multiple bindings

	let lastScrollTop = 0;

	scrollHandler = () => {
		const scrollTop =
			window.pageYOffset || document.documentElement.scrollTop;

		// Only update camera position when controls are disabled
		if (!controls.enabled) {
			if (scrollTop > lastScrollTop) {
				// Scrolling down
				camera2.position.z += 0.0005; // Move camera away (increase Z position)
			} else {
				// Scrolling up
				camera2.position.z -= 0.0005; // Move camera closer (decrease Z position)
			}
		}

		lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative scrolling
	};

	console.log('startScrollCamera');
	window.addEventListener('scroll', scrollHandler);
	isScrollHandlerActive = true; // Update the state
}

function stopScrollCamera() {
	if (!isScrollHandlerActive) return; // No need to remove if not active

	window.removeEventListener('scroll', scrollHandler);
	isScrollHandlerActive = false; // Update the state
	console.log('stopScrollCamera');
}

// Reset the camera to its original position
function resetCameraPosition() {
	camera2.position.x = lastCameraPosition.x;
	camera2.position.y = lastCameraPosition.y;
	camera2.position.z = lastCameraPosition.z;
	camera2.lookAt(0, 0, 0); // Refocus the camera
}

// Start animation with observer
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			if (trig === 0) {
				console.log('Triggered action!');
				startTime2 = Date.now(); // Initialize start time
				animate2();
				trig = 1; // Prevent re-triggering
			}
			startScrollCamera(); // Start scroll interaction
		} else {
			stopScrollCamera();
			resetCameraPosition(); // Reset camera when element is out of view
		}
	});
});

observer.observe(bl);

window.addEventListener('resize', () => {
	camera2.aspect = window.innerWidth / window.innerHeight;
	camera2.updateProjectionMatrix();
	renderer2.setSize(window.innerWidth, window.innerHeight);
});
