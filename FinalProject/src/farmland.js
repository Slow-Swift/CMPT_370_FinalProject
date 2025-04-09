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
    console.log(farmland);
    farmland.onClick = onClick;
    farmland.onUpdate = onUpdate;
    farmland.unlocked = false;
    farmland.transform.position = [2.5 * x, 0, 2.5 * y];
    farmland.location = [x,y];
    farmland.canInteract = canInteract;
    farmland.plantCrop = plantCrop;
    return farmland;
}

function onUpdate() {
    let scale = this.unlocked ? 1.0 : 0.4;
    this.materials[0].emissive = [0,0,0];
    if (this.mouseOver && this.canInteract() || applicationData.selectedFarmland == this) {
        scale *= 1.1;
        this.materials[0].emissive = [0.1, 0.1, 0.0];
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
        applicationData.selectedFarmland = this;
        applicationData.sidePanel.setPosition({right: 0});
    }
}

function plantCrop(crop) {
    if (!this.plant) {
        this.plant = crop;
        this.plant.transform.rotation[1] = 90 * Math.floor(Math.random() * 4);
        this.plant.setParent(this);
    }
}

function canInteract() {
    return !this.unlocked || !this.plant || this.plant.ready;
}
