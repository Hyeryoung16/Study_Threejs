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
    this._setupControls();
    // this._setupModel_Points();
    // this._setupModel_Line();
    this._setupModel_Mesh();

    window.onresize = this.resize.bind(this); 
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
    camera.position.z = 7;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupControls(){
    new OrbitControls(this._camera, this._divContainer);
  }


  _setupModel_Points() {

    /* -5~5 사이의 랜덤 값으로 좌표를 구해서 vertices 배열에 담음 */
    const vertices = [];
    for(let i=0; i<10000; i++){
      const x = THREE.Math.randFloatSpread(5);
      const y = THREE.Math.randFloatSpread(5);
      const z = THREE.Math.randFloatSpread(5);
      vertices.push(x,y,z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3) /* 3 : vertices에서 3개가 하나의 좌표임을 나타냄 */
    );
    
    const dot = new THREE.TextureLoader().load("../texture/dot.png");
    const material = new THREE.PointsMaterial({
      map : dot,
      alphaTest : 0.5, /* 픽셀 값 중 alpha 값이 0.5 보다 큰 경우만 픽셀 렌더링 */
      color : 0x00ffff,
      size : 0.1,
      sizeAttenuation : true /* 포인트 크기가 카메라 거리에 따라서 감소하는지 여부 */
    });

    const points = new THREE.Points(geometry, material);
    this._scene.add(points);
  }

  _setupModel_Line(){
    const vertices = [
      -1, 1, 0,
      1, 1, 0,
      -1, -1, 0,
      1, -1, 0
    ];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({
      color : 0xff0000
    });

    const material_dash = new THREE.LineDashedMaterial({
      color : 0xffff00,
      dashSize : 0.2, /* 그려지는 구간 길이 */
      gapSize: 0.1, /* 비어진 구간 길이 */
      scale : 1
    });

    const line = new THREE.Line(geometry, material);

    const lineSegment = new THREE.LineSegments(geometry, material);
    lineSegment.position.x = 3;

    const lineLoop = new THREE.LineLoop(geometry, material_dash);
    lineLoop.computeLineDistances(); /* 선의 길이 구하는 작업 수행 필요 */
    lineLoop.position.x = -3;

    this._scene.add(line);
    this._scene.add(lineSegment);
    this._scene.add(lineLoop);
  }

  _setupModel_Mesh(){
    /* Mesh는 Material의 속성을 전부 상속받는다 */
    const material = new THREE.MeshBasicMaterial({

      visible : true, /* Material 기본 속성 */
      transparent : true, /* Material 기본 속성 */
      opacity : 0.5, /* Material 기본 속성 */
      depthTest : true, /* Material 기본 속성 */
      depthWrite : true, /* Material 기본 속성 */
      side : THREE.FrontSide, /* Material 기본 속성 */

      color : 0xffff00,
      wireframe : false,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    box.position.set(-1, 0, 0);
    this._scene.add(box);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
    sphere.position.set(1, 0, 0);
    this._scene.add(sphere);
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
  }
}

window.onload = function() {
  new App();
}