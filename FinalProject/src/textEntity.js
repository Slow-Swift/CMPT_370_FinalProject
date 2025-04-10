import { createEntity } from "./entities/entities.js";
import { createModels } from "./entities/models.js";

let fontTexture;
let model;
// export async function setupTextRendering() {
//     fontTexture = await loadFontTexture("textures/fontAtlas.png");
// }

// export function createTextEntity(text, position = [0, 0, 0], scale = [1, 1, 1]) {
//     // Just make a quad for now that uses the font texture
//     const vertices = new Float32Array([
//         -0.5, -0.5, 0.0,
//         -0.5,  0.5, 0.0,
//          0.5,  0.5, 0.0,
//          0.5, -0.5, 0.0,
//     ]);

//     const texCoords = new Float32Array([
//         0.0, 0.0,
//         0.0, 1.0,
//         1.0, 1.0,
//         1.0, 0.0,
//     ]);


//     const textIndices = new Int32Array ([
//         0, 3, 2,
//         0, 2, 1
//     ])

//     model = createModels(indices, vertices, texCoords, [], [{material: {color: [1, 1, 1], texture: fontTexture}}]);

//     const entity = createEntity(model);
//     entity.transform.position = position;
//     entity.transform.scale = scale;
//     return entity;
// }

export function createTextEntity(text, atlas, spacing = 0.6) {
    const textEntity = createEntity();

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const uv = atlas.charMap[char] || atlas.charMap["?"];
        const model = createCharQuad(uv, atlas.texture);

        const letter = createEntity(model);
        letter.transform.position = [i * spacing, 0, 0];
        letter.setParent(textEntity);
    }

    return textEntity;
}

function createCharQuad(uv, fontTexture) {
    const positions = new Float32Array([
        -0.5, -0.5, 0,
        -0.5,  0.5, 0,
         0.5,  0.5, 0,
         0.5, -0.5, 0,
    ]);

    const uvs = new Float32Array([
        uv.uMin, uv.vMin,
        uv.uMin, uv.vMax,
        uv.uMax, uv.vMax,
        uv.uMax, uv.vMin,
    ]);

    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

    return createModels(indices, positions, uvs, [], [{ material: { texture: fontTexture, color: [1.0, 1.0, 1.0] } }]);
}
