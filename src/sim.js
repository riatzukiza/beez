import { EventEmitter } from "events";

import * as ECS from "./ecs"
import {systems} from "./components"

class Bee extends ECS.Entity {
    constructor(pos={x:0,y:0,z:0},velocity={x:0,y:0,z:0},acceleration={x:0,y:0,z:0}) {
        super()

        this.addComponent({},systems.wandering)
        this.addComponent({},systems.incentive)
        this.addComponent({},systems.friction)


        this.addComponent(velocity,systems.velocity)

        this.addComponent(pos,systems.positioning)
        this.addComponent(acceleration,systems.acceleration)

        this.addComponent({},systems.rendering)
    }
}


export const sim = new EventEmitter()

let beez = []

sim.once("scene-ready",() => {

    let thread = Promise.resolve();
    let range = 2

    for(let i = 0;i < 100;i++) {
        new Bee({x:0,y:0,z:0},{x:Math.random() * range,y:Math.random() * range,z:Math.random() * range})
    } 

    const render = async () => {
        thread =  ECS.systems.reduce(async (p,sys) => {
            await p;
            await sys.update()
        },thread)
        window.requestAnimationFrame(render);
    };
    render()
})