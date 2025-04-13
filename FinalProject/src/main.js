/**
 * File Name: main.js
 * Author: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *  The heart of the app. It sets up the scene and updates it each frame.
 */

import { createRenderer } from "./rendering/renderer.js";
import { createCamera } from "./entities/camera.js";
import { createEntity, createEntity2D } from "./entities/entities.js";
import { createQuad, setupQuad } from "./ui/quad.js";
import { loadPlants, plantTypes} from "./plant.js";
import { loadFarmlandModel } from "./farmland.js";
import { initializeInputSystem, updateInputs } from "./inputManager.js";
import { setupFarmland } from "./farmlandManager.js";
import { createTextEntity, initializeTextAtlas } from "./textEntity.js";
import { createButton } from "./ui/button.js";
import { loadTexture } from "./entities/textures.js";
import { loadSound } from "./audio.js";



const applicationData = window.applicationData = {
    scene: createEntity(), 
    uiScene: createEntity2D(), 
    textScene: createEntity(),

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

applicationData.plants = {};
applicationData.plants[plantTypes.CORN] = {seeds: 1, harvested: 0};
applicationData.plants[plantTypes.PUMPKIN] = {seeds: 1, harvested: 0};
applicationData.plants[plantTypes.WHEAT] = {seeds: 1, harvested: 0};

/**
 * Sets up the program when the window loads
 */
window.onload = async function init()
{
    initialize_gl();
    initializeInputSystem();
    await loadModels();
    await loadSounds();
    initializeTextAtlas();

    applicationData.renderer = await createRenderer();
    applicationData.camera = createCamera();
    applicationData.camera.transform.position = [-100, 100, 100];
    applicationData.camera.transform.rotation = [-35, -45, 0];

    // Start the scene
    setupFarmland();
    createUI();
    
    const loadingPanel = document.querySelector('.loadingPanel');
    loadingPanel.style.opacity = '0';
    setTimeout(() => loadingPanel.style.display = 'none', 500);
    applicationData.backgroundMusic.play();
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

async function loadSounds() {
    applicationData.plantSounds = [
        await loadSound("audio/plant1.mp3", 0.4),
        await loadSound("audio/plant2.mp3", 0.4),
        await loadSound("audio/plant3.mp3", 0.4),
    ];
    applicationData.harvestSounds = [
        await loadSound("audio/harvest1.mp3"),
        await loadSound("audio/harvest2.mp3"),
        await loadSound("audio/harvest3.mp3"),
    ];
    applicationData.unlockSounds = [
        await loadSound("audio/unlock1.mp3", 0.2),
        await loadSound("audio/unlock2.mp3", 0.2),
        await loadSound("audio/unlock3.mp3", 0.2),
    ];
    applicationData.backgroundMusic = await loadSound("audio/background.mp3", 0.2, true);
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

    const resourceDisplay = createQuad(0, 0.08, [139/255,92/255,60/255], {aspectRatio: 0.2, anchor: [0.5, 1], position: [0.5, 1]});
    const resourceDisplayOverlay = createQuad(0.97, 0.90, [1,209/255,114/255]);
    resourceDisplayOverlay.setParent(resourceDisplay);
    resourceDisplay.setParent(applicationData.uiScene);

    const cornIcon = createQuad(0.6 * 0.2, 0.6, [1,1,1], {texture: cornTexture, position: [0.1, 0.5]});
    const pumpkinIcon = createQuad(0.6*0.2, 0.6, [1,1,1], {texture: pumpkinTexture, position: [0.4, 0.5]});
    const wheatIcon = createQuad(0.6 * 0.2, 0.6, [1,1,1], {texture: wheatTexture, position: [0.7, 0.5]});
    cornIcon.setParent(resourceDisplayOverlay);
    pumpkinIcon.setParent(resourceDisplayOverlay);
    wheatIcon.setParent(resourceDisplayOverlay);

    const cornText = createTextEntity("1");
    cornText.transform.width = 0.3;
    cornText.transform.height = 0.3;
    cornText.transform.anchor = [0, 0.5];
    cornText.transform.position = [1.4, 0.6]; 
    cornText.setParent(cornIcon);

    const pumpkinText = createTextEntity("1");
    pumpkinText.transform.width = 0.3;
    pumpkinText.transform.height = 0.3;
    pumpkinText.transform.anchor = [0, 0.5];
    pumpkinText.transform.position = [1.4, 0.6]; 
    pumpkinText.setParent(pumpkinIcon);

    const wheatText = createTextEntity("1");
    wheatText.transform.width = 0.3;
    wheatText.transform.height = 0.3;
    wheatText.transform.anchor = [0, 0.5];
    wheatText.transform.position = [1.4, 0.6]; 
    wheatText.setParent(wheatIcon);

    applicationData.cornText = cornText;
    applicationData.pumpkinText = pumpkinText;
    applicationData.wheatText = wheatText;
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
    applicationData.cornText.setText(String(applicationData.plants[plantTypes.CORN].seeds));
    applicationData.pumpkinText.setText(String(applicationData.plants[plantTypes.PUMPKIN].seeds));
    applicationData.wheatText.setText(String(applicationData.plants[plantTypes.WHEAT].seeds));
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


