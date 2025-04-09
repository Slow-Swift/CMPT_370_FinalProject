import { loadObj } from "./entities/objParser.js";
import { createEntity } from "./entities/entities.js";

let plantModels = {}

export function createCorn() {
    let corn = createEntity(...(plantModels.corn[0]));
    corn.stages = plantModels.corn;
    corn.stage = 0;
    corn.growthTime = 0;
    corn.readyTime = 10;
    corn.pickable = false;
    corn.onUpdate = updatePlant;
    return corn;
}

export function createPumpkin() {
    let pumpkin = createEntity(...(plantModels.pumpkin[0]));
    pumpkin.stages = plantModels.pumpkin;
    pumpkin.stage = 0;
    pumpkin.growthTime = 0;
    pumpkin.readyTime = 10;
    pumpkin.pickable = false;
    pumpkin.onUpdate = updatePlant;
    return pumpkin;
}

export async function loadPlants() {
    plantModels.corn = await loadPlant("corn");
    plantModels.pumpkin = await loadPlant("pumpkin");
}

async function loadPlant(plant) {
    const name = `objects/${plant}`;
    return [
        await loadObj(`${name}Stage1.obj`),
        await loadObj(`${name}Stage2.obj`),
        await loadObj(`${name}Stage3.obj`),
        await loadObj(`${name}Stage4.obj`),
    ];
}

function updatePlant(deltaTime) {
    this.growthTime += deltaTime;
    this.stage = Math.min(Math.floor((this.stages.length - 1) * this.growthTime / this.readyTime), this.stages.length - 1);
    this.model = this.stages[this.stage][0];
    this.ready = this.growthTime >= this.readyTime;
}