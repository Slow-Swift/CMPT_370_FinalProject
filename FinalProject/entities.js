/**
 * File Name: entities.js
 * Name: Finian Lugtigheid
 * Date: February 10, 2025
 * Description:
 *   Creates entities that may be rendered by a shader
 */

"use strict"

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

/**
 * Create a new entity given the indices, vertices, and texture coordinates
 * @param indices The indices of the model
 * @param vertices The vertex positions
 * @param textureCoords The texture coordinates for each vertex
 * @param texture The texture for the model
 * @returns The created entity
 */
function createEntity(indices, vertices, textureCoords, normals, components) {
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
        transform: create_transform(),
    };
}

/**
 * Create a transform for an entity
 * @returns The created transform
 */
function create_transform() {
    return {
        position: [0.0, 0.0, 0.0],
        scale: 1.0,
        rotation: [0.0, 0.0, 0.0],

        getTransformationMatrix: function() {
            const transformation = translate(this.position[0], this.position[1], this.position[2]);
            let rotation = rotateX(this.rotation[0]);
            rotation = mult(rotation, rotateY(this.rotation[1]));
            rotation = mult(rotation, rotateZ(this.rotation[2]));
            const scaleM = scale(this.scale, this.scale, this.scale);

            return mult(mult(transformation, rotation), scaleM);
        }
    }
}

// /**
//  * Adapted from ThinMatrix's tutorial on writing an OBJ parser in Java:
//  * https://www.youtube.com/watch?v=YKFYtekgnP8
//  * @param {*} file 
//  */
// async function loadObj(file, texture) {
//     const objData = await loadFile(file);
//     const lines = objData.split('\n');

//     const vertices = [];
//     const textureCoords = [];
//     const normals = [];

//     const indices = [];
//     const orderedTextureCoords = [];
//     const orderedNormals = [];

//     let mode = "DATA";

//     function processDataLine(line) {
//         const parts = line.split(' ');
//         if (line.startsWith("v ")) {
//             vertices.push(Number(parts[1]), Number(parts[2]), Number(parts[3]));
//         } else if (line.startsWith("vt ")) {
//             textureCoords.push([Number(parts[1]), Number(parts[2])]);
//         } else if (line.startsWith("vn ")) {
//             normals.push([Number(parts[1]), Number(parts[2]), Number(parts[3])]);
//         } else if (line.startsWith("f ")) {
//             mode = "FACE";
//             processFace(line);
//         }
//     }

//     function processFace(line) {
//         if (!line.startsWith("f ")) return;
//         const parts = line.split(' ');
//         processVertex(parts[1].split('/'));
//         processVertex(parts[2].split('/'));
//         processVertex(parts[3].split('/'));
//     }

//     function processVertex(vertex) {
//         const index = Number(vertex[0]) - 1;
//         const textureIndex = Number(vertex[1]) - 1;
//         const normalIndex = Number(vertex[2]) - 1;
//         indices.push(index);
//         orderedTextureCoords[2 * index] = textureCoords[textureIndex][0];
//         orderedTextureCoords[2 * index + 1] = 1 - textureCoords[textureIndex][1];
//         orderedNormals[3 * index] = normals[normalIndex][0];
//         orderedNormals[3 * index + 1] = normals[normalIndex][1];
//         orderedNormals[3 * index + 2] = normals[normalIndex][2];
//     }

//     for (const line of lines) {
//         switch (mode) {
//             case "DATA": 
//                 processDataLine(line);
//                 break;
//             case "FACE":
//                 processFace(line);
//         }
//     }

//     return createEntity(indices, vertices, orderedTextureCoords, orderedNormals, texture);
// }