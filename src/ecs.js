
export const systems = []

export class EntityComponent {
    get system() {return this._system}
    get entity () {return this._entity}
    get data() {return this._data}
    update() {}
    constructor(entity,data,system) {
        console.log("created a component",entity,data,system)
        this._entity = entity;
        this._data = data;
        this._system = system
    }
}

export class Vec3Component extends EntityComponent {
    get x() {return this.data.x}
    get y() {return this.data.y}
    get z() {return this.data.z}

    set x(v) {this.data.x = v}
    set y(v) {this.data.y = v}
    set z(v) {this.data.z = v}
}

export class EntitySystem {
    
    constructor(ComponentType,update) {
        this._type = ComponentType;
        this._components = []
        this._entities = []
        systems.push(this)
    }
    add(entity,data) {
        const component = new this._type(entity,data,this)
        this._components.push(component)
        return component;
    }
    update() {
        for(let component of this._components) {
            component.update();
        }
    }

}

export class Entity {
    get components() { return this._components}
    get table () {return this._table}

    constructor() {
        this._components = [];
        this._table = new Map();
    }
    getComponent(type) {
        if((type instanceof EntitySystem)) return this.table.get(type)

        throw Error("component key must be an entity system")
    }
    addComponent(data,system) {
        const c = system.add(this,data)
        this.components.push(c);
        this.table.set(system,c)
    }
}