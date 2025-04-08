import { createEntity } from "./entities/entities.js";
import { loadObj } from "./entities/objParser.js";
import { unlockFarmland } from "./farmlandManager.js";
import { createCorn } from "./plant.js";

let farmlandModelData;

export async function loadFarmlandModel() {
    farmlandModelData = await loadObj("objects/farmland.obj")
}

export function createFarmland(x, y) {
    let farmland = createEntity(...farmlandModelData);
    farmland.onClick = onClick;
    farmland.onUpdate = onUpdate;
    farmland.unlocked = false;
    farmland.transform.position = [2.5 * x, 0, 2.5 * y];
    farmland.location = [x,y];
    farmland.canInteract = canInteract;
    farmland.baseColor = farmland.materials[0].color;
    return farmland;
}

function onUpdate() {
    let scale = this.unlocked ? 1.0 : 0.4;
    this.materials[0].color = this.baseColor;
    if (this.mouseOver && this.canInteract()) {
        scale *= 1.1;
        this.materials[0].color = [this.baseColor[0] * 2, this.baseColor[1] * 2, this.baseColor[2] * 2]
    }
    if (this.plant) this.plant.mouseOver = this.mouseOver;
    this.transform.scaleAll(scale);
}

function onClick() {
    if (!this.unlocked) {
        unlockFarmland(this);
        return;
    }
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

function canInteract() {
    return !this.unlocked || !this.plant || this.plant.ready;
}
