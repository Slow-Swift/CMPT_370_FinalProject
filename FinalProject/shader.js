/**
 * File Name: shader.js
 * Name: Finian Lugtigheid
 * Date: February 10, 2025
 * Description:
 *   Loads a shader and provides methods to use it to render and entity
 */

"use strict"

async function loadShader(shaderName, attributes) {
    const shaderProgram = await createShaderFromFile(`shaders/${shaderName}.vert`, `shaders/${shaderName.frag}`, attributes);
}

/**
 * Create a shader program and load information about the locations
 * of the relevant attributes and uniform variables
 * 
 * @returns An object representing the shader
 */
async function loadMainShader() {
    const shaderProgram = await createShaderFromFile(
        "shaders/main.vert", 
        "shaders/main.frag",
        [
            "position", "textureCoord", "normal"
        ]
    );

    gl.useProgram(shaderProgram);

    /**
     * Prepare the WebGL context to use this shader
     */
    function prepare(camera, light, projectionMatrix) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, flatten(projectionMatrix));
        gl.uniformMatrix4fv(this.uniforms.viewMatrix, false, flatten(camera.getViewMatrix()));
        gl.uniform3f(this.uniforms.lightPosition, light.position[0], light.position[1], light.position[2]);
        gl.uniform3f(this.uniforms.lightColor, light.color[0], light.color[1], light.color[2]);
    }

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
        renderEntity: renderEntity
    };

    return shader;
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
 * @returns {WebGLProgram} The new shader program
 */
async function createShaderFromFile(vertexFile, fragmentFile, attributes=[]) {
    const vertexSource = await loadFile(vertexFile);
    const fragmentSource = await loadFile(fragmentFile);

    return createShaderProgram(vertexSource, fragmentSource, attributes);
}
