/**
 * File Name: renderer.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  A renderer object which is capable of rendering the scene using multiple shaders
 */

import { createRenderBuffers } from "../picker.js";
import { loadMainShader } from "./mainShader.js";
import { loadPickerShader } from "./pickerShader.js";

/**
 * Create the renderer object
 * @returns The renderer
 */
export async function createRenderer() {
    return {
        mainShader: await loadMainShader(),
        pickerShader: await loadPickerShader(),
        pickerBuffers: await createRenderBuffers(),
        projectionMatrix: calculateProjectionMatrix(),
        renderScene: renderScene,
        recalculateProjectionMatrix: function() { this.projectionMatrix = calculateProjectionMatrix() },
        preparePicker: preparePicker,
        prepareMain: prepareMain
    }
}

/**
 * Render a scene
 * @param entities The list entities to render
 * @param camera The camera
 * @param light The light in the scene
 */
function renderScene(entities, camera, light) {
    // Render to the picker texture
    this.preparePicker();
    this.pickerShader.prepare(camera, light, this.projectionMatrix);
    for (const entity of entities) {
        this.pickerShader.renderEntity(entity);
    }

    // Render to the screen
    this.prepareMain();
    this.mainShader.prepare(camera, light, this.projectionMatrix);
    for (const entity of entities) {
        this.mainShader.renderEntity(entity);
    }
}

/**
 * Prepare the WebGL context to use the picker shader
 */
function preparePicker() {
    this.pickerBuffers.enable();
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * Prepare the WebGL context to use the main shader shader
 */
function prepareMain() {
    this.pickerBuffers.disable();
    gl.clearColor(0.6, 0.4, 0.2, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * Calculate the projection matrix to use
 * @returns The projection matrix
 */
function calculateProjectionMatrix() {
    const NEAR_PLANE = 0.1;
    const FAR_PLANE = 1000;
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    const SIZE = 10;
    // return perspective(FOV, aspectRatio, NEAR_PLANE, FAR_PLANE);
    return ortho(-SIZE, SIZE, -SIZE / aspectRatio, SIZE / aspectRatio, NEAR_PLANE, FAR_PLANE);
}