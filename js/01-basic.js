import * as THREE from "../lib/build/three.module.js"

class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias : true }); // antialias : object들이 렌더링 될떄, 경계선이 계단현상 없이 자연스럽게
    renderer.setPixelRatio(window.devicePixelRatio); // 픽셀의 ratio 값을 설정
    divContainer.appendChild(renderer.domElement); // 렌더러를 div 컨테이너의 자식으로 추가 ( renderer.domElement == canvas 타입의 dom 객체 )
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();

    /***** 창크키 변화했을 떄 이벤트 설정 ****/
    window.onresize = this.resize.bind(this); 
    this.resize();
    /***************************************/

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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({color : 0x44a88});
    const cube = new THREE.Mesh(geometry, material);
    this._scene.add(cube);
    this._cube = cube;
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
    this._cube.rotation.x = time;
    this._cube.rotation.y = time;
  }
}

window.onload = function() {
  new App();
}