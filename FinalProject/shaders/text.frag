#version 300 es
precision mediump float;

in vec2 v_texCoord;

uniform sampler2D fontAtlas;
uniform vec3 textColor;

out vec4 fColor;

void main() {
    float alpha = texture(fontAtlas, v_texCoord).r;
    fColor = vec4(textColor, alpha);
}
