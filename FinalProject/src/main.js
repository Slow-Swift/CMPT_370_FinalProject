/**
 * File Name: main.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  The heart of the app. It sets up the scene and updates it each frame.
 */

import { createRenderer } from "./rendering/renderer.js";
import { createCamera } from "./entities/camera.js";
import { loadObj } from "./entities/objParser.js";
import { createEntity } from "./entities/entities.js";
import { loadPlants, createCorn } from "./plant.js";

const applicationData = window.applicationData = {
    objects: [],
    mouse: {x:0, y:0}
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
    applicationData.renderer = await createRenderer();
    applicationData.camera = createCamera();
    applicationData.camera.transform.position = [-10, 10, 10];
    applicationData.camera.transform.rotation = [-35, -45, 0];
    await loadPlants();

    // Create a basic grid of farmland
    const farmModel = await loadObj('objects/farmland.obj');
    for (let i=-1; i<2; i++) {
        for (let j = -1; j < 2; j++) {
            const farmland = createEntity(farmModel);
            farmland.transform.position = [i * 3, 0, j * 3];
            applicationData.objects.push(farmland);
        }
    }

    // Add some corn to one of the farmlands
    applicationData.objects.push(createCorn());

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

    gl.canvas.addEventListener('mousemove', onMouseMove);
    gl.viewport( 0, 0, canvas.width, canvas.height );

    // Enable backface culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
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
    applicationData.renderer.renderScene(applicationData.objects, applicationData.camera, applicationData.light);
    applicationData.mouseID = applicationData.renderer.pickerBuffers.getID(applicationData.mouse.x, applicationData.mouse.y);
    updateObjects(deltaTime);
    requestAnimationFrame(mainLoop);
}

/**
 * Update each object in the scene 
 */
function updateObjects(deltaTime) {
    for (const obj of applicationData.objects) {
        obj.mouseOver = applicationData.mouseID == obj.id;
        obj.update?.(deltaTime);
    }
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

/**
 * Called everytime the mouse is moved on the canvas and updates
 * the recorded pixel position of the mouse.
 * @param e The mouse move event
 */
function onMouseMove(e) {
    const rect = gl.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    applicationData.mouse.x = mouseX * gl.canvas.width / gl.canvas.clientWidth;
    applicationData.mouse.y = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight;
}