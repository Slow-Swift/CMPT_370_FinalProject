/**
 * File Name: camera.js
 * Author: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *  Creates a camera object to more easily control the view of the game
 */

import { createTransform } from "./entities.js";

const SPEED = 1;
const SCALE_SPEED = 20;
const MIN_SCALE = 5;
const MAX_SCALE = 50;

/**
 * Create a camera object
 * @returns The camera object
 */
export function createCamera() {
    return {
        transform: createTransform(),
        size: 10,
        getViewMatrix: getViewMatrix,
        update: update
    };
}

/**
 * Get the view matrix for the camera. This is the inverse of it's transformation matrix
 * @returns The camera's view matrix
 */
function getViewMatrix() {
    const transformation = translate(-this.transform.position[0], -this.transform.position[1], -this.transform.position[2]);
    let rotation = rotateZ(-this.transform.rotation[2]);
    rotation = mult(rotation, rotateX(-this.transform.rotation[0]));
    rotation = mult(rotation, rotateY(-this.transform.rotation[1]));

    return mult(rotation, transformation);
}

function update(deltaTime) {
    let moveX = 0;
    let moveZ = 0;
    if (inputData.isDown['KeyW']) moveX += 1;
    if (inputData.isDown['KeyS']) moveX -= 1;
    if (inputData.isDown['KeyA']) moveZ -= 1;
    if (inputData.isDown['KeyD']) moveZ += 1;
    const multiplier = inputData.isDown['ShiftLeft'] ? 3 : 1;
    
    // Transform directions from local to world (but only in 2D)
    const cosY = Math.cos(this.transform.rotation[1] * Math.PI / 180);
    const sinY = Math.sin(this.transform.rotation[1] * Math.PI / 180);
    const worldX = cosY * moveX - sinY * moveZ;
    const worldZ = sinY * moveX + cosY * moveZ;

    this.transform.position[0] += worldX * SPEED * this.size * multiplier * deltaTime;
    this.transform.position[2] += worldZ * SPEED * this.size * multiplier * deltaTime;

    if (inputData.isDown['KeyQ']) this.size -= SCALE_SPEED * multiplier * deltaTime;
    if (inputData.isDown['KeyE']) this.size += SCALE_SPEED * multiplier * deltaTime;
    this.size = Math.max(Math.min(this.size, MAX_SCALE), MIN_SCALE);

    if (inputData.isDown['KeyH'] && !inputData.wasDown['KeyH']) {
        this.size = 10;
        this.transform.position = [-100, 100, 100];
    }
}