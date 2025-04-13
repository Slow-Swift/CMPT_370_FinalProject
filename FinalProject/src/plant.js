/**
 * File Name: plant.js
 * Author: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *  This file handles the loading, creation, and updating of plant entities in the game.
 */

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
    plant.type = plantType;
    return plant;
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