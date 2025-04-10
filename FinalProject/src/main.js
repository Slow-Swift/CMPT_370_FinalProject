/**
 * File Name: main.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  The heart of the app. It sets up the scene and updates it each frame.
 */

import { createRenderer } from "./rendering/renderer.js";
import { createCamera } from "./entities/camera.js";
import { createEntity, createEntity2D } from "./entities/entities.js";
import { createQuad, setupQuad } from "./ui/quad.js";
import { createPlant, loadPlants, plantTypes} from "./plant.js";
import { loadFarmlandModel } from "./farmland.js";
import { initializeInputSystem, updateInputs } from "./inputManager.js";
import { setupFarmland } from "./farmlandManager.js";
import { createButton } from "./ui/button.js";
import { loadTexture } from "./entities/textures.js";


const applicationData = window.applicationData = {
    scene: createEntity(), 
    uiScene: createEntity2D(), 
};
applicationData.uiScene.transform.anchor = [0,0];
applicationData.uiScene.transform.position = [-1,-1];
applicationData.uiScene.transform.scale = 2;

applicationData.light = {
    position: [0, 250, 200],
    ambient: [0.05,0.05,0.05],
    diffuse: [1,1,1],
    specular: [0.2,0.2,0.2]
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
    applicationData.camera.transform.position = [-100, 100, 100];
    applicationData.camera.transform.rotation = [-35, -45, 0];

    // Start the main loop
    setupFarmland();
    // applicationData.sidePanel = createQuad(0.2, 1.0, [92/255, 64/255, 51/255]);
    // applicationData.sidePanel.setParent(applicationData.uiScene);
    // applicationData.sidePanel.transform.anchor = [1,1];
    // applicationData.sidePanel.transform.position = [1,1];
    // const cornBtn = createButton(0.9, 0.1, [1,1,1], () => {
    //     applicationData.selectedFarmland?.plantCrop(createPlant(plantTypes.CORN));
    //     applicationData.sidePanel.transform.anchor = [0,1];
    //     applicationData.selectedFarmland = null;
    // });
    // cornBtn.setParent(applicationData.sidePanel);
    // cornBtn.transform.anchor = [0.5, 0.5];
    // cornBtn.transform.position = [0.5, 0.93];
    // const pumpkinBtn = createButton(0.9, 0.1, [1,1,1], () => {
    //     applicationData.selectedFarmland?.plantCrop(createPlant(plantTypes.PUMPKIN));
    //     applicationData.sidePanel.transform.anchor = [0,1];
    //     applicationData.selectedFarmland = null;
    // });
    // pumpkinBtn.setParent(applicationData.sidePanel);
    // pumpkinBtn.transform.anchor = [0.5, 0.5];
    // pumpkinBtn.transform.position = [0.5, 0.81];
    // const wheatBtn = createButton(0.9, 0.1, [1,1,1], () => {
    //     applicationData.selectedFarmland?.plantCrop(createPlant(plantTypes.WHEAT));
    //     applicationData.sidePanel.transform.anchor = [0,1];
    //     applicationData.selectedFarmland = null;
    // });
    // wheatBtn.setParent(applicationData.sidePanel);
    // wheatBtn.transform.anchor = [0.5, 0.5];
    // wheatBtn.transform.position = [0.5, 0.69];

    createUI();

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
    setupQuad();
}

function createUI() {
    const cornTexture = loadTexture("images/icons/cornIcon.png");
    const pumpkinTexture = loadTexture("images/icons/pumpkinIcon.png");
    const wheatTexture = loadTexture("images/icons/wheatIcon.png");
    const slotTexture = loadTexture("images/slot.png");

    const cropPicker = createButton(
        0.05, 0, [1,1,1], () => selectors.transform.scale = 1 - selectors.transform.scale, {aspectRatio: 1, texture: slotTexture,
        position: [0.95, 0.1]
    });
    cropPicker.setParent(applicationData.uiScene);
    const selectedCropImg = createQuad(.8, .8, [1,1,1], {texture: cornTexture, pickable:false});
    selectedCropImg.setParent(cropPicker);

    const selectors = createEntity2D();
    selectors.transform.width = 0.05;
    selectors.transform.aspectRatio = 1;
    selectors.transform.position = [0.95, 0.1];
    selectors.transform.scale = 0;

    selectors.setParent(applicationData.uiScene);

    applicationData.selectedCrop = plantTypes.CORN;
    const cornBtn = createButton(
        1, 1, [1,1,1], () => {
            selectors.transform.scale = 0;
            applicationData.selectedCrop = plantTypes.CORN;
            selectedCropImg.materials[0].texture = cornTexture;
        }, {texture: slotTexture,
        position: [0.5, 1.7]
    });
    cornBtn.setParent(selectors);
    createQuad(.8, .8, [1,1,1], {texture: cornTexture, pickable:false}).setParent(cornBtn);
    
    const pumpkinBtn = createButton(
        1, 1, [1,1,1], () => {
            selectors.transform.scale = 0;
            applicationData.selectedCrop = plantTypes.PUMPKIN;
            selectedCropImg.materials[0].texture = pumpkinTexture;
        }, {texture: slotTexture,
        position: [0.5, 2.8]
    });
    pumpkinBtn.setParent(selectors);
    createQuad(.8, .8, [1,1,1], {texture: pumpkinTexture, pickable:false}).setParent(pumpkinBtn);

    const wheatBtn = createButton(
        1, 1, [1,1,1], () => {
            selectors.transform.scale = 0;
            applicationData.selectedCrop = plantTypes.WHEAT;
            selectedCropImg.materials[0].texture = wheatTexture;
        }, {texture: slotTexture,
        position: [0.5, 3.9]
    });
    wheatBtn.setParent(selectors);
    createQuad(.8, .8, [1,1,1], {texture: wheatTexture, pickable:false}).setParent(wheatBtn);
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
    applicationData.renderer.renderScene(applicationData.scene,applicationData.uiScene, applicationData.camera, applicationData.light);
    applicationData.mouseID = applicationData.renderer.pickerBuffers.getID(inputData.mouse.x, inputData.mouse.y);
    applicationData.scene.update(deltaTime);
    applicationData.uiScene.update(deltaTime);
    applicationData.camera.update(deltaTime);
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
    }
    return resizeRequired;
}


