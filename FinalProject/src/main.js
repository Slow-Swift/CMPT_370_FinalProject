/**
 * File Name: main.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  The heart of the app. It sets up the scene and updates it each frame.
 */

import { createRenderer } from "./rendering/renderer.js";
import { createCamera } from "./entities/camera.js";
import { createEntity } from "./entities/entities.js";
import { loadPlants, createCorn } from "./plant.js";
import { createFarmland, loadFarmlandModel } from "./farmland.js";
import { initializeInputSystem, updateInputs } from "./inputManager.js";
import { setupFarmland } from "./farmlandManager.js";

const applicationData = window.applicationData = {
    scene: createEntity(),
};

applicationData.light = {
    position: [200, 200, 0],
    color: [1,1,1]
};

/**
 * Sets up the program when the window loads
 */
window.onload = async function init()
{
    initialize_gl();
    initializeInputSystem();
    await loadModels();

    applicationData.renderer = await createRenderer();
    applicationData.camera = createCamera();
    applicationData.camera.transform.position = [-10, 10, 10];
    applicationData.camera.transform.rotation = [-35, -45, 0];

    setupFarmland();

    // // Create a basic grid of farmland
    // for (let i=-1; i<2; i++) {
    //     for (let j = -1; j < 2; j++) {
    //         const farmland = createFarmland();
    //         farmland.transform.position = [i * 3, 0, j * 3];
    //         farmland.setParent(applicationData.scene);
    //         // createCorn().setParent(farmland);
    //     }
    // }

    // Start the main loop
    mainLoop();
};


/**
 * Gets the WebGL context and does some basic gl initialization
 */
function initialize_gl() {
    const canvas = document.getElementById( "gl-canvas" );

    window.gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );

    // Enable backface culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
}

async function loadModels() {
    await loadPlants();
    await loadFarmlandModel();
}

/**
 * The main rendering loop
 * Redraws the screen and updates the rocket ship
 */
function mainLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - (applicationData.lastFrameTime ?? currentTime)) / 1000;
    applicationData.lastFrameTime = currentTime;

    if (resizeCanvas(gl.canvas)) {}
    applicationData.renderer.renderScene(applicationData.scene, applicationData.camera, applicationData.light);
    applicationData.mouseID = applicationData.renderer.pickerBuffers.getID(inputData.mouse.x, inputData.mouse.y);
    applicationData.scene.update(deltaTime);
    updateInputs();
    requestAnimationFrame(mainLoop);
}

/**
 * Resize the canvas to it's screen size. 
 * Also updates the viewport size, the picker buffer size, 
 * and the projection matrix
 * @returns True if the canvas needed to be resized, otherwise false
 */
function resizeCanvas() {
    const displayWidth = gl.canvas.clientWidth;
    const displayHeight = gl.canvas.clientHeight;
    const resizeRequired = gl.canvas.width != displayWidth || gl.canvas.height != displayHeight;
    if (resizeRequired) {
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
        applicationData.renderer.pickerBuffers.resize(displayWidth, displayHeight);
        applicationData.renderer.recalculateProjectionMatrix();
    }
    return resizeRequired;
}

