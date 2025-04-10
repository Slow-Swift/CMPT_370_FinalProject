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
import { loadTextShader } from "./textShader.js";

/**
 * Create the renderer object
 * @returns The renderer
 */
export async function createRenderer() {
    return {
        mainShader: await loadMainShader(),
        uiShader: await loadUIShader(),
        textShader: await loadTextShader(),
        pickerShader: await loadPickerShader(),
        pickerBuffers: await createRenderBuffers(),
        projectionMatrix: calculateProjectionMatrix(),
        renderScene: renderScene,
        recalculateProjectionMatrix: function() { this.projectionMatrix = calculateProjectionMatrix() },
        preparePicker: preparePicker,
        prepareMain: prepareMain,
        prepareUI: prepareUI,
        prepareText: prepareText
    }
}

/**
 * Render a scene
 * @param entities The list entities to render
 * @param camera The camera
 * @param light The light in the scene
 */
function renderScene(scene, ui, text, camera, light) {
    // Render to the picker texture
    this.preparePicker();
    this.pickerShader.prepare(camera, light, this.projectionMatrix);
    renderEntity(this.pickerShader, scene);

    // Render to the screen
    this.prepareMain();
    this.mainShader.prepare(camera, light, this.projectionMatrix);
    renderEntity(this.mainShader, scene);

    this.prepareUI();
    this.uiShader.prepare();
    renderEntity(this.uiShader, ui);

    this.prepareText();
    this.textShader.prepare();
    renderEntity(this.textShader, text);

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
 * Prepare the WebGL context to use the ui shader shader
 */
function prepareUI() {
    this.pickerBuffers.disable();
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT);
}

/**
 * Prepare the WebGL context to use the text shader shader
 */
function prepareText() {
    // this.pickerBuffers.disable();
    // gl.disable(gl.DEPTH_TEST);
    // gl.clear(gl.DEPTH_BUFFER_BIT);
    this.pickerBuffers.disable();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST); // optional, but helps with visibility
    gl.clear(gl.DEPTH_BUFFER_BIT);
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