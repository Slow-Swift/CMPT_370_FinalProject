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
    const atlas = createTextAtlas(gl, { fontSize: 32 });
    
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.uniforms.texture, 0);
    gl.uniformMatrix4fv(this.uniforms.transformationMatrix, false, flatten(entity.transform.getTransformationMatrix()));
    // const color = entity.model.components[0].material.color || [1.0, 1.0, 1.0];
    gl.uniform3fv(this.uniforms.textColor, entity.model.components[0].material.color);
    gl.bindVertexArray(entity.model.vao);
    // console.log("Font Atlas Texture: ", typeof entity.model.components[0].material.texture);
    // const textAtlas = createTextAtlas(gl);
    // entity.model.components[0].material.texture = textAtlas.texture;    
    // console.log("Binding font texture: ", entity.model.components[0].material.texture);
    gl.bindTexture(gl.TEXTURE_2D, entity.model.components[0].material.texture);
    gl.drawElements(gl.TRIANGLES, entity.model.vertexCount, gl.UNSIGNED_INT, 0);
    
}
