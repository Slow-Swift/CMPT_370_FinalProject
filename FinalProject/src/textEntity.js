import { createEntity, createEntity2D } from "./entities/entities.js";
import { createModels } from "./entities/models.js";

let textAtlas;

export function initializeTextAtlas(options = {}) {
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

    textAtlas = {
        texture,
        charMap: chars.reduce((map, char, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            map[char] = {
                uMin: col / cols,
                vMin: row / rows,
                uMax: (col + 0.9) / cols,
                vMax: (row + 0.9) / rows,
            };
            return map;
        }, {}),
        fontSize,
        cols,
        rows
    };
}

export function createTextEntity(text, spacing = 1.1) {
    const textEntity = createEntity2D();
    textEntity.pickable = false;
    textEntity.spacing = spacing;
    textEntity.setText = setText;
    textEntity.setText(text);
    return textEntity;
}

function createCharQuad(uv) {
    const positions = new Float32Array([
        -1, -1, 0,
        -1,  1, 0,
         1,  1, 0,
         1, -1, 0,
    ]);

    const uvs = new Float32Array([
        uv.uMin, uv.vMax,
        uv.uMin, uv.vMin,
        uv.uMax, uv.vMin,
        uv.uMax, uv.vMax,
    ]);

    const indices = new Uint16Array([0, 2, 1, 0, 3, 2]);

    return createModels(indices, positions, uvs, []);
}

function setText(text) {
    this.children = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const uv = textAtlas.charMap[char] || textAtlas.charMap["?"];
        const model = createCharQuad(uv, textAtlas.texture);
        
        const letter = createEntity(model, [ {color: [0.0, 0.0, 0.0] } ]);
        letter.pickable = false;
        letter.materials[0].texture = textAtlas.texture;
        letter.materials[0].useTexture = true;
        letter.transform.position = [i * this.spacing, 0, 0];
        letter.setParent(this);
    }
}