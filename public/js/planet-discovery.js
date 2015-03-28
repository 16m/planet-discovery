var camera,
	controls,
	parentCounterClockWise,
	parentClockWise,
	pivot,
	renderer,
	scene;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addTrajectory(xRadius, yRadius) {
	var curve = new THREE.EllipseCurve(
		0,  0,
		yRadius, yRadius,
		0,  2 * Math.PI,
		false
	);
	var path = new THREE.Path( curve.getPoints( 50 ) );
	var geometry = path.createPointsGeometry( 50 );
	var material = new THREE.LineBasicMaterial( { color : 0xffffff } );
	var ellipse = new THREE.Line( geometry, material );
	scene.add(ellipse);
}

function render() {
	requestAnimationFrame( render );
	parentCounterClockWise.rotation.z += 0.01;
	parentClockWise.rotation.z -= 0.01;
	controls.update();
	this.renderer.render( scene, camera );
}

function initControls() {
	controls = new THREE.OrbitControls( camera );
	controls.minDistance = 1;
	controls.maxDistance = 300;
}

function initLogBox() {
	log = document.createElement( 'div' );
	log.style.position = 'absolute';
	log.style.bottom = '0px';
	log.style.width = '100%';
	log.style.height = '150px';
	log.style.fontFamily = 'Courier';
	log.style.fontWeight = 'bold';
	log.style.fontSize = '9px';
	log.style.backgroundColor = '#ffffff';
	log.style.color = '#000000';
	log.id = 'log';
	document.body.appendChild( log );
}

function initInfo() {
	info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '15px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#fff';
	info.style.fontWeight = 'bold';
	info.style.backgroundColor = 'transparent';
	info.style.zIndex = '1';
	info.style.fontFamily = 'Monospace';
	info.innerHTML = 'Drag mouse to rotate camera; Scroll to zoom';
	document.body.appendChild( info );
}

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer({ antialias: false });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);
	THREE.ImageUtils.crossOrigin = '';
	camera.position.z = 10;
	camera.position.x = 0;
	camera.position.y = 0;
	initControls();
	initInfo();
	initLogBox();
	addSun();
};

function addPivots() {
	parentCounterClockWise = new THREE.Object3D();
	parentClockWise = new THREE.Object3D();
	pivotCounterClockWise = new THREE.Object3D();
	pivotClockWise = new THREE.Object3D();
	scene.add( parentCounterClockWise );
	scene.add( parentClockWise );
	pivotCounterClockWise.rotation.z = 0;
	pivotClockWise.rotation.z = 0;
	parentCounterClockWise.add( pivotCounterClockWise );
	parentClockWise.add( pivotClockWise );
}

function addSun() {
	var geometry = new THREE.SphereGeometry( 1, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {
		map: THREE.ImageUtils.loadTexture('http://localhost:3000/textures/sun.bmp')
	} );
	var sun = new THREE.Mesh( geometry, material );
	scene.add(sun);
}

function addPlanet() {
	if (typeof addPlanet.distance == 'undefined')
		addPlanet.distance = 2;
	var size = getRandomInt(2, 7) / 10;
	var geometry = new THREE.SphereGeometry( size, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {
		map: THREE.ImageUtils.loadTexture('http://localhost:3000/textures/soil.jpg')
	} );
	var planet = new THREE.Mesh( geometry, material );
	var range = getRandomInt(0, 40);
	if (range < 10) {
		x = 1 * addPlanet.distance;
		y = 0;
		addTrajectory(0, x);
	}
	else if (range < 20) {
		x = 0;
		y = 1 * addPlanet.distance;
		addTrajectory(0, y);
	}
	else if (range < 30) {
		x = -1 * addPlanet.distance;
		y = 0;
		addTrajectory(0, Math.abs(x));
	}
	else {
		x = 0;
		y = -1 * addPlanet.distance;
		addTrajectory(0, Math.abs(y));
	}
	planet.position.x = x;
	planet.position.y = y;
	addPlanet.distance++;

	if (getRandomInt(1,10) >= 5)
		pivotCounterClockWise.add(planet);
	else
		pivotClockWise.add(planet);
}
init();
addPivots();
render();
var socket = io();
socket.emit('launch spider', '');
socket.on('new planet', function (msg) {
	document.getElementById('log').innerHTML = '> ' + msg + '<br/>' + document.getElementById('log').innerHTML;
	addPlanet();
})
