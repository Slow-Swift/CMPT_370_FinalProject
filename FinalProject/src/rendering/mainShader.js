/**
 * File Name: mainShader.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  Loads and manages the main shader used to render the scene
 */

import { loadShader } from "./shader.js";

/**
 * Load the main shader
 * @returns The main shader
 */
export async function loadMainShader() {
    const shaderProgram = await loadShader(
        "main", ["position", "textureCoord", "normal"]
    );

    gl.useProgram(shaderProgram);

    // Return an object containing information relevant to the shader program
    const shader = { 
        program: shaderProgram,
        uniforms: {
            texture: gl.getUniformLocation(shaderProgram, "image"),
            transformationMatrix: gl.getUniformLocation(shaderProgram, "transformationMatrix"),
            viewMatrix: gl.getUniformLocation(shaderProgram, "viewMatrix"),
            projectionMatrix: gl.getUniformLocation(shaderProgram, "projectionMatrix"),
            lightPosition: gl.getUniformLocation(shaderProgram, "lightPosition"),
            lightColor: gl.getUniformLocation(shaderProgram, "lightColor"),
            tintColor: gl.getUniformLocation(shaderProgram, "tintColor"),
            tintStrength: gl.getUniformLocation(shaderProgram, "tintStrength"),
            mouseOver: gl.getUniformLocation(shaderProgram, "mouseOver"),
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
    gl.uniform1f(this.uniforms.mouseOver, entity.mouseOver ? 1 : 0);
    gl.bindVertexArray(entity.vao);
    
    for (const component of entity.components) {
        gl.uniform3fv(this.uniforms.tintColor, component.material.color);
        gl.uniform1f(this.uniforms.tintStrength, component.material.colorStrength);
        gl.bindTexture(gl.TEXTURE_2D, component.material.texture);
        gl.drawElements(gl.TRIANGLES, component.vertexCount, gl.UNSIGNED_INT, 4 * component.startIndex);
    }
}