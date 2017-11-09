function CelestialObject(geometry = undefined, material = undefined, mesh = undefined, revolution = undefined, rotation = undefined) {
	this.geometry = geometry;
	this.material = material;
	this.mesh = mesh;
	this.revolution = revolution;
	this.rotation = rotation;
	this.position = function() {
		return this.mesh.position;
	}
	this.get_rotation = function() {
		return this.mesh.rotation;
	}
}
function Star(geometry = undefined, material = undefined, mesh = undefined, revolution = undefined, rotation = undefined, light = undefined) {
	CelestialObject.call(this, geometry, material, mesh, revolution, rotation);
	this.light = light;
}
function Game(scene = undefined, camera = undefined, renderer = undefined) {
	this.scene = scene;
	this.camera = camera;
	this.renderer = renderer;
}
let game = new Game(
	new THREE.Scene(),
	new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1, 1000),
	new THREE.WebGLRenderer({antialias: true})
);
game.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(game.renderer.domElement);
let loader = new THREE.TextureLoader();
let sun = new CelestialObject();
let pair_sun = new CelestialObject();
let earth = new CelestialObject();
let moon = new CelestialObject();
loader.load('./assets/water.jpg', skip);
function skip(texture) {
	earth.material = new THREE.MeshLambertMaterial({map: texture});
	loader.load('./assets/texture.jpg', main);
}
function main(texture) {
	moon.material = new THREE.MeshLambertMaterial({map: texture});
	sun.material = new THREE.MeshLambertMaterial({emissive: 0xffffff});
	pair_sun.material = new THREE.MeshLambertMaterial({emissive: 0xff0000});
	sun.geometry = new THREE.SphereGeometry(12);
	pair_sun.geometry = new THREE.SphereGeometry(20);
	earth.geometry = new THREE.SphereGeometry(10);
	moon.geometry = new THREE.SphereGeometry(1);
	sun.mesh = new THREE.Mesh(sun.geometry, sun.material);
	sun.revolution = Math.PI / 100;
	pair_sun.mesh = new THREE.Mesh(pair_sun.geometry, pair_sun.material);
	earth.mesh = new THREE.Mesh(earth.geometry, earth.material);
	earth.rotation = Math.PI / 150;
	earth.revolution = Math.PI / 400;
	moon.mesh = new THREE.Mesh(moon.geometry, moon.material);
	moon.revolution = Math.PI / 200;
	sun.position().set(20,0,0);
	pair_sun.position().set(-20,0,0);
	earth.position().set(150,0,150);
	moon_earth_dist = new THREE.Vector3(20,0,20);
	moon.position().addVectors(earth.position(), moon_earth_dist);
	game.scene.add(sun.mesh);
	game.scene.add(pair_sun.mesh);
	game.scene.add(moon.mesh);
	game.scene.add(earth.mesh);
	game.camera.position.set(0,100,300);
	game.camera.lookAt(0,0,0);
	let center = new THREE.Vector3(0,0,0);
	sun.light = new THREE.PointLight(0xdd90a5, 5, 0);
	sun.light.position.set(20, 0, 0);
	game.scene.add(sun.light);
	pair_sun.light = new THREE.PointLight(0xff0000, 5, 0);
	pair_sun.light.position.set(-20, 0, 0);
	game.scene.add(pair_sun.light);
	let revAxis = new THREE.Vector3(0,1,0);
	let rotAxis = new THREE.Vector3(-0.53283302033,-0.84622040417,0);
	let rotation = new THREE.Quaternion();
	rotation.setFromAxisAngle(rotAxis, earth.rotation);
	function animate() {
		requestAnimationFrame( animate );
		sun.get_rotation().y += 0.01;
		pair_sun.get_rotation().y += 0.01;
		moon.get_rotation().y += 0.03;
		earth.mesh.applyQuaternion(rotation);
		rotateAboutPoint(sun.mesh, center, revAxis, sun.revolution);
		rotateAboutPoint(sun.light, center, revAxis, sun.revolution);
		rotateAboutPoint(pair_sun.mesh, center, revAxis, sun.revolution);
		rotateAboutPoint(pair_sun.light, center, revAxis, sun.revolution);
		rotateAboutPoint(earth.mesh, center, revAxis, earth.revolution);
		rotateAboutPoint(moon.mesh, center, revAxis, earth.revolution);
		rotateAboutPoint(moon.mesh, earth.position(), revAxis, moon.revolution);
		game.renderer.render( game.scene, game.camera );
	}
	animate();
}
function rotateAboutPoint(obj, point, axis, theta) {
	let distance = new THREE.Vector3();
	distance.subVectors(point, obj.position);
	let revolution = new THREE.Quaternion();
	revolution.setFromAxisAngle(axis, theta);
	obj.position.add(distance);
	distance.applyQuaternion(revolution);
	obj.position.sub(distance);
}
