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
export function createEntity(model, materials) {
    const entity = {
        model: model,
        materials: structuredClone(materials),
        id: currentID++,
        children: [],
        parent: null,
        pickable: true,
        setParent: setParent,
        update: update
    }
    entity.transform = createTransform(entity);
    return entity;
}
/**
 * Create a copy of the entity that has the same model
 * @param entity The entity to copy
 */
export function setParent(entity) {
    if (this.parent != null){
        const index = this.parent.children.indexOf(this)
        if (index > -1){
            this.parent.children.splice(index, 1);
        }
    };
    this.parent = entity;
    entity?.children.push(this);
}

/**
 * Create a transform for an entity
 * @returns The created transform
 */
export function createTransform(entity) {
    return {
        position: [0.0, 0.0, 0.0],
        rotation: [0.0, 0.0, 0.0],
        scale: [1.0, 1.0, 1.0],
        entity: entity,
        getTransformationMatrix: function() {
            const transformation = translate(this.position[0], this.position[1], this.position[2]);
            let rotation = rotateX(this.rotation[0]);
            rotation = mult(rotation, rotateY(this.rotation[1]));
            rotation = mult(rotation, rotateZ(this.rotation[2]));
            const scaleM = scale(this.scale[0], this.scale[1], this.scale[2]);
            
            const childTransform = mult(mult(transformation, rotation), scaleM);

            if (this.entity!= null && this.entity.parent != null){
                const parentTransform = this.entity.parent.transform.getTransformationMatrix();
                return mult(parentTransform, childTransform);
            }
            return childTransform;
        },

        copy: function() {
            let transform = createTransform();
            transform.position = this.position.slice();
            transform.rotation = this.rotation.slice();
            transform.scale = this.scale.slice();
            return transform;
        },

        scaleAll: function(scale) {
            this.scale = [scale, scale, scale];
        }
    }
}

function update(deltaTime) {
    if (this.pickable) {
        this.mouseOver = applicationData.mouseID == this.id;
        if (this.mouseOver && inputData.mouse.clicked) {
            this.onClick();
        }
    }
    
    this.onUpdate?.(deltaTime);
    for (const child of this.children){
        child.update(deltaTime);
    }
}