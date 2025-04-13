/**
 * File Name: textures.js
 * Name: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *   Creates Webgl textures that may be used to texture an object
 */

"use strict"


/**
 * Creates a WebGL texture and fills it with one pixel of the given color
 * @param color The Color of the texture
 * @returns The created texture
 */
function createTexture(color) {
    const texture = gl.createTexture();

    // Create the texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Setup the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Set texture to a single pixel
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array(color)
    );
    return texture;
}

/**
 * Loads a texture from a given URL into a WebGL texture
 * @param url The url of the image
 * @returns The loaded texture
 */
export function loadTexture(url) {
    // We will use pink as a default texture until the image is loaded
    const texture = createTexture([224, 63, 250, 255]);

    const image = new Image();
    image.crossOrigin = "anonymous";

    // Update the texture data when the image is loaded
    image.addEventListener('load', () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE, image
        );
    });
    image.src = url;
    return texture;
}