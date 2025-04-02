import { loadShader } from "./shader.js";

/**
 * Load the main shader
 * @returns The main shader
 */
export async function loadUIShader() {
    const shaderProgram = await loadShader(
        "ui", ["position", "textureCoord"]
    );

    gl.useProgram(shaderProgram);

    // Return an object containing information relevant to the shader program
    const shader = { 
        program: shaderProgram,
        uniforms: {
            texture: gl.getUniformLocation(shaderProgram, "image"),
            transformationMatrix: gl.getUniformLocation(shaderProgram, "transformationMatrix"),
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
function prepare() {
    gl.useProgram(this.program);
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
    gl.bindVertexArray(entity.model.vao);
   
    gl.uniform3fv(this.uniforms.tintColor, entity.model.components[0].material.color);
    gl.uniform1f(this.uniforms.tintStrength, entity.model.components[0].material.colorStrength);
    gl.bindTexture(gl.TEXTURE_2D, entity.model.components[0].material.texture);
    gl.drawElements(gl.TRIANGLES, entity.model.vertexCount, gl.UNSIGNED_INT, 0);
}
