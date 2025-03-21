import { loadObj } from "./entities/objParser.js";

let plants = {}

export function createCorn() {
    return {
        stages: plants.corn,
        entity: plants.corn[0],
        stage: 0,
        growthTime: 0,
        readyTime: 10,
        update: updatePlant
    }
}

export async function loadPlants() {
    plants.corn = await loadPlant("corn");
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
    this.entity = this.stages[this.stage];
}