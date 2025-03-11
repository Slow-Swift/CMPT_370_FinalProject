/**
 * File Name: shader.js
 * Name: Finian Lugtigheid
 * Date: February 10, 2025
 * Description:
 *   Loads a shader and provides methods to use it to render and entity
 */

"use strict"

/**
 * Create a shader program and load information about the locations
 * of the relevant attributes and uniform variables
 * 
 * @returns An object representing the shader
 */
async function loadShader() {
    const shaderProgram = await createShaderFromFile("shader.vert", "shader.frag");
    
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Return an object containing information relevant to the shader program
    const shader = { 
        program: shaderProgram, 
        attributes: {
            vertices: gl.getAttribLocation( shaderProgram, "position" ),
            textureCoords: gl.getAttribLocation( shaderProgram, "textureCoord" ),
            normals: gl.getAttribLocation( shaderProgram, "normal" ),
        },
        uniforms: {
            texture: gl.getUniformLocation(shaderProgram, "image"),
            transformationMatrix: gl.getUniformLocation(shaderProgram, "transformationMatrix"),
            viewMatrix: gl.getUniformLocation(shaderProgram, "viewMatrix"),
            projectionMatrix: gl.getUniformLocation(shaderProgram, "projectionMatrix"),
            lightPosition: gl.getUniformLocation(shaderProgram, "lightPosition"),
            lightColor: gl.getUniformLocation(shaderProgram, "lightColor"),
        },
        prepare: prepare,
        renderEntity: renderEntity,
        recalculateProjectionMatrix: recalculateProjectionMatrix,
    };

    shader.recalculateProjectionMatrix();

    return shader;
}

function recalculateProjectionMatrix() {
    const FOV = 70.0;
    const NEAR_PLANE = 0.1;
    const FAR_PLANE = 1000;
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    this.projectionMatrix = perspective(FOV, aspectRatio, NEAR_PLANE, FAR_PLANE);
}

/**
 * Prepare the WebGL context to use this shader
 */
function prepare(camera, light) {
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 1);
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, flatten(this.projectionMatrix));
    gl.uniformMatrix4fv(this.uniforms.viewMatrix, false, flatten(camera.getViewMatrix()));
    gl.uniform3f(this.uniforms.lightPosition, light.position[0], light.position[1], light.position[2]);
    gl.uniform3f(this.uniforms.lightColor, light.color[0], light.color[1], light.color[2]);
}

/**
 * Render the given entity
 * @param shape The shape to render 
 */
function renderEntity(entity) {
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.uniforms.texture, 0);
    gl.uniformMatrix4fv(this.uniforms.transformationMatrix, false, flatten(entity.transform.getTransformationMatrix()));
    gl.bindVertexArray(entity.vao);
    
    for (const component of entity.components) {
        gl.bindTexture(gl.TEXTURE_2D, component.material.texture);
        gl.drawElements(gl.TRIANGLES, component.vertexCount, gl.UNSIGNED_INT, 4 * component.startIndex);
    }
}

/**
 * Compile a shader given the source code and shader type
 * @param {string} shaderSource 
 * @param {number} shaderType 
 * @returns {WebGLShader} The compiled shader
 */
function compileShader(shaderSource, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw `Failed to compile ${shaderType == gl.VERTEX_SHADER ? "vertex" : "fragment"} shader: ${gl.getShaderInfoLog(shader)}`;
    }

    return shader;
}

/**
 * Compile and link a shader program
 * @param {string} vertexSource The source code for the vertex shader
 * @param {string} fragmentSource The source code for the fragment shader
 * @returns {WebGLProgram} The created program
 */
function createShaderProgram(vertexSource, fragmentSource) {
    const program = gl.createProgram();
    gl.attachShader(program, compileShader(vertexSource, gl.VERTEX_SHADER));
    gl.attachShader(program, compileShader(fragmentSource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw `Failed to link program: ${gl.getShaderInfoLog(program)}`;
    }

    return program;
}

/**
 * Compile and link a shader given the IDs of the scripts
 * @param {string} vertexFile The name of the vertex shader file
 * @param {string} fragmentFile The name of the fragment shader file
 * @returns {WebGLProgram} The new shader program
 */
async function createShaderFromFile(vertexFile, fragmentFile) {
    const vertexSource = await loadFile(vertexFile);
    const fragmentSource = await loadFile(fragmentFile);

    return createShaderProgram(vertexSource, fragmentSource);
}
