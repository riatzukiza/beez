import SceneManager from "./SceneManager"
import {sim} from "../sim"


export default containerElement => {
    const canvas = createCanvas(document,containerElement);
    const sceneManager = sim.sceneManager = new SceneManager(canvas);

    bindEventListeners();
    sim.emit("scene-ready",sceneManager)
    render();

    function createCanvas(document,containerElement) { 
        const canvas = document.createElement('canvas')
        containerElement.appendChild(canvas);
        return canvas;
    }
    function bindEventListeners() {
        window.onresize = resizeCanvas;
        resizeCanvas();
    }
    function resizeCanvas() {
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetWidth;
        sceneManager.onWindowResize();
    }
    function render(time) {
        requestAnimationFrame(render)
        sceneManager.update();
    }
}