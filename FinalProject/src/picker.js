/**
 * File Name: picker.js
 * Author: Finian Lugtigheid
 * Date: TODO
 * Description:
 *  Loads and manages the shader used to render to the picker texture
 * 
 *  Modified from https://webgl2fundamentals.org/webgl/lessons/webgl-picking.html
 */

/**
 * Create the buffers used to render to the picker texture
 * @returns An object containing the picker buffers
 */
export function createRenderBuffers() {
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    const level = 0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return {
        frameBuffer: frameBuffer,
        depthBuffer: depthBuffer,
        texture: targetTexture,
        resize: setFramebufferAttachmentSizes,
        enable: enable,
        disable: disable,
        getID: getID
    }
}

/**
 * Update the size of the buffers
 * @param {number} width 
 * @param {number} height 
 */
function setFramebufferAttachmentSizes(width, height) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0, gl.RGBA,
        width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE,
        null
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
}

/**
 * Tell WebGL to render to these buffers
 */
function enable() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

/**
 * Tell WebGL to stop rendering to these buffers
 */
function disable() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

/**
 * Get the ID of a pixel in the buffer
 * @param {*} x The x coordinate of the pixel
 * @param {*} y The y coordinate of the pixel
 * @returns 
 */
function getID(x, y) {
    this.enable();
    // Get the pixel color
    const data = new Uint8Array(4);
    gl.readPixels(
        x, y,
        1, 1,
        gl.RGBA, gl.UNSIGNED_BYTE,
        data
    );
    this.disable();

    // Convert the color to and ID
    const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
    return id;
}