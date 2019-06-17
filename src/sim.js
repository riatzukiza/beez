import { EventEmitter } from "events";

import * as ECS from "./ecs"
import {systems} from "./components"

class Bee extends ECS.Entity {
    constructor(pos={x:0,y:0,z:0},velocity={x:0,y:0,z:0},acceleration={x:0,y:0,z:0}) {
        super()

        this.addComponent({},systems.wandering)
        this.addComponent({},systems.incentive)

        this.addComponent(velocity,systems.velocity)

        this.addComponent(pos,systems.positioning)
        this.addComponent(acceleration,systems.acceleration)

        this.addComponent({},systems.rendering)
    }
}


export const sim = new EventEmitter()

sim.once("scene-ready",() => {
    for(let i = 0;i < 100;i++) {

        new Bee({x:0,y:0,z:-20})
    } 
    let thread = Promise.resolve();
    const render = async () => {
        thread =  ECS.systems.reduce(async (p,sys) => {
            await p;
            await sys.update()
        },thread)
        window.requestAnimationFrame(render);
    };
    render()
})