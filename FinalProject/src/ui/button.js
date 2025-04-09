import { createQuad } from "./quad.js";

export function createButton(
    width, height, color, callback, 
    {
        borderColor = vec3(0,0,0), borderWidth=0, borderL=0, borderR=0,
        borderT=0, borderB=0
    } = {}
) {
    const button = createQuad(width, height, borderColor);
    button.callback = callback;
    button.onUpdate = onUpdate;
    button.onClick = onClick;

    if (borderWidth != 0) {
        borderL = borderR = borderT = borderB = borderWidth;
    }
    const foreground = createQuad(1-borderR-borderL, 1-borderT-borderB, color);
    foreground.setPosition({x: borderL / 2 - borderR / 2, y: borderB / 2 - borderT / 2})
    foreground.pickable = false;
    foreground.setParent(button);
    return button;
}

function onUpdate() {
    const scale = this.mouseOver ? 1.03 : 1;
    this.transform.scale = [this.size[0] * scale, this.size[1] * scale, 1];
}

function onClick() {
    this.callback?.();
}