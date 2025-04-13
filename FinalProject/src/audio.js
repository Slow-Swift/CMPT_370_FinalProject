
/**
 * File Name: audio.js
 * Author: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *  This file handles sound loading and playback using the Web Audio API.
 *  Adds sound effects for actions like unlocking land, planting, and harvesting crops.
 */
import { createFarmland } from "./farmland.js"

const farmland = {}

export function setupFarmland() {
    const startLand = createFarmland(0,0);
    farmland[[0,0]] = startLand;
    startLand.setParent(applicationData.scene);
    unlockFarmland(startLand);
}

export function unlockFarmland(farmland) {
    farmland.unlocked = true;
    const [x,y] = farmland.location;
    for (const [lx,ly] of [[x+1,y], [x-1, y], [x, y+1], [x, y-1]]) {
        if ([lx,ly] in farmland) continue;

        const land = createFarmland(lx,ly);
        farmland[[lx,ly]] = land;
        land.setParent(applicationData.scene);
    }
}
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

const audioContext = new AudioContext();

export async function loadSound(url, volume=1.0, loop = false) {
    const audio = await fetch(url).then(r => r.arrayBuffer()).then(ab => audioContext.decodeAudioData(ab));
    audio.play = () => {
        const source = audioContext.createBufferSource();
        source.buffer = audio;
        source.loop = loop;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    }
    return audio;
}