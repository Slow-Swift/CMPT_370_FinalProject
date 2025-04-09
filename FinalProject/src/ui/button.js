import { createQuad } from "./quad.js";

export function createButton(width, height, color, callback) {
    const button = createQuad(width, height, color);
    button.callback = callback;
    button.onUpdate = onUpdate;
    button.onClick = onClick;
    return button;
}

function onUpdate() {
    const scale = this.mouseOver ? 1.03 : 1;
    this.transform.scale = [this.size[0] * scale, this.size[1] * scale, 1];
}

function onClick() {
    this.callback?.();
}