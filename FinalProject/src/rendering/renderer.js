import { createRenderBuffers } from "../picker.js";
import { loadMainShader } from "./mainShader.js";
import { loadPickerShader } from "./pickerShader.js";

export async function createRenderer() {
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

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

function renderScene(entities, camera, light) {

    // Render to the picker shader
    this.pickerBuffers.enable();
    this.preparePicker();
    this.pickerShader.prepare(camera, light, this.projectionMatrix);
    for (const entity of entities) {
        this.pickerShader.renderEntity(entity);
    }

    this.prepareMain();
    this.mainShader.prepare(camera, light, this.projectionMatrix);
    for (const entity of entities) {
        this.mainShader.renderEntity(entity);
    }
}

/**
 * Prepare the WebGL context to use this shader
 */
function preparePicker() {
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * Prepare the WebGL context to use this shader
 */
function prepareMain() {
    this.pickerBuffers.disable();
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function calculateProjectionMatrix() {
    const FOV = 70.0;
    const NEAR_PLANE = 0.1;
    const FAR_PLANE = 1000;
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    return perspective(FOV, aspectRatio, NEAR_PLANE, FAR_PLANE);
}