/**
 * File Name: assignment3.js
 * Name: Finian Lugtigheid
 * Date: February 3, 2025
 * Description:
 *   Sets up a WebGL system to render a rocket ship and provide interaction
 */

import { createRenderer } from "./renderer.js";
import { createCamera } from "./camera.js";
import { loadObj } from "./objParser.js";

// Global variables
const applicationData = {
    objects: []
};
let renderer;

const light = {
    position: [200, 200, 0],
    color: [1,1,1]
};

/**
 * Gets the WebGL context and does some basic gl initialization
 */
function initialize_gl() {
    const canvas = document.getElementById( "gl-canvas" );

    window.gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
}

/**
 * The main rendering loop
 * Redraws the screen and updates the rocket ship
 */
function mainLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - (applicationData.lastFrameTime ?? currentTime)) / 1000;
    applicationData.objects[0].transform.rotation[1] += 10 * deltaTime;
    applicationData.objects[0].transform.position = [150 * Math.cos(currentTime / 10000), 0, 150 * Math.sin(currentTime / 10000)];
    applicationData.lastFrameTime = currentTime;
    if (resizeCanvas(gl.canvas)) {
        // setFramebufferAttachmentSizes(gl.canvas.width, gl.canvas.height, applicationData.pickerTexture.texture, applicationData.pickerTexture.depthBuffer);
    }
    renderer.renderScene(applicationData.objects, applicationData.camera, light);
    requestAnimationFrame(mainLoop);
}

/**
 * Sets up the program when the window loads
 */
window.onload = async function init()
{
    initialize_gl();
    renderer = await createRenderer();

    applicationData.camera = createCamera();
    // applicationData.pickerTexture = createRenderBuffers();

    const earth = await loadObj("objects/earth.obj");
    applicationData.objects.push(earth);
    earth.transform.scale = 10 * 0.6371

    const sun = await loadObj("objects/sun.obj");
    sun.transform.position = [0, 0, 0]
    applicationData.objects.push(sun);
    sun.transform.scale = 69.57

    applicationData.camera.transform.position = [0, 150, 150];
    applicationData.camera.transform.rotation[0] = -45;

    mainLoop();
};

function resizeCanvas(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const resizeRequired = canvas.width != displayWidth || canvas.height != displayHeight;
    if (resizeRequired) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    renderer.recalculateProjectionMatrix();
    return resizeRequired;
}