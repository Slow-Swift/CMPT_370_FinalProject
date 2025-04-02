window.inputData = {
    mouse: {x:0, y:0},
    isDown: {},
};

export function updateInputs() {
    inputData.mouse.wasDown = inputData.mouse.clicked;
    inputData.mouse.clicked = false;
    inputData.wasDown = structuredClone(inputData.isDown);
}

export function initializeInputSystem() {
    gl.canvas.addEventListener('mousemove', (e) => setMousePos(e.clientX, e.clientY));
    gl.canvas.addEventListener('mouseup', () => inputData.mouse.down=false);
    gl.canvas.addEventListener('mousedown', () => inputData.mouse.down=true);
    gl.canvas.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
}

function onClick(e) {
    inputData.mouse.clicked=true;
    setMousePos(e.clientX, e.clientY);
}

function setMousePos(x, y) {
    const rect = gl.canvas.getBoundingClientRect();
    const mouseX = x - rect.left;
    const mouseY = y - rect.top;
    inputData.mouse.x = mouseX * gl.canvas.width / gl.canvas.clientWidth;
    inputData.mouse.y = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight;
}

function onKeyDown(e) {
    inputData.isDown[e.code] = true;
}

function onKeyUp(e) {
    inputData.isDown[e.code] = false;
}