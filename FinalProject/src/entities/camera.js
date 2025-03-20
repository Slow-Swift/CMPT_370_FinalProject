/**
 * File Name: camera.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  Creates a camera object to more easily control the view of the game
 */

import { createTransform } from "./entities.js";

/**
 * Create a camera object
 * @returns The camera object
 */
export function createCamera() {
    return {
        transform: createTransform(),
        getViewMatrix: getViewMatrix
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