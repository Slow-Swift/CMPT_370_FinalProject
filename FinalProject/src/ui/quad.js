import { createModels } from "../entities/models.js";
import { createEntity2D } from "../entities/entities.js";

let quadModel;

export function setupQuad() {
    const quadVertices = new Float32Array([
    0, 0, 0.0,
    0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0, 0.0,
    ]);
    
    const quadTexture = new Float32Array([
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0
    ])

    const quadIndices = new Int32Array ([
        0, 3, 2,
        0, 2, 1
    ])
   quadModel = createModels(quadIndices, quadVertices, quadTexture, [], []); 
}

export function createQuad(width, height, color, {aspectRatio=0, texture=null}={}){
    const quadEntity = createEntity2D(quadModel, [{color: color}]);
    quadEntity.transform.width = width;
    quadEntity.transform.height = height;
    quadEntity.transform.aspectRatio = aspectRatio
    quadEntity.materials[0].texture = texture;
    quadEntity.materials[0].useTexture = texture != null;
    return quadEntity;
}