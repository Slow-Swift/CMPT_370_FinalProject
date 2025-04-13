/**
 * File Name: models.js
 * Name: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *   Handles creation and setup of 3D model data in WebGL, including VAOs, vertex attributes,
 *  and index buffers for rendering entities.
 */

/**
 * Create a new entity given the indices, vertices, and texture coordinates
 * @param indices The indices of the model
 * @param vertices The vertex positions
 * @param textureCoords The texture coordinates for each vertex
 * @param texture The texture for the model
 * @returns The created entity
 */
export function createModels(indices, vertices, textureCoords, normals, components) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    storeIndices(indices);
    storeDataInAttribute(vertices, 0, 3);
    storeDataInAttribute(textureCoords, 1, 2);
    storeDataInAttribute(normals, 2, 3);

    return { 
        vao: vao,
        vertexCount: indices.length,
        components: components,
    };
}


/**
 * Create a new buffer and populate it with the provided data
 * @param data An array of floats to populate the buffer 
 * @returns The id of the the created buffer
 */
function storeDataInAttribute(data, attribute, dimension) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(attribute, dimension, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
    return buffer;
}

/**
 * Create a new buffer and populate it with the indices data
 * @param indices An array of the indices
 * @returns The id of the the created buffer
 */
function storeIndices(indices) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer );
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(indices), gl.STATIC_DRAW);
}