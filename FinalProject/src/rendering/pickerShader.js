import { loadShader } from "./shader.js";

/**
 * Create a shader program and load information about the locations
 * of the relevant attributes and uniform variables
 * 
 * @returns An object representing the shader
 */
export async function loadPickerShader() {
    const shaderProgram = await loadShader("picker", ["position"]);
    gl.useProgram(shaderProgram);

    // Return an object containing information relevant to the shader program
    const shader = { 
        program: shaderProgram, 
        attributes: {
            vertices: gl.getAttribLocation( shaderProgram, "position" ),
        },
        uniforms: {
            id: gl.getUniformLocation(shaderProgram, "id"),
            transformationMatrix: gl.getUniformLocation(shaderProgram, "transformationMatrix"),
            viewMatrix: gl.getUniformLocation(shaderProgram, "viewMatrix"),
            projectionMatrix: gl.getUniformLocation(shaderProgram, "projectionMatrix"),
        },
        prepare: prepare,
        renderEntity: renderEntity
    };

    return shader;
}

/**
 * Prepare the WebGL context to use this shader
 */
function prepare(camera, light, projectionMatrix) {
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(this.uniforms.viewMatrix, false, flatten(camera.getViewMatrix()));
}

/**
 * Render the given entity
 * @param shape The shape to render 
 */
function renderEntity(entity) {
    gl.uniformMatrix4fv(this.uniforms.transformationMatrix, false, flatten(entity.transform.getTransformationMatrix()));
    gl.uniform4fv(this.uniforms.id, idToV4(entity.id));
    gl.bindVertexArray(entity.vao);
    
    for (const component of entity.components) {
        gl.drawElements(gl.TRIANGLES, component.vertexCount, gl.UNSIGNED_INT, 4 * component.startIndex);
    }
}

// From: https://webgl2fundamentals.org/webgl/lessons/webgl-picking.html
function idToV4(id) {
    return [
        ((id >> 0) & 0xFF) / 0xFF,
        ((id >> 8) & 0xFF) / 0xFF,
        ((id >> 16) & 0xFF) / 0xFF,
        ((id >> 24) & 0xFF) / 0xFF,
    ]
}