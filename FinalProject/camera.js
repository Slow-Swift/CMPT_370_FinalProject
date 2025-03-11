"use strict"

function create_camera() {
    return {
        transform: create_transform(),
        getViewMatrix: getViewMatrix
    };
}

function getViewMatrix() {
    const transformation = translate(-this.transform.position[0], -this.transform.position[1], -this.transform.position[2]);
    let rotation = rotateZ(-this.transform.rotation[2]);
    rotation = mult(rotation, rotateY(-this.transform.rotation[1]));
    rotation = mult(rotation, rotateX(-this.transform.rotation[0]));

    return mult(rotation, transformation);
}