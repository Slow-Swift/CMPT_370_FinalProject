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
import { loadUIShader } from "./uiShader.js";

/**
 * Create the renderer object
 * @returns The renderer
 */
export async function createRenderer() {
    return {
        mainShader: await loadMainShader(),
        uiShader: await loadUIShader(),
        pickerShader: await loadPickerShader(),
        pickerBuffers: await createRenderBuffers(),
        renderScene: renderScene,
        preparePicker: preparePicker,
        prepareMain: prepareMain,
        prepareUI: prepareUI
    }
}

/**
 * Render a scene
 * @param entities The list entities to render
 * @param camera The camera
 * @param light The light in the scene
 */
function renderScene(scene, ui, camera, light) {
    const projectionMatrix = calculateProjectionMatrix(camera);
    // Render to the picker texture
    this.preparePicker();
    this.pickerShader.prepare(camera, light, projectionMatrix);
    renderEntity(this.pickerShader, scene);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    this.pickerShader.prepare2D();
    renderEntity(this.pickerShader, ui);

    // Render to the screen
    this.prepareMain();
    this.mainShader.prepare(camera, light, projectionMatrix);
    renderEntity(this.mainShader, scene);

    gl.enable(gl.BLEND);
    this.prepareUI();
    this.uiShader.prepare();
    renderEntity(this.uiShader, ui);
    gl.disable(gl.BLEND);
}

function renderEntity(shader, entity){
    if (entity.model != null){
        shader.renderEntity(entity);
    }
    for (const child of entity.children){
        renderEntity(shader, child);
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
 * Prepare the WebGL context to use the main shader shader
 */
function prepareUI() {
    this.pickerBuffers.disable();
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT);
}

/**
 * Calculate the projection matrix to use
 * @returns The projection matrix
 */
function calculateProjectionMatrix(camera) {
    const NEAR_PLANE = 0.1;
    const FAR_PLANE = 1000;
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    const size = camera.size;
    return ortho(-size, size, -size / aspectRatio, size / aspectRatio, NEAR_PLANE, FAR_PLANE);
}