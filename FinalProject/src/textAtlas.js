export function createTextAtlas(gl, options = {}) {
    const fontSize = options.fontSize || 32;
    const chars = options.chars || [...Array(96)].map((_, i) => String.fromCharCode(i + 32)); // ASCII 32-127
    const cols = options.cols || 16;
    const rows = Math.ceil(chars.length / cols);
    const canvasSize = fontSize * cols;

    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = fontSize * rows;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    chars.forEach((char, i) => {
        const x = (i % cols) * fontSize;
        const y = Math.floor(i / cols) * fontSize;
        ctx.fillText(char, x, y);
    });

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        canvas
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return {
        texture,
        charMap: chars.reduce((map, char, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            map[char] = {
                uMin: col / cols,
                vMin: row / rows,
                uMax: (col + 1) / cols,
                vMax: (row + 1) / rows,
            };
            return map;
        }, {}),
        fontSize,
        cols,
        rows
    };
}