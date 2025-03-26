import { createEntity } from "./entities/entities.js";
import { loadObj } from "./entities/objParser.js";
import { createCorn } from "./plant.js";

let farmlandModel;

export async function loadFarmlandModel() {
    farmlandModel = await loadObj("objects/farmland.obj")
}

export function createFarmland() {
    let farmland = createEntity(farmlandModel);
    farmland.onClick = onClick;
    farmland.onUpdate = onUpdate;
    return farmland;
}

function onUpdate() {
    if (this.plant) this.plant.mouseOver = this.mouseOver;
}

function onClick() {
    if (this.plant) {
        if (this.plant.ready) {
            this.plant.setParent(null);
            this.plant = null;
        }
    } else {
        this.plant = createCorn();
        this.plant.setParent(this);
    }
}
