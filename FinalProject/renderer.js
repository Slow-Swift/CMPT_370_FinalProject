import { loadMainShader } from "./shader.js";

export async function createRenderer() {
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    return {
        mainShader: await loadMainShader(),
        projectionMatrix: calculateProjectionMatrix(),
        renderScene: renderScene,
        recalculateProjectionMatrix: function() { this.projectionMatrix = calculateProjectionMatrix() }
    }
}

function renderScene(entities, camera, light) {
    prepare();
    this.mainShader.prepare(camera, light, this.projectionMatrix);
    for (const entity of entities) {
        this.mainShader.renderEntity(entity);
    }
}

/**
 * Prepare the WebGL context to use this shader
 */
function prepare() {
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 1);
}

function calculateProjectionMatrix() {
    const FOV = 70.0;
    const NEAR_PLANE = 0.1;
    const FAR_PLANE = 1000;
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    return perspective(FOV, aspectRatio, NEAR_PLANE, FAR_PLANE);
}