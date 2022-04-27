import * as THREE from "../lib/build/three.module.js"
import {OrbitControls} from "../lib/example/jsm/controls/OrbitControls.js"
import {FontLoader} from "../lib/example/jsm/loaders/FontLoader.js"
import {TextGeometry} from "../lib/example/jsm/geometries/TextGeometry.js"

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

    /**** Shape, Tube, Lathe, Extrue Geometry ****/
    // this._setupGeometryShape();
    // this._setupGeometryTube();
    // this._setupGeometryLathe();
    // this._setupGeometryExtrude();
    // this._setupModel();

    /**** Text ****/
    this._setupTextModel();

    this._setupControls();

    window.onresize = this.resize.bind(this); 
    this.resize();
    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
    camera.position.z = 15;
    camera.position.x = -10;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupGeometryShape() {
    const shape = new THREE.Shape();
    const x = -2.5, y =-5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y); 
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5); 
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5); 
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y); 
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5); 
    
    this._geometry = new THREE.ShapeGeometry(shape);
  }

  _setupGeometryTube() {
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t*3 - 1.5;
        const ty = Math.sin(2*Math.PI*t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);
    this._geometry = new THREE.TubeGeometry(path, 30, 0.5, 20, true); // 튜브 진행 방향, 튜브 진행 방향 분할 수, 원통 반지름, 원통 분할 수, 양끝 연결 여부
  }

  _setupGeometryLathe(){
    const points = [];
    for (let i=0; i<10; i++) {
      points.push(new THREE.Vector2(Math.sin(i*0.2)*3 + 3, (i-5)*0.8));
    }
    this._geometry = new THREE.LatheGeometry(points, 20, 0, Math.PI); // 회전시킬 포인트셋, 회전 분할 수, 시작각, 연장각 
  }

  _setupGeometryExtrude(){
    const shape = new THREE.Shape();
    const x = -2.5, y =-5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y); 
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5); 
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5); 
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y); 
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5); 

    const settings = {
      steps : 5,
      depth : 5,
      bevelEnabled : true,
      bevelThickness : 1.6,
      bevelSize : 1.5,
      bevelSegments : 5,
    }

    this._geometry = new THREE.ExtrudeGeometry(shape, settings)
  }

  _setupTextModel(){
    const fontLoader = new FontLoader();
    async function loadFont(that) {
      const url = "../lib/example/font/example.typeface.json";
      const font = await new Promise((resolve, reject) => {
        fontLoader.load(url, resolve, undefined, reject);
      });

      const geometry = new TextGeometry("HELLO", {
        font : font,
        size : 5,
        height : 1.5,
        curveSegments : 4, 
        bevelEnabled : true,
        bevelThickness : 0.7,
        bevelSize : 0.7,
        bevelSegments : 2,
      });

      const fillMaterial = new THREE.MeshPhongMaterial({color : 0x515151});
      const cube = new THREE.Mesh(geometry, fillMaterial);

      const lineMaterial = new THREE.LineBasicMaterial({color : 0xffff00});
      const line = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry), lineMaterial
      );

      const group = new THREE.Group();
      group.add(cube);
      group.add(line);

      that._scene.add(group);
      that._cube = group;
    }
    loadFont(this);
  }

  _setupModel() {
    const geometry = this._geometry;

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
  }
}

window.onload = function() {
  new App();
}