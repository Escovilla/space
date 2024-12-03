self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('gltf-cache').then((cache) => {
			return cache.addAll(['./bfg/scene.gltf', './astronaut/scene.gltf']);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
