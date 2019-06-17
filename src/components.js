
import {Entity,EntityComponent,EntitySystem,Vec3Component} from "./ecs"
import {sim} from "./sim"
import * as tf from '@tensorflow/tfjs';

const LIMIT = 5

class Acceleration extends Vec3Component {
    update() {
        let vel = this.entity.getComponent(velocity);
//        if(this.x && !Number.isNaN(this.x)) console.log("acceleration",{ax:this.x,ay:this.y,az:this.z})

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

const pheremones = tf.variable(tf.fill([LIMIT * 2 +1,LIMIT * 2 + 1,LIMIT * 2 + 1,3],0))
class Incentive extends EntityComponent {
    async update() {
        let buf = await pheremones.buffer()
        let pos = this.entity.getComponent(positioning)
        let {x,y,z} = pos;
        x = Math.round(LIMIT/2  + x)
        y = Math.round(LIMIT/2  + y)
        z = Math.round(LIMIT/2  + z)

        let px = buf.get(x,y,z,0)
        let py = buf.get(x,y,z,1)
        let pz = buf.get(x,y,z,2)

        let accel = this.entity.getComponent(acceleration)

        const factor = 0.3

        // accel.x = px * factor
        // accel.y = py * factor
        // accel.y = py * factor
        // if(x) console.log("pos",{x,y,z})
        // if(px) console.log("pheremones",{px,py,pz})
        // if(accel.x && !Number.isNaN(accel.x)) console.log("acceleration",{ax:accel.x,ay:accel.y,az:accel.z})

        accel.x += (px + 0.1) * factor
        accel.y += (py + 0.1) * factor
        accel.z += (pz + 0.1) * factor

        buf.set(x,y,z,0,px+0.1)
        buf.set(x,y,z,1,py+0.1)
        buf.set(x,y,z,2,pz+0.1)
        pheremones.assign(buf.toTensor())

    }
}
class Friction extends EntityComponent {
    update() {

        let accel = this.entity.getComponent(acceleration);
        accel.x *= 0.5
        accel.y *= 0.5
        accel.z *= 0.5
    }
}

class Scale extends Vec3Component { }
class Position extends Vec3Component { 
    update() {

        let vel = this.entity.getComponent(velocity);
        let pos = this.entity.getComponent(positioning);

        let limit = LIMIT;

        if(this.x > limit || this.x < -limit) {
            vel.x = vel.x * -1;

            if(this.x > limit) {
                pos.x = limit - 1
            } else {
                pos.x = -(limit -1)
            }
        }
        if(this.y > limit || this.y < -limit) {
            vel.y = vel.y * -1

            if(this.y > limit) {
                pos.y = limit - 1
            } else {
                pos.y = -(limit -1)
            }
        }
        if(this.z > limit || this.z < -limit) {
            vel.z = vel.z * -1

            if(this.x > limit) {
                pos.x = limit - 1
            } else {
                pos.x = -(limit -1)
            }
        }
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

export const systems = {positioning,acceleration,velocity,wandering,rendering,scale,incentive}