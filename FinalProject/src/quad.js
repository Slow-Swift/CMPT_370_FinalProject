import { createModels } from "./entities/models.js";
import { createEntity } from "./entities/entities.js";

let quadModel;

export function setupQuad() {
    const quadVertices = new Float32Array([
    -1.0, -1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    ]);
    
    const quadTexture = new Float32Array([
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.1,
        1.0, 0.0
    ])

    const quadIndices = new Int32Array ([
        0, 3, 2,
        0, 2, 1
    ])
   quadModel = createModels(quadIndices, quadVertices, quadTexture, [], []); 
}

export function createQuad(width, height){
    const quadEntity = createEntity(quadModel, [{color: [92/255, 64/255, 51/255]}]);
    quadEntity.transform.scale = [width, height, 1.0];
    return quadEntity;
}

