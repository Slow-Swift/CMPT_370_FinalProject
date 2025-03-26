/**
 * File Name: pickerShader.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  Loads and manages the shader used to render to the picker texture
 */

import { loadShader } from "./shader.js";

/**
 * Loads the picker shader
 * @returns the picker shader
 */
export async function loadPickerShader() {
    const shaderProgram = await loadShader("picker", ["position"]);
    gl.useProgram(shaderProgram);

    const shader = { 
        program: shaderProgram, 
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
    if (!entity.pickable) return;
    
    gl.uniformMatrix4fv(this.uniforms.transformationMatrix, false, flatten(entity.transform.getTransformationMatrix()));
    gl.uniform4fv(this.uniforms.id, idToColor(entity.id));
    gl.bindVertexArray(entity.model.vao);
    
    for (const component of entity.model.components) {
        gl.drawElements(gl.TRIANGLES, component.vertexCount, gl.UNSIGNED_INT, 4 * component.startIndex);
    }
}

/**
 * Convert and ID number to a color
 * From: https://webgl2fundamentals.org/webgl/lessons/webgl-picking.html
 * 
 * @param {number} id The ID to convert
 * @returns The color as a vector 4
 */
function idToColor(id) {
    return [
        ((id >> 0) & 0xFF) / 0xFF,
        ((id >> 8) & 0xFF) / 0xFF,
        ((id >> 16) & 0xFF) / 0xFF,
        ((id >> 24) & 0xFF) / 0xFF,
    ]
}