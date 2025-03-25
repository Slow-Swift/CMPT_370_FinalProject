/**
 * File Name: entities.js
 * Name: Finian Lugtigheid
 * Date: TODO
 * Description:
 *   Creates entities that may be rendered by a shader
 */


let currentID = 1;

/**
 * Create a new entity given the indices, vertices, and texture coordinates
 * @param indices The indices of the model
 * @param vertices The vertex positions
 * @param textureCoords The texture coordinates for each vertex
 * @param texture The texture for the model
 * @returns The created entity
 */
export function createEntity(model) {
    return { 
        model: model,
        id: currentID++,
        transform: createTransform(),
    };
}

/**
 * Create a copy of the entity that has the same model
 * @param entity The entity to copy
 * @returns The copied entity
 */
export function copyEntity(entity) {
    return { 
        id: currentID++,
        model: entity.model,
        transform: entity.transform.copy()
    };
}

/**
 * Create a transform for an entity
 * @returns The created transform
 */
export function createTransform() {
    return {
        position: [0.0, 0.0, 0.0],
        rotation: [0.0, 0.0, 0.0],
        scale: 1.0,

        getTransformationMatrix: function() {
            const transformation = translate(this.position[0], this.position[1], this.position[2]);
            let rotation = rotateX(this.rotation[0]);
            rotation = mult(rotation, rotateY(this.rotation[1]));
            rotation = mult(rotation, rotateZ(this.rotation[2]));
            const scaleM = scale(this.scale, this.scale, this.scale);

            return mult(mult(transformation, rotation), scaleM);
        },

        copy: function() {
            let transform = createTransform();
            transform.position = this.position.slice();
            transform.rotation = this.rotation.slice();
            transform.scale = this.scale;
            return transform;
        },
    }
}