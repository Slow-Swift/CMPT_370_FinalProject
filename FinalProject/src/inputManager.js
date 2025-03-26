window.inputData = {
    mouse: {x:0, y:0}
};

export function updateInputs() {
    inputData.mouse.wasDown = false;
    inputData.mouse.clicked = false;
}

export function initializeInputSystem() {
    gl.canvas.addEventListener('mousemove', onMouseMove);
    gl.canvas.addEventListener('mouseup', () => inputData.mouse.down=false);
    gl.canvas.addEventListener('mousedown', () => inputData.mouse.down=true);
    gl.canvas.addEventListener('click', () => inputData.mouse.clicked=true);
}

/**
 * Called everytime the mouse is moved on the canvas and updates
 * the recorded pixel position of the mouse.
 * @param e The mouse move event
 */
function onMouseMove(e) {
    const rect = gl.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    inputData.mouse.x = mouseX * gl.canvas.width / gl.canvas.clientWidth;
    inputData.mouse.y = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight;
}