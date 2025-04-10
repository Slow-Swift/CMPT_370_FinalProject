/**
 * Create a transform for an entity
 * @returns The created transform
 */
export function createTransform2D(entity) {
    return {
        layer: 1,
        width: 1.0,
        height: 1.0,
        scale: 1.0,
        position: [0.5, 0.5],
        anchor: [0.5, 0.5],
        rotation: 0.0,
        entity: entity,
        aspectRatio: 0,

        getTransformationMatrix: function() {
            const [width, height] = calculateSize(this);
            const actualX = this.position[0] - this.anchor[0] * width;
            const actualY = this.position[1] - this.anchor[1] * height;

            const transformation = translate(actualX, actualY, -this.layer / 20);
            const rotation = rotateZ(this.rotation);
            const scaleM = scale(width, height, 1.0);
            
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

function calculateSize(transform) {
    if (transform.aspectRatio == 0) {
        return [transform.width * transform.scale, transform.height * transform.scale];
    }

    const pixels = transform.width != 0 ? gl.canvas.width * transform.width : gl.canvas.height * transform.height;
    const width = pixels / gl.canvas.width;
    const height = pixels / gl.canvas.height * transform.aspectRatio;
    return [width * transform.scale, height * transform.scale];
}