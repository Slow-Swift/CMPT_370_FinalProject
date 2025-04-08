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
    return farmland;
}

function onUpdate() {
    const baseScale = this.unlocked ? 1.0 : 0.4;
    const scaleMultiplier = (this.mouseOver && this.canInteract()) ? 1.1 : 1.0;
    if (this.plant) this.plant.mouseOver = this.mouseOver;
    this.transform.scaleAll(baseScale * scaleMultiplier);
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
