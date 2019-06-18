
import {Entity,EntityComponent,EntitySystem,Vec3Component} from "./ecs"
import {sim} from "./sim"

//import osn from "../lib/open-simplex-noise/index.ts";
import * as tf from '@tensorflow/tfjs';

const LIMIT = 1

function random(min,max) {
    return Math.random() * (max - min) + min

}

class Acceleration extends Vec3Component {
    update() {
        let vel = this.entity.getComponent(velocity);

        vel.x = Math.min(0.01,this.x) + vel.x
        vel.y = Math.min(0.01,this.y) + vel.y
        vel.z = Math.min(0.01,this.z) + vel.z

        this.x = 0
        this.y = 0
        this.z = 0
    }
}
class Velocity extends Vec3Component {
    update() {
        let pos = this.entity.getComponent(positioning);

        pos.x = Math.min(0.01,this.x) + pos.x
        pos.y = Math.min(0.01,this.y) + pos.y
        pos.z = Math.min(0.01,this.z) + pos.z
    }
}

class WanderingBehavior extends EntityComponent {
    update() {
        let accel = this.entity.getComponent(acceleration)
        const factor = 0.5
        accel.x = random(-1,1) * factor
        accel.y = random(-1,1) * factor
        accel.z = random(-1,1) * factor

    }
}

class Renderable extends EntityComponent {
    constructor(entity,data,system) {
        super(entity,data,system)
        sim.sceneManager.add(this.entity.getComponent(positioning))
    }
    update() {
    }
}

const pheremones = tf.variable(tf.fill([LIMIT * 2 +1,LIMIT * 2 + 1,LIMIT * 2 + 1,3],0))
class Incentive extends EntityComponent {
    async update() {
        let buf = await pheremones.buffer()
        let pos = this.entity.getComponent(positioning)
        let {x,y,z} = pos;
        
        x = Math.round(LIMIT  + x)
        y = Math.round(LIMIT  + y)
        z = Math.round(LIMIT  + z)

        if(x < 0) x = 0
        if(y < 0) y = 0
        if(z < 0) z = 0

        if(x > LIMIT)  x = LIMIT - 1
        if(y > LIMIT)  y = LIMIT - 1
        if(z > LIMIT)  z = LIMIT - 1

        let px = buf.get(x,y,z,0)
        let py = buf.get(x,y,z,1)
        let pz = buf.get(x,y,z,2)

        let accel = this.entity.getComponent(acceleration)

        const factor = 0.1

        accel.x += (px + 0.01) * factor
        accel.y += (py + 0.01) * factor
        accel.z += (pz + 0.01) * factor

        buf.set(x,y,z,0,px+0.01)
        buf.set(x,y,z,1,py+0.01)
        buf.set(x,y,z,2,pz+0.01)

        pheremones.assign(buf.toTensor())

    }
}
class Friction extends EntityComponent {
    update() {

        let accel = this.entity.getComponent(acceleration);
        accel.x *= 0.1
        accel.y *= 0.1
        accel.z *= 0.1
    }
}

class Scale extends Vec3Component { }
class Position extends Vec3Component { 
    update() {

        let vel = this.entity.getComponent(velocity);
        let pos = this.entity.getComponent(positioning);
        let accel = this.entity.getComponent(acceleration);

        let limit = LIMIT;

    }
}


export const positioning = new EntitySystem(Position)
positioning.limit = LIMIT;
export const acceleration = new EntitySystem(Acceleration)
export const velocity = new EntitySystem(Velocity)
export const wandering = new EntitySystem(WanderingBehavior)
export const rendering = new EntitySystem(Renderable)
export const scale = new EntitySystem(Scale)
export const incentive = new EntitySystem(Incentive)
export const friction = new EntitySystem(Friction)

export const systems = {positioning,acceleration,velocity,wandering,rendering,scale,incentive,friction}