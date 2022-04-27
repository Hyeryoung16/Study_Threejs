import * as THREE from "../lib/build/three.module.js"
import {OrbitControls} from "../lib/example/jsm/controls/OrbitControls.js"

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
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this); 
    this.resize();
    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
    camera.position.z = 2;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2); // 1. 큐브 
    //const geometry = new THREE.CircleGeometry(0.9, 20, 0, Math.PI*2); // 2. 원판 : 반지름, 둘레 분할 수, 시작각, 연장각
    // const geometry = new THREE.ConeGeometry(0.5, 1.5, 20, 3, false, 0, Math.PI*2); // 3. 원뿔 : 밑면반지름, 높이, 둘레 분할 수, 높이 분할 수, 밑면 개방 여부, 시작각, 연장각
    // const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20, 3, true, 0, Math.PI); // 4. 원통 : 윗면반지름, 밑면반지금, 높이, 둘레 분할 수, 높이 분할 수, 윗/밑면 개방 여부, 시작각, 연장각
    // const geometry = new THREE.SphereGeometry(0.8, 20, 20, 0, Math.PI/2, 0, Math.PI/2 ); // 5. 구 : 반지름, 수평 방향 분할 수, 수직 방향 분할 수, 수평 방향 시작각, 수평 방향 연장각, 수직 방향 시작각, 수직 방향 연장각
    // const geometry = new THREE.RingGeometry(0.7, 1.2, 10, 2, 0, Math.PI ); // 6. 링 : 내부반지름, 외부반지름, 둘레 분할 수, 두께 분할 수, 시작각, 연장각
    // const geometry = new THREE.PlaneGeometry(1, 2, 3, 2); // 7. 평면 : 너비, 높이, 너비 방향 분할 수, 높이 방향 분할 수
    // const geometry = new THREE.TorusGeometry(1, 0.3, 10, 20, Math.PI); // 8. 3차원반지모양 : 반지름, 원통 반지름, 원통 둘레 분할 수, 둘레 분할 수, 연장각
    // const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 20, 2); // 9. 반지름, 원통 반지름, 분할 수, 원통 둘레 분할 수, 반복 횟 수 값

    const fillMaterial = new THREE.MeshPhongMaterial({color : 0x515151});
    const cube = new THREE.Mesh(geometry, fillMaterial);

    const lineMaterial = new THREE.LineBasicMaterial({color : 0xffff00});
    const line = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry), lineMaterial
    )

    const group = new THREE.Group();
    group.add(cube);
    group.add(line);

    this._scene.add(group);
    this._cube = group;
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
    //this._cube.rotation.x = time;
    //this._cube.rotation.y = time;
  }
}

window.onload = function() {
  new App();
}