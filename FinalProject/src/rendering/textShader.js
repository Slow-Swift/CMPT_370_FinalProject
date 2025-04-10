import { loadShader } from "./shader.js";
import { createTextAtlas } from "../textAtlas.js";
/**
 * Load the text shader
 * @returns The text shader
 */
export async function loadTextShader() {
    const shaderProgram = await loadShader(
        "text", ["position", "textureCoord"]
    );

    gl.useProgram(shaderProgram);

    const shader = {
        program: shaderProgram,
        uniforms: {
            texture: gl.getUniformLocation(shaderProgram, "fontAtlas"),
            transformationMatrix: gl.getUniformLocation(shaderProgram, "transformationMatrix"),
            textColor: gl.getUniformLocation(shaderProgram, "textColor"),
        },
        prepare: prepare,
        renderEntity: renderEntity
    };

    return shader;
}

function prepare() {
    gl.useProgram(this.program);
}

function renderEntity(entity) {
    
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.uniforms.texture, 0);
    gl.uniformMatrix4fv(this.uniforms.transformationMatrix, false, flatten(entity.transform.getTransformationMatrix()));
    gl.uniform3fv(this.uniforms.textColor, entity.model.components[0].material.color);
    gl.bindVertexArray(entity.model.vao);
    gl.bindTexture(gl.TEXTURE_2D, entity.model.components[0].material.texture);
    gl.drawElements(gl.TRIANGLES, entity.model.vertexCount, gl.UNSIGNED_INT, 0);
    
}
