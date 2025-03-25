import { loadObj } from "./entities/objParser.js";
import { createEntity } from "./entities/entities.js";

let plantModels = {}

export function createCorn() {
    let corn = createEntity(plantModels.corn[0]);
    corn.stages = plantModels.corn;
    corn.stage = 0;
    corn.growthTime = 0;
    corn.readyTime = 10;
    corn.update = updatePlant;
    return corn;
}

export async function loadPlants() {
    plantModels.corn = await loadPlant("corn");
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
    this.stage = Math.min(Math.floor(4 * this.growthTime / this.readyTime), 3);
    this.model = this.stages[this.stage];
}