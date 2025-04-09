import { loadObj } from "./entities/objParser.js";
import { createEntity } from "./entities/entities.js";

let plantModels = {}

export const plantTypes = {
    WHEAT: "wheat",
    CORN: "corn",
    PUMPKIN: "pumpkin",
}

export function createPlant(plantType) {
    const plant = createEntity(...(plantModels[plantType][0]));
    plant.stages = plantModels[plantType];
    plant.growthTime = 0;
    plant.readyTime = 10;
    plant.pickable = false;
    plant.onUpdate = updatePlant;
    return plant;
}

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
    for (const plantType in plantTypes) {
        plantModels[plantTypes[plantType]] = await loadPlant(plantTypes[plantType]);
    }
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
    this.materials = this.stages[this.stage][1];
    this.ready = this.growthTime >= this.readyTime;
}