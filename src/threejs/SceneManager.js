import * as THREE from "three"

class SceneSubject {
    get position () {return this._position}

    get x() {return this.position.x}
    set x(v) {this.position.x = v}

    get y() {return this.position.y}
    set y(v) {this.position.y = v}

    get z() {return this.position.z}
    set z(v) {this.position.z = v}


    constructor(scene,position = {x : 10,y : 10,z : -20}) {

        const radius = 2;
        this._position = position

        const mesh = new THREE.Mesh(
            new THREE.IcosahedronBufferGeometry(radius, 2), 
            new THREE.MeshStandardMaterial({ flatShading: true })
        );

        mesh.position.set(this.position.x,this.position.y,this.position.z);

        scene.add(mesh);
        
        this.update = function(time) {
            //console.log(this.position.x,this.position.y,this.position.z)
            mesh.position.set(this.position.x,this.position.y,this.position.z);
            mesh.scale.set(0.1,0.1,0.1)

        }
    }
}
class GeneralLights {
    constructor(scene) {
	
        const light = new THREE.PointLight("#2222ff", 1);
        scene.add(light);
        
        this.update = function(time) {
            light.intensity = (Math.sin(time)+1.5)/1.5;
            light.color.setHSL( Math.sin(time), 0.5, 0.5 );
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