const loaderElement = document.getElementById('loader');
const progressBar = document.getElementById('file');
const loaded = document.getElementById('loaded');
let loadedModelsCount = 0; // Counter to track loaded models
const totalModels = 2; // Total number of models to load
let play = 0;
const landing = document.getElementById('bod');

window.onscroll = function () {
	nicoElement.style.opacity = '1'; // Make it visible
	nicoElement.style.opacity = 'opacity 3s ease-in-out'; // Smooth fade-in
	nicoElement.style.textShadow = '-5px 0px 0px rgb(104 0 0)';
	nicoElement.style.transition = 'color 1s ease, text-shadow 1s ease';
	renderer.domElement.style.transition = 'filter 1s ease'; // Transition over 1 second
	renderer.domElement.style.filter = 'blur(10px)';
};
window.addEventListener('scroll', function () {
	if (window.scrollY == 0) {
		play = 0;
		renderer.domElement.style.filter = 'none'; // Remove blur
		nicoElement.style.animation = 'none'; // Restart animation
		void nicoElement.offsetWidth; // Trigger reflow to reset animation
		nicoElement.style.textShadow = '-5px 0px 10px rgb(104 0 0)';
	} else {
		play = 1;
	}
});
const loadingManager = new THREE.LoadingManager(
	() => {
		// All resources are loaded
		console.log('All assets loaded');
		loaderElement.style.display = 'none';
		const nicoElement = document.querySelector('#nico');
		setTimeout(() => {
			landing.style.overflow = 'visible';
			nicoElement.style.opacity = '1'; // Make it visible
			nicoElement.style.opacity = 'opacity 3s ease-in-out'; // Smooth fade-in
			nicoElement.style.textShadow = '-5px 0px 0px rgb(104 0 0)';
			nicoElement.style.transition = 'color 1s ease, text-shadow 1s ease';
			renderer.domElement.style.transition = 'filter 1s ease'; // Transition over 1 second
			renderer.domElement.style.filter = 'blur(15px)';
			play = 1;
		}, 3000); // Delay of 3 seconds
		setTimeout(() => {
			renderer.domElement.style.filter = 'none'; // Remove blur
			nicoElement.style.animation = 'none'; // Restart animation
			void nicoElement.offsetWidth; // Trigger reflow to reset animation
			play = 0;
			startFlickerInterval();
			nicoElement.style.textShadow = '-5px 0px 10px rgb(104 0 0)';
		}, 4500);
	},
	(itemUrl, itemsLoaded, itemsTotal) => {
		// Update progress as each item is loaded

		const progress = (itemsLoaded / itemsTotal) * 100;

		console.log('progress: ', Math.ceil(progress));
		progressBar.value = Math.ceil(progress); // Update the progress bar

		loaded.innerHTML = `Loading: ${itemUrl} (${itemsLoaded}/${itemsTotal})`;
		console.log(`Loading: ${itemUrl} (${itemsLoaded}/${itemsTotal})`);

		console.log('progressBar.value: ', progressBar.value);
	},
	(url) => {
		console.error(`There was an error loading: ${url}`);
	}
);

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('assets/sw.js').then(() => {
		console.log('Service Worker registered');
	});
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	95,
	window.innerWidth / (window.innerHeight + 500),
	0.27,
	1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight + 500);

const container1 = document.getElementById('story1');
if (container1) {
	container1.appendChild(renderer.domElement);
} else {
	console.error('Element with id="bl" not found.');
}

// Handle window resize to maintain responsiveness
window.addEventListener('resize', () => {
	const newHeight = window.innerHeight + 500;
	camera.aspect = window.innerWidth / newHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, newHeight);
});
// Lighting
const redLight = new THREE.PointLight(0xff0000, 50, 100);
redLight.position.set(0, 20, 10);
scene.add(redLight);

const blueLightRight = new THREE.PointLight(0xff0000, 90, 100);
blueLightRight.position.set(10, -10, 10);
scene.add(blueLightRight);

const l2 = new THREE.PointLight(0x0000ff, 10);
l2.position.set(1.2, 2, 14);
scene.add(l2);

const l3 = new THREE.PointLight(0xff0000, 10);
l3.position.set(1.2, 2, 20);
scene.add(l3);

const l4 = new THREE.PointLight(0x00ff00, 10);
l4.position.set(1.2, 2, 20);
scene.add(l4);


const MAIN = new THREE.PointLight(0xffffff, 1000, 1000000);
MAIN.position.set(-30, 2, 20);
scene.add(MAIN);
const redLightM = new THREE.PointLight(0xff0000, 1000, 1000000);
redLightM.position.set(-30, 2, 20);
scene.add(redLightM);
const blueLightRightM = new THREE.PointLight(0x0000ff, 1000, 1000000);
blueLightRightM.position.set(-30, 2, 20);
scene.add(blueLightRightM);

// Models

const light = new THREE.PointLight(0xffffff, 0, 0); // Blue light, intensity 1

light.position.set(1.2, 4, 0);
scene.add(light);

function startFlicker() {
	const flickerDuration = 500; // Flicker lasts 500ms
	const flickerInterval = 100; // Flicker happens quickly within the 500ms

	let flickerCount = 0;
	const maxFlickers = flickerDuration / flickerInterval;

	// Temporary flickering effect
	const flickerTimer = setInterval(() => {
		light.intensity = Math.random() * 90; // Randomize light intensity
		flickerCount++;

		if (flickerCount >= maxFlickers) {
			clearInterval(flickerTimer);
			light.intensity = 0; // Reset to original intensity
		}
	}, flickerInterval);
}

