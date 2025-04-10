import { createEntity } from "./entities/entities.js";
import { loadObj } from "./entities/objParser.js";
import { unlockFarmland } from "./farmlandManager.js";
import { createPlant } from "./plant.js";

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
        applicationData.unlockSounds[Math.floor(Math.random() * applicationData.unlockSounds.length)].play();
        return;
    }
    if (this.plant) {
        if (this.plant.ready) {
            applicationData.plants[this.plant.type].seeds += 1 + Math.ceil(Math.random() * 4);
            console.log(applicationData.plants[this.plant.type]);
            this.plant.setParent(null);
            this.plant = null;
            applicationData.harvestSounds[Math.floor(Math.random() * applicationData.harvestSounds.length)].play();
        }
    } else {
        if (applicationData.plants[applicationData.selectedCrop].seeds > 0) {
            this.plantCrop(applicationData.selectedCrop);
            applicationData.plantSounds[Math.floor(Math.random() * applicationData.plantSounds.length)].play();
            applicationData.plants[applicationData.selectedCrop].seeds--;
        }
    }
}

function plantCrop(crop) {
    if (!this.plant) {
        this.plant = createPlant(crop);
        this.plant.transform.rotation[1] = 90 * Math.floor(Math.random() * 4);
        this.plant.setParent(this);
    }
}

function canInteract() {
    return !this.unlocked || (!this.plant && applicationData.plants[applicationData.selectedCrop].seeds > 0) || this.plant?.ready;
}
