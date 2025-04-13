/**
 * File Name: shader.js
 * Name: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *   Loads a shader given the shader name
 */

import { loadFile } from "../files.js";

/**
 * Load a shader given the name of the shader.
 * The vertex shader must be called `<shaderName>.vert`.
 * The fragment shader must be called `<shaderName>.frag`.
 * @param {string} shaderName The name of the shader 
 * @param {[string]|{string:int}} attributes The attributes that will be used by the shader
 * @returns {WebGLProgram} The created program
 */
export async function loadShader(shaderName, attributes) {
    const shaderProgram = await createShaderFromFile(`shaders/${shaderName}.vert`, `shaders/${shaderName}.frag`, attributes);
    return shaderProgram;
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
 * @param {[string]|{string:int}} attributes The attributes that will be used by the shader
 * @returns {WebGLProgram} The created shader program
 */
function createShaderProgram(vertexSource, fragmentSource, attributes) {
    const program = gl.createProgram();
    gl.attachShader(program, compileShader(vertexSource, gl.VERTEX_SHADER));
    gl.attachShader(program, compileShader(fragmentSource, gl.FRAGMENT_SHADER));

    // Bind the attribute locations
    if (attributes instanceof Array) {
        for (let i=0; i<attributes.length; i++) {
            gl.bindAttribLocation(program, i, attributes[i]);
        }
    } else if (typeof(attributes) == "object") {
        for (const attribute in attributes) {
            gl.bindAttribLocation(program, attributes[attribute], attribute);
        }
    }

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
 * @param {[string]|{string:int}} attributes The attributes that will be used by the shader
 * @returns {WebGLProgram} The new shader program
 */
async function createShaderFromFile(vertexFile, fragmentFile, attributes=[]) {
    const vertexSource = await loadFile(vertexFile);
    const fragmentSource = await loadFile(fragmentFile);

    return createShaderProgram(vertexSource, fragmentSource, attributes);
}