// Trigger flicker every 5 seconds
let intervalId; // Variable to store the interval ID

const nicoElement = document.querySelector('#nico');

// Function to start the flicker interval

function startFlickerInterval() {
	intervalId = setInterval(() => {
		if (play == 0) {
			console.log('startFlickerInterval');
			startFlicker(); // Trigger Three.js flicker
			nicoElement.style.animation = 'none'; // Restart animation
			void nicoElement.offsetWidth; // Trigger reflow to reset animation
			nicoElement.style.animation = 'flicker 0.5s steps(2, start)';
		}
	}, 5000);
}

// Function to stop the flicker interval

function stopFlickerInterval() {
	void nicoElement.offsetWidth;
	console.log('stopFlickerInterval');
	nicoElement.style.animation = 'none !important';
	clearInterval(intervalId);
}

// Start the interval initially

// Event listener to toggle animation and apply blur
nicoElement.addEventListener('click', () => {
	// Stop the flicker animation
	play = 1;
	void nicoElement.offsetWidth;
	stopFlickerInterval();
	// Apply a blur effect to the renderer with a smooth transition
	renderer.domElement.style.transition = 'filter 1s ease'; // Transition over 1 second
	renderer.domElement.style.filter = 'blur(10px)'; // Apply blur

	// Optional: remove the blur after a delay (e.g., 2 seconds)
	setTimeout(() => {
		renderer.domElement.style.filter = 'none'; // Remove blur
		nicoElement.style.animation = 'none'; // Restart animation
		void nicoElement.offsetWidth; // Trigger reflow to reset animation
		startFlickerInterval(); // Restart the flicker effect after blur
	}, 3000);

	// Apply a transition to the text's clarity
	nicoElement.style.transition = 'color 1s ease, text-shadow 1s ease'; // Transition over 1 second
	nicoElement.style.textShadow = '-5px 0px 0px rgb(104 0 0)'; // Change text-shadow for effect

	// Optionally revert back to original state after a delay (e.g., 2 seconds)
	setTimeout(() => {
		nicoElement.style.color = '#00000000'; // Restore original transparent color
		nicoElement.style.textShadow = '-5px 0px 10px rgb(104 0 0)'; // Restore original shadow
		play = 0;
	}, 3000);

	console.log(play);
});

const gltfLoader = new THREE.GLTFLoader(loadingManager);
const loader = new THREE.GLTFLoader();
let helmet, astronaut;
let helmetBasePosition = new THREE.Vector3(); // Store base positions
let astronautBasePosition = new THREE.Vector3();

// Load Helmet Model
gltfLoader.load(
	'./assets/la_station_spatiale_internationale_iss/scene.gltf',
	function (gltf) {
		helmet = gltf.scene;
		scene.add(helmet);
		helmetBasePosition.set(-25, 23, -50); // Set base position

		helmet.position.copy(helmetBasePosition); // Apply base position
		helmet.rotation.y = 0; // Rotate 180 degrees around Y-axis
		helmet.rotation.x = 0;
		helmet.scale.set(0.5, 0.5, 0.5); //
		console.log('Helmet loaded and positioned:', helmetBasePosition);

		loadedModelsCount++;
	},
	undefined,
	function (error) {
		console.error('An error occurred with helmet:', error);
	}
);

// Load Astronaut Model
gltfLoader.load(
	'./assets/astronaut/scene.gltf',
	function (gltf) {
		astronaut = gltf.scene;
		scene.add(astronaut);

		// Set base position
		astronautBasePosition.set(4.9, 4.2, -1);
		astronaut.position.copy(astronautBasePosition);

		// Set the astronaut to face forward (negative Z-axis)
		astronaut.rotation.y = Math.PI + 18; // Rotate 180 degrees around Y-axis
		astronaut.rotation.x = 10;
		console.log(
			'Astronaut loaded, positioned, and rotated:',
			astronautBasePosition
		);

		loadedModelsCount++;
	},
	undefined,
	function (error) {
		console.error('An error occurred with astronaut:', error);
	}
);
if (loadedModelsCount === totalModels) {
	loaderElement.style.display = 'none'; // Hide loader
}

// Camera position
camera.position.z = 3.7;

// Animate the scene
let helmetFloatOffset = 0;
let astronautFloatOffset = 0;

function animate() {
	requestAnimationFrame(animate);

	// If the helmet is loaded
	if (helmet) {
		helmet.rotation.y += 0.00009; // Rotate
		helmet.rotation.x += 0.0009;

		// Oscillate around its base position
		helmetFloatOffset += 0.001;
		helmet.position.y =
			helmetBasePosition.y + Math.sin(helmetFloatOffset) * 0.1; // Float up and down
	}

	// If the astronaut is loaded
	if (astronaut) {
		astronaut.rotation.y += 0.0009; // Slower rotation
		astronaut.rotation.x += 0.0009;

		// Oscillate around its base position
		astronautFloatOffset += 0.0005;
		astronaut.position.y =
			astronautBasePosition.y + Math.sin(astronautFloatOffset) * 0.0; // Float up and down
		astronaut.position.x =
			astronautBasePosition.x + Math.sin(astronautFloatOffset) * 0.0; // Slight left/right movement
	}

	renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
