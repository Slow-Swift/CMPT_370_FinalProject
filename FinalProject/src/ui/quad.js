import { createModels } from "../entities/models.js";
import { createEntity } from "../entities/entities.js";

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

export function createQuad(width, height, color){
    const quadEntity = createEntity(quadModel, [{color: color}]);
    quadEntity.transform.scale = [width, height, 1.0];
    quadEntity.transform.position[2] = -0.1;
    quadEntity.setPosition = setPosition;
    quadEntity.size = [width, height];
    return quadEntity;
}

function setPosition(position) {
    if (position.top)
        this.transform.position[1] = 1 - position.top / 2- this.transform.scale[1];
    if (position.bottom)
        this.transform.position[1] = -(1 - position.bottom / 2- this.transform.scale[1]);
    if (position.left)
        this.transform.position[0] = -(1 - position.left / 2- this.transform.scale[0]);
    if (position.right)
        this.transform.position[0] = 1 - position.right / 2- this.transform.scale[0];
}
