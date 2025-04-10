import { createQuad } from "./quad.js";

export function createButton(
    width, height, color, callback, 
    {
        ...args
    } = {}
) {
    const button = createQuad(width, height, color, args);
    button.callback = callback;
    button.onUpdate = onUpdate;
    button.onClick = onClick;

    return button;
}

function onUpdate() {
    const scale = this.mouseOver ? 1.03 : 1;
    this.transform.scale = scale;
}

function onClick() {
    this.callback?.();
}