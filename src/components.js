
import {Entity,EntityComponent,EntitySystem,Vec3Component} from "./ecs"
import {sim} from "./sim"
import * as tf from '@tensorflow/tfjs';

class Acceleration extends Vec3Component {
    update() {
        let vel = this.entity.getComponent(velocity);
        vel.x = this.x + vel.x
        vel.y = this.y + vel.y
        vel.z = this.z + vel.z

        this.x = 0
        this.y = 0
        this.z = 0
    }
}
class Velocity extends Vec3Component {
    update() {
        let pos = this.entity.getComponent(positioning);

        pos.x = this.x + pos.x
        pos.y = this.y + pos.y
        pos.z = this.z + pos.z
    }
}

class WanderingBehavior extends EntityComponent {
    update() {
        let accel = this.entity.getComponent(acceleration)
        const factor = 0.1
        accel.x = (Math.random() - 0.5) * factor
        accel.y = (Math.random() - 0.5) * factor
        accel.z = (Math.random() - 0.5) * factor

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

class Incentive extends EntityComponent {
    update() {

    }
}
class Friction extends EntityComponent {
    update() {

        let vel = this.entity.getComponent(velocity);
        vel.x *= 0.5
        vel.y *= 0.5
        vel.z *= 0.5
    }
}

class Scale extends Vec3Component { }
class Position extends Vec3Component { 
    update() {

        let vel = this.entity.getComponent(velocity);
        const limit = 10;
        let {x,y,z} = vel 
        console.log({x,y,z})

        if(this.x > limit || this.x < -limit) {
            vel.x = vel.x * -1
        }
        if(this.y > limit || this.y < -limit) {
            vel.y = vel.y * -1
        }
        if(this.z > limit || this.z < -limit) {
            vel.z = vel.z * -1
        }
    }
}


export const positioning = new EntitySystem(Position)
export const acceleration = new EntitySystem(Acceleration)
export const velocity = new EntitySystem(Velocity)
export const wandering = new EntitySystem(WanderingBehavior)
export const rendering = new EntitySystem(Renderable)
export const scale = new EntitySystem(Scale)
export const incentive = new EntitySystem(Incentive)

export const systems = {positioning,acceleration,velocity,wandering,rendering,scale,incentive}