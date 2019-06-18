import * as THREE from "three"

import osn from "../lib/open-simplex-noise/index.ts";
import ADT from "../lib/listadt"
import  CircleBuffer  from "../lib/circleBuffer";

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class SceneSubject {
    get position () {return this._position}

    get x() {return this.position.x}
    set x(v) {this.position.x = v}

    get y() {return this.position.y}
    set y(v) {this.position.y = v}

    get z() {return this.position.z}
    set z(v) {this.position.z = v}

    updateMesh() {

        const radius = 0.1;

        this.mesh = new THREE.Mesh(
            new THREE.IcosahedronBufferGeometry(radius, 1), 
            new THREE.MeshStandardMaterial({ flatShading: true ,color:this.color})
        );

        this.mesh.position.set(this.position.x,this.position.y,this.position.z);

        this.scene.add(this.mesh);
    }
    buildTailSegment() {
        var points3D = new THREE.Geometry();
        points3D.vertices.push( // here you can use 3-dimensional coordinates

            new THREE.Vector3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z),
            new THREE.Vector3(this.x,this.y,this.z),
        );
        var line = new THREE.Line(points3D, new THREE.LineBasicMaterial({ color: this.color }));
        this.scene.add(line);

        return this.tail.pushOver(line)[0]
    }
    updateTail() {
        let r = this.buildTailSegment();
        this.scene.remove(r)
    }

    constructor(scene,position = {x : 10,y : 10,z : -20}) {


        this.color = getRandomColor();
        this.scene = scene;
        this._position = position

        this.updateMesh();
        this.tail = new CircleBuffer(100);
        
        this.update = function(time) {

            //console.log(this.position.x,this.position.y,this.position.z)

            //this.updateMesh();
            this.updateTail();
            this.mesh.position.set(this.position.x,this.position.y,this.position.z);
            this.mesh.scale.set(0.1,0.1,0.1)

        }
    }
}
class GeneralLights {
    constructor(scene) {
	
        const light = new THREE.PointLight("#ffffff", 1);
        scene.add(light);
        
        this.update = function(time) {
            light.intensity = (Math.sin(time)+1.5)/1.5;
        }
    }
}
function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    return scene;
}

function buildRenderer(canvas,{width,height}) {
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias:true,alpha:true})
    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

    renderer.setPixelRatio(DPR);
    renderer.setSize(width,height)

    renderer.gammaInput = true;
    renderer.gammaOutput = true
    return renderer
}
function buildCamera({width,height}) {
    const aspectRatio = width / height;
    const fieldOfView = 60
    const nearPlane = 1
    const farPlane = 100
    const camera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane)

    return camera
}
function createSceneSubjects(scene) {
    return [new GeneralLights(scene)]
}


export default class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.clock = new THREE.Clock();

        this.screenDimensions = { width: canvas.width,
            height: canvas.height
        };

        this.scene = buildScene(this.screenDimensions)
        this.renderer = buildRenderer(this.canvas,this.screenDimensions);
        this.camera = buildCamera(this.screenDimensions);

        this.sceneSubjects = createSceneSubjects(this.scene)
    }
    update() {
        const elapsedTime = this.clock.getElapsedTime();
        for(let i = 0; i < this.sceneSubjects.length; i++)
            this.sceneSubjects[i].update(elapsedTime)

        this.renderer.render(this.scene,this.camera)
    }
    add(s) {
        this.addSubject(s)
    }
    addSubject(position) {
        this.sceneSubjects.push(new SceneSubject(this.scene,position))
    }
    onWindowResize() {
        const {width,height} = this.canvas;

        this.screenDimensions.width = width
        this.screenDimensions.height = height

        this.camera.aspect = width/height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width,height)

    }
}
