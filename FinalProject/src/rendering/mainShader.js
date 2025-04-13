/**
 * File Name: mainShader.js
 * Author: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
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
            
            ambientLight: gl.getUniformLocation(shaderProgram, "ambientLight"),
            diffuseLight: gl.getUniformLocation(shaderProgram, "diffuseLight"),
            specularLight: gl.getUniformLocation(shaderProgram, "specularLight"),
            
            ambientColor: gl.getUniformLocation(shaderProgram, "ambientColor"),
            diffuseColor: gl.getUniformLocation(shaderProgram, "diffuseColor"),
            specularColor: gl.getUniformLocation(shaderProgram, "specularColor"),
            emissiveColor: gl.getUniformLocation(shaderProgram, "emissiveColor"),
            shininess: gl.getUniformLocation(shaderProgram, "shininess"),
            useTexture: gl.getUniformLocation(shaderProgram, "useTexture"),
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
    gl.uniform3fv(this.uniforms.ambientLight, light.ambient);
    gl.uniform3fv(this.uniforms.diffuseLight, light.diffuse);
    gl.uniform3fv(this.uniforms.specularLight, light.specular);
    gl.uniform3fv(this.uniforms.lightPosition, light.position);
}

/**
 * Render the given entity
 * @param shape The shape to render 
 */
function renderEntity(entity) {
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.uniforms.texture, 0);
    gl.uniformMatrix4fv(this.uniforms.transformationMatrix, false, flatten(entity.transform.getTransformationMatrix()));
    gl.bindVertexArray(entity.model.vao);
    
    for (const component of entity.model.components) {
        const material = entity.materials[component.materialIndex];
        gl.uniform3fv(this.uniforms.ambientColor, material.ambient);
        gl.uniform3fv(this.uniforms.diffuseColor, material.diffuse);
        gl.uniform3fv(this.uniforms.specularColor, material.specular);
        gl.uniform3fv(this.uniforms.emissiveColor, material.emissive);
        gl.uniform1f(this.uniforms.shininess, material.shininess);
        gl.uniform1f(this.uniforms.useTexture, material.useTexture ? 1 : 0);
        gl.bindTexture(gl.TEXTURE_2D, material.texture);
        gl.drawElements(gl.TRIANGLES, component.vertexCount, gl.UNSIGNED_INT, 4 * component.startIndex);
    }
}