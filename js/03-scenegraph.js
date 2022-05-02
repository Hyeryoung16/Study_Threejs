import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.140.0/examples/jsm/controls/OrbitControls.js';

class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias : true });
    renderer.setPixelRatio(window.devicePixelRatio); 
    divContainer.appendChild(renderer.domElement); 
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupControls();
    this._setupLight();
    this._setupModel();

    window.onresize = this.resize.bind(this); 
    this.resize();
    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
    camera.position.z = 20;
    camera.position.x = 10;
    camera.position.y = 5;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 2;
    const light = new THREE.PointLight(color, intensity)
    light.position.set(0, 0, 0);
    this._scene.add(light);

    const light2 = new THREE.AmbientLight(0x555555);
    this._scene.add(light2);
  }

  _setupModel() {

    const textureLoader = new THREE.TextureLoader();

    // X AXIS
    const x_points = [];
    x_points.push( new THREE.Vector3(0, 0, 0) );
    x_points.push( new THREE.Vector3(15, 0, 0) );
    const x_geometry = new THREE.BufferGeometry().setFromPoints(x_points);
    const x_material = new THREE.LineBasicMaterial({color : 0xff0000 });
    const x_line = new THREE.Line(x_geometry, x_material);
    this._scene.add(x_line);

    // Y AXIS
    const y_points = [];
    y_points.push( new THREE.Vector3(0, 0, 0) );
    y_points.push( new THREE.Vector3(0, 15, 0) );
    const y_geometry = new THREE.BufferGeometry().setFromPoints(y_points);
    const y_material = new THREE.LineBasicMaterial({color : 0x00ff00 });
    const y_line = new THREE.Line(y_geometry, y_material);
    this._scene.add(y_line);

    // Z AXIS
    const z_points = [];
    z_points.push( new THREE.Vector3(0, 0, 0) );
    z_points.push( new THREE.Vector3(0, 0, 15) );
    const z_geometry = new THREE.BufferGeometry().setFromPoints(z_points);
    const z_material = new THREE.LineBasicMaterial({color : 0x0000ff });
    const z_line = new THREE.Line(z_geometry, z_material);
    this._scene.add(z_line);

    // SOLAR SYSTEM
    const solarSystem = new THREE.Object3D();
    this._scene.add(solarSystem);

    // INFO
    const radius = 1;
    const widthSegments = 20;
    const heightSegments = 20;
    
    // SUN
    const sun_geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const sun_texture = textureLoader.load("../texture/sun.jpg");
    const sun_material = new THREE.MeshStandardMaterial({color : 0xffff00, emissive : 0x555500, emissiveMap:sun_texture, emissiveIntensity:2});
    const sun = new THREE.Mesh(sun_geometry, sun_material);
    sun.scale.set(3, 3, 3);
    solarSystem.add(sun);

    // EARTH ORBIT
    const earthOrbit = new THREE.Object3D();
    solarSystem.add(earthOrbit);
    earthOrbit.position.x = 10;
    earthOrbit.rotation.z = -(23.5) * Math.PI / 180;

    // EARTH 
    const earth_geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const earth_texture = textureLoader.load("../texture/earth.jpg");
    const earth_material = new THREE.MeshPhongMaterial({map : earth_texture});
    const earth = new THREE.Mesh(earth_geometry, earth_material);
    earthOrbit.add(earth);

    // EARTH AXIS
    const earth_axis_points = [];
    earth_axis_points.push(new THREE.Vector3(0, -3, 0));
    earth_axis_points.push(new THREE.Vector3(0, 3, 0));
    const earth_axis_geometry = new THREE.BufferGeometry().setFromPoints(earth_axis_points);
    const earth_axis_material = new THREE.LineBasicMaterial({color : 0x00ff00 });
    const earth_axis = new THREE.Line(earth_axis_geometry, earth_axis_material);
    earthOrbit.add(earth_axis);


    // MOON ORBIT
    const moonOrbit = new THREE.Object3D();
    earthOrbit.add(moonOrbit);
    moonOrbit.position.x = 2;

    // MOON
    const moon_geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const moon_texture = textureLoader.load("../texture/moon.jpg")
    const moon_material = new THREE.MeshPhongMaterial({map: moon_texture});
    const moon = new THREE.Mesh(moon_geometry, moon_material);
    moon.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moon);
    
    this._solarSystem = solarSystem;
    this._sun = sun;
    this._earthOrbit = earthOrbit;
    this._earth = earth;
    this._moonOrbit = moonOrbit;
    this._moon = moon;
  }

  _setupControls(){
    new OrbitControls(this._camera, this._divContainer);
  }

  resize(){
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width/height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }

  render(time){
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time){
    time *= 0.001; //seconde unit
    this._sun.rotation.y = time / 4;
    this._solarSystem.rotation.y = time / 2;
    this._earthOrbit.rotation.y = time * 2;
  }
}

window.onload = function() {
  new App();
}